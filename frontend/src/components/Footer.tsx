import { Stack, Box, Container, IconButton, Typography } from "@mui/material";
import "../styles/footer.css"
import GitHubIcon from '@mui/icons-material/GitHub';
import TwitterIcon from '@mui/icons-material/X';
import Link from '@mui/material/Link';



export default function Footer() {
    return (
        <Container maxWidth={false} className="container">
            <Box
                className="footer-row"
            >
                <div>
                    <Link href='#'>Privacy Policy</Link>
                </div>
                <div className="copyright">
                    <Typography>
                        Copyright © Stockfolio 2026
                    </Typography>
                </div>
                <Stack
                    direction='row'
                    justifyContent='flex-end'
                    className="stack"
                >

                    <IconButton
                        href='https://github.com/joelvkuos/Ohjelmistoprojekti2'
                        target="_blank"
                        className="githubicon">
                        <GitHubIcon />
                    </IconButton>

                    <IconButton
                        className="githubicon"
                        href="https://x.com/"
                        target="_blank"
                    >
                        <TwitterIcon />
                    </IconButton>
                </Stack>
            </Box>
        </Container >
    )
}