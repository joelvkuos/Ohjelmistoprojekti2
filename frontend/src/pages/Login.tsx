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

                <h1>Log in</h1>
                <TextField className="textField" placeholder="Username:"></TextField>
                <TextField className="textField" placeholder="Password:"></TextField>
                <Button className="btn-grad">Log in</Button>
            </ Box >
        </Box>
    )

}