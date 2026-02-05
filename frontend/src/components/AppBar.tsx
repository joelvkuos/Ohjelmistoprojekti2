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
                Stockfolio
            </div>
            <div className="appbar-center">
            </div>
            <div className="burger-icon" onClick={() => setMenuOpen(!menuOpen)}>
                <MenuIcon />
            </div>
            <div className="appbar-right">
                <Button className="btn-signin" onClick={() => navigate('/')}>
                    Sign in
                </Button>
                <Button className="btn-signUp" onClick={() => navigate('/register')}>
                    Sign up
                </Button>

            </div>
            {menuOpen && (
                <div className="mobile-menu">
                    <Button>Sign Up</Button>
                    <Button>Sign In</Button>
                </div>
            )}
        </header>
    );
}