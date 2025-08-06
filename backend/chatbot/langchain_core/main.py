from langchain_groq import ChatGroq
from langchain_community.embeddings import HuggingFaceEmbeddings
from langchain_chroma import Chroma
from pathlib import Path

from dotenv import load_dotenv
load_dotenv()

DATA_PATH = Path(__file__).resolve().parent / "data"
CHROMA_PATH = Path(__file__).resolve().parent / "chroma"

embeddings_model = HuggingFaceEmbeddings(model_name='jinaai/jina-embeddings-v2-base-en')

llm = ChatGroq(
    model_name="llama-3.3-70b-versatile",
    temperature=0.8
)

vector_store = Chroma(
    embedding_function=embeddings_model,
    persist_directory=CHROMA_PATH
)

num_results = 3
retriever = vector_store.as_retriever(search_kwargs={"k": num_results})

def checkKnowledge(): 

  docs = retriever.invoke("can you print out the data of everything I gave you")
  
  print("chunks in docs: ", len(docs))
  i = 1
  for doc in docs :
    print(f"chunk {i}")
    print(doc)
    i = i+1

def stream_response(message, history): 

  docs = retriever.invoke(message)

  knowledge = ""

  for doc in docs :
    knowledge += doc.page_content + "\n"

  if message is not None:
    partial_message = ""

    rag_prompt  = f"""
    you are an assistant which answers questions based on knowledge which is provided to you.
    While answering, you don't use your internal knowledge,
    but solely the information in the "The knowledge" section.
    You don't mention anything to the user about the povided knowledge.

    The question: {message}

    Conversation history: {history}

    The knowledge: {knowledge}

    Answer:
    """

    for response in llm.stream(rag_prompt):
      partial_message += response.content
      yield partial_message

