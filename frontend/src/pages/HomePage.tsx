import Footer from "../components/Footer";
import "../styles/homePage.css"

import Navigation from "../components/Navigation";
import { Button } from "@mui/material";
import stocksImage from "../assets/Stocks.jpg"


export default function Homepage() {
    return (
        <>
            <Navigation />
             <div className="two-column-section">
                <div className="column-text">
                    <h1>Welcome User!</h1>
                    <h4>Welcome to Stockfolio — your personal space to showcase and track your investment journey. 
                        Build your own stock portfolios, monitor your performance, and see your investments come to life in one place. 
                        Explore what others are investing in, share your thoughts, 
                        and join the conversation — but most importantly, keep your own portfolio front and center.</h4>
                    <Button className="btn-starter">
                        Get Started With Stockfolio
                    </Button>
                </div>
                <div className="column-image">
                    <img className="stocksimg FadeIn" src={stocksImage}></img>
                </div>
            </div>
            <Footer />

        </>
    )
}