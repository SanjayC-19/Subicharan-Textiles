import React, { useState, useRef } from 'react';
import './chatbot.css';

const SYSTEM_PROMPT = `You are a professional, helpful chatbot for a textile company. Only answer questions related to textiles, fabrics, textile industry, textile care, textile products, textile technology, and textile business. If a question is not related to textiles, politely refuse to answer.`;

export default function Chatbot({ groqApiKey }) {
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
      const response = await fetch('https://api.groq.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${groqApiKey}`,
        },
        body: JSON.stringify({
          model: 'llama3-8b-8192',
          messages: [
            { role: 'system', content: SYSTEM_PROMPT },
            ...messages,
            userMessage
          ],
          max_tokens: 512,
        })
      });
      const data = await response.json();
      const botReply = data.choices?.[0]?.message?.content || 'Sorry, I could not process your request.';
      setMessages((prev) => [...prev, { role: 'assistant', content: botReply }]);
    } catch (err) {
      setMessages((prev) => [...prev, { role: 'assistant', content: 'Sorry, there was an error connecting to the chatbot service.' }]);
    } finally {
      setLoading(false);
      setTimeout(() => chatEndRef.current?.scrollIntoView({ behavior: 'smooth' }), 100);
    }
  };

  return (
    <div className="chatbot-container">
      <div className="chatbot-header">Textile Chatbot</div>
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
  );
}
