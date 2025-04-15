require("dotenv").config();
const express = require("express");
const session = require("express-session");
const passport = require("passport");
const socketIO = require('socket.io');
const mongoose = require("mongoose");
const http = require('http');
const cors = require("cors");
const connectDB = require("./config/db")
const userRoutes = require("./routes/userRoutes");
const listingRoutes = require("./routes/listings");
const authRoutes = require("./routes/auth")
const chatRoutes = require('./routes/chats');
const messageRoutes = require('./routes/messages');
require("./config/passport");

const app = express();
const server = http.createServer(app); // socket.io
const io = socketIO(server, {
  cors: {
    origin: 'http://localhost:5001', // your frontend origin
    methods: ['GET', 'POST']
  }
});

// middleware
app.use(session({ //client session management
  secret: process.env.SESSION_SECRET, //secret used to create session ID cookie
  resave: false,
  saveUninitialized: false,
  cookie:{maxAge: 1000 * 60 * 60} //cookie lasts 1 hour (1000ms * 60 * 60)
}));
app.use(passport.initialize());
app.use(passport.session());
app.use(express.json());
app.use(cors());

// routes
app.use("/users", userRoutes);
app.use("/listings", listingRoutes);
app.use("/auth", authRoutes);
app.use('/chats', chatRoutes);
app.use('/messages', messageRoutes);

// connect to MongoDB
connectDB();

// socket.io stuff
io.on('connection', (socket) => {
  console.log('A user connected:', socket.id);

  // join user to a room based on their userId
  socket.on('join', (userId) => {
    socket.join(userId);
    console.log(`User ${userId} joined their own room`);
  });

  // handle message sending
  socket.on('sendMessage', ({ chatId, senderId, receiverId, text }) => {
    console.log(`Message sent from ${senderId} to ${receiverId}:`, text);

    // emit to receiver's room
    io.to(receiverId).emit('newMessage', {
      chatId,
      senderId,
      text,
      createdAt: new Date()
    });
  });

  socket.on('disconnect', () => {
    console.log('User disconnected:', socket.id);
  });
});

// root route
app.get("/", (req, res) => {
  res.send("<a href='/auth/google'>Authenticate with Google</a>");
});

// start server
const PORT = process.env.PORT || 5001;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
