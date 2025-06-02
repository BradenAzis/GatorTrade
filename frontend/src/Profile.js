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

    // Request fetches all the listing data on the website
    useEffect(() => {
        const fetchData = async () => {
            const response = await axios.get(`${process.env.REACT_APP_BACKEND_URI}/listings`);
            setListings(response.data);
            console.log(response.data);
        }
        fetchData();
    }, [])

    // Request fetches the data of the current user
    useEffect(() => {
        const fetchCurrentUser = async () => {
            try {
                const res = await axios.get(`${process.env.REACT_APP_BACKEND_URI}/auth/me`, {
                    withCredentials: true
                });
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

    // When a user uploads a new profile picture this function handles the change
    const pfpUpload = (event) => {
        const file = event.target.files[0];
        const reader = new FileReader();

        // First a file reader is made to properly interpret the upload
        reader.onload = async (e) => {
            if (e.target.result == null) {
                return;
            }
            document.getElementById("pfp").setAttribute("src", e.target.result);
            try {

                const imageData = new FormData();
                imageData.append("images", file);

                // Then the image is uploaded to our image hosting platform
                const imageRes = await fetch(`${process.env.REACT_APP_BACKEND_URI}/upload/image`, {
                    method: "POST",
                    body: imageData
                });

                // and the resulting url is saved
                const result = await imageRes.json();
                console.log(result.images);
                let imageUrl = result.images[0].url
                console.log(imageUrl)

                const pfpData = {profilePicture: imageUrl}
                console.log(JSON.stringify(pfpData));

                // This url is then used to update the users profile picture in their backend user data
                const pfpUpdate = await fetch(`${process.env.REACT_APP_BACKEND_URI}/auth/me`, {
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
            }
        };

        reader.readAsDataURL(file);
    }

    // When the edit button is clicked this function opens the input box to change the bio
    const bioEdit = () => {
        document.getElementById("bioText").style.visibility = "hidden";
        document.getElementById("bioText").style.fontSize = "0";
        document.getElementById("bioBox").style.visibility = "visible";
        document.getElementById("bioBox").style.height = "3vmin";
        document.getElementById("edit").innerHTML = "Save";
        document.getElementById("edit").onclick = () => {bioSave()}
    }

    // Once the save button is clicked this function sends the changed bio to the backend and the input box goes away
    const bioSave = async () => {
        const newText = document.getElementById("bioInput").value;
        const bioData = {bio: newText};
        console.log(JSON.stringify(bioData));

        try {
            const bioUpdate = await fetch(`${process.env.REACT_APP_BACKEND_URI}/auth/me`, {
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
        document.getElementById("edit").onclick = () => {bioEdit()}
    }

    return (
        <div> 
            {/*Profile card with name, profile picture and bio, as well as input handlers to allow changing them*/}
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
                {/*This section displays all your posts*/}
            <h1 className={"ContentSubHeader"}>{"Posted Listings"}</h1>
        </div>
        <div className="PageContent">
            <div className="UserListings">
                {/*The previously pulled listings are filtered down using the current users ID*/}
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