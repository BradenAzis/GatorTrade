import './App.css';
import HomePage from './HomePage';
import Listings from './Listings';
import Profile from './Profile';
import {BrowserRouter, Routes, Route} from "react-router-dom";
import logo from './resources/images/GatorTradeLogo.png';
import ListingInfo from "./ListingInfo";


function App() {
  return (
    <BrowserRouter>
        <div className="NavBar">
            <div className="App-logo">
                <a href="/Listings">
                    <img src={logo} alt={"GatorTrade"}></img>
                </a>
            </div>
            <div className="PageButton">
                <a href="/">About</a>
                <a href="/Profile">Profile</a>
            </div>
        </div>
        <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/listings" element={<Listings />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/listings/:id" element={<ListingInfo />} />
        </Routes>
    </BrowserRouter>
  );
}

export default App;
