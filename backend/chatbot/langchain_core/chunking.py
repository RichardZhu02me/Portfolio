from langchain_text_splitters import RecursiveCharacterTextSplitter

def chunkTranscript(transcriptDocument):
    text_splitter = RecursiveCharacterTextSplitter(
        separators=[
            "Spring",
            "Winter",
            "Fall"
        ],
        chunk_size=300,
        chunk_overlap=20,
        length_function=len,
        is_separator_regex=False,
    )
    chunks = text_splitter.split_documents(transcriptDocument)
    return chunks

def chunkDocuments(Documents):
    
    text_splitter = RecursiveCharacterTextSplitter(
        chunk_size=300,
        chunk_overlap=20,
        length_function=len,
        is_separator_regex=False,
    )
    chunks = text_splitter.split_documents(Documents)
    return chunks

def chunkResume(ResumeDocument):
    text_splitter = RecursiveCharacterTextSplitter(
        separators=[
            "Technical Skills",
            "Experience",
            "Projects",
            "Education",
        ],
        chunk_size=300,
        chunk_overlap=20,
        length_function=len,
        is_separator_regex=False,
    )
    chunks = text_splitter.split_documents(ResumeDocument)
    return chunks