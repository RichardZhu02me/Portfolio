from langchain_community.document_loaders import PyPDFDirectoryLoader, PyPDFLoader
from langchain_huggingface import HuggingFaceEmbeddings
from langchain_chroma import Chroma
from uuid import uuid4
from pathlib import Path
from dotenv import load_dotenv
from chunking import chunkTranscript, chunkDocuments, chunkResume


load_dotenv()

DATA_PATH = Path(__file__).resolve().parent / "data"
CHROMA_PATH = Path(__file__).resolve().parent / "chroma"

# Use HuggingFaceEmbeddings with the specified model
embeddings_model = HuggingFaceEmbeddings(model_name='jinaai/jina-embeddings-v2-base-en')

print("Initializing Chroma (in-memory)")
vector_store = Chroma(
    embedding_function=embeddings_model,
    persist_directory=CHROMA_PATH
)

# loader = PyPDFDirectoryLoader(DATA_PATH)
# raw_documents = loader.load()

transcript_path = Path(DATA_PATH) / "important/transcript.pdf"
transcript_documents = PyPDFLoader(str(transcript_path)).load()

resume_path = Path(DATA_PATH) / "important/resume.pdf"
resume_documents = PyPDFLoader(str(resume_path)).load()


# chunks = chunkDocuments(raw_documents) + chunkTranscript(transcript_documents) #+ chunkResume(resume_documents)

chunks = chunkTranscript(transcript_documents) + chunkResume(resume_documents)
# Add print statements to check chunks
print(f"Number of chunks: {len(chunks)}")
if chunks:
    print(f"First chunk: {chunks[0]}")

uuids = [str(uuid4()) for _ in range(len(chunks))]

# metadatas = [{'uuid': uuid} for uuid in uuids]

vector_store.add_documents(documents=chunks, ids=uuids)