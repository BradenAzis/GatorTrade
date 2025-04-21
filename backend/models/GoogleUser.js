const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
  googleId: { type: String, required: true, unique: true },
  firstName: { type: String },
  lastName: { type: String },
  email: { type: String, unique: true },
  favorites: [{ type: mongoose.Schema.Types.ObjectId, ref: "Listing" }],
  bio: { type: String, required: false, default: "Go Gators!" },
  profilePicture: { type: String, required: false, default: "https://res.cloudinary.com/dzbfopydt/image/upload/v1745182273/default_pfp_km3kqd.png" },
});

const User = mongoose.model("GoogleUser", UserSchema);
module.exports = User;