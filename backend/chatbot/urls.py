from django.urls import path
from .views import LangChainRAGView

urlpatterns = [
    path("api/chat/", LangChainRAGView.as_view(), name="langchain_chat"),
]
