import './App.css';
import LandingPage from './LandingPage'
import HomePage from './HomePage';
import Listings from './Listings';
import Profile from './Profile';
import Post from './Post';
import Messages from './Messages'
import {BrowserRouter, Routes, Route} from "react-router-dom";
import logo from './resources/images/GatorTradeLogo.png';
import ListingInfo from "./ListingInfo";
import {useEffect, useState} from "react";


function App() {

    const [ButtonName, setButtonName] = useState(null);
    const [ButtonURL, setButtonURL] = useState(null);

    const CheckUserState = async () => {
        const response = await fetch('http://localhost:5001/auth/me', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
            credentials: 'include'
        });

        if (!response.ok) {
            console.log(response);
            console.log("AAAAAAAAAGGGGGGH")
            setButtonName("Login")
            setButtonURL('http://localhost:5001/auth/google')
        }
        else{
            console.log(response);
            console.log("YES KING")
            setButtonName("My Profile")
            setButtonURL('http://localhost:3000/profile')
        }

    }

    useEffect(() => {

        CheckUserState()//first execution

    },[]);

  return (
    <BrowserRouter>
        <div className="NavBar">
            <div className="App-logo">
                <a href="/">
                    <img src={logo} alt={"GatorTrade"}></img>
                </a>
            </div>
            <div className="PageButton">
                <a href={ButtonURL}>{ButtonName}</a>
                <a href={"/Listings"}>Listings</a>
                <a href="/About">About</a>
                <a href="/Messages">Messages</a>
            </div>
        </div>
        <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/about" element={<HomePage />} />
            <Route path="/listings" element={<Listings />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/messages" element={<Messages />} />
            <Route path="/listings/:id" element={<ListingPage />} />
            <Route path="/post" element={<Post />} />
            <Route path="*" element={<h1>404 Not Found</h1>} />
        </Routes>
    </BrowserRouter>
  );
}

export default App;
