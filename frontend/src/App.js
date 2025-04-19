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


function App() {
  return (
    <BrowserRouter>
        <div className="NavBar">
            <div className="App-logo">
                <a href="/">
                    <img src={logo} alt={"GatorTrade"}></img>
                </a>
            </div>
            <div className="PageButton">

                <a href="/">About</a>
                <a href="/Profile">Profile</a>
                <a href={"/Create"}>Post</a>
                <a href="/Messages">Messages</a>
            </div>
        </div>
        <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/home" element={<HomePage />} />
            <Route path="/listings" element={<Listings />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/create" element={<Post />} />
            <Route path="/listings/:id" element={<ListingInfo />} />
            <Route path="/messages" element={<Messages />} />

        </Routes>
    </BrowserRouter>
  );
}

export default App;
