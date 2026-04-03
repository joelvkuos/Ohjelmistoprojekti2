import "../styles/profile.css"
import Navigation from "../components/Navigation";
import Footer from "../components/Footer";
import { Button } from "@mui/material";


export default function Profile() {
    return (
        <>
            <Navigation />
            <div className="two-column-section">
                <div className="column-text">
                    <h2>My profile</h2>
                    <div className="profileButtons">
                        <Button className="profileButton">
                            Profile
                        </Button>
                        <Button className="profileButton">
                            Portfolio
                        </Button>
                    </div>
                </div>
                <p>This is where user profile information will be displayed.</p>
            </div>
            <Footer />
        </>
    );
}