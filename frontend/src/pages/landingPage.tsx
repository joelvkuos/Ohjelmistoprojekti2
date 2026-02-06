import "../styles/landingPage.css"
import NavBar from "../components/AppBar";


export default function LandingPage() {

    return (
        <>
            <NavBar />
            <div className="column-section">
                <div className="column-text">
                    <h1>Create your own stock portfolio</h1>
                    <h3>Browse other stock portfolios and rate them.</h3>
                </div>
            </div>
        </>
    );
}