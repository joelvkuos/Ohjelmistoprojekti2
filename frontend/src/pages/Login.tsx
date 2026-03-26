import { Box, Button, TextField } from "@mui/material";
import { Link, useNavigate } from "react-router-dom";
import "../styles/Login.css"
import { useState } from "react";
import { useAuth } from "../context/AuthContext";

export default function Login() {

    const navigate = useNavigate();
    const { login, state } = useAuth();

    const [error, setError] = useState("");

    const [formData, setFormData] = useState({
        username: "",
        password: ""
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleLogin = async () => {
        setError("");

        if (!formData.username || !formData.password) {
            setError("Username and password are required");
            return;
        }

        try {
            await login(formData.username, formData.password);
            navigate('/homepage');
        } catch (err) {
            setError(err instanceof Error ? err.message : "Login failed. Please check your credentials.");
        }
    }

    return (
        <Box className='loginBox1'>
            <Box className='loginBox3'>
                <h1 className="Stockfolio">Stockfolio</h1>
                <h3>Your personal stock portfolio</h3>

            </Box>
            <Box className='loginBox2 slide-left'>
                <h1>LOGIN</h1>
                <TextField
                    className="textField"
                    placeholder="Username:"
                    name="username"
                    value={formData.username}
                    onChange={handleChange}
                    disabled={state.loading}
                />
                <TextField
                    className="textField"
                    placeholder="Password:"
                    type="password"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    error={error !== ""}
                    helperText={error ? error : " "}
                    disabled={state.loading}
                />
                <Button
                    className="btn-grad1"
                    onClick={handleLogin}
                    disabled={state.loading}
                >
                    {state.loading ? 'Logging in..' : 'Log in'}
                </Button>
                <Link className="link1" to="/">Forgot password?</Link>
                <p className="pCreateAccount">Don't have an account? <Link className="link2" to="/register" >Create one here</Link></p>

            </Box>
        </Box>
    )

}