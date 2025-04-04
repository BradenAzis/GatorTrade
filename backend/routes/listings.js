
const express = require("express");
const router = express.Router();
const Listing = require("../models/Listing");
const isLoggedIn = require("../middleware/authMiddleware");

// Create a new listing (protected route)
router.post("/", isLoggedIn, async (req, res) => {
  try {
    //console.log("User in request:", req.user); // check req.user info
    const { title, description, price, images, tags} = req.body;
    const newListing = new Listing({ 
      user: req.user._id,
      title, 
      description, 
      price, 
      images,
      tags 
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

router.get("/:id", async (req, res) => {
  try {
    const listing = await Listing.findById(req.params.id).populate("user", "firstName lastName email");
    if (!listing) return res.status(404).json({ message: "Listing not found" });
    res.json(listing);
  } catch (error) {
    res.status(500).json({ message: "Error fetching listing", error });
  }
});

router.get("/", async (req, res) => {
  try {
    const {search, tags, maxPrice} = req.query;
    let query = {};
    // Search by listing title (case-insensitive)
    if (search) {
      query.title = { $regex: search, $options: "i" };
    }
    // Filter by tags
    if (tags) {
      query.tags = { $in: tags.split(",") };
    }
    // Filter by max price
    if (maxPrice) {
      query.price = { $lte: parseFloat(maxPrice) }; // Ensure it's a number
    }
    const listings = await Listing.find(query).populate("user", "firstName lastName email"); // Populate seller details
    res.json(listings);
  } catch (error) {
    res.status(500).json({ message: "Error fetching listings", error });
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
