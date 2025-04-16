import React, { useEffect, useState, useRef } from 'react';
import axios from 'axios';
import { io } from 'socket.io-client';
import './App.css';

export default function Messages() {
  const [chats, setChats] = useState([]);
  const [selectedChat, setSelectedChat] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [userId, setUserId] = useState(null);
  const socket = useRef(null);

  useEffect(() => {
    const fetchCurrentUser = async () => {
      try {
        const res = await axios.get("http://localhost:5001/auth/me", {
          withCredentials: true
        });
        setUserId(res.data._id);
      } catch (err) {
        console.error("Failed to fetch user:", err);
      }
    };
    fetchCurrentUser();
  }, []);

  useEffect(() => {
    // Connect to socket server
    socket.current = io('http://localhost:5001', { withCredentials: true });

    // join personal room
    socket.current.emit('join', userId);

    // Listen for incoming messages
    socket.current.on('message received', (message) => {
      if (selectedChat && message.chatId === selectedChat._id) {
        setMessages((prev) => [...prev, message]);
      }
    });

    return () => {
      socket.current.disconnect();
    };
  }, [selectedChat]);

  useEffect(() => {
    const fetchChats = async () => {
      const res = await axios.get('http://localhost:5001/chats', { withCredentials: true });
      setChats(res.data);
    };
    fetchChats();
  }, []);

  useEffect(() => {
    if (!selectedChat) return;

    const fetchMessages = async () => {
      const res = await axios.get(`http://localhost:5001/messages/${selectedChat._id}`, {
        withCredentials: true,
      });
      setMessages(res.data);
    };
    fetchMessages();
  }, [selectedChat]);

  const handleSendMessage = async () => {
    if (!newMessage.trim()) return;

    const res = await axios.post(
      'http://localhost:5001/messages',
      {
        chatId: selectedChat._id,
        text: newMessage,
      },
      { withCredentials: true }
    );

    setMessages((prev) => [...prev, res.data]);
    socket.current.emit('new message', res.data); // emit to server
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
