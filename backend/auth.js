require('dotenv').config();
const passport = require("passport");
const GoogleStrategy = require('passport-google-oauth20').Strategy;

passport.use(
    //Define authentication strategy
    new GoogleStrategy(
      {
        clientID: process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        callbackURL: "http://localhost:5000/google/callback",
        passReqToCallback: true
      },
      function(request, accessToken, refreshToken, profile, done){
        //TODO: Add user to database here based on valid UFL email
        const email = profile.emails[0].value; // Extract user email
        if (!email.endsWith("@ufl.edu")) {
          return done(null, false, { message: "Only @ufl.edu emails are allowed" });
        }
        return done(null, profile);
      }
    ));

//I do not think this is the most clean way to implement this, but it should work for now
passport.serializeUser(function(user, done){
    done(null, user);
});

passport.deserializeUser(function(user, done){
    done(null, user);
});

  