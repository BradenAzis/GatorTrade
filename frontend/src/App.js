import './App.css';
import HomePage from './HomePage';
import Listings from './Listings';
import Profile from './Profile';
import Post from './Post';
import {BrowserRouter, Routes, Route} from "react-router-dom";
import logo from './resources/images/GatorTradeLogo.png';


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
                <a href="/Profile">My Profile</a>
                <a href={"/Create"}>Post</a>
                <a href="/About">About</a>
            </div>
        </div>
        <Routes>
            <Route path="/About" element={<HomePage />} />
            <Route path="/" element={<Listings />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/create" element={<Post />} />
        </Routes>
    </BrowserRouter>
  );
}

export default App;
