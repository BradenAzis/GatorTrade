const ListingInfo = ({ listing }) => {
    if (!listing) return null;
  
    return (
      <div className="Card">
        <div className="CardLink">
          <a href={`/Listings/${listing._id}`}>{listing.title}</a>
        </div>
  
        <div className="CardPrice">
          <p>${listing.price}</p>
        </div>
  
        <div className="CardText">
          <p>{listing._id}</p>
        </div>
      </div>
    );
  };
  
  export default ListingInfo;
  