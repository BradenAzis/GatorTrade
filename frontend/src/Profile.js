import './App.css'
import './Profile.css'
import coolimage from './resources/images/importantazis.jpg'

function Profile(){

    return (
        <div className="PageContent">
            <img className="ProfilePicture" src={coolimage} alt="ProfileImage"/>
            <h1 className={"ContentHeader"}></h1>
        </div>
    );
}

export default Profile;