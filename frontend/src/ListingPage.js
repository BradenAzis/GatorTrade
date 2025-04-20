import { useParams, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import {FaChevronLeft, FaChevronRight} from 'react-icons/fa';
import './ListingPage.css';

function ListingPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [listing, setListing] = useState(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  useEffect(() => {
    const fetchListing = async () => {
      const res = await fetch(`http://localhost:5001/listings/${id}`);
      const data = await res.json();
      setListing(data);
    };
    fetchListing();
  }, [id]);

  if (!listing) return <p>Loading...</p>;

  const handlePrev = () => {
    setCurrentImageIndex((prev) => (prev === 0 ? listing.images.length - 1 : prev - 1));
  };

  const handleNext = () => {
    setCurrentImageIndex((prev) => (prev + 1) % listing.images.length);
  };

  return (
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
          <h1>{listing.title}</h1>
          <p className="listing-price">${listing.price}</p>
          <p className="listing-description">{listing.description}</p>
          <div className="listing-tags">
            {listing.tags.map((tag, index) => (
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

        <button
          className="ContactSeller"
          onClick={async () => {
            try {
              const res = await fetch('http://localhost:5001/chats', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                credentials: 'include',
                body: JSON.stringify({
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
      </div>
    </div>
  );
}

export default ListingPage;
