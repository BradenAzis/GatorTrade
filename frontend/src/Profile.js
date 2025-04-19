import './App.css'
import './Profile.css'
import './Landing.css'
import ListingInfo from "./ListingInfo";
import coolimage from './resources/images/importantazis.jpg'
import {useEffect, useState} from "react";
import axios from "axios";

function Profile(){
    const [userInfo, setUserInfo] = useState([]);
    const [listings, setListings] = useState(null);
    
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
                setUserInfo(res.data);
                console.log(res);
                console.log("YESSS")
            } catch (err) {
                console.error("Failed to fetch user:", err);
            }
        };
        fetchCurrentUser();
    }, []);

    return (
        <div>
            <div className="ProfileCardsSection">
            <div className={"ProfileCard"}>
                <img className="ProfilePicture" src={coolimage} alt="ProfileImage"/>
                <div>
                    <h1 className={"ContentHeader"}>{userInfo["firstName"] + " " + userInfo["lastName"]}</h1>
                    <h2 className={"ParagraphText"}>I'm balling</h2>
                </div>
            </div>
            <h1 className={"ContentSubHeader"}>{"Posted Listings"}</h1>
        </div>
        <div className="PageContent">
            <div className="UserListings">
            {listings && listings
                .filter((listing) => listing.user?._id === userInfo["_id"])
                .map((listing) => (
                    <ListingInfo key={listing._id} listings={listing} />
            ))}
            </div>
        </div>
        </div>
    );
}

export default Profile;