const ListingInfo = ({ listing }) => {
    if (!listing) return null;
  
    return (
        <div className="Card">
            <img className="CardImage" src={listings.images[0]} alt={""}></img>
            <div className="CardBody">
                <div className="CardLink">
                    <a href={`/Listings/${listings._id}`}>{listings.title}</a>
                </div>

                <div className="CardText">
                    <p>{listings.tags}</p>
                </div>
            </div>
            <div className="PriceCard">
                <div className="CardPrice">
                    <p>{"$" + listings.price}</p>
                </div>
            </div>
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
  