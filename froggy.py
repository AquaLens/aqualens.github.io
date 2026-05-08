from flask import Flask, request, jsonify
import requests
import faiss
import numpy as np
import os
from sentence_transformers import SentenceTransformer
from together import Together
from flask_cors import CORS  # Import CORS (development only)

# === Settings ===
SANITY_API_BASE = "https://594hcrq0.api.sanity.io/v2025-04-14/data/query/production?query="
TOGETHER_API_KEY = os.environ.get("TOGETHER_API_KEY", "your-key-here")
MODEL_NAME = "meta-llama/Llama-3.3-70B-Instruct-Turbo-Free"

# === Initialize clients ===
embedder = SentenceTransformer("all-MiniLM-L6-v2")
client = Together(api_key=TOGETHER_API_KEY)

app = Flask(__name__)
CORS(app) # devlopment

# === Backend logic ===
def query_sanity_data(query_type="projects"):
    # Define different queries for different types of data
    queries = {
        "projects": '*[_type == "projects"]{projectName, description, fullText, tags, location, companyOrganization, source}',
        "tags": '*[_type == "tags"]{tagName, description}',
        "locations": '*[_type == "locations"]{locationName, description}',
        "organizations": '*[_type == "organizations"]{orgName, description}',
    }

    query = queries.get(query_type, queries["projects"])  # Default to projects if query_type is unknown
    url = SANITY_API_BASE + requests.utils.quote(query)
    res = requests.get(url)
    res.raise_for_status()
    return res.json()['result']


def embed_texts(texts):
    return embedder.encode(texts, convert_to_numpy=True)

def get_top_k(query, documents, query_type="projects", k=3):
    corpus_texts = []
    
    # Build corpus_texts depending on query_type
    if query_type == "projects":
        corpus_texts = [doc['description'] + "\n" + doc['fullText'] + "\n" + doc['source'] for doc in documents]
    elif query_type == "tags":
        corpus_texts = [doc['tagName'] + "\n" + doc['description'] for doc in documents]
    elif query_type == "locations":
        corpus_texts = [doc['locationName'] + "\n" + doc['description'] for doc in documents]
    elif query_type == "organizations":
        corpus_texts = [doc['orgName'] + "\n" + doc['description'] for doc in documents]

    corpus_embeddings = embed_texts(corpus_texts)

    index = faiss.IndexFlatL2(corpus_embeddings.shape[1])
    index.add(corpus_embeddings)

    query_embedding = embed_texts([query])
    distances, indices = index.search(query_embedding, k)
    return [documents[i] for i in indices[0]]


def generate_answer(query, relevant_docs, query_type="projects"):
    # Generate context based on the documents returned
    context = "\n\n".join(
        f"Name: {doc.get('projectName', doc.get('tagName', doc.get('locationName', doc.get('orgName', 'N/A'))))}\n"
        f"Description: {doc.get('description', 'N/A')}\n"
        f"Full Text: {doc.get('fullText', '')[:1000]}..."
        for doc in relevant_docs
    )

    # Adjust the system prompt to avoid the 'projects' assumption
    system_prompt = """You are Froggy, a helpful and knowledgeable AI agent specializing in water quality initiatives and research. My goal is to guide you by answering questions, providing insights, and helping you explore water-related topics such as research projects, locations, organizations, and more.

I will adjust my responses based on your interest:
- If you're curious about specific research, I can provide detailed explanations.
- If you're looking to explore water-related topics like locations, organizations, or technologies, I can help with that too.
- I'll keep my responses friendly, clear, and concise, and tailor them to your level of expertise.

Please feel free to ask anything about water research, and I'll be happy to assist you."""

    prompt = f"""Context:
{context}

User question: {query}
Answer:"""

    headers = {
        "Authorization": f"Bearer {TOGETHER_API_KEY}",
        "Content-Type": "application/json"
    }

    data = {
        "model": MODEL_NAME,
        "messages": [
            {"role": "system", "content": system_prompt},
            {"role": "user", "content": prompt}
        ]
    }

    response = requests.post("https://api.together.xyz/v1/chat/completions", headers=headers, json=data)
    response.raise_for_status()
    return response.json()["choices"][0]["message"]["content"].strip()



def answer_question(user_question):
    # First, classify the query (e.g., is it about projects, tags, locations, etc.?)
    if "project" in user_question.lower():
        query_type = "projects"
    elif "tag" in user_question.lower():
        query_type = "tags"
    elif "location" in user_question.lower():
        query_type = "locations"
    elif "organization" in user_question.lower():
        query_type = "organizations"
    else:
        query_type = None  # No query type if unsure

    if query_type:
        documents = query_sanity_data(query_type)
        top_docs = get_top_k(user_question, documents, query_type)
        return generate_answer(user_question, top_docs, query_type)
    else:
        return generate_answer(user_question, [], "")  # No documents and no query type



# === API Endpoint ===
@app.route("/api/ask", methods=["POST"])
def ask():
    data = request.json
    question = data.get("question", "")
    if not question:
        return jsonify({"error": "No question provided"}), 400

    try:
        answer = answer_question(question)
        return jsonify({"answer": answer})
    except Exception as e:
        return jsonify({"error": str(e)}), 500


# === Run server ===
if __name__ == "__main__":
    app.run(debug=True)
