import { Box, Button, TextField } from "@mui/material";
import "../styles/Login.css"
export default function Login() {


    return (
        <Box className='loginBox1'>
            <Box className='loginBox2'>
                <h1>Log in</h1>
                <TextField placeholder="Username:"></TextField>
                <TextField placeholder="Password:"></TextField>
                <Button variant="text">Log in</Button>
            </ Box >
        </Box>
    )

}