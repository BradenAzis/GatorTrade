import './App.css'

function Listing(){
    return (
        <div className="PageContent">
            <div className="SearchBar">
                <label></label>
                <input type="text" id="listinginput"  name="lquery" placeholder="Search for listings..."/>
            </div>
            <h3 className="ContentSubHeader">Recently Added</h3>
        </div>
    );
}

export default Listing;