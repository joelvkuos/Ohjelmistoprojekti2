import { Box, Button, TextField } from "@mui/material";
import { Link, useNavigate } from "react-router-dom";
import "../styles/Login.css"


export default function Login() {

    const navigate = useNavigate();


    return (
        <Box className='loginBox1'>
            <Box className='loginBox3'>
                <h1 className="Stockfolio">Stockfolio</h1>
                <h3>Your personal stock portfolio</h3>

            </Box>
            <Box className='loginBox2 slide-left'>
                <h1>LOGIN</h1>
                <TextField className="textField" placeholder="Username:"></TextField>
                <TextField className="textField" placeholder="Password:" type="password"></TextField>
                <Button className="btn-grad1" onClick={() => navigate('/landingPage')}>log in</Button>
                <Link className="link1" to="/">Forgot password?</Link>
                <p className="pCreateAccount">Don't have an account? <Link className="link2" to="/register" >Create one here</Link></p> {/*Laitoin vaan jonkun random linkin, sen voi muuttaa miten haluaa */}

            </ Box >
        </Box>
    )

}