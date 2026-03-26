# Textile Chatbot

This directory contains a professional, production-grade React chatbot component for answering textile-related questions using the Groq API.

## Features
- Restricts answers to textile topics only (see system prompt in `Chatbot.jsx`)
- Modern, branded UI with textile-inspired color palette
- Easy to integrate anywhere in your React app
- All logic and styles are encapsulated in this directory

## Usage

1. **Add your Groq API key** securely (never commit it to source control).
2. Import and use the chatbot in your app:

```jsx
import Chatbot from './chatbot/Chatbot';

function App() {
  return <Chatbot groqApiKey={process.env.REACT_APP_GROQ_API_KEY} />;
}
```

3. The chatbot will only answer questions related to textiles. For other topics, it will politely refuse.

## File Structure
- `Chatbot.jsx` — Main chatbot React component
- `chatbot.css` — Styles for the chatbot UI
- `README.md` — This documentation

---

**Security Note:**
- Never expose your Groq API key in client-side code for production. Use a backend proxy or environment variables with server-side protection for real deployments.
