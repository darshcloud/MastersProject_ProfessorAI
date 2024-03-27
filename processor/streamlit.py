import chromadb
from llama_index.core.chat_engine import ContextChatEngine
from llama_index.core.indices.vector_store import VectorIndexRetriever
from llama_index.vector_stores.chroma import ChromaVectorStore
from llama_index.embeddings.huggingface import HuggingFaceEmbedding
from llama_index.llms.ollama import Ollama
from llama_index.core import (
    VectorStoreIndex,
    ServiceContext,
)
from llama_index.core.vector_stores import MetadataFilters, ExactMatchFilter
import streamlit as st

hide_streamlit_style = """
                <style>
                div[data-testid="stToolbar"] {
                visibility: hidden;
                height: 0%;
                position: fixed;
                }
                div[data-testid="stDecoration"] {
                visibility: hidden;
                height: 0%;
                position: fixed;
                }
                div[data-testid="stStatusWidget"] {
                visibility: hidden;
                height: 0%;
                position: fixed;
                }
                #MainMenu {
                visibility: hidden;
                height: 0%;
                }
                header {
                visibility: hidden;
                height: 0%;
                }
                footer {
                visibility: hidden;
                height: 0%;
                }
                </style>
                """
st.markdown(hide_streamlit_style, unsafe_allow_html=True)

filters = MetadataFilters(filters=[])
course_id = st.query_params.get("course_id")
if course_id is not None and course_id != "":
    filters = MetadataFilters(
        filters=[ExactMatchFilter(key="course_id", value=course_id)]
    )

print(filters)

embed_model = HuggingFaceEmbedding(model_name="BAAI/bge-base-en-v1.5")
chroma_client = chromadb.HttpClient()
chroma_collection = chroma_client.get_collection("professorai")
vector_store = ChromaVectorStore(chroma_collection=chroma_collection)

llm = Ollama(model="mistral:latest")

service_context = ServiceContext.from_defaults(llm=llm,
                                               embed_model=embed_model)
index = VectorStoreIndex.from_vector_store(vector_store, service_context=service_context)
retriever = VectorIndexRetriever(
    index=index,
    filters=filters,
    verbose=True,
)

print(retriever.retrieve("what is openstack heat?"))
chat_engine = ContextChatEngine.from_defaults(
    retriever=retriever,
    verbose=True, service_context=service_context,
    system_prompt="""You are an expert who has been given context around course materials for a masters class.
    you will answer questions to the point only from the context information.
    if you did not get any context for the question then say you that this course probably doesnt cover the material
    the person is looking for""",
    context_template="Context information is below.\n"
    "---------------------\n"
    "{context_str}\n"
    "---------------------\n"
    "\nInstruction: Use the previous chat history, or the context above, to interact and help the user."
)

st.title('Ask me what I know...')
if "messages" not in st.session_state.keys():  # Initialize the chat message history
    st.session_state.messages = [
        {"role": "assistant", "content": "Ask me a question about things I know!"}
    ]

if prompt := st.chat_input("Your question"):  # Prompt for user input and save to chat history
    st.session_state.messages.append({"role": "user", "content": prompt})

for message in st.session_state.messages:  # Display the prior chat messages
    with st.chat_message(message["role"]):
        st.write(message["content"])

if "chat_engine" not in st.session_state.keys():  # Initialize the chat engine
    st.session_state.chat_engine = chat_engine

if st.session_state.messages[-1]["role"] != "assistant":
    with st.chat_message("assistant"):
        with st.spinner("Thinking..."):
            response = st.session_state.chat_engine.chat(prompt)
            st.write(response.response)
            message = {"role": "assistant", "content": response.response}
            st.session_state.messages.append(message)

