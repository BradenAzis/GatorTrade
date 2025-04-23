import './App.css'
import ListingInfo from "./ListingInfo";
import {useEffect, useState} from "react";
import axios from "axios"

const Listing = () => {
    const [listings, setListings] = useState(null);

    //fetch listing data from database
    useEffect(() => {
        const fetchData = async () => {
            const response = await axios.get("http://localhost:5001/listings");
            setListings(response.data);
        }
        fetchData();
    }, [])

    //press enter when searching to filter listings based on search
    function Search(e){
        if (e.keyCode === 13) {
                //fetches listing data from database that is relevant to the search
                const searchData = async () => {
                    const response = await axios.get("http://localhost:5001/listings?search=" + e.target.value);
                    setListings(response.data);
                }
                searchData();
        }
    }

    //macro layout for page
    //listing data is passed to ListingInfo.js where it will be formatted for each card
    return (
        <div className="PageContent">
            <div style={{display: "flex", justifyContent: "space-between", marginRight: "2vw"}}>
                <div className="SearchBar">
                    <input type="text" id="listinginput"  name="lquery" placeholder="Search for listings..." onKeyDown={Search}/>
                </div>
                <a className={"PostButton"} href={'/post'}>Create a Post</a>
            </div>
            <div className="UserListings">
            {listings && listings.map((listing) => (
                <ListingInfo key={listing._id} listing={listing} />
            ))}

            </div>
        </div>
    );
}

export default Listing;