const express = require("express");
const passport = require("passport");
const mongoose = require("mongoose");
const router = express.Router();
const isLoggedIn = require("../middleware/authMiddleware");
const GoogleUser = require("../models/GoogleUser");


// route to initiate Google login
router.get("/google", passport.authenticate("google", { scope: ["email", "profile"] }));

// google OAuth callback
router.get("/google/callback", (req, res, next) => {
  passport.authenticate("google", (err, user, info) => {
    if (err) {
      console.error("Auth error:", err);
      return res.redirect("/auth/failure");
    }

    if (!user) {
      console.error("No user returned from Google strategy");
      return res.redirect("/auth/failure");
    }

    req.logIn(user, (err) => {
      if (err) {
        console.error("Login error:", err);
        return res.redirect("/auth/failure");
      }

      console.log("User successfully logged in:", user);
      return res.redirect(process.env.REACT_APP_FRONTEND_URL);
    });
  })(req, res, next);
});

// test route to check if login is working and getting proper user info
router.get("/protected", isLoggedIn, (req, res) => { //example protected route
    res.send(`Hello ${req.user.firstName} ${req.user.lastName}!`);
    console.log(req.user);
});

// login failure redirect route
router.get("/failure", (req, res) => {
    res.send("Something went wrong. Make sure to sign in with a valid ufl email adress.");
});

// logout route
router.get("/logout", (req, res, next) => {
  req.logout((err) => {
    if (err) {
      return next(err);
    }
    req.session.destroy(() => {
      res.send("Goodbye!");
    });
  });
});

router.get("/me", isLoggedIn, async (req, res) => {
    if (req.isAuthenticated()) {
        const freshUser = await GoogleUser.findById(req.user._id); // ✅ fetch fresh user
        res.json(freshUser);
    } else {
      res.status(401).json({ message: "Not authenticated" });
    }
  });

router.put("/me", isLoggedIn, async (req, res) => {
    console.log(req.body);
    try {
      const user = await GoogleUser.findById(req.user._id);

      Object.assign(user, req.body);
      await user.save();
      res.json(user);
    } catch (error) {
        console.log(error);
      res.status(500).json({ message: "Error updating listing", error });
    }
  });

  router.get("/:id", isLoggedIn, async (req, res) => {
    try {
      const user = await GoogleUser.findById(req.params.id);
      if (!user) return res.status(404).json({ message: "User not found" });
      res.json(user);
    } catch (error) {
      res.status(500).json({ message: "Error fetching user", error });
    }
  });

module.exports = router;
