import { Button } from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import '../styles/landingPage.css';


export default function NavBar() {
    const navigate = useNavigate();
    const [menuOpen, setMenuOpen] = useState(false);

    const closeMenu = () => setMenuOpen(false);

    const handleNavigation = (path: string) => {
        navigate(path);
        closeMenu();
    };

    return (
        <header className="appbar">
            <div className="appbar-left">
                <h1 onClick={() => handleNavigation('/')} style={{ cursor: 'pointer' }}>Stockfolio</h1>
            </div>
            <div className="appbar-center">
            </div>
            <div className="burger-icon" onClick={() => setMenuOpen(!menuOpen)}>
                <MenuIcon />
            </div>
            <div className="appbar-right">
                <Button className="btn-signin" onClick={() => handleNavigation('/login')}>
                    Sign in
                </Button>
                <Button className="btn-signUp" onClick={() => handleNavigation('/register')}>
                    Sign up
                </Button>
            </div>
            {menuOpen && (
                <div className="mobile-menu">
                    <Button className="mobile-menu-btn2" onClick={() => handleNavigation('/login')}>Sign In</Button>
                    <Button className="mobile-menu-btn1" onClick={() => handleNavigation('/register')}>Sign Up</Button>
                </div>
            )}
        </header>
    );
}