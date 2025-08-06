from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from .langchain_core.main import stream_response

# for now, no history
class LangChainRAGView(APIView):
    def post(self, request):
        question = request.data.get("question")
        if not question:
            return Response({"error": "No question provided."}, status=400)

        try:
            # consume the generator
            answer = ""
            for chunk in stream_response(question, None):
                answer = chunk  # progressively grows

            return Response({"answer": answer})
        except Exception as e:
            return Response({"error": str(e)}, status=500)
