import Footer from "../components/Footer";
import "../styles/homePage.css"

import Navigation from "../components/Navigation";
import { Button } from "@mui/material";
import stocksImage from "../assets/Stocks.jpg"
import { useState, useEffect } from "react";
import { useNavigate } from 'react-router-dom';


export default function Homepage() {
    const [username, setUsername] = useState<string>();

    useEffect(() => {
        const storedUserJson = localStorage.getItem('user');
        if (!storedUserJson) return;

        try {
            const user = JSON.parse(storedUserJson);
            setUsername(user.username)
        } catch (e) {
            console.error("Error in JSON", e)
        }

    }, []);

    const navigate = useNavigate();

    return (
        <>
            <Navigation />
            <div className="two-column-section">
                <div className="column-text">
                    <h1>Welcome {username}!</h1>
                    <h4>Your personal space to showcase and track your investment journey.</h4>
                    <h4>Build your own stock portfolios, monitor your performance, and see your investments come to life in one place.</h4>
                    <h4>Explore what others are investing in, share your thoughts,
                        and join the conversation.</h4>
                    <Button className="btn-starter" onClick={() => navigate('/portfolio')}>
                        Get Started With Stockfolio
                    </Button>
                </div>
                <div className="column-image">
                    <img className="stocksimg FadeIn" src={stocksImage}></img>
                </div>
            </div >
            <Footer />

        </>
    )
}