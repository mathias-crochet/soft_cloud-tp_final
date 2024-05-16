import React, { useEffect, useState } from "react";
import { AppBar, Toolbar, Typography, IconButton, Card, CardContent, Container, Grid, Button } from '@mui/material'
import ExitToAppIcon from "@mui/icons-material/ExitToApp";
import TextField from "@mui/material/TextField";
import { useNavigate } from "react-router-dom";

interface ProfileDataType {
    name: string;
    firstname: string;
    age: number;
}
export function Profile() {

    const [name, setName] = useState("");
    const [firstname, setFirstname] = useState("");
    const [age, setAge] = useState(0);
    const [profileData, setProfileData] = useState<ProfileDataType | null>(null);
    const [isLoggedIn, setIsLoggedIn] = useState(true);
    const [noChanges, setNoChanges] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        if (
            profileData !== null &&
            profileData.name === name &&
            profileData.firstname === firstname &&
            profileData.age == age
        ) {
            setNoChanges(true);
        } else {
            setNoChanges(false);
        }
    }, [profileData, name, firstname, age, noChanges]);

    const handleLogout = async () => {
        try {
            const response = await fetch("http://localhost:800/api/auth/logout", {
                method: "POST",
                credentials: "include",
            });

            if (!response.ok) {
                throw new Error("Failed to logout");
            }
            setIsLoggedIn(false);
            navigate("/login");
        } catch (error) {
            console.error("Error logging out:", error);
        }
    };

    const handleNameChange = (event) => {
        setName(event.target.value);
    };

    const handleFirstnameChange = (event) => {
        setFirstname(event.target.value);
    };

    const handleAgeChange = (event) => {
        setAge(event.target.value);
    };

    const checkLoginStatus = async () => {
        try {
            const response = await fetch("http://localhost:800/api/auth/islogged", {
                credentials: "include",
            });
            const data = await response.json();
            if (!data.isLogged) {
                navigate("/login");
            }
            setIsLoggedIn(data.isLogged);
        } catch (error) {
            console.error("Error fetching login status:", error);
        }
    };

    const fetchProfile = async () => {
        try {
            const response = await fetch("http://localhost:800/api/profile", {
                credentials: "include",
            });
            console.log(response);
            if (!response.ok) {
                throw new Error("Failed to fetch profile");
            }
            const profileData = await response.json();
            setProfileData(profileData);
            setName(profileData.name);
            setFirstname(profileData.firstname);
            setAge(profileData.age);
        } catch (error) {
            console.error("Error fetching profile:", error);
            return null;
        }
    };

    const updateProfile = async () => {
        try {
            const response = await fetch("http://localhost:800/api/profile", {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    name: name,
                    firstname: firstname,
                    age: age,
                }),
                credentials: "include",
            });

            if (!response.ok) {
                throw new Error("Failed to update profile");
            }

            const updatedProfile = await response.json();
            setProfileData(updatedProfile);
            navigate('/')
        } catch (error) {
            console.error("Error updating profile:", error);
            return null;
        }
    };

    const goBack = () => {
        navigate(-1);
    }

    useEffect(() => {
        checkLoginStatus();
        fetchProfile();
    }, []);

    return (
        <div>
            <AppBar position="static">
                <Toolbar>
                    <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
                        Profil
                    </Typography>
                    {isLoggedIn && (
                        <IconButton
                            edge="end"
                            color="inherit"
                            aria-label="logout"
                            onClick={handleLogout}
                        >
                            <ExitToAppIcon />
                        </IconButton>
                    )}
                </Toolbar>
            </AppBar>
            {isLoggedIn && profileData ? (
                <Container maxWidth="lg" style={{ marginTop: "50px" }}>
                    <Card variant="outlined">
                        <CardContent>
                            <Typography variant="h5" gutterBottom>
                                Mon Profil
                            </Typography>
                            <Grid container spacing={2}>
                                <Grid item xs={12} md={6}>
                                    <TextField
                                        id="firstname"
                                        label="Prénom"
                                        fullWidth
                                        value={firstname}
                                        onChange={handleFirstnameChange}
                                    />
                                </Grid>
                                <Grid item xs={12} md={6}>
                                    <TextField
                                        id="name"
                                        label="Nom"
                                        fullWidth
                                        value={name}
                                        onChange={handleNameChange}
                                    />
                                </Grid>
                                <Grid item xs={12}>
                                    <TextField
                                        id="age"
                                        label="Âge"
                                        fullWidth
                                        type="number"
                                        value={age}
                                        onChange={handleAgeChange}
                                    />
                                </Grid>
                            </Grid>
                            <Button
                                variant="contained"
                                color="primary"
                                onClick={updateProfile}
                                disabled={noChanges}
                                sx={{ mt: 2 }}
                            >
                                Enregistrer
                            </Button>
                            <Button
                                variant="contained"
                                color="inherit"
                                onClick={goBack}
                                sx={{ mx: 2, mt: 2 }}
                            >
                                Retour
                            </Button>
                        </CardContent>
                    </Card>
                </Container>
            ) : (
                <>
                    Vous devez être connecté pour modifier votre profil.
                </>
            )}
        </div>
    );
}
