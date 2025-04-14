require("dotenv").config();
const express = require("express");
const session = require("express-session");
const passport = require("passport");
const mongoose = require("mongoose");
const cors = require("cors");
const connectDB = require("./config/db")
const userRoutes = require("./routes/userRoutes");
const listingRoutes = require("./routes/listings");
const authRoutes = require("./routes/auth")
const chatRoutes = require('./routes/chats');
const messageRoutes = require('./routes/messages');
require("./config/passport");

const app = express();

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

// root route
app.get("/", (req, res) => {
  res.send("<a href='/auth/google'>Authenticate with Google</a>");
});

// start server
const PORT = process.env.PORT || 5001;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
