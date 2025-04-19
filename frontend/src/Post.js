import './App.css';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function Post() {
  const [selectedImages, setSelectedImages] = useState([]);
  const [previewImages, setPreviewImages] = useState([]);
  const navigate = useNavigate(); 


  const submitPost = async () => {
    const title = document.getElementById("ltitle").value;
    const description = document.getElementById("ldesc").value;
    const price = document.getElementById("lprice").value;
    const tags = document.getElementById("ltags").value;

    let imageUrls = [];

    // Step 1: Upload the selected images
    if (selectedImages.length > 0) {
      const imageData = new FormData();
      selectedImages.forEach(image => {
        imageData.append("images", image);
      });

      try {
        const imageRes = await fetch("http://localhost:5001/upload/image", {
          method: "POST",
          body: imageData
        });

        const result = await imageRes.json();
        imageUrls = result.images.map(img => img.url);
      } catch (err) {
        console.error("Image upload failed:", err);
        return;
      }
    }

    // Step 2: Submit listing with image URLs
    const postData = {
      title,
      description,
      price: parseFloat(price),
      tags: tags.split(',').map(t => t.trim()),
      images: imageUrls
    };

    try {
      const listingRes = await fetch("http://localhost:5001/listings", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        credentials: "include",
        body: JSON.stringify(postData)
      });

      if (!listingRes.ok) throw new Error("Failed to submit listing");

      const listingResult = await listingRes.json();
      console.log("Listing created:", listingResult);
      navigate(`/Listings/${listingResult._id}`); // redirects to the listing page after creation

    } catch (err) {
      console.error("Listing creation failed:", err);
    }
  };

  const imageChange = (event) => {
    const files = Array.from(event.target.files);
    const existingNames = selectedImages.map(f => f.name);
  
    const newUniqueFiles = files.filter(file => !existingNames.includes(file.name)); // checks if the file is already in array
  
    if (newUniqueFiles.length === 0) {
      alert("All selected files are already added.");
      return;
    }
  
    const combined = [...selectedImages, ...newUniqueFiles];
  
    const finalFiles = combined.slice(0, 5);
    const finalPreviews = finalFiles.map(file => URL.createObjectURL(file));
  
    setSelectedImages(finalFiles);
    setPreviewImages(finalPreviews);
  
    event.target.value = null;  //reset so same file can be picked again (after removal)
  };
  
  const removeImage = (index) => {
    const updatedImages = [...selectedImages];
    const updatedPreviews = [...previewImages];
    updatedImages.splice(index, 1);
    updatedPreviews.splice(index, 1);
    setSelectedImages(updatedImages);
    setPreviewImages(updatedPreviews);
  };

  return (
    <div className={"PageContent"}>
      <h1 className={"ContentHeader"}>Create a Listing</h1>
      <h1 className={"InputHeader"}>Title & Description</h1>
      <div className={"InputField"}>
        <input type={"text"} name="ltitle" id="ltitle" placeholder={"Listing Title"} />
      </div>
      <div className={"ParagraphField"}>
        <textarea name={"ldesc"} placeholder={"Listing Description"} id={"ldesc"} />
      </div>
      <h1 className={"InputHeader"}>Pricing</h1>
      <div className={"InlineContent"}>
        <h1 className={"ParagraphText"}>$</h1>
        <div className={"PriceInput"}>
          <input type={"text"} name="lprice" placeholder={"0.00"} id="lprice" />
        </div>
      </div>
     <h1 className={"InputHeader"}>Listing Images</h1>
        <div className={"UploadButton"}>
        <input
            type="file"
            id="limage"
            name="limage"
            accept="image/*"
            multiple
            onChange={imageChange}
            disabled={selectedImages.length >= 5}
            style={{ display: "none" }}
        />
        <button
            type="button"
            className="Button"
            onClick={() => document.getElementById("limage").click()}
            disabled={selectedImages.length >= 5}
        >
            {selectedImages.length < 5
            ? `Select Images (${selectedImages.length}/5)`
            : "Max 5 Images Reached"}
        </button>
        </div>
      <div className="PreviewContainer">
        {previewImages.map((src, index) => (
          <div key={index} className="ImageThumbnail">
            <img src={src} alt={`preview-${index}`} style={{ width: "120px", margin: "5px" }} />
            <button onClick={() => removeImage(index)} className="RemoveButton">Remove</button>
          </div>
        ))}
      </div>
      <h1 className={"InputHeader"}>Tags</h1>
      <div className={"InputField"}>
        <input type={"text"} name="ltags" id="ltags" placeholder={"Tags"} />
      </div>
      <div className={"Button"} onClick={submitPost}>Post Listing</div>
    </div>
  );
}

export default Post;