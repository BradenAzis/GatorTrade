
import './App.css';
import HomePage from './HomePage';
import Listings from './Listings';
import {BrowserRouter, Routes, Route} from "react-router-dom";


function App() {
  return (
    <BrowserRouter>
        <div className="NavBar">
            <div className="App-logo">GatorTrade</div>
            <div className="PageButton">
                <a href="/">Home</a>
                <a href="/Listings">Listings</a>
            </div>
        </div>
        <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/listings" element={<Listings />} />
        </Routes>
    </BrowserRouter>
  );
}

export default App;
