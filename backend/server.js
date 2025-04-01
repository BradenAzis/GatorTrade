const express = require("express");
const session = require("express-session");
const mongoose = require("mongoose");
const cors = require("cors");
const userRoutes = require("./routes/userRoutes");
const passport = require("passport");
const listingRoutes = require("./routes/listings");
const isLoggedIn = require("./middleware/authMiddleware");
require("./auth");
require("dotenv").config();

const app = express();
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
app.use("/users", userRoutes);
app.use("/listings", listingRoutes);

app.get("/auth/google", //go to this route for google login prompt 
  passport.authenticate("google", {scope: ['email', 'profile']})
);

app.get("/google/callback",
  passport.authenticate('google', {
    successRedirect: "/protected", //change to home page or wherever the user should go on succesfful login
    failureRedirect: "/auth/failure" //where user is sent on failed login
  })
)

app.get("/protected", isLoggedIn, (req, res) => { //example protected route
  res.send(`Hello ${req.user.firstName} ${req.user.lastName}!`);
  console.log(req.user);
});

app.get("/auth/failure", (req, res) => {
  res.send("Something went wrong. Make sure to sign in with a valid ufl email adress.");
});

app.get("/logout", (req, res, next) => {
  req.logout((err) => {
    if (err) {
      return next(err);
    }
    req.session.destroy(() => {
      res.send("Goodbye!");
    });
  });
});


mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}).then(() => console.log("MongoDB Connected"))
  .catch(err => console.log(err));

app.get("/", (req, res) => {
  //res.send("MERN Backend Running");
  res.send("<a href='/auth/google'>Authenticate with Google</a>");
});

const PORT = process.env.PORT || 5001;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
