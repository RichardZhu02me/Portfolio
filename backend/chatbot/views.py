from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from .langchain_core.main import query_rag_model

class LangChainRAGView(APIView):
    def post(self, request):
        question = request.data.get("question")
        if not question:
            return Response({"error": "No question provided."}, status=400)

        try:
            answer = query_rag_model(question)
            return Response({"answer": answer})
        except Exception as e:
            return Response({"error": str(e)}, status=500)
