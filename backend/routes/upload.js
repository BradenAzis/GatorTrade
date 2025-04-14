const express = require('express');
const router = express.Router();
const multer = require('multer');
const { cloudinary } = require('../config/cloudinary');
const { storage } = require('../config/cloudinary');

const upload = multer({ storage });

//TODO: file size limit and file type validation?
router.post('/image', upload.array('images', 5), (req, res) => {
    const images = req.files.map(file => ({
      url: file.path,         // public URL
      public_id: file.filename // Cloudinary's identifier for image deletion
    }));
    res.json({ images });
  });
  

router.delete("/image", async (req, res) => {
const { public_id } = req.body;

if (!public_id) {
    return res.status(400).json({ message: "Missing public_id" });
}

try {
    const result = await cloudinary.uploader.destroy(public_id);
    res.json({ message: "Image deleted", result });
} catch (err) {
    console.error("Cloudinary delete error:", err); // debugging
    res.status(500).json({ message: "Failed to delete image", error: err.message || err });
}
});
  

module.exports = router;
