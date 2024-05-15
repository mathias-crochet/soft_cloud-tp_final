import React, { useEffect, useState } from "react";
import {Avatar, Button, TextField, Link, Grid, Box, Typography, Container} from '@mui/material'
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import { useNavigate } from "react-router-dom";

export function Register() {
    const nav = useNavigate();
    const [error, setError] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const handleRegisterAccount = async (e) => {
        e.preventDefault();
        try {
            if (!email || !password) {
                setError("Email et mot de passe requis");
                return;
            }
            console.log(email, password);
            const response = await fetch(
              "http://localhost:800/api/auth/register",
              {
                method: "POST",
                credentials: "include",
                headers: {
                  "Content-Type": "application/json",
                },
                body: JSON.stringify({
                  email: email,
                  password: password,
                }),
              }
            );

            if (!response.ok) {
              setError("Erreur lors de l'inscription");
              return;
            }
            const profileRes = await fetch("http://localhost:800/api/profile", {
              method: "POST",
              credentials: "include",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({
                name: "",
                firstname: "",
                age: 0,
              }),
            });
            if (!profileRes.ok) {
                throw new Error("Failed to create profile");
            }
            nav("/login");
        } catch (error) {
            console.error("Error registering account:", error.message);
        }
    };

    const handleEmailChange = (event) => {
        setEmail(event.target.value);
    };
    const handlePasswordChange = (event) => {
        setPassword(event.target.value);
    };

    return (
        <Box
            sx={{
                marginTop: 8,
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
            }}
        >
            <Avatar sx={{ m: 1, bgcolor: "secondary.main" }}>
                <LockOutlinedIcon />
            </Avatar>
            <Typography component="h1" variant="h5">
                Inscription
            </Typography>
            <Container maxWidth="sm" style={{ marginTop: "50px" }}>
                <Grid container spacing={2}>
                    <Typography sx={{ ml: 3 }}>{error}</Typography >
                    <Grid item xs={12}>
                        <TextField
                            required
                            fullWidth
                            id="email"
                            label="Adresse mail"
                            name="email"
                            value={email}
                            onChange={handleEmailChange}
                            autoComplete="email"
                        />
                    </Grid>
                    <Grid item xs={12}>
                        <TextField
                            required
                            fullWidth
                            name="password"
                            label="Mot de passe"
                            type="password"
                            id="password"
                            onChange={handlePasswordChange}
                            value={password}
                            autoComplete="new-password"
                        />
                    </Grid>
                </Grid>
                <Button
                    type="submit"
                    fullWidth
                    variant="contained"
                    sx={{ mt: 3, mb: 2 }}
                    onClick={handleRegisterAccount}
                >
                    S'inscrire
                </Button>
                <Grid container justifyContent="flex-end">
                    <Grid item>
                        <Link href="/login" variant="body2">
                            Vous avez déjà un compte ? Connectez-vous
                        </Link>
                    </Grid>
                </Grid>
            </Container>
        </Box>
    );
}
