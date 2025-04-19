
const express = require("express");
const router = express.Router();
const Listing = require("../models/Listing");
const GoogleUser = require("../models/GoogleUser");
const isLoggedIn = require("../middleware/authMiddleware");

// create a new listing (protected route)
router.post("/", isLoggedIn, async (req, res) => {
  console.log("POST /listings hit successfully");
  console.log("Request body:", req.body);
  console.log("Authenticated user:", req.user);
  try {
    const { title, description, price, images, tags } = req.body;

    const newListing = new Listing({ 
      user: req.user._id,
      title, 
      description, 
      price, 
      images,
      tags 
    });

    await newListing.save();

    await newListing.populate("user", "firstName lastName email"); // populate seller details
    console.log("New listing created and populated:", newListing);
    res.status(201).json(newListing);

  } catch (error) {
    console.error("Failed to save listing:", error);
    res.status(500).json({ message: "Error creating listing", error });
  }
});


// get all listings or filter by search, maxPrice, or tags
router.get("/", async (req, res) => {
  try {
    const {search, tags, maxPrice, sortBy} = req.query;
    let query = {};
    // Search by listing title (case-insensitive)
    // BUG/UNINTENDED BEHAVIOR: only finds the first instance of the listing with the search keyword. Should return all listings with that word
        // Seems to work fine in Postman
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
    // Determine sort field and order
    let sortOption = {};
    if (sortBy === "price_asc") {
      sortOption.price = 1; // ascending
    } else if (sortBy === "price_desc") {
      sortOption.price = -1; // descending
    } else {
      sortOption.createdAt = -1; // default to most recent
    }
    
    const listings = await Listing.find(query)
      .sort(sortOption)
      .populate("user", "firstName lastName email");

    res.json(listings);
  } catch (error) {
    res.status(500).json({ message: "Error fetching listings", error });
  }
});

// get favorite listings
router.get("/favorites", isLoggedIn, async (req, res) => {
  try {
    const user = await GoogleUser.findById(req.user._id).populate({ path: "favorites", populate: { path: "user", model: "GoogleUser", select: "firstName lastName email"} });
    res.json(user.favorites);
  } catch (err) {
    res.status(500).json({ message: "Error fetching favorites", err });
  }
});

// remove a listing from "favorites"
router.delete("/favorites/:listingId", isLoggedIn, async (req, res) => {
  try {
    const user = await GoogleUser.findById(req.user._id);
    user.favorites = user.favorites.filter(
      (id) => id.toString() !== req.params.listingId
    );
    await user.save();

    res.json({ message: "Favorite removed", favorites: user.favorites });
  } catch (err) {
    res.status(500).json({ message: "Error removing favorite", err });
  }
});

//GENERICS BELOW
//==================================================================================================================

// add a listing to "favorites"
router.post("/favorites/:listingId", isLoggedIn, async (req, res) => {
  try {
    const user = await GoogleUser.findById(req.user._id);
    const { listingId } = req.params;

    if (!user.favorites.includes(listingId)) {
      user.favorites.push(listingId);
      await user.save();
    }

    res.json({ message: "Listing favorited!", favorites: user.favorites });
  } catch (err) {
    res.status(500).json({ message: "Error adding favorite", err });
  }
});

// get specific listing by ID
router.get("/:id", async (req, res) => {
  try {
    const listing = await Listing.findById(req.params.id).populate("user", "firstName lastName email");
    if (!listing) return res.status(404).json({ message: "Listing not found" });
    res.json(listing);
  } catch (error) {
    res.status(500).json({ message: "Error fetching listing", error });
  }
});

// update a listing (only the owner can update)
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

// delete a listing (only the owner can delete)
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
