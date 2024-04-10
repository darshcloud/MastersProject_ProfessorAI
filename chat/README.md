# Chat (Query engine)
 The chat app is created using streamlit and context chat engine from llamaindex. When a student asks a question about a particular course. The relevant embeddings are retrieved from the vector database and given as a context to the LLM. The LLM then synthesizes the embeddings and provides a coherent answer.
## Installation

1. Clone this repository.
2. Install dependencies using `pip install -r requirements.txt`.
3. Deploy the LLM-Mistral 7B in VertexAI and add the endpoint id in main.py.



## Usage

- Run the project with `streamlit run main.py`.
- Access the app at `http://localhost:8501/`.
