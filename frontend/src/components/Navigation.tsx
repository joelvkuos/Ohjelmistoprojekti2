import { Button } from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import '../styles/landingPage.css';


export default function Navigation() {
    const navigate = useNavigate();
    const [menuOpen, setMenuOpen] = useState(false);

    return (
        <header className="appbar">
            <div className="navigation-left">

                <h1 onClick={() => navigate('/homepage')} style={{ cursor: 'pointer' }}>Stockfolio</h1>
            </div>
            <Button className='btn-navigation' onClick={() => navigate('/homepage')}>
                Home
            </Button>
            <Button className='btn-navigation'>
                News
            </Button>
            <Button className='btn-navigation'>
                Stocks
            </Button>
            <Button className='btn-navigation'>
                Profile
            </Button>

            <div className="appbar-center">
            </div>
            <div className="burger-icon" onClick={() => setMenuOpen(!menuOpen)}>
                <MenuIcon />
            </div>
            <div className="appbar-right">

                <Button className="btn-logOut" onClick={() => navigate('/')}>
                    Log out
                </Button>

            </div>
            {menuOpen && (
                <div className="mobile-menu">
                    <Button className="mobile-menu-btn2" onClick={() => navigate('/login')}>Sign In</Button>
                    <Button className="mobile-menu-btn1" onClick={() => navigate('/register')}>Sign Up</Button>
                </div>
            )}
        </header>
    );
}