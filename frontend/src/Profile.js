import './App.css'
import './Profile.css'
import './Landing.css'
import ListingInfo from "./ListingInfo";
import {useEffect, useState} from "react";
import axios from "axios";

function Profile(){
    const [userInfo, setUserInfo] = useState([]);
    const [listings, setListings] = useState(null);
    const [myProfile, setMyProfile] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            const response = await axios.get("http://localhost:5001/listings");
            setListings(response.data);
            console.log(response.data);
        }
        fetchData();
    }, [])


    useEffect(() => {
        const fetchCurrentUser = async () => {
            try {
                const res = await axios.get("http://localhost:5001/auth/me", {
                    withCredentials: true
                });
                console.log("BING")
                setUserInfo(res.data);
                console.log(res.data["profilePicture"])
                setMyProfile(res.data["profilePicture"])
                console.log(res);
            } catch (err) {
                console.error("Failed to fetch user:", err);
            }
        };
        fetchCurrentUser();
    }, []);

    const pfpUpload = (event) => {
        const file = event.target.files[0];
        const reader = new FileReader();

        reader.onload = async (e) => {
            document.getElementById("pfp").setAttribute("src", e.target.result);
            try {

                const imageData = new FormData();
                imageData.append("images", file);

                const imageRes = await fetch("http://localhost:5001/upload/image", {
                    method: "POST",
                    body: imageData
                });

                const result = await imageRes.json();
                console.log(result.images);
                let imageUrl = result.images[0].url
                console.log(imageUrl)

                const pfpData = {profilePicture: imageUrl}
                console.log(JSON.stringify(pfpData));

                const pfpUpdate = await fetch("http://localhost:5001/auth/me", {
                    method: "PUT",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    credentials: "include",
                    body: JSON.stringify(pfpData)
                });

                const updateRes = await pfpUpdate.json();
                console.log(updateRes);

            } catch (err) {
                console.error("Image upload failed:", err);
                return;
            }
        };

        reader.readAsDataURL(file);
    }

    const bioEdit = (event) => {
        document.getElementById("bioText").style.visibility = "hidden";
        document.getElementById("bioText").style.fontSize = "0";
        document.getElementById("bioBox").style.visibility = "visible";
        document.getElementById("bioBox").style.height = "3vmin";
        document.getElementById("edit").innerHTML = "Save";
        document.getElementById("edit").onclick = (event) => {bioSave()}
    }

    const bioSave = async (event) => {
        const newText = document.getElementById("bioInput").value;
        const bioData = {bio: newText};
        console.log(JSON.stringify(bioData));

        try {
            const bioUpdate = await fetch("http://localhost:5001/auth/me", {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json"
                },
                credentials: "include",
                body: JSON.stringify(bioData)
            });
            const updateRes = await bioUpdate.json();
            console.log(updateRes);
        }
        catch (err) {
            console.error("Failed to update bio:", err);
        }
        document.getElementById("bioBox").style.visibility = "hidden";
        document.getElementById("bioBox").style.height = "0";
        document.getElementById("bioText").innerHTML = newText;
        document.getElementById("bioText").style.visibility = "visible";
        document.getElementById("bioText").style.fontSize = "3vmin";
        document.getElementById("edit").innerHTML = "Edit Bio";
        document.getElementById("edit").onclick = (event) => {bioEdit()}
    }

    return (
        <div>
            <div className="ProfileCardsSection">
            <div className={"ProfileCard"}>
                <input type="file" id="uploadFile" onChange={pfpUpload}/>
                <label for="uploadFile" className="custom-upload">
                    <img id="pfp" src={`${myProfile}?v=${new Date().getTime()}`} alt={"Profile"}/>
                </label>
                <div>
                    <h1 className={"ContentHeader"}>{userInfo["firstName"] + " " + userInfo["lastName"]}</h1>
                    <h2 className={"ParagraphText"} id={"bioText"}>{userInfo["bio"]}</h2>
                    <div className={"BioField"} id={"bioBox"} style={{visibility: "hidden", height: "0"}}>
                        <textarea placeholder={"New bio"} id={"bioInput"}/>
                    </div>
                    <br></br>
                    <br></br>
                    <br></br>
                    <a className={"Button"} id={"edit"} onClick={bioEdit}>Edit Bio</a>
                </div>
            </div>
            <h1 className={"ContentSubHeader"}>{"Posted Listings"}</h1>
        </div>
        <div className="PageContent">
            <div className="UserListings">
            {listings && listings
                .filter((listing) => listing.user?._id === userInfo["_id"])
                .map((listing) => (
                    <ListingInfo key={listing._id} listing={listing} />
            ))}
            </div>
        </div>
        </div>
    );
}

export default Profile;