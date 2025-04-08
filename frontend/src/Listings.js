import './App.css'

function Listing(){
    return (
        <div className="PageContent">
            <h1 className="ContentHeader">Listings</h1>
            <div className="SearchBar">
                <label for="listinginput"></label>
                <input type="text" id="listinginput"  name="lquery" placeholder="Search for listings..."/>
            </div>

            <h3 className="ContentSubHeader">Recently Added</h3>
        </div>
    );
}

export default Listing;