import json
import os
import unittest
from types import SimpleNamespace
from unittest.mock import Mock, patch

from chatbot import completions, retrieval


class ChatbotHTTPTests(unittest.TestCase):
    def setUp(self):
        from flask import Flask, request

        import main

        app = Flask(__name__)
        app.add_url_rule(
            "/", view_func=lambda: main.chatbot(request), methods=["GET", "POST", "OPTIONS", "PUT"],
        )
        self.client = app.test_client()

    def test_preflight_and_original_post_contract(self):
        preflight = self.client.options("/")
        self.assertEqual(preflight.status_code, 204)
        self.assertIn("POST", preflight.headers["Access-Control-Allow-Methods"])
        self.assertEqual(self.client.get("/").status_code, 200)

        with patch("main.get_answer", return_value="Waterloo") as answer:
            response = self.client.post("/", json={"message": " Where? "})
        answer.assert_called_once_with("Where?")
        self.assertEqual(response.json, {"response": "Waterloo"})
        self.assertEqual(response.headers["Access-Control-Allow-Origin"], "*")

    def test_invalid_post_and_service_failure(self):
        for body in ("{", "[]", '{"message": 42}', '{"message": " "}'):
            with self.subTest(body=body):
                response = self.client.post("/", data=body, content_type="application/json")
                self.assertEqual(response.status_code, 400)
        self.assertEqual(self.client.put("/").status_code, 405)

        with patch("main.get_answer", side_effect=retrieval.RetrievalUnavailable("private detail")):
            response = self.client.post("/", json={"message": "Where?"})
        self.assertEqual(response.status_code, 503)
        self.assertEqual(response.json, {"error": "Chat is temporarily unavailable."})


class PortfolioRAGTests(unittest.TestCase):
    def setUp(self):
        stack = patch.dict(os.environ, {
            "PINECONE_API_KEY": "test",
            "PINECONE_INDEX_HOST": "portfolio.example",
            "PINECONE_NAMESPACE": "",
            "PINECONE_TEXT_FIELD": "",
        })
        self.addCleanup(stack.stop)
        stack.start()
        self.client = Mock()
        self.route = {
            "source": "resume",
            "season": None,
            "calendar_years": [],
            "academic_years": [],
            "term": None,
            "latest": False,
        }

    def complete(self, question, *pinecone_responses):
        create = self.client.chat.completions.create
        create.side_effect = [
            SimpleNamespace(choices=[SimpleNamespace(message=SimpleNamespace(content=content))])
            for content in (json.dumps(self.route), "Grounded answer.")
        ]
        with patch("chatbot.completions._client", return_value=self.client), patch(
            "chatbot.retrieval.httpx.post",
            side_effect=[Mock(**{"json.return_value": body}) for body in pinecone_responses],
        ) as post:
            answer = completions.get_answer(question)
        return answer, post.call_args_list, create.call_args_list

    def test_resume_uses_existing_namespace_reranking_and_grounding(self):
        result = {"result": {"hits": [{"fields": {
            "source": "resume", "text": "Student ID: 12345678\nBuilt an object detector.",
        }}]}}
        answer, calls, groq = self.complete("What did Richard build?", result)
        self.assertEqual(answer, "Grounded answer.")
        self.assertTrue(calls[0].args[0].endswith("/records/namespaces/documents/search"))
        request = calls[0].kwargs["json"]
        self.assertEqual(request["query"]["filter"], {"source": {"$eq": "resume"}})
        self.assertEqual(request["rerank"]["model"], "bge-reranker-v2-m3")
        self.assertLessEqual(request["rerank"]["top_n"], request["query"]["top_k"])
        self.assertTrue(groq[0].kwargs["response_format"]["json_schema"]["strict"])
        self.assertEqual(groq[1].kwargs["model"], "openai/gpt-oss-20b")
        prompt = groq[1].kwargs["messages"][1]["content"]
        self.assertIn("Built an object detector.", prompt)
        self.assertNotIn("12345678", prompt)

    def test_transcript_filters_and_empty_result(self):
        self.route.update(
            source="transcript", season="Fall", calendar_years=[2023],
            academic_years=[2], term="Study Term",
        )
        answer, calls, groq = self.complete("What courses did he take in Fall 2023?", {
            "result": {"hits": []},
        })
        self.assertEqual(calls[0].kwargs["json"]["query"]["filter"], {
            "source": {"$eq": "transcript"},
            "season": {"$eq": "Fall"},
            "yyyy": {"$in": [2023]},
            "year": {"$in": [2]},
            "term": {"$eq": "Study Term"},
        })
        self.assertTrue(answer.startswith("I don't know"))
        self.assertEqual(len(groq), 1)

    def test_latest_uses_indexed_terms_across_pages(self):
        self.route.update(source="transcript", term="Work Term", latest=True)
        first = {
            "vectors": {"a": {"metadata": {"yyyy": 2023, "season": "Fall"}}},
            "pagination": {"next": "next-page"},
        }
        second = {"vectors": {
            "b": {"metadata": {"yyyy": 2024, "season": "Winter"}},
            "c": {"metadata": {"yyyy": 2024, "season": "Spring"}},
        }}
        result = {"result": {"hits": [{"fields": {
            "text": "Work experience.", "yyyy": 2024, "season": "Spring", "term": "Work Term",
        }}]}}

        answer, calls, groq = self.complete("What was his latest work term?", first, second, result)
        self.assertEqual(answer, "Grounded answer.")
        self.assertTrue(calls[0].args[0].endswith("/vectors/fetch_by_metadata"))
        self.assertEqual(calls[0].kwargs["json"]["filter"]["term"], {"$eq": "Work Term"})
        self.assertEqual(calls[1].kwargs["json"]["paginationToken"], "next-page")
        self.assertEqual(calls[2].kwargs["json"]["query"]["filter"]["yyyy"], {"$eq": 2024})
        self.assertEqual(calls[2].kwargs["json"]["query"]["filter"]["season"], {"$eq": "Spring"})
        self.assertIn("Spring 2024 Work Term", groq[1].kwargs["messages"][1]["content"])
