const mongoose = require("mongoose");

const listingSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "GoogleUser", required: false },
  title: { type: String, required: true },
  description: { type: String, required: true },
  price: { type: Number, required: true },
  images: { type: [String], default: [], required: true }, // image URLs from Cloudinary route
  tags: { type: [String], default: [] },
  createdAt: { type: Date, default: Date.now },
});

const Listing = mongoose.model("Listing", listingSchema);
module.exports = Listing;
