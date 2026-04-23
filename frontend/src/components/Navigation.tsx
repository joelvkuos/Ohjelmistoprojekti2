import { Button } from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import '../styles/landingPage.css';
import { useAuth } from '../context/AuthContext';


export default function Navigation() {
    const navigate = useNavigate();
    const [menuOpen, setMenuOpen] = useState(false);
    const { logout } = useAuth();


    const handleLogout = () => {
        logout();
        navigate('/');
    };

    return (
        <header className="appbar">
            <div className="navigation-left">

                <h1 onClick={() => navigate('/homepage')} style={{ cursor: 'pointer' }}>Stockfolio</h1>
            </div>

            <Button className='btn-navigation' onClick={() => navigate('/news')}>
                News
            </Button>
            <Button className='btn-navigation' onClick={() => navigate('/stocks')}>
                Stocks
            </Button>
            <Button className='btn-navigation' onClick={() => navigate('/portfolios')}>
                All Portfolios
            </Button>
            <Button className='btn-navigation' onClick={() => navigate('/profile')}>
                Profile
            </Button>

            <div className="appbar-center">
            </div>
            <div className="burger-icon" onClick={() => setMenuOpen(!menuOpen)}>
                <MenuIcon />
            </div>
            <div className="appbar-right">

                <Button className="btn-logOut" onClick={handleLogout}>
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