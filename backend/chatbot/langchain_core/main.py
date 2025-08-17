from langchain_groq import ChatGroq
from langchain_chroma import Chroma
from pathlib import Path
from .chains import router_chain, get_filtered_retriever, combine_chain, answer_chain, summary_chain
from langchain_huggingface import HuggingFaceEmbeddings
from transformers import pipeline

DATA_PATH = Path(__file__).resolve().parent / "data"
CHROMA_PATH = Path(__file__).resolve().parent / "chroma"

embeddings_model = HuggingFaceEmbeddings(model_name='jinaai/jina-embeddings-v2-base-en')

flan = pipeline("text2text-generation", model="google/Flan-T5-base")

groq = ChatGroq(
    model_name="llama-3.3-70b-versatile",
    temperature=0.8
)

vector_store = Chroma(
    embedding_function=embeddings_model,
    persist_directory=CHROMA_PATH
)

num_results = 5
vector_retriever = vector_store.as_retriever(search_kwargs={"k": num_results})

def get_answer(question, history=""):
  router_llm = flan
  combine_llm = groq
  answer_llm = groq
  summary_llm = flan

  classification = router_chain(router_llm).invoke({"question": question, "history": history})
  # print("classification: ", classification)
  retriever_chain = get_filtered_retriever(vector_retriever, num_results=num_results, classification=classification)
  docs = retriever_chain.invoke(question)
  # print("docs: ", docs)
  compact_docs = combine_chain(combine_llm).invoke({"input": docs, "question": question})
  # print("compact_docs: ", compact_docs)
  answer = answer_chain(answer_llm).invoke({"question": question, "context": compact_docs, "history": history})
  # print("answer: ", answer)
  summary = summary_chain(summary_llm).invoke({"answer": answer, "question": question})
  # print("summary: ", summary)
  return summary

def checkKnowledge(): 

  docs = vector_retriever.invoke("can you print out the data of everything I gave you")
  
  print("chunks in docs: ", len(docs))
  i = 1
  for doc in docs :
    print(f"chunk {i}")
    print(doc)
    i = i+1

def stream_response(message, history): 

  docs = vector_retriever.invoke(message)

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

    for response in groq.stream(rag_prompt):
      partial_message += response.content
      yield partial_message

