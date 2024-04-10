# Processor (Data ingestion and embedding generation)
Once getting a notification from the backend, the processor reads the professor uploaded file from S3 and processes it using llamaindex. It generates embeddings using BAAI/bge-base-en model. The embeddings are stored in chroma which is the vector database. 

## Installation

1. Clone this repository.
2. Install dependencies using `pip install -r requirements.txt`.
4. Set the environment variables:

```
AWS_ACCESS_KEY_ID=""
AWS_SECRET_ACCESS_KEY=""
AWS_BUCKET_NAME=""
AWS_S3_ENDPOINT_URL=""

```
5. Run the vector database as a docker container `docker run -d --name=chromadb -p 8000:8000 chromadb/chroma`

## Usage

- Run the project with `python main.py`.
- Access the app at `http://localhost:5001/`.
