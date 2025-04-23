import './App.css';
import ListingPage from './ListingPage';
import LandingPage from './LandingPage';
import HomePage from './HomePage';
import Listings from './Listings';
import Profile from './Profile';
import Post from './Post';
import Messages from './Messages'
import {BrowserRouter, Routes, Route} from "react-router-dom";
import logo from './resources/images/GatorTradeLogo.png';
import {useEffect, useState} from "react";
import UserProfile from "./UserProfile";


function App() {

    const [ButtonName, setButtonName] = useState(null);
    const [ButtonURL, setButtonURL] = useState(null);

    // Request user information from the backend
    const CheckUserState = async () => {
        console.log(process.env.REACT_APP_BACKEND_URI)
        console.log(process.env.REACT_APP_FRONTEND_URL)
        const response = await fetch(`${process.env.REACT_APP_BACKEND_URI}/auth/me`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
            credentials: 'include'
        });

        // If the response from the backend is negative and the route indicates a failed login, a browser alert is sent
        if (!response.ok) {
            console.log(response);
            setButtonName("Login")
            setButtonURL(`${process.env.REACT_APP_BACKEND_URI}/auth/google`)
            const params = new URLSearchParams(window.location.search);
            if (params.get('loginFailed') === 'true') {
                alert('Authentication failed. Google accounts must be affiliated with a ufl email.');
            }
        }
        // Otherwise the user is given access to the rest of the website
        else{
            console.log(response);
            setButtonName("My Profile")
            setButtonURL(`${process.env.REACT_APP_FRONTEND_URL}/profile`)
            document.getElementById("listingsButton").style.visibility = "visible";
            document.getElementById("listingsButton").style.width = "fit-content";
            document.getElementById("messagesButton").style.visibility = "visible";
            document.getElementById("messagesButton").style.width = "fit-content";
        }

    }

    useEffect(() => {

        CheckUserState()//first execution

    },[]);

  return (
    <BrowserRouter>
        {/*Navigation bar that remains across pages*/}
        <div className="NavBar">
            <div className="App-logo">
                <a href="/">
                    <img src={logo} alt={"GatorTrade"}></img>
                </a>
            </div>
            <div className="PageButton">
                <a href={ButtonURL}>{ButtonName}</a>
                <a href={"/Listings"} id={"listingsButton"} style={{visibility: "hidden", width: "0"}}>Listings</a>
                <a href="/About">About</a>
                <a href="/Messages" id={"messagesButton"} style={{visibility: "hidden", width: "0"}}>Messages</a>
            </div>
        </div>
        <Routes>
            {/*Routes associated with different .js files*/}
            <Route path="/" element={<LandingPage/>}/>
            <Route path="/about" element={<HomePage />} />
            <Route path="/listings" element={<Listings />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/messages" element={<Messages />} />
            <Route path="/listings/:id" element={<ListingPage />} />
            <Route path="/profile/:id" element={<UserProfile />} />
            <Route path="/post" element={<Post />} />
            <Route path="*" element={<h1>404 Not Found</h1>} />
        </Routes>
    </BrowserRouter>
  );
}

export default App;
