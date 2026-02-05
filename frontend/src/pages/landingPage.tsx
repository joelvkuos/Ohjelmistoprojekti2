import { Button } from "@mui/material";
import "../styles/landingPage.css"
import { useNavigate } from "react-router-dom";


export default function LandingPage() {
    const navigate = useNavigate();

    return (
        <>
            <header className="appbar">
                Stockfolio
                <Button className="btn signin" onClick={() => navigate('/')}>Sign in / Sign up</Button>
            </header>
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