import { useParams, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import './ListingPage.css';

function ListingPage() {
  const { id } = useParams();
  const navigate = useNavigate(); // ✅ Moved inside component
  const [listing, setListing] = useState(null);

  useEffect(() => {
    const fetchListing = async () => {
      const res = await fetch(`http://localhost:5001/listings/${id}`);
      const data = await res.json();
      setListing(data);
    };
    fetchListing();
  }, [id]);

  if (!listing) return <p>Loading...</p>;

  return (
    <div className="listing-container">
        <div className="listing-images-scroll">
        {listing.images.map((img, index) => (
            <div className="image-wrapper" key={index}>
            <img src={img} alt={`Image ${index}`} />
            </div>
        ))}
        </div>


      <div className="listing-info">
        <h1>{listing.title}</h1>
        <p className="listing-price">${listing.price}</p>
        <p className="listing-description">{listing.description}</p>

        <div className="listing-tags">
          {listing.tags.map((tag, index) => (
            <span className="tag" key={index}>
              {tag}
            </span>
          ))}
        </div>

        <div className="listing-user">
          <h3>Posted by:</h3>
          <p>{listing.user.firstName} {listing.user.lastName}</p>
          <p>{listing.user.email}</p>
        </div>

        <button
          className="ContactSeller"
          onClick={async () => {
            try {
              const res = await fetch('http://localhost:5001/chats', {
                method: 'POST',
                headers: {
                  'Content-Type': 'application/json',
                },
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
