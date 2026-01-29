import { Box, Button, TextField } from "@mui/material";
import "../styles/Login.css"
export default function Login() {


    return (
        <Box className='loginBox1'>
            <Box className='loginBox3'>
                <h1>Stockfolio</h1>
                <h3>Personal stock portfolio profile</h3>

            </Box>
            <Box className='loginBox2'>

                <h1>LOGIN</h1>
                <TextField className="textField" placeholder="Username:"></TextField>
                <TextField className="textField" placeholder="Password:"></TextField>
                <Button className="btn-grad1">log in</Button>
                <p className="pCreateAccount">Don't have an account?</p>
                <Button className="btn-grad2">Create account</Button>

            </ Box >
        </Box>
    )

}