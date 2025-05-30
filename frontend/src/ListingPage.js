import { useParams, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import {FaChevronLeft, FaChevronRight} from 'react-icons/fa'; // icons for the carousel buttons
import './ListingPage.css';

function ListingPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [listing, setListing] = useState(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0); // handles parsing through image array
  const [currentUser, setCurrentUser] = useState(null);


  useEffect(() => {
    const fetchListing = async () => {
      const res = await fetch(`${process.env.REACT_APP_BACKEND_URI}/listings/${id}`);
      const data = await res.json();
      setListing(data);
    };
    fetchListing();

    const fetchCurrentUser = async () => {
      const res = await fetch(`${process.env.REACT_APP_BACKEND_URI}/auth/me`, {
        credentials: 'include'
      });
      const user = await res.json();
      setCurrentUser(user);
    };
    fetchCurrentUser();

  }, [id]);

  if (!listing) return <p>Loading...</p>; // moreso for debugging purposes. Listing should always exist. 

  const handlePrev = () => {
    setCurrentImageIndex((prev) => (prev === 0 ? listing.images.length - 1 : prev - 1));
  };

  const handleNext = () => {
    setCurrentImageIndex((prev) => (prev + 1) % listing.images.length);
  };

  return (
    // whole page is "listing-container" div
    <div className="listing-container">
      <div className="listing-main">
        <div className="image-carousel">
          {listing.images.length > 1 && (
            <button className="carousel-button left" onClick={handlePrev}>
              <FaChevronLeft />
            </button>
          )}

          <img
            src={listing.images[currentImageIndex]}
            alt={`Listing ${currentImageIndex + 1}`}
            className="carousel-image"
          />

          {listing.images.length > 1 && (
            <button className="carousel-button right" onClick={handleNext}>
              <FaChevronRight />
            </button>
          )}
        </div>


        <div className="listing-info">
          <div className="listing-title">{listing.title}</div>
          <div className="listing-profile">
            <a href={`/Profile/${listing.user?._id}`}>{listing.user?.firstName + " " + listing.user?.lastName}</a>
          </div>
          <div className="listing-price">${listing.price}</div>
          <div className="listing-description">{listing.description}</div>
          <div className="listing-tags">
            {listing.tags.map((tag, index) => ( // uses a map to iterate through the tags array for that specific listing and display them
              <span className="tag" key={index}>{tag}</span>
          ))}
          </div>
        </div>
      </div>

      <div className="seller-details">
        <div className="seller-text">
          <h3>Seller Information</h3>
          <p>{listing.user.firstName} {listing.user.lastName}</p>
          <p>{listing.user.email}</p>
        </div>

        {currentUser && listing.user._id !== currentUser._id && (
          <button
            className="ContactSeller"
            onClick={async () => {
              try {
                const res = await fetch(`${process.env.REACT_APP_BACKEND_URI}/chats`, {
                  method: 'POST',
                  headers: { 'Content-Type': 'application/json' },
                  credentials: 'include',
                  body: JSON.stringify({ //TODO: have navigation functionality to the profile page of the user
                    sellerId: listing.user._id,
                    listingId: listing._id,
                  }),
                });
              
                const chat = await res.json();
                navigate(`/messages`, { state: {chat} });
              } catch (err) {
                console.error("Failed to start chat:", err);
              }
            }}
          >
            Contact Seller
          </button>
        )}
      </div>
    </div>
  );
}

export default ListingPage;
