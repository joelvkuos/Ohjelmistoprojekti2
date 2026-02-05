import "../styles/landingPage.css"
import NavBar from "../components/Appbar";


export default function LandingPage() {

    return (
        <>
            <NavBar />
            <div className="two-columns">
                <div className="column-left">
                    Left column
                </div>
                <div className="column-right">
                    Right column
                </div>
            </div>
        </>
    );
}