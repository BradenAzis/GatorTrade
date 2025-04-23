import './App.css'
import './Profile.css'
import ListingInfo from "./ListingInfo";
import { useParams, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import axios from "axios";

function UserProfile() {
    const { id } = useParams();
    const [userInfo, setUserInfo] = useState([]);
    const [listings, setListings] = useState(null);

    // All listings are pulled
    useEffect(() => {
        const fetchData = async () => {
            const response = await axios.get(`${process.env.REACT_APP_BACKEND_URI}/listings`);
            setListings(response.data);
            console.log(response.data);
        }
        fetchData();
    }, [])

    // The user data for the user currently being viewed is pulled using the user id in the route
    useEffect(() => {
        const fetchCurrentUser = async () => {
            try {
                const res = await axios.get(`${process.env.REACT_APP_BACKEND_URI}/auth/${id}`, {
                    withCredentials: true
                });
                setUserInfo(res.data);
                console.log(res);
            } catch (err) {
                console.error("Failed to fetch user:", err);
            }
        };
        fetchCurrentUser();
    }, []);

    return (
        <div>
            {/*Profile card with name, profile picture and bio */}
            <div className="ProfileCardsSection">
                <div className={"ProfileCard"}>
                    <label for="uploadFile" className="custom-upload" style={{cursor: "default"}}>
                        <img id="pfp" src={userInfo["profilePicture"]} alt={"Profile"}/>
                    </label>
                    <div>
                        <h1 className={"ContentHeader"}>{userInfo["firstName"] + " " + userInfo["lastName"]}</h1>
                        <h2 className={"ParagraphText"} id={"bioText"}>{userInfo["bio"]}</h2>
                    </div>
                </div>
                <h1 className={"ContentSubHeader"}>{"Posted Listings"}</h1>
            </div>
            <div className="PageContent">
                {/*This section displays all posts attributed to the user being viewed */}
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

export default UserProfile;