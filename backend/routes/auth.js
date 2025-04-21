const express = require("express");
const passport = require("passport");
const router = express.Router();
const isLoggedIn = require("../middleware/authMiddleware");


// route to initiate Google login
router.get("/google", passport.authenticate("google", { scope: ["email", "profile"] }));

// google OAuth callback
router.get("/google/callback",
  passport.authenticate("google", {
    successRedirect: "http://localhost:3000", //change to home page or wherever the user should go on succesfful login
    failureRedirect: "/auth/failure" //where user is sent on failed login
  })
);

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

router.get("/me", isLoggedIn, (req, res) => {
    if (req.isAuthenticated()) {
      res.json(req.user);
    } else {
      res.status(401).json({ message: "Not authenticated" });
    }
  });

router.put("/me", isLoggedIn, async (req, res) => {
    try { 
      const user = await GoogleUser.findById(req.user._id);

      Object.assign(user, req.body);
      await user.save();
      res.json(user);
    } catch (error) {
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
