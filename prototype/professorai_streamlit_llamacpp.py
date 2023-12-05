from llama_index.llms import LlamaCPP
from llama_index.llms.llama_utils import messages_to_prompt, completion_to_prompt
from langchain.embeddings.huggingface import HuggingFaceBgeEmbeddings
from llama_index import VectorStoreIndex, SimpleDirectoryReader, ServiceContext
from llama_index.vector_stores import ChromaVectorStore
from llama_index.storage.storage_context import StorageContext
import streamlit as st
import chromadb

st.title("Chat with ProfessorAI 💬")
st.info(
    "Need help with your lectures? Ask ProfessorAI! We are here to assist you with any doubts or questions you might have about your course content")

llm = LlamaCPP(
    # You can pass in the URL to a GGML model to download it automatically
    model_url='https://huggingface.co/TheBloke/Mistral-7B-Instruct-v0.1-GGUF/resolve/main/mistral-7b-instruct-v0.1.Q4_K_M.gguf',
    # optionally, you can set the path to a pre-downloaded model instead of model_url
    model_path=None,
    temperature=0.1,
    max_new_tokens=512,
    context_window=8000,
    # kwargs to pass to __call__()
    generate_kwargs={},
    # kwargs to pass to __init__()
    # set to at least 1 to use GPU
    model_kwargs={"n_gpu_layers": -1},
    # transform inputs into Llama2 format
    messages_to_prompt=messages_to_prompt,
    completion_to_prompt=completion_to_prompt,
    verbose=True,
)

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
            st.write(response.response)
            message = {"role": "assistant", "content": response.response}
            # Add response to message history
            st.session_state.messages.append(message)
