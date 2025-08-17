from langchain_core.prompts import PromptTemplate, ChatPromptTemplate
from langchain_core.output_parsers import StrOutputParser
from langchain_core.runnables import RunnableLambda
from langchain.chains.combine_documents import create_stuff_documents_chain

convert_prompt_to_string = RunnableLambda(lambda x: x.to_string())
extract_generated_text = RunnableLambda(lambda x: x[0]['generated_text'] if isinstance(x, list) and x else "")
lower_case = RunnableLambda(lambda x: x.lower())

#router
def router_chain(router_llm):
    router_prompt = PromptTemplate(
        input_variables=["history", "question"],
        template=(
            "You are a classifier that determines the source of the answer.\n"
            "The sources are:\n"
            "Transcript: academic performance, courses, grades.\n"
            "Resume: skills, work experiences, projects.\n"
            "Examples:\n"
            "Question: What is his cumulative average?\nAnswer: transcript\n"
            "Question: Tell me about his work experience at Google.\nAnswer: resume\n"
            "Question: What courses did he take last semester?\nAnswer: transcript\n"
            "Classify this question as 'resume', 'transcript': {question}"
            "Answer: ")
    )
    # Chain the prompt template, the conversion, the flan pipeline call, the extraction, and the lower_case step
    router_chain = router_prompt | convert_prompt_to_string | router_llm | extract_generated_text | lower_case
    return router_chain

# retriever
def get_filtered_retriever(retriever, num_results=5, classification=None):
    print(classification)
    retriever.search_kwargs = {"k": num_results}
    if classification in ("resume", "transcript"):
        retriever.search_kwargs["filter"] = {"source": classification}
    elif classification == "both":
        retriever.search_kwargs["filter"] = {
            "$or": [{"source": "resume"}, {"source": "transcript"}]
        }
    return retriever

# combiner
def combine_chain(combine_llm):
    combine_prompt = ChatPromptTemplate([
        ("system", "You are a researcher that looks for relevant data to answer the given question about Richard Zhu."),
        ("human", "Here is the question: {question}"),
        ("assistant", "Find the relevant data in this context: {input}")
        ])
    combine_chain = create_stuff_documents_chain(
    llm=combine_llm,
    prompt=combine_prompt,
    document_variable_name="input"
    )
    return combine_chain

def answer_chain(answer_llm):
    answer_prompt = ChatPromptTemplate([("system", "You are a helpful assistant that helps answer questions about Richard Zhu."),
        ("assistant","You have access to the following context, which comprise of his transcript and resume:\n{context}\n"
        "You can only answer questions about Richard Zhu and his work. If you do not know the answer, say 'I do not know'.\n"
        "These are the previous messages in the conversation:\n{history}\n"
        ),
        ("human", "What is the answer to this question?: {question}")])
    answer_chain = answer_prompt | answer_llm | StrOutputParser ()
    return answer_chain

def summary_chain(summary_llm):  
    summary_prompt = PromptTemplate(
        template=("Please rephrase the following text into a concise sentence that answers the question:\n"
                "Question: {question}\n"
                "Text to rephrase: {answer}\n\n"
                "Rephrased answer:")
    )
    summary_chain = summary_prompt | convert_prompt_to_string | summary_llm | extract_generated_text | StrOutputParser()
    return summary_chain