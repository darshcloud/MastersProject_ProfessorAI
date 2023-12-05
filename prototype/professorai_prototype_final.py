from langchain.embeddings.huggingface import HuggingFaceBgeEmbeddings
from llama_index import VectorStoreIndex, SimpleDirectoryReader, ServiceContext
from llama_index.vector_stores import ChromaVectorStore
from llama_index.storage.storage_context import StorageContext
from langchain.llms import VertexAI
from llama_index.llms import LangChainLLM
import streamlit as st
import chromadb
import time

st.title("Chat with ProfessorAI 💬")
st.info(
    "Need help with your lectures? Ask ProfessorAI! We are here to assist you with any doubts or questions you might have about your course content")

llmv = VertexAI(project="PROJECT_ID", endpoint_id="ENDPOINT_ID", max_output_tokens=2048)

llm = LangChainLLM(llm=llmv)

db = chromadb.PersistentClient(path="./chroma_data")
chroma_collection = db.get_or_create_collection("quickstart")

embed_model = HuggingFaceBgeEmbeddings(model_name="BAAI/bge-base-en")

vector_store = ChromaVectorStore(chroma_collection=chroma_collection)
storage_context = StorageContext.from_defaults(vector_store=vector_store)

# Initialize the chat messages history

if "messages" not in st.session_state.keys():
    st.session_state.messages = [
        {"role": "assistant", "content": "Ask me a question about the Course Material!"}
    ]


@st.cache_resource(show_spinner=False)
def load_data():
    with st.spinner(text="Loading and Indexing Data - Please hang Tight! This should take 2-3 minutes."):
        service_context = ServiceContext.from_defaults(llm=llm, embed_model=embed_model)
        documents = SimpleDirectoryReader('data').load_data()
        indexdata = VectorStoreIndex.from_documents(documents, service_context=service_context, storage_context=storage_context)
        return indexdata


index = load_data()

# Initialize the chat engine

if "chat_engine" not in st.session_state.keys():
    st.session_state.chat_engine = index.as_chat_engine(chat_mode="context", verbose=True)

# Initialize messages if not present in session state
if "messages" not in st.session_state:
    st.session_state.messages = []

# Prompt for user input and save to chat history
if prompt := st.chat_input("Please Enter Your question"):
    st.session_state.messages.append({"role": "user", "content": prompt})

# Display the prior chat messages
for message in st.session_state.messages:
    with st.chat_message(message["role"]):
        st.write(message["content"])

# If last message is not from assistant, generate a new response
if st.session_state.messages[-1]["role"] != "assistant":
    with st.chat_message("assistant"):
        with st.spinner("Thinking..."):
            response = st.session_state.chat_engine.chat(prompt)
            full_response = ""
            placeholder = st.empty()
            for chunk in response.response:
                time.sleep(0.01)
                full_response += chunk
                placeholder.markdown(full_response+ "▌")
            placeholder.markdown(full_response)
            message = {"role": "assistant", "content": full_response}
            # Add response to message history
            st.session_state.messages.append(message)
