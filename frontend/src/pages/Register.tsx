import { Box, Button, TextField } from "@mui/material";
import { Link, useNavigate } from "react-router-dom";
import { addCustomer } from "../services/authService";
import "../styles/Login.css"
import { useState } from "react";

export default function Register() {
    const navigate = useNavigate();


    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    const [formData, setFormData] = useState({
        username: "",
        password: "",
        confirmPassword: "",
        email: "",
        phone: ""
    });


    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleRegister = async () => {
        setError("");

        if (!formData.username || !formData.password || !formData.email) {
            setError("Username, password and email are required");
            return;
        }

        if (formData.password !== formData.confirmPassword) {
            setError("Passwords do not match");
            return;
        }

        setLoading(true);
        try {
            await addCustomer(formData);
            navigate('/login');
        } catch (err) {
            setError("Registration failed. Please try again.");
        } finally {
            setLoading(false);
        }
    }

    return (
        <Box className='loginBox1 reverse green-bg'>
            <Box className='loginBox3'>
                <h1 className="Stockfolio">Stockfolio</h1>
                <h3 className="info">Create an account to get started</h3>

            </Box>
            <Box className='loginBox2 slide-right green-bg'>
                <h1>REGISTER</h1>
                {error && <p style={{ color: 'red' }}>{error}</p>}
                <TextField
                    className="textField"
                    placeholder="Username:"
                    name="username"
                    value={formData.username}
                    onChange={handleChange}
                />
                <TextField
                    className="textField"
                    placeholder="Password:"
                    type="password"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                />
                <TextField
                    className="textField"
                    placeholder="Confirm Password:"
                    type="password"
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                />
                <TextField
                    className="textField"
                    placeholder="Email:"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                />
                <TextField
                    className="textField"
                    placeholder="Phone:"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                />
                <Button
                    className="btn-grad1 register"
                    onClick={handleRegister}
                    disabled={loading}
                >
                    {loading ? 'Creating...' : 'create account'}
                </Button>
                <p className="pCreateAccount">Already have an account? <Link className="link2" to="/login" >Back to login</Link></p>
            </ Box >
        </Box>
    )
}