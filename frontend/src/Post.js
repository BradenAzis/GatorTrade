import './App.css'
import {useState} from "react";

function Post (){
    const [selectedImage, setSelectedImage] = useState(null)
    const [previewImage, setPreviewImage] = useState(null)

    const submitPost = async () => {
        const title = document.getElementById("ltitle").value;
        const description = document.getElementById("ldesc").value;
        const price = document.getElementById("lprice").value;
        const tags = document.getElementById("ltags").value;
    
        let imageUrls = [];
    
        // Step 1: Upload the selected image to /upload/image
        if (selectedImage) {
            const imageData = new FormData();
            imageData.append("images", selectedImage);
    
            try {
                const imageRes = await fetch("http://localhost:5001/upload/image", {
                    method: "POST",
                    body: imageData,
                });
    
                const result = await imageRes.json();
                imageUrls = result.images.map(img => img.url); // extract Cloudinary URLs
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
        } catch (err) {
            console.error("Listing creation failed:", err);
        }
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
    }

    return (
        <div className={"PageContent"}>
            <h1 className={"ContentHeader"}>Create a Listing</h1>
            <h1 className={"InputHeader"}>Title & Description</h1>
            <div className={"InputField"}>
                <input type={"text"} name="ltitle" id="ltitle" placeholder={"Listing Title"}/>
            </div>
            <div className={"ParagraphField"}>
                <textarea name={"ldesc"} placeholder={"Listing Description"} id={"ldesc"}/>
            </div>
            <h1 className={"InputHeader"}>Pricing</h1>
            <div className={"InlineContent"}>
                <h1 className={"ParagraphText"}>$</h1>
                <div className={"PriceInput"}>
                    <input type={"text"} name="lprice" placeholder={"0.00"} id="lprice"/>
                </div>
            </div>
            <h1 className={"InputHeader"}>Listing Image</h1>
            <div className={"UploadButton"}>
                <input type={"file"} name="limage" accept={"image/*"} onChange={imageChange} id="limage"/>
            </div>
            <img className={"ImagePreview"} src={previewImage} alt={""}/>
            <h1 className={"InputHeader"}>Tags</h1>
            <div className={"InputField"}>
                <input type={"text"} name="ltags" id="ltags" placeholder={"Tags"}/>
            </div>
            <div className={"Button"} onClick={submitPost}>Post Listing</div>
        </div>
    )
}



export default Post;