import "../styles/profile.css"
import { useEffect, useState } from "react";
import { useAuth } from '../context/AuthContext';
import { getCurrentUser, updateUserProfile, type UserProfile } from "../services/userService";

import Navigation from "../components/Navigation";
import Footer from "../components/Footer";
import { useNavigate } from 'react-router-dom';

import { Alert, Box, Button, CircularProgress, TextField } from "@mui/material";
import Person2OutlinedIcon from '@mui/icons-material/Person2Outlined';
import WorkOutlineOutlinedIcon from '@mui/icons-material/WorkOutlineOutlined';
import EditIcon from '@mui/icons-material/Edit';
import SaveIcon from '@mui/icons-material/Save';
import CancelIcon from '@mui/icons-material/Cancel';



export default function Profile() {
    const navigate = useNavigate();
    const { state } = useAuth();

    const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [isEditing, setIsEditing] = useState(false);
    const [isSaving, setIsSaving] = useState(false);

    const [editData, setEditData] = useState({
        email: '',
        phone: '',
    });

    useEffect(() => {
        const fetchUserData = async () => {
            if (!state.accessToken) {
                setError("Not authenticated");
                setLoading(false);
                return;
            }

            try {
                const data = await getCurrentUser(state.accessToken);
                setUserProfile(data);
                setEditData({
                    email: data.email || '',
                    phone: data.phone || '',
                });
            } catch (err) {
                setError(err instanceof Error ? err.message : "Failed to load profile");
            } finally {
                setLoading(false);
            }
        };

        fetchUserData();
    }, [state.accessToken]);

    const handleEditChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setEditData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSave = async () => {
        if (!state.accessToken) {
            setError("Not authenticated");
            return;
        }

        setIsSaving(true);
        try {
            const updated = await updateUserProfile(editData, state.accessToken);
            setUserProfile(updated);
            setIsEditing(false);
            setError(null);
        } catch (err) {
            setError(err instanceof Error ? err.message : "Failed to update profile");
        } finally {
            setIsSaving(false);
        }
    };

    const handleCancel = () => {
        if (userProfile) {
            setEditData({
                email: userProfile.email || '',
                phone: userProfile.phone || '',
            });
        }
        setIsEditing(false);
        setError(null);
    };

    if (loading) {
        return (
            <>
                <Navigation />
                <div className="profiletwo-column-section" style={{ justifyContent: 'center', minHeight: '60vh' }}>
                    <CircularProgress />
                </div>
                <Footer />
            </>
        );
    }


    return (
        <>
            <Navigation />
            <div className="profiletwo-column-section">
                <div className="column-text">
                    <h2>My profile</h2>
                    <div className="profileButtons">
                        <Button className="profileButton" startIcon={<Person2OutlinedIcon />} onClick={() => navigate('/profile')}>
                            Profile
                        </Button>
                        <Button className="portfolioButton" startIcon={<WorkOutlineOutlinedIcon />} onClick={() => navigate('/portfolio')}>
                            My portfolios
                        </Button>
                    </div>
                </div>

                {/* Profiilin sisältö */}
                <Box className="profile-content">
                    {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

                    {userProfile && !isEditing ? (
                        // Näkymä tila
                        <Box className="profile-display">
                            <Box className="profile-field">
                                <label>Username:</label>
                                <p className="profile-value">{userProfile.username}</p>
                            </Box>

                            <Box className="profile-field">
                                <label>Email:</label>
                                <p className="profile-value">{userProfile.email || 'Not set'}</p>
                            </Box>

                            <Box className="profile-field">
                                <label>Phone:</label>
                                <p className="profile-value">{userProfile.phone || 'Not set'}</p>
                            </Box>

                            <Button
                                variant="contained"
                                startIcon={<EditIcon />}
                                onClick={() => setIsEditing(true)}
                                className="edit-button"
                                sx={{ mt: 2 }}
                            >
                                Edit Profile
                            </Button>
                        </Box>
                    ) : userProfile ? (
                        // Muokkaus tila
                        <Box className="profile-edit">
                            <TextField
                                fullWidth
                                label="Username"
                                value={userProfile.username}
                                disabled
                                sx={{ mb: 2 }}
                                helperText="Username cannot be changed"
                            />

                            <TextField
                                fullWidth
                                label="Email"
                                name="email"
                                value={editData.email}
                                onChange={handleEditChange}
                                type="email"
                                sx={{ mb: 2 }}
                            />

                            <TextField
                                fullWidth
                                label="Phone"
                                name="phone"
                                value={editData.phone}
                                onChange={handleEditChange}
                                sx={{ mb: 2 }}
                            />

                            <Box className="button-group" sx={{ display: 'flex', gap: 1, justifyContent: 'flex-start' }}>
                                <Button
                                    variant="contained"
                                    startIcon={<SaveIcon />}
                                    onClick={handleSave}
                                    disabled={isSaving}
                                    color="success"
                                >
                                    {isSaving ? 'Saving...' : 'Save'}
                                </Button>
                                <Button
                                    variant="outlined"
                                    startIcon={<CancelIcon />}
                                    onClick={handleCancel}
                                    disabled={isSaving}
                                    color="error"
                                >
                                    Cancel
                                </Button>
                            </Box>
                        </Box>
                    ) : null}
                </Box>
            </div>
            <Footer />
        </>
    );
}