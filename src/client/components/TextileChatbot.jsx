
import React, { useState, useRef } from 'react';
import '../../chatbot/chatbot.css';

const SYSTEM_PROMPT = `You are a professional, helpful chatbot for a textile company. Only answer questions related to textiles, fabrics, textile industry, textile care, textile products, textile technology, and textile business. If a question is not related to textiles, politely refuse to answer.`;


export default function TextileChatbot({ groqApiKey }) {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState([
    { role: 'assistant', content: 'Hello! I am your Textile Chatbot. Ask me anything about textiles.' }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const chatEndRef = useRef(null);

  const sendMessage = async (e) => {
    e.preventDefault();
    if (!input.trim()) return;
    const userMessage = { role: 'user', content: input };
    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    setLoading(true);
    try {
      const payload = {
        model: 'openai/gpt-oss-120b',
        messages: [
          { role: 'system', content: SYSTEM_PROMPT },
          ...messages,
          userMessage
        ],
      };
      const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${groqApiKey}`,
        },
        body: JSON.stringify(payload),
      });
      let data;
      if (!response.ok) {
        const errorText = await response.text();
        console.error('Groq API error response:', errorText);
        setMessages((prev) => [...prev, { role: 'assistant', content: 'Sorry, there was an error: ' + errorText }]);
        return;
      } else {
        data = await response.json();
      }
      console.log('Groq API response:', data); // Debug log
      const botReply = data.choices?.[0]?.message?.content || 'Sorry, I could not process your request.';
      setMessages((prev) => [...prev, { role: 'assistant', content: botReply }]);
    } catch (err) {
      console.error('Groq API fetch error:', err);
      setMessages((prev) => [...prev, { role: 'assistant', content: 'Sorry, there was a network or parsing error.' }]);
    } finally {
      setLoading(false);
      setTimeout(() => chatEndRef.current?.scrollIntoView({ behavior: 'smooth' }), 100);
    }
  };

  return (
    <>
      {!open && (
        <button
          className="chatbot-fab"
          aria-label="Open Textile Chatbot"
          onClick={() => setOpen(true)}
          style={{ position: 'fixed', bottom: '2rem', right: '2rem', zIndex: 1100 }}
        >
          <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
            <circle cx="16" cy="16" r="16" fill="#6a4bc6" />
            <path d="M10 22v-2a4 4 0 014-4h4a4 4 0 014 4v2" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            <circle cx="12" cy="14" r="1" fill="#fff"/>
            <circle cx="16" cy="14" r="1" fill="#fff"/>
            <circle cx="20" cy="14" r="1" fill="#fff"/>
          </svg>
        </button>
      )}
      {open && (
        <div className="chatbot-container">
          <div className="chatbot-header">
            Textile Chatbot
            <button
              aria-label="Close chatbot"
              style={{ float: 'right', background: 'none', border: 'none', color: '#fff', fontSize: '1.5rem', cursor: 'pointer' }}
              onClick={() => setOpen(false)}
            >
              ×
            </button>
          </div>
          <div className="chatbot-messages">
            {messages.map((msg, idx) => (
              <div key={idx} className={`chatbot-msg chatbot-msg-${msg.role}`}>{msg.content}</div>
            ))}
            <div ref={chatEndRef} />
          </div>
          <form className="chatbot-input-row" onSubmit={sendMessage}>
            <input
              className="chatbot-input"
              type="text"
              value={input}
              onChange={e => setInput(e.target.value)}
              placeholder="Ask about textiles..."
              disabled={loading}
            />
            <button className="chatbot-send-btn" type="submit" disabled={loading || !input.trim()}>
              {loading ? '...' : 'Send'}
            </button>
          </form>
        </div>
      )}
    </>
  );
}
