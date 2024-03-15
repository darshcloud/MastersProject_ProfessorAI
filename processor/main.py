from flask import Flask, request, abort
from dotenv import load_dotenv
import os
import chromadb
from llama_index.vector_stores.chroma import ChromaVectorStore
from llama_index.embeddings.huggingface import HuggingFaceEmbedding
from llama_index.readers.s3 import S3Reader
from llama_index.core.node_parser import SentenceSplitter
from llama_index.core.ingestion import IngestionPipeline
import json
import requests

# Load the environment variables from the .env file
load_dotenv()

# Get the properties from the environment
aws_access_key_id = os.getenv('AWS_ACCESS_KEY_ID')
aws_secret_access_key = os.getenv('AWS_SECRET_ACCESS_KEY')
aws_bucket_name = os.getenv('AWS_BUCKET_NAME')
s3_endpoint_url = os.getenv('AWS_S3_ENDPOINT_URL')
aws_region = os.getenv('AWS_REGION')
hf_token = os.getenv('HF_TOKEN')

app = Flask(__name__)

embed_model = HuggingFaceEmbedding(model_name="BAAI/bge-base-en-v1.5")
chroma_client = chromadb.HttpClient()
chroma_collection = chroma_client.get_or_create_collection("professorai")
vector_store = ChromaVectorStore(chroma_collection=chroma_collection)


pipeline = IngestionPipeline(
    transformations=[
        SentenceSplitter(chunk_size=500),
        embed_model,
    ],
    vector_store=vector_store,
)


@app.route('/sns', methods=['POST'])
def sns():
    try:
        # Parse the JSON message
        message = json.loads(request.data)

        # Check the type of message and process accordingly
        message_type = message.get('Type')
        if message_type == 'SubscriptionConfirmation':
            return handle_subscription(message)
        elif message_type == 'Notification':
            return handle_notification(message)
        else:
            return 'Invalid message type', 400

    except Exception as e:
        return 'Error processing message: {}'.format(e), 500


def handle_subscription(message):
    # Extract the subscribe URL
    subscribe_url = message.get('SubscribeURL')

    # Make a request to the subscribe URL to confirm the subscription
    requests.get(subscribe_url)

    return 'Subscription confirmed', 200


def generate_embeddings(file_id, course_id):
    try:
        loader = S3Reader(bucket=aws_bucket_name, aws_access_id=aws_access_key_id,
                          aws_access_secret=aws_secret_access_key, key=file_id,
                          s3_endpoint_url=s3_endpoint_url)
        documents = loader.load_data()

        for document in documents:

            document.metadata["file_id"] = file_id
            document.metadata["course_id"] = course_id

        # Insert nodes into the index
        pipeline.run(documents=documents, show_progress=True)
    except Exception as e:
        abort(500, f'Error obtaining file: {e}')

    return 'File downloaded successfully.', 200


def delete_file(filename):
    print("before", chroma_collection.count())
    chroma_collection.delete(where={"file_id": filename})
    print("after", chroma_collection.count())
    return 'File deleted successfully.', 200


def handle_notification(message):
    # Extract the message from the SNS notification
    sns_message = json.loads(message.get('Message'))

    # Extract the course_id and file_id from the message
    file_id = sns_message.get('file_id')
    course_id = sns_message.get('course_id')
    action = sns_message.get('action')

    if action == 'delete':
        return delete_file(file_id)
    elif action == 'create':
        return generate_embeddings(file_id, course_id)


if __name__ == '__main__':
    app.run(debug=True, port=5001)


