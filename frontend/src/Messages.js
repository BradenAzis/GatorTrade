import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './App.css';


export default function Messages() {
  const [chats, setChats] = useState([]);
  const [selectedChat, setSelectedChat] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');

  useEffect(() => {
    // Fetch all chats
    const fetchChats = async () => {
      const res = await axios.get('http://localhost:5001/chats', { withCredentials: true });
      setChats(res.data);
    };
    fetchChats();
  }, []);

  useEffect(() => {
    // Fetch messages when a chat is selected
    if (!selectedChat) return;
    const fetchMessages = async () => {
      const res = await axios.get(`http://localhost:5001/messages/${selectedChat._id}`, { withCredentials: true });
      setMessages(res.data);
    };
    fetchMessages();
  }, [selectedChat]);

  const handleSendMessage = async () => {
    if (!newMessage.trim()) return;
    const res = await axios.post('http://localhost:5001/messages', {
        chatId: selectedChat._id,
        text: newMessage,
    }, {withCredentials: true});
    setMessages((prev) => [...prev, res.data]);
    setNewMessage('');
  };

  return (
    <div className="messages-container">
      {/* Left: Chat List */}
      <div className="chat-list">
        {chats.map(chat => (
          <div
            key={chat._id}
            className={`chat-preview ${selectedChat?._id === chat._id ? 'active' : ''}`}
            onClick={() => setSelectedChat(chat)}
          >
            <div className="chat-user">{chat.otherUser?.firstName}</div>
            <div className="chat-last-message">{chat.lastMessage?.text || 'No messages yet'}</div>
          </div>
        ))}
      </div>

      {/* Right: Chat Window */}
      <div className="chat-window">
        <div className="chat-messages">
          {messages.map(msg => (
            <div
              key={msg._id}
              className={`chat-bubble ${msg.sender === selectedChat.otherUser._id ? 'received' : 'sent'}`}
            >
              {msg.text}
            </div>
          ))}
        </div>

        <div className="chat-input">
          <input
            type="text"
            value={newMessage}
            onChange={e => setNewMessage(e.target.value)}
            placeholder="Type a message..."
          />
          <button onClick={handleSendMessage}>Send</button>
        </div>
      </div>
    </div>
  );
}
