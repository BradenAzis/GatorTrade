const express = require("express");
const session = require("express-session");
const mongoose = require("mongoose");
const cors = require("cors");
const userRoutes = require("./routes/userRoutes");
const passport = require("passport");
require("./auth");
require("dotenv").config();

function isLoggedIn(req, res, next){
  req.user ? next() : res.sendStatus(401);
}

const app = express();
app.use(session({
  secret: "superSecret",
  resave: true,
  saveUninitialized: true,
  cookie:{maxAge: 1000 * 60 * 60}
}));
app.use(passport.initialize());
app.use(passport.session());
app.use(express.json());
app.use(cors());
app.use("/users", userRoutes);

app.get("/auth/google", 
  passport.authenticate("google", {scope: ['email', 'profile']})
);

app.get("/google/callback",
  passport.authenticate('google', {
    successRedirect: "/protected",
    failureRedirect: "/auth/failure"
  })
)

app.get("/protected", isLoggedIn, (req, res) => {
  res.send(`Hello ${req.user.displayName}!`);
  console.log(req.user);
});

app.get("/auth/failure", (req, res) => {
  res.send("something went wrong");
});

app.get("/logout", (req, res) => {
  req.logout();
  req.session.destroy();
  res.send("Goodbye!");
})


mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}).then(() => console.log("MongoDB Connected"))
  .catch(err => console.log(err));

app.get("/", (req, res) => {
  res.send("MERN Backend Running");
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
