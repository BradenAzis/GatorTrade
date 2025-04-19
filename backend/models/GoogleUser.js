const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
  googleId: { type: String, required: true, unique: true },
  firstName: { type: String },
  lastName: { type: String },
  email: { type: String, unique: true },
  favorites: [{ type: mongoose.Schema.Types.ObjectId, ref: "Listing" }],
  bio: { type: String, required: false, default: "" },
  profilePicture: { type: String, required: false, default: "" },
});

const User = mongoose.model("GoogleUser", UserSchema);
module.exports = User;