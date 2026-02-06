import { Button } from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import '../styles/landingPage.css';


export default function NavBar() {
    const navigate = useNavigate();
    const [menuOpen, setMenuOpen] = useState(false);

    return (
        <header className="appbar">
            <div className="appbar-left">
                <h1>Stockfolio</h1>
            </div>
            <div className="appbar-center">
            </div>
            <div className="burger-icon" onClick={() => setMenuOpen(!menuOpen)}>
                <MenuIcon />
            </div>
            <div className="appbar-right">
                <Button className="btn-signin" onClick={() => navigate('/login')}>
                    Sign in
                </Button>
                <Button className="btn-signUp" onClick={() => navigate('/register')}>
                    Sign up
                </Button>

            </div>
            {menuOpen && (
                <div className="mobile-menu">
                    <Button className="mobile-menu-btn2" onClick={() => navigate('/')}>Sign In</Button>
                    <Button className="mobile-menu-btn1" onClick={() => navigate('/register')}>Sign Up</Button>
                </div>
            )}
        </header>
    );
}