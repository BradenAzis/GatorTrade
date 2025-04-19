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
import {useEffect} from "react";


function App() {

    const ButtonRefState = ['/Profile', 'http://localhost:5001/auth/google']
    const ButtonNameState = ['My Profile', 'Login']
    let index = 1

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
        }
        else{
            console.log(response);
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
                <a href={ButtonRefState[index]}>{ButtonNameState[index]}</a>
                <a href={"/Post"}>Post</a>
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
            <Route path="/listings/:id" element={<ListingInfo />} />
            <Route path="/post" element={<Post />} />
        </Routes>
    </BrowserRouter>
  );
}

export default App;
