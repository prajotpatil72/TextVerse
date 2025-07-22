import React, { useState, useEffect, useRef } from 'react';
import './App.css';

// SVG icons for a cleaner look
const UploadIcon = () => (
  <svg className="upload-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
    <path d="M14 14.75V19.5C14 20.3284 13.3284 21 12.5 21H5.5C4.67157 21 4 20.3284 4 19.5V4.5C4 3.67157 4.67157 3 5.5 3H12.5C13.3284 3 14 3.67157 14 4.5V9.25C14 9.66421 14.3358 10 14.75 10C15.1642 10 15.5 9.66421 15.5 9.25V4.5C15.5 2.84315 14.1569 1.5 12.5 1.5H5.5C3.84315 1.5 2.5 2.84315 2.5 4.5V19.5C2.5 21.1569 3.84315 22.5 5.5 22.5H12.5C14.1569 22.5 15.5 21.1569 15.5 19.5V14.75C15.5 14.3358 15.1642 14 14.75 14C14.3358 14 14 14.3358 14 14.75ZM18.5185 7.42434L15.7685 4.67434C15.4756 4.38145 15.0008 4.38145 14.7079 4.67434C14.415 4.96724 14.415 5.44208 14.7079 5.73497L16.4421 7.46914H10.75C10.3358 7.46914 10 7.80493 10 8.21914C10 8.63336 10.3358 8.96914 10.75 8.96914H16.4421L14.7079 10.7033C14.415 10.9962 14.415 11.471 14.7079 11.7639C15.0008 12.0568 15.4756 12.0568 15.7685 11.7639L18.5185 9.01391C18.961 8.57147 18.961 7.86678 18.5185 7.42434Z" />
  </svg>
);

const SendIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" width="20px" height="20px">
    <path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z" />
  </svg>
);


function App() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [isChatActive, setIsChatActive] = useState(false); // Controls the UI state

  const chatWindowRef = useRef(null);

  // Automatically scroll to the bottom of the chat window when new messages are added
  useEffect(() => {
    if (chatWindowRef.current) {
      chatWindowRef.current.scrollTop = chatWindowRef.current.scrollHeight;
    }
  }, [messages, isLoading]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMessage = { sender: 'user', text: input };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);
    setError('');

    try {
      const response = await fetch('http://127.0.0.1:8000/ask', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ question: input }),
      });

      if (!response.ok) {
        throw new Error(`API error: ${response.statusText}`);
      }

      const data = await response.json();
      const aiMessage = { sender: 'ai', text: data.answer };
      setMessages(prev => [...prev, aiMessage]);

    } catch (err) {
      const errorMessage = { sender: 'ai', text: `Sorry, I encountered an error. Please try again. (${err.message})` };
      setMessages(prev => [...prev, errorMessage]);
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  // This function simulates "uploading" and transitions the UI to the chat view.
  const handleStartChat = () => {
    setIsChatActive(true);
    setMessages([{
      sender: 'ai',
      text: "Document loaded. I'm ready to answer your questions!"
    }]);
  };

  return (
    <div className="app-container">
      <div className="pdf-interactor">
        <header className="header">
          <h1>PDF Interactor</h1>
          <p>Upload a PDF and start asking questions</p>
        </header>

        <div className="chat-window" ref={chatWindowRef}>
          {!isChatActive ? (
            <div className="initial-view">
              <UploadIcon />
              <p className="initial-text">Upload a PDF to begin your conversation.</p>
            </div>
          ) : (
            messages.map((msg, index) => (
              <div key={index} className={`message-container ${msg.sender}-message-container`}>
                <div className={`message-bubble ${msg.sender}-bubble`}>
                  {msg.text}
                </div>
              </div>
            ))
          )}
           {isLoading && (
              <div className="message-container ai-message-container">
                <div className="message-bubble ai-bubble loading-bubble">
                  <span></span><span></span><span></span>
                </div>
              </div>
            )}
        </div>

        <footer className="footer-form">
          {!isChatActive ? (
            <div className="upload-actions">
              <button className="select-pdf-btn">Select PDF</button>
              <button className="upload-btn" onClick={handleStartChat}>Upload</button>
            </div>
          ) : (
            <form className="input-form" onSubmit={handleSubmit}>
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Ask a question about the PDF..."
                disabled={isLoading}
              />
              <button type="submit" disabled={isLoading || !input.trim()}>
                <SendIcon />
              </button>
            </form>
          )}
        </footer>
      </div>
    </div>
  );
}

export default App;