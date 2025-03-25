
import './App.css';
import HomePage from './HomePage';
import Listings from './Listings';
import {BrowserRouter, Routes, Route} from "react-router-dom";


function App() {
  return (
    <BrowserRouter>
        <header className="App-logo">
            <p>
                GatorTrade
            </p>
        </header>
        <header className="PageButton">
            <a href="/">Home</a>
            <a href="/Listings">Listings</a>
        </header>
        <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/listings" element={<Listings />} />
        </Routes>
    </BrowserRouter>
  );
}

export default App;
