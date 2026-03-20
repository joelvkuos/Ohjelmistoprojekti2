import Footer from "../components/Footer";
import "../styles/homePage.css"

import Navigation from "../components/Navigation";
import { Button } from "@mui/material";


export default function Homepage() {
    return (
        <>
            <Navigation />
             <div className="column-section">
                <div className="column-text">
                    <h1>Welcome User!</h1>
                    <h4>Start exploring</h4>
                    <Button className="btn-starter">
                        Get Started With Stockfolio
                    </Button>
                </div>
            </div>
            <Footer />

        </>
    )
}