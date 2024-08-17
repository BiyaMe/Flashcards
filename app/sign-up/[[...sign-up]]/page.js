import { SignUp, SignIn} from "@clerk/nextjs";
import { AppBar, Box, Button, Container, Toolbar, Typography } from "@mui/material";
import Link from "next/link";

export default function SignUpPage(){
    return <Container maxWidth="100vw">
        <AppBar position="static" >
            <Toolbar>
                <Typography variant="h6" sx={{flexGrow: 1}}>
                    Flashcard
                </Typography>
                <Button color="inherit">
                    <Link href="/sign-in" passHref>
                        Login
                    </Link>
                <Button color="inherit">
                    <Link href="/sign-up" passHref>
                        Sign Up
                    </Link>
                </Button>
                </Button>
            </Toolbar>
        </AppBar>

        <Box
            display="flex"
            flexDirection="column"
            justifyContent="center"
            alignItems="center"
        >
            <Typography variant="h4"> Sign Up </Typography>
            <SignUp />
            {/* <Box sx={{width: '100%', mt: 3}}>
                <SignUpForm />
            </Box> */}
        </Box>
    </Container>
}