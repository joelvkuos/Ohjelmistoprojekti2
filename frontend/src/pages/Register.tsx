import { Box, Button, TextField } from "@mui/material";
import { Link, useNavigate } from "react-router-dom";
import "../styles/Login.css"

export default function Register() {
    const navigate = useNavigate();

    return (
        <Box className='loginBox1 reverse'>
            <Box className='loginBox3'>
                <h1 className="Stockfolio">Stockfolio</h1>
                <h3 className="info">Your personal stock portfolio</h3>

            </Box>
            <Box className='loginBox2 slide-right'>
                <h1>REGISTER</h1>
                <TextField className="textField" placeholder="Username:"></TextField>
                <TextField className="textField" placeholder="Password:" type="password"></TextField>
                <TextField className="textField" placeholder="Confirm Password:" type="password"></TextField>
                <Button className="btn-grad1" onClick={() => navigate('/')}>create account</Button>
                <p className="pCreateAccount">Already have an account? <Link className="link2" to="/" >Back to login</Link></p>
            </ Box >
        </Box>
    )
}