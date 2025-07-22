import os
from dotenv import load_dotenv

# --- FastAPI Imports ---
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel

# --- LangChain Imports ---
from langchain_community.vectorstores import FAISS
from langchain_huggingface import HuggingFaceEmbeddings, HuggingFaceEndpoint, ChatHuggingFace
from langchain_core.prompts import ChatPromptTemplate
from langchain.chains import create_retrieval_chain
from langchain.chains.combine_documents import create_stuff_documents_chain

# Load environment variables from .env file
load_dotenv()

# --- Initialize Global Variables ---
print("Loading embedding model...")
EMBED_MODEL = HuggingFaceEmbeddings(model_name="BAAI/bge-small-en-v1.5")

VECTOR_STORE_PATH = "faiss_index"
print(f"Loading vector store from {VECTOR_STORE_PATH}...")
try:
    VECTOR_STORE = FAISS.load_local(VECTOR_STORE_PATH, EMBED_MODEL, allow_dangerous_deserialization=True)
except Exception as e:
    print(f"Error loading FAISS index: {e}. Make sure you have run the script to create it.")
    exit()

print("Initializing LLM from Hugging Face...")
hf_endpoint = HuggingFaceEndpoint(
    endpoint_url="https://api-inference.huggingface.co/models/mistralai/Mixtral-8x7B-Instruct-v0.1",
    huggingface_api_token=os.getenv("HUGGINGFACEHUB_API_TOKEN"),
    task="text-generation",
    max_new_tokens=512,
    top_k=30,
    temperature=0.1,
    repetition_penalty=1.03,
)

LLM = ChatHuggingFace(llm=hf_endpoint)

print("Creating retrieval chain...")
retriever = VECTOR_STORE.as_retriever()

system_prompt = (
    "You are an assistant for question-answering tasks. "
    "Use the following pieces of retrieved context to answer "
    "the question. If you don't know the answer, say that you "
    "don't know. Use three sentences maximum and keep the "
    "answer concise."
    "\n\n"
    "{context}"
)

prompt = ChatPromptTemplate.from_messages(
    [
        ("system", system_prompt),
        ("human", "{input}"),
    ]
)

Youtube_chain = create_stuff_documents_chain(LLM, prompt)
rag_chain = create_retrieval_chain(retriever, Youtube_chain)

print("Backend setup complete. Ready to receive requests.")

# --- FastAPI App ---
app = FastAPI()
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class Query(BaseModel):
    question: str

@app.get("/")
def read_root():
    return {"message": "PDF Chatbot API is running!"}

@app.post("/ask")
async def ask_question(query: Query):
    try:
        result = await rag_chain.ainvoke({"input": query.question})
        return {"answer": result["answer"]}
    except Exception as e:
        print(f"Error during chain invocation: {e}")
        return {"answer": "Sorry, I encountered an error while processing your request."}
