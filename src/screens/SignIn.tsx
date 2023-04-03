import React from "react";
import { Box, Button, Container, TextField, Typography } from "@mui/material";
import LoadingButton from '@mui/lab/LoadingButton';
import { useAppDispatch, useAppSelector } from "../state/hook";

import { User } from "../api";
import { clearUserError } from "../state/userSlice";

const SignInScreen = () => {
    const dispatch = useAppDispatch();

    const [email, setEmail] = React.useState("");
    const [password, setPassword] = React.useState("");

    const state = useAppSelector(state => state.user);

    const handleSignIn = () => {
        if (!email || !password) return;
        dispatch(User.signIn({ email, password }));
    }

    React.useEffect(() => {
        if (state.error)
            setTimeout(() => dispatch(clearUserError()), 2000);
    }, [state.error]);

    return (
        <Container >
            <Box sx={{ height: "70vh", display: "flex", justifyContent: "center", alignItems: "center" }}>
                <Box sx={{ width: "30%", border: "solid 1px grey", borderRadius: "6px", display: "flex", flexDirection: "column", gap: "20px", padding: "20px", justifyContent: "center", alignItems: "center" }}>
                    <Box sx={{ display: "flex", gap: "20px", border: "solid 0px red", alignItems: "center" }}>
                        <img src="./pgcil.png" style={{ width: "50px", height: "50px" }} />
                        <Typography variant="h6" color="primary" fontWeight={"bold"} my={5} >POWERGRID BILL UTILITY</Typography>
                    </Box>
                    <TextField
                        label="Email"
                        variant="outlined"
                        value={email}
                        fullWidth
                        onChange={(e) => setEmail(e.target.value)} />
                    <TextField
                        label="Password"
                        variant="outlined"
                        value={password}
                        fullWidth
                        type="password"
                        onChange={(e) => setPassword(e.target.value)} />
                    {state.error && <Typography color="red" variant="body1">{state.error}</Typography>}
                    <LoadingButton loading={state.loading} variant="contained" onClick={handleSignIn}>Sign In</LoadingButton>
                </Box>
            </Box>
        </Container>
    );
}

export default SignInScreen;
