from langchain.embeddings.huggingface import HuggingFaceBgeEmbeddings
from llama_index import VectorStoreIndex, ServiceContext
from llama_index.chat_engine import ContextChatEngine
from llama_index.indices.vector_store import VectorIndexRetriever
from llama_index.vector_stores import ChromaVectorStore
from llama_index.vector_stores.types import MetadataFilters, ExactMatchFilter
from llama_index.storage.storage_context import StorageContext
from langchain.llms import VertexAI
from llama_index.llms import LangChainLLM
import streamlit as st
import chromadb
import time

from dotenv import load_dotenv
load_dotenv()

filters = MetadataFilters(filters=[])
course_id = st.query_params.get("course_id")
if course_id is not None and course_id != "":
    filters = MetadataFilters(
        filters=[ExactMatchFilter(key="course_id", value=course_id)]
    )


st.title("Chat with ProfessorAI 💬")
st.info("Need help with your lectures? Ask ProfessorAI! We are here to assist you with any doubts or questions you might have about your course content")

llmv = VertexAI(project="", endpoint_id="", max_output_tokens=2048)

llm = LangChainLLM(llm=llmv)

db = chromadb.HttpClient()
chroma_collection = db.get_or_create_collection("professorai")

embed_model = HuggingFaceBgeEmbeddings(model_name="BAAI/bge-base-en")

vector_store = ChromaVectorStore(chroma_collection=chroma_collection)
storage_context = StorageContext.from_defaults(vector_store=vector_store)

service_context = ServiceContext.from_defaults(llm=llm, embed_model=embed_model)
index = VectorStoreIndex.from_vector_store(vector_store, service_context=service_context)
retriever = VectorIndexRetriever(
    index=index,
    filters=filters,
    verbose=True,
)
# Initialize the chat messages history

print(retriever.retrieve("who is Radia Perlman?"))

if "messages" not in st.session_state.keys():
 st.session_state.messages = [
  {"role": "assistant", "content": "Ask me a question about the Course Material!"}
 ]


# Initialize the chat engine

if "chat_engine" not in st.session_state.keys():
  st.session_state.chat_engine = ContextChatEngine.from_defaults(
      retriever=retriever,
      verbose=True, service_context=service_context,
      system_prompt="""You are an expert who has been given context around course materials for a masters class. 
      you will answer questions to the point only from the context information. 
      if you did not get any context for the question then say you that this course probably doesnt cover the material
      the person is looking for""",
  )

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
