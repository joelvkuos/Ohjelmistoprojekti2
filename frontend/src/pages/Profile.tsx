import "../styles/profile.css"
import Navigation from "../components/Navigation";
import Footer from "../components/Footer";
import { Button } from "@mui/material";
import { useNavigate } from 'react-router-dom';

import Person2OutlinedIcon from '@mui/icons-material/Person2Outlined';
import WorkOutlineOutlinedIcon from '@mui/icons-material/WorkOutlineOutlined';


export default function Profile() {
    const navigate = useNavigate();

    return (
        <>
            <Navigation />
            <div className="profiletwo-column-section">
                <div className="column-text">
                    <h2>My profile</h2>
                    <div className="profileButtons">
                        <Button className="profileButton" startIcon={<Person2OutlinedIcon />} onClick={() => navigate('/profile')} >
                            Profile
                        </Button>
                        <Button className="portfolioButton" startIcon={<WorkOutlineOutlinedIcon />} onClick={() => navigate('/portfolio')}>
                            My portfolios
                        </Button>
                    </div>
                </div>
                <p>This is where user profile information will be displayed.</p>
            </div>
            <Footer />
        </>
    );
}