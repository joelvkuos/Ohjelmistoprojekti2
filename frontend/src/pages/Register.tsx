import { Box, Button, TextField } from "@mui/material";
import { Link, useNavigate } from "react-router-dom";
import "../styles/Login.css"

export default function Register() {
    const navigate = useNavigate();

    return (
        <Box className='loginBox1 reverse green-bg'>
            <Box className='loginBox3'>
                <h1 className="Stockfolio">Stockfolio</h1>
                <h3 className="info">Create an account to get started</h3>

            </Box>
            <Box className='loginBox2 slide-right green-bg'>
                <h1>REGISTER</h1>
                <TextField className="textField" placeholder="Username:"></TextField>
                <TextField className="textField" placeholder="Password:" type="password"></TextField>
                <TextField className="textField" placeholder="Confirm Password:" type="password"></TextField>
                <TextField className="textField" placeholder="Email:"></TextField>
                <TextField className="textField" placeholder="Phone:"></TextField>
                <Button className="btn-grad1 register" onClick={() => navigate('/')}>create account</Button>
                <p className="pCreateAccount">Already have an account? <Link className="link2" to="/" >Back to login</Link></p>
            </ Box >
        </Box>
    )
}