import './App.css';
import { useState } from 'react';

function Post() {
  const [selectedImage, setSelectedImage] = useState(null);
  const [previewImage, setPreviewImage] = useState(null);
  const [imageUrl, setImageUrl] = useState('');
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    price: '',
    tags: ''
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const imageChange = (event) => {
    const image = event.target.files[0];
    if (image) {
      setSelectedImage(image);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewImage(reader.result);
      };
      reader.readAsDataURL(image);
    } else {
      setSelectedImage(null);
      setPreviewImage(null);
    }
  };

  const submitPost = async () => {
    if (!selectedImage) {
      console.error("No image selected.");
      return;
    }

    const imageData = new FormData();
    imageData.append("images", selectedImage);

    try {
      const imageRes = await fetch("http://localhost:5001/upload/image", {
        method: "POST",
        body: imageData
      });

      const imageResult = await imageRes.json();
      const uploadedImageUrl = imageResult.imageUrl;
      setImageUrl(uploadedImageUrl);

      // Step 2: Submit the listing
      const listingPayload = {
        title: formData.title,
        description: formData.description,
        price: parseFloat(formData.price),
        tags: formData.tags.split(',').map(tag => tag.trim()),
        images: [uploadedImageUrl]
      };

      const listingRes = await fetch("http://localhost:5001/listings", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        credentials: "include",
        body: JSON.stringify(listingPayload)
      });

      const listingResult = await listingRes.json();
      console.log("Listing created:", listingResult);

      // Optional: reset form
      setFormData({ title: '', description: '', price: '', tags: '' });
      setSelectedImage(null);
      setPreviewImage(null);
      setImageUrl('');

    } catch (err) {
      console.error("Failed to create listing:", err);
    }
  };

  return (
    <div className="PageContent">
      <h1 className="ContentHeader">Create a Listing</h1>

      <h1 className="InputHeader">Title & Description</h1>
      <div className="InputField">
        <input
          type="text"
          name="title"
          placeholder="Listing Title"
          value={formData.title}
          onChange={handleChange}
        />
      </div>
      <div className="ParagraphField">
        <textarea
          name="description"
          placeholder="Listing Description"
          value={formData.description}
          onChange={handleChange}
        />
      </div>

      <h1 className="InputHeader">Pricing</h1>
      <div className="InlineContent">
        <h1 className="ParagraphText">$</h1>
        <div className="PriceInput">
          <input
            type="text"
            name="price"
            placeholder="0.00"
            value={formData.price}
            onChange={handleChange}
          />
        </div>
      </div>

      <h1 className="InputHeader">Listing Image</h1>
      <div className="UploadButton">
        <input
          type="file"
          accept="image/*"
          onChange={imageChange}
        />
      </div>

      {previewImage && (
        <img
          className="ImagePreview"
          src={previewImage}
          alt="Preview"
          style={{ width: "150px", marginTop: "10px" }}
        />
      )}

      <h1 className="InputHeader">Tags</h1>
      <div className="InputField">
        <input
          type="text"
          name="tags"
          placeholder="Tags (comma-separated)"
          value={formData.tags}
          onChange={handleChange}
        />
      </div>

      <button className="Button" onClick={submitPost}>
        Post Listing
      </button>
    </div>
  );
}

export default Post;
