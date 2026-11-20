import logging

import functions_framework
from flask import jsonify

from chatbot.completions import CHAT_ERRORS, get_answer
from chatbot.retrieval import RetrievalUnavailable

logger = logging.getLogger(__name__)
CORS_HEADERS = {"Access-Control-Allow-Origin": "*"}


@functions_framework.http
def chatbot(request):
    if request.method == "OPTIONS":
        return "", 204, {
            **CORS_HEADERS,
            "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
            "Access-Control-Allow-Headers": "Content-Type",
            "Access-Control-Max-Age": "3600",
        }

    if request.method == "GET":
        return jsonify(response="I'm a chatbot. Ask me a question about Richard!"), 200, CORS_HEADERS

    if request.method != "POST":
        return jsonify(error="Method not allowed."), 405, {**CORS_HEADERS, "Allow": "GET, POST, OPTIONS"}

    body = request.get_json(silent=True)
    question = body.get("message") if isinstance(body, dict) else None
    if not isinstance(question, str) or not question.strip():
        return jsonify(error="No message provided."), 400, CORS_HEADERS

    try:
        answer = get_answer(question.strip())
    except CHAT_ERRORS as error:
        if isinstance(error, RetrievalUnavailable):
            logger.warning("Portfolio chat failed (RetrievalUnavailable): %s", error.diagnostic)
        else:
            logger.warning("Portfolio chat failed (%s)", type(error).__name__)
        return jsonify(error="Chat is temporarily unavailable."), 503, CORS_HEADERS

    return jsonify(response=answer), 200, CORS_HEADERS
