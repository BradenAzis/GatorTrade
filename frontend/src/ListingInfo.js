function ListingInfo({ listing }) {
    if (!listing) return null;

    //set tags for listings
    let tags = "";
    for (let i = 0; i < listing.tags.length; i++) {
        tags += listing.tags[i] + ",";
    }

    //layout for listing cards
    //each card has a title, posting user, tags, and price
    return (
        <div className="Card">
            <img className="CardImage" src={listing.images[0]} alt={""}></img>
            <div className="CardBody">
                <div className="CardLink">
                    <a href={`/Listings/${listing._id}`}>{listing.title}</a>
                </div>
                <div className="CardProfile">
                    <a href={`/Profile/${listing.user?._id}`}>{listing.user?.firstName + " " + listing.user?.lastName}</a>
                </div>
                <div className="CardText">
                    {listing.tags.map((tag, index) => (
                        <span className="tag" key={index}>{tag}</span>
                    ))}
                </div>
            </div>
            <div className="PriceCard">
                <div className="CardPrice">
                    <p>{"$" + listing.price}</p>
                </div>
            </div>
        </div>
    );
}

export default ListingInfo;
 