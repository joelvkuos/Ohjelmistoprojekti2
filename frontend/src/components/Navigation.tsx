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

    const closeMenu = () => setMenuOpen(false);

    const handleLogout = () => {
        logout();
        closeMenu();
        navigate('/');
    };

    const handleNavigation = (path: string) => {
        navigate(path);
        closeMenu();
    };

    return (
        <header className="appbar">
            <div className="navigation-left">
                <h1 onClick={() => handleNavigation('/homepage')} style={{ cursor: 'pointer' }}>Stockfolio</h1>
            </div>

            <Button className='btn-navigation' onClick={() => handleNavigation('/news')}>
                News
            </Button>
            <Button className='btn-navigation' onClick={() => handleNavigation('/stocks')}>
                Stocks
            </Button>
            <Button className='btn-navigation' onClick={() => handleNavigation('/portfolios')}>
                All Portfolios
            </Button>
            <Button className='btn-navigation' onClick={() => handleNavigation('/profile')}>
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
                    <Button className="mobile-menu-btn" onClick={() => handleNavigation('/news')}>News</Button>
                    <Button className="mobile-menu-btn" onClick={() => handleNavigation('/stocks')}>Stocks</Button>
                    <Button className="mobile-menu-btn" onClick={() => handleNavigation('/portfolios')}>All Portfolios</Button>
                    <Button className="mobile-menu-btn" onClick={() => handleNavigation('/profile')}>Profile</Button>
                    <Button className="mobile-menu-btn mobile-menu-logout" onClick={handleLogout}>Log Out</Button>
                </div>
            )}
        </header>
    );
}