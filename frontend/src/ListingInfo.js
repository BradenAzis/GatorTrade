const ListingInfo = ({listings}) => {


    return (
        <div className="Card">
            <div className="CardLink">
                <a href={`/Listings/${listings._id}`}>{listings.title}</a>
            </div>

            <div className="CardPrice">
                <p>{"$" + listings.price}</p>
            </div>

            <div className="CardText">
                <p>{listings._id}</p>
            </div>
        </div>
    )
}
export default ListingInfo;