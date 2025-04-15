import React, { useEffect, useState } from 'react';
import axios from 'axios';

export default function Messages() {
  const [chats, setChats] = useState([]);
  const [selectedChat, setSelectedChat] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');

  useEffect(() => {
    // Fetch all chats
    const fetchChats = async () => {
      const res = await axios.get('/api/chats');
      setChats(res.data);
    };
    fetchChats();
  }, []);

  useEffect(() => {
    // Fetch messages when a chat is selected
    if (!selectedChat) return;
    const fetchMessages = async () => {
      const res = await axios.get(`/api/messages?chatId=${selectedChat._id}`);
      setMessages(res.data);
    };
    fetchMessages();
  }, [selectedChat]);

  const handleSendMessage = async () => {
    if (!newMessage.trim()) return;
    const res = await axios.post('/api/messages', {
      chatId: selectedChat._id,
      text: newMessage,
    });
    setMessages((prev) => [...prev, res.data]);
    setNewMessage('');
  };

  return (
    <div className="flex h-screen">
      {/* Left column - chats list */}
      <div className="w-1/4 border-r overflow-y-auto p-4">
        <h2 className="text-lg font-semibold mb-4">Chats</h2>
        {chats.map((chat) => (
          <div
            key={chat._id}
            onClick={() => setSelectedChat(chat)}
            className={`p-2 cursor-pointer rounded hover:bg-gray-100 ${
              selectedChat?._id === chat._id ? 'bg-gray-200' : ''
            }`}
          >
            <div className="font-medium">{chat.otherUser?.name || 'Unknown User'}</div>
            <div className="text-sm text-gray-500 truncate">
              {chat.lastMessage?.text || 'No messages yet'}
            </div>
          </div>
        ))}
      </div>

      {/* Right column - messages */}
      <div className="w-3/4 flex flex-col">
        {selectedChat ? (
          <>
            <div className="flex-1 overflow-y-auto p-4">
              {messages.map((msg) => (
                <div
                  key={msg._id}
                  className={`flex mb-2 ${
                    msg.sender === selectedChat.otherUser._id
                      ? 'justify-start'
                      : 'justify-end'
                  }`}
                >
                  <div className="max-w-xs p-2 rounded-lg bg-blue-100 text-gray-800">
                    {msg.text}
                  </div>
                </div>
              ))}
            </div>
            <div className="p-4 border-t flex">
              <input
                type="text"
                className="flex-1 border rounded p-2 mr-2"
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                placeholder="Type a message..."
              />
              <button
                onClick={handleSendMessage}
                className="bg-blue-500 text-white px-4 py-2 rounded"
              >
                Send
              </button>
            </div>
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center text-gray-500">
            Select a chat to start messaging
          </div>
        )}
      </div>
    </div>
  );
}
