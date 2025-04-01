const mongoose = require("mongoose");

const listingSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  title: { type: String, required: true },
  description: { type: String, required: true },
  price: { type: Number, required: true },
  images: [{ type: String }], // Store image URLs (e.g., from Cloudinary or AWS S3)
  createdAt: { type: Date, default: Date.now },
});

const Listing = mongoose.model("Listing", listingSchema);
module.exports = Listing;
