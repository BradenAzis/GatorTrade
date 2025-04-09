import './App.css'

function Listing(){
    return (
        <div className="PageContent">
            <div className="Search">
                <div className="SearchBar">
                    <label></label>
                    <input type="text" id="listinginput"  name="lquery" placeholder="Search for listings..." onKeyDown={Search}/>
                </div>
            </div>
            <h3 className="ContentSubHeader">Recently Added</h3>
        </div>
    );
}
function Search(e){
    if (e.keyCode === 13) {
        alert("Looking for " + e.target.value + "?");
        //filter database based on e
    }
}

export default Listing;