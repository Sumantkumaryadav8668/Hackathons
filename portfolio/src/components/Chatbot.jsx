import { useState } from "react";
import React from "react";

const botReplies = [
  "Thanks for visiting. You can download the resume from the hero section.",
  "The projects section includes GitHub and live links for quick review.",
  "This portfolio is built with React, CSS animations, Node.js, and Express."
];

function Chatbot() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState([
    { from: "bot", text: "Hi, I can answer quick portfolio questions." }
  ]);
  const [input, setInput] = useState("");

  function sendMessage(event) {
    event.preventDefault();
    if (!input.trim()) return;
    const reply = botReplies[messages.length % botReplies.length];
    setMessages([...messages, { from: "user", text: input.trim() }, { from: "bot", text: reply }]);
    setInput("");
  }

  return (
    <div className="chatbot">
      {open && (
        <section className="chat-window glass-panel" aria-label="Portfolio chatbot">
          <header>AI Assistant</header>
          <div className="chat-messages">
            {messages.map((message, index) => (
              <p className={message.from} key={`${message.text}-${index}`}>
                {message.text}
              </p>
            ))}
          </div>
          <form onSubmit={sendMessage}>
            <input
              value={input}
              onChange={(event) => setInput(event.target.value)}
              placeholder="Ask about skills..."
              aria-label="Chat message"
            />
            <button type="submit">Send</button>
          </form>
        </section>
      )}
      <button className="chat-button" onClick={() => setOpen(!open)} aria-label="Toggle chatbot">
        AI
      </button>
    </div>
  );
}

export default Chatbot;
