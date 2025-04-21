const ListingInfo = ({listings}) => {


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
    )
}
export default ListingInfo;