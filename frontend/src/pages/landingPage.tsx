import "../styles/landingPage.css"
import NavBar from "../components/AppBar";
import Footer from "../components/Footer";
import stocksImage from "../assets/Stocks.jpg"


export default function LandingPage() {

    return (
        <>
            <NavBar />
            <div className="column-section">
                <div className="column-text">
                    <h1>Create your own stock portfolio</h1>
                    <h4>Browse other stock portfolios and rate them.</h4>
                    <div>
                        <img className="stocksimg FadeIn" src={stocksImage}></img>
                    </div>
                </div>
            </div>
            <Footer />
        </>
    );
}