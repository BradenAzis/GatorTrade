import './App.css'
import ListingInfo from "./ListingInfo";
import {useEffect, useState} from "react";
import axios from "axios"

const Listing = () => {
    const [listings, setListings] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            const response = await axios.get("http://localhost:5001/listings");
            setListings(response.data);
        }
        fetchData();
    }, [])

    function Search(e){
        if (e.keyCode === 13) {
                const searchData = async () => {
                    const response = await axios.get("http://localhost:5001/listings?search=" + e.target.value);
                    setListings(response.data);
                }
                searchData();
        }
    }

    return (
        <div className="PageContent">
            <div style={{display: "flex", justifyContent: "space-between", marginRight: "2vw"}}>
                <div className="SearchBar">
                    <input type="text" id="listinginput"  name="lquery" placeholder="Search for listings..." onKeyDown={Search}/>
                </div>
                <a className={"Button"} href={'/post'}>Create a Post</a>
            </div>
            <div className="UserListings">
                    {listings && listings.map((listings) => (
                        <ListingInfo key={listings._id} listings={listings} />
                    ))}
            </div>
        </div>
    );
}

export default Listing;