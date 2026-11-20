import os
from functools import lru_cache
from urllib.parse import quote

import httpx


class RetrievalUnavailable(Exception):
    def __init__(self, message, *, diagnostic="unspecified"):
        super().__init__(message)
        self.diagnostic = diagnostic


INDEX_NAME = "advanced-rag-index"
NAMESPACE = "documents"
API_VERSION = "2025-10"
SEASONS = ("Winter", "Spring", "Fall")


def _metadata_filter(route):
    source = route["source"]
    if source is None:
        return {}

    filters = {"source": {"$eq": source}}
    if source == "transcript":
        for field in ("season", "term"):
            if route[field]:
                filters[field] = {"$eq": route[field]}
        for field, key in (("yyyy", "calendar_years"), ("year", "academic_years")):
            if route[key]:
                filters[field] = {"$in": route[key]}
    return filters


@lru_cache(maxsize=1)
def _index_host(api_key):
    response = httpx.get(
        f"https://api.pinecone.io/indexes/{INDEX_NAME}",
        headers={"Api-Key": api_key, "X-Pinecone-Api-Version": API_VERSION},
        timeout=5,
        follow_redirects=False,
    )
    response.raise_for_status()
    index = response.json()
    host = index.get("host") if isinstance(index, dict) else None
    if not isinstance(host, str) or not host.strip():
        raise RetrievalUnavailable(
            "Pinecone index description has no host",
            diagnostic="index description has no host",
        )
    return host.strip()


def _post(host, headers, path, body):
    response = httpx.post(
        f"https://{host}{path}", headers=headers, json=body, timeout=5, follow_redirects=False
    )
    response.raise_for_status()
    return response.json()


def _latest_term(host, headers, namespace, filters):
    body = {"namespace": namespace, "filter": filters, "limit": 100}
    latest = None
    seen_tokens = set()
    while True:
        page = _post(host, headers, "/vectors/fetch_by_metadata", body)
        for record in page["vectors"].values():
            metadata = record.get("metadata", {})
            year = metadata.get("yyyy")
            season = metadata.get("season")
            if isinstance(year, (int, float)) and season in SEASONS:
                term = (year, SEASONS.index(season))
                latest = term if latest is None else max(latest, term)
        token = page.get("pagination", {}).get("next")
        if not token:
            return latest
        if token in seen_tokens:
            raise RetrievalUnavailable(
                "Pinecone returned a repeated pagination token",
                diagnostic="repeated pagination token",
            )
        seen_tokens.add(token)
        body = {**body, "paginationToken": token}


def retrieve_context(question, route):
    api_key = os.environ.get("PINECONE_API_KEY", "").strip()
    if not api_key:
        raise RetrievalUnavailable(
            "Pinecone credentials are missing",
            diagnostic="missing runtime variable: PINECONE_API_KEY",
        )

    text_field = os.environ.get("PINECONE_TEXT_FIELD", "").strip() or "text"
    headers = {"Api-Key": api_key, "X-Pinecone-Api-Version": API_VERSION}
    filters = _metadata_filter(route)

    try:
        host = _index_host(api_key)
        if route["source"] == "transcript" and route["latest"]:
            latest = _latest_term(host, headers, NAMESPACE, filters)
            if latest is None:
                return ""
            year, season_index = latest
            filters = {**filters, "yyyy": {"$eq": year}, "season": {"$eq": SEASONS[season_index]}}

        query = {"inputs": {"text": question}, "top_k": 12}
        if filters:
            query["filter"] = filters
        result = _post(host, headers, f"/records/namespaces/{quote(NAMESPACE, safe='')}/search", {
            "query": query,
            "fields": [text_field, "source", "yyyy", "season", "term"],
            "rerank": {"model": "bge-reranker-v2-m3", "top_n": 6, "rank_fields": [text_field]},
        })
        hits = result["result"]["hits"]
        chunks = [hit["fields"] for hit in hits]
        if not all(isinstance(fields, dict) for fields in chunks):
            raise RetrievalUnavailable(
                "Pinecone returned invalid search fields",
                diagnostic="invalid search fields",
            )
    except (ValueError, KeyError, TypeError, AttributeError) as error:
        raise RetrievalUnavailable(
            "Pinecone returned an unexpected response",
            diagnostic="unexpected response structure",
        ) from error

    context = []
    for fields in chunks:
        chunk = fields.get(text_field)
        if not isinstance(chunk, str):
            continue
        lines = [
            line for line in chunk.splitlines()
            if not line.lstrip().lower().startswith(("student id:", "ontario education nbr:"))
        ]
        cleaned = "\n".join(lines).strip()
        if cleaned:
            label = " ".join(str(fields[key]) for key in ("source", "season", "yyyy", "term") if key in fields)
            context.append(f"[{label}]\n{cleaned}" if label else cleaned)

    if hits and not context:
        raise RetrievalUnavailable(
            "Pinecone results did not include usable text",
            diagnostic="no usable text in configured result field",
        )
    return "\n\n".join(context)
