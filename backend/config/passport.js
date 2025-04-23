require('dotenv').config();
const passport = require("passport");
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const User = require('../models/GoogleUser'); // Import Mongoose model

passport.use(
    //Define authentication strategy
    new GoogleStrategy(
      {
        clientID: process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        callbackURL: `${process.env.REACT_APP_BACKEND_URI}/auth/google/callback`,
        passReqToCallback: true
      },
      async(request, accessToken, refreshToken, profile, done) => {
        const email = profile.emails[0].value; // Extract user email
        if (!email.endsWith("@ufl.edu")) {
          return done(null, false, { message: "Only @ufl.edu emails are allowed" });
        }
        try {
          // Check if user exists
          let user = await User.findOne({ googleId: profile.id });
          if (!user) {
            // Create new user if not found
            user = new User({
              googleId: profile.id,
              firstName: profile.name.givenName,
              lastName: profile.name.familyName,
              email: profile.emails[0].value,
              favorites: [],
            });
            await user.save();
          }
          return done(null, user); // Proceed with user
        } catch (err) {
          return done(err, null);
        }
      }
    ));

//I do not think this is the most clean way to implement this, but it should work for now
passport.serializeUser(function(user, done){
    done(null, user);
});

passport.deserializeUser(function(user, done){
    done(null, user);
});

// debugging
console.log('GOOGLE_CLIENT_ID:', process.env.GOOGLE_CLIENT_ID);
