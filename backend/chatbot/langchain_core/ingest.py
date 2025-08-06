from langchain_community.document_loaders import PyPDFDirectoryLoader
from langchain_text_splitters import RecursiveCharacterTextSplitter
from langchain_community.embeddings import HuggingFaceEmbeddings
from langchain_chroma import Chroma
from uuid import uuid4
from pathlib import Path
from dotenv import load_dotenv
load_dotenv()

DATA_PATH = Path(__file__).resolve().parent / "data"
CHROMA_PATH = Path(__file__).resolve().parent / "chroma"

# Use HuggingFaceEmbeddings with the specified model
embeddings_model = HuggingFaceEmbeddings(model_name='jinaai/jina-embeddings-v2-base-en')

print("Initializing Chroma (in-memory)")
vector_store = Chroma(
    embedding_function=embeddings_model,
    persist_directory=CHROMA_PATH
    # Removed persist_directory for in-memory test
)

loader = PyPDFDirectoryLoader(DATA_PATH)

raw_documents = loader.load()

text_splitter = RecursiveCharacterTextSplitter(
    chunk_size=300,
    chunk_overlap=100,
    length_function=len,
    is_separator_regex=False,
)

chunks = text_splitter.split_documents(raw_documents)

# Add print statements to check chunks
print(f"Number of chunks: {len(chunks)}")
if chunks:
    print(f"First chunk: {chunks[0]}")

uuids = [str(uuid4()) for _ in range(len(chunks))]

# metadatas = [{'uuid': uuid} for uuid in uuids]

vector_store.add_documents(documents=chunks, ids=uuids)