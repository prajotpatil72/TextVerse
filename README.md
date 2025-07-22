

```markdown
# 📄 TextVerse

TextVerse is a full-stack **PDF-interaction chatbot** powered by **LangChain**, **FAISS**, and **Hugging Face models**. It allows users to upload a PDF and ask questions related to its content via a conversational interface.

Built with:
- 🧠 **LLM**: Mistral-8x7B-Instruct (via HuggingFace)
- 📚 **Vector Store**: FAISS with BGE-small embeddings
- ⚙️ **Backend**: FastAPI + LangChain
- 💬 **Frontend**: React

---

## 🌟 Features

- Upload a PDF (feature coming soon)
- Ask natural language questions about the document
- Uses Retrieval-Augmented Generation (RAG) to answer based on document context
- Smooth chat UI with loading indicators and state transitions

---

## 🖼️ Screenshot

![App Screenshot](assets/screenshot.png)

👉 To add a screenshot:
1. Create an `assets/` folder in the repo root (if not already).
2. Place your image inside it, e.g., `screenshot.png`.
3. Reference it using the Markdown syntax above.

---

## 🏗️ Project Structure
```

TextVerse/
├── backend/                \# FastAPI + LangChain backend
│   ├── main.py             \# API + RAG setup
│   └── .env                \# HuggingFace API token
├── frontend/               \# React-based UI
│   ├── src/App.js          \# Main chat component
│   └── src/App.css         \# Styles
├── assets/                 \# (optional) screenshots and images
├── faiss\_index/            \# Precomputed FAISS index
└── README.md

````
---

## 🚀 Getting Started

### 1. Clone the repository

```bash
git clone [https://github.com/your-username/TextVerse.git](https://github.com/your-username/TextVerse.git)
cd TextVerse
````

### 2\. Backend Setup (FastAPI + LangChain)

#### 🔧 Install dependencies

```bash
cd backend
pip install -r requirements.txt
```

*If `requirements.txt` doesn't exist, use:*

```bash
pip install fastapi uvicorn langchain langchain-community python-dotenv huggingface_hub faiss-cpu
```

#### 🔐 Add HuggingFace API token

Create a `.env` file in the `backend` folder:

```ini
HUGGINGFACEHUB_API_TOKEN=your_token_here
```

#### ▶️ Run the backend server

```bash
uvicorn main:app --reload
```

### 3\. Frontend Setup (React)

#### 🧱 Install dependencies

```bash
cd ../frontend
npm install
```

#### ▶️ Start the frontend app

```bash
npm start
```

The app runs at `http://localhost:3000` and connects to the backend at `http://127.0.0.1:8000`.

-----

## 💬 API Reference

#### `POST /ask`

Send a question to the RAG chatbot.

**Request body:**

```json
{
  "question": "What is the summary of this document?"
}
```

**Response:**

```json
{
  "answer": "This document is about..."
}
```


-----

## 🙌 Acknowledgments

  - [LangChain](https://www.langchain.com/)
  - [Hugging Face](https://huggingface.co/)
  - [BAAI BGE Embeddings](https://huggingface.co/BAAI/bge-small-en)
  - [Mistral-8x7B](https://huggingface.co/mistralai/Mixtral-8x7B-Instruct-v0.1)

-----


<!-- end list -->

```
```
