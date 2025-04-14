import './App.css'

function Post (){
    return (
        <div className={"PageContent"}>
            <h1 className={"ContentHeader"}>Create a Listing</h1>
            <h1 className={"InputHeader"}>Title & Description</h1>
            <div className={"InputField"}>
                <input type={"text"} name="ltitle" placeholder={"Listing Title"}/>
            </div>
            <div className={"ParagraphField"}>
                <textarea name={"ldesc"} placeholder={"Listing Description"}/>
            </div>
            <h1 className={"InputHeader"}>Pricing</h1>
            <div className={"InlineContent"}>
                <h1 className={"ParagraphText"}>$</h1>
                <div className={"InputField"}>
                    <input type={"text"} name="lprice" placeholder={"0.00"}/>
                </div>
            </div>
            <h1 className={"InputHeader"}>Tags</h1>
            <div className={"InputField"}>
                <input type={"text"} name="ltags" placeholder={"Tags"}/>
            </div>
            <a className={"Button"} href="#">Post Listing</a>
        </div>
    )
}

export default Post;