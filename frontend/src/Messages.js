import React, { useEffect, useState, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import axios from 'axios';
import { io } from 'socket.io-client';
import './App.css';

export default function Messages() {
  const location = useLocation();
  const chat = location.state?.chat;
  const [chats, setChats] = useState([]);
  const [selectedChat, setSelectedChat] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [userId, setUserId] = useState(null);
  const socket = useRef(null);

  useEffect(() => {
    const fetchCurrentUser = async () => {
      try {
        const res = await axios.get(`${process.env.REACT_APP_BACKEND_URI}/auth/me`, {
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
    socket.current = io(`${process.env.REACT_APP_BACKEND_URI}`, { withCredentials: true });
  
    return () => {
      socket.current.disconnect();
    };
  }, []);

  useEffect(() => {
    if (!userId || !socket.current) return;
  
    console.log("Emitting join for user:", userId);
    socket.current.emit('join', userId);
  }, [userId]);
  
  useEffect(() => {
    if (!socket.current) return;
  
    socket.current.on('message received', (message) => {
      console.log("Recieved data:");
      console.log(message);
      if (selectedChat && message.chat === selectedChat._id) {
        setMessages(prev => [...prev, message]);
      }
    });
  
    return () => {
      socket.current.off('message received');
    };
  });

  useEffect(() => {
    const fetchChats = async () => {
      const res = await axios.get(`${process.env.REACT_APP_BACKEND_URI}/chats`, { withCredentials: true });
      setChats(res.data);
    };
    fetchChats();
  }, []);

  useEffect(() => {
    if (!selectedChat) return;

    const fetchMessages = async () => {
      const res = await axios.get(`${process.env.REACT_APP_BACKEND_URI}/messages/${selectedChat._id}`, {
        withCredentials: true,
      });
      setMessages(res.data);
    };
    fetchMessages();
  }, [selectedChat]);

  const handleSendMessage = async () => {
    if (!newMessage.trim()) return;

    const res = await axios.post(
      `${process.env.REACT_APP_BACKEND_URI}/messages`,
      {
        chatId: selectedChat._id,
        text: newMessage,
      },
      { withCredentials: true }
    );

    setMessages((prev) => [...prev, res.data]);
    console.log("Sent data:")
    console.log(res.data)
    socket.current.emit('new message', {
        chatId: selectedChat._id,
        senderId: res.data.sender,           
        receiverId: selectedChat.otherUser._id,
        text: res.data.text,
      });// emit to server
    setNewMessage('');
  };

  useEffect(() => {
    if (chat) {
      console.log(chat);
      const filteredChat = {
        ...chat,
        otherUser: chat.participants.find(p => p !== userId) || null,
      };
      setSelectedChat(filteredChat);
    }
  }, [chat]);

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
              className={`chat-bubble ${msg.sender === userId ? 'sent' : 'received'}`}
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
            onKeyDown={e => { if (e.key === 'Enter') {
                e.preventDefault();
                handleSendMessage();
              }
            }}
            placeholder="Type a message..."
          />
          <button onClick={handleSendMessage}>Send</button>
        </div>
      </div>
    </div>
  );
}
