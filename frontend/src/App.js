import "./theme.css";
import './App.css';
import ListingPage from './ListingPage';
import LandingPage from './LandingPage';
import Listings from './Listings';
import Profile from './Profile';
import Post from './Post';
import Messages from './Messages'
import {BrowserRouter, Routes, Route} from "react-router-dom";
import logo from './resources/images/GatorTradeLogo.png';
import {useEffect, useState} from "react";
import UserProfile from "./UserProfile";
import useTheme from "./useTheme";

function App() {

    const [theme, toggleTheme] = useTheme();
    const [ButtonName, setButtonName] = useState(null);
    const [ButtonURL, setButtonURL] = useState(null);

    // Request user information from the backend
    const CheckUserState = async () => {
        try {
            const response = await fetch(`${process.env.REACT_APP_BACKEND_URI}/auth/me`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                },
                credentials: 'include'
            });
    
            if (!response.ok) {
                console.log("Not logged in", response);
                setButtonName("Login");
                setButtonURL(`${process.env.REACT_APP_BACKEND_URI}/auth/google`);
            } else {
                const data = await response.json();
                console.log("Logged in user:", data);
                setButtonName("My Profile");
                setButtonURL(`${process.env.REACT_APP_FRONTEND_URL}/profile`);
                document.getElementById("listingsButton").style.visibility = "visible";
                document.getElementById("listingsButton").style.width = "fit-content";
                document.getElementById("messagesButton").style.visibility = "visible";
                document.getElementById("messagesButton").style.width = "fit-content";
            }
        } catch (error) {
            console.error("Error checking login state:", error);
            setButtonName("Login");
            setButtonURL(`${process.env.REACT_APP_BACKEND_URI}/auth/google`);
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
                    <img src={logo} alt={"GatorTrade"} />
                </a>
            </div>
            <div className="NavLinks">
                <div className="PageButton">
                    <a href={ButtonURL}>{ButtonName}</a>
                </div>
                <div className="PageButton" id="messagesButton" style={{ visibility: "hidden", width: "0" }}>
                    <a href="/Messages">Messages</a>
                </div>
                <div className="PageButton" id="listingsButton" style={{ visibility: "hidden", width: "0" }}>
                    <a href="/Listings">Listings</a>
                </div>
                <div className="PageButton">
                    <button onClick={toggleTheme}>
                        {theme === 'dark' ? 'Light' : 'Dark'} Mode
                    </button>
                </div>
            </div>
        </div>
        <Routes>
            {/*Routes associated with different .js files*/}
            <Route path="/" element={<LandingPage/>}/>
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
