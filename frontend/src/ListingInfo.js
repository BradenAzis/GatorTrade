const ListingInfo = ({ listing }) => {
    if (!listing) return null;

    return (
        <div className="Card">
            <img className="CardImage" src={listing.images[0]} alt={""}></img>
            <div className="CardBody">
                <div className="CardLink">
                    <a href={`/Listings/${listing._id}`}>{listing.title}</a>
                </div>

                <div className="CardText">
                    <p>{listing.tags}</p>
                </div>
            </div>
            <div className="PriceCard">
                <div className="CardPrice">
                    <p>{"$" + listing.price}</p>
                </div>
            </div>
        </div>
    );
};

export default ListingInfo;
  