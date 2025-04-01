
const express = require("express");
const router = express.Router();
const Listing = require("../models/Listing");
const isLoggedIn = require("../middleware/authMiddleware");

// Create a new listing (protected route)
router.post("/", isLoggedIn, async (req, res) => {
  try {
    //console.log("User in request:", req.user); // check req.user info
    const { title, description, price, images} = req.body;
    const newListing = new Listing({ 
      user: req.user._id,
      title, 
      description, 
      price, 
      images 
    });
    await newListing.save();
    res.status(201).json(newListing);
  } catch (error) {
    res.status(500).json({ message: "Error creating listing", error });
  }
});

// Update a listing (only the owner can update)
router.put("/:id", isLoggedIn, async (req, res) => {
  try {
    const listing = await Listing.findById(req.params.id);
    if (!listing) return res.status(404).json({ message: "Listing not found" });

    if (listing.user.toString() !== req.user._id)
      return res.status(403).json({ message: "Unauthorized" });

    Object.assign(listing, req.body);
    await listing.save();
    res.json(listing);
  } catch (error) {
    res.status(500).json({ message: "Error updating listing", error });
  }
});

// Delete a listing (only the owner can delete)
router.delete("/:id", isLoggedIn, async (req, res) => {
  try {
    const listing = await Listing.findById(req.params.id);
    if (!listing) return res.status(404).json({ message: "Listing not found" });

    if (listing.user.toString() !== req.user._id)
      return res.status(403).json({ message: "Unauthorized" });

    await listing.deleteOne();
    res.json({ message: "Listing deleted" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting listing", error });
  }
});

module.exports = router;
