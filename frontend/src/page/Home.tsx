import React, { useState, useEffect } from "react";
import { Typography, Container, AppBar, Toolbar, IconButton, Button } from "@mui/material";
import ExitToAppIcon from "@mui/icons-material/ExitToApp";
import { useNavigate, Link } from "react-router-dom";


export function Home() {
    const [userData, setUserData] = useState({
        
    });
    const [isLoggedIn, setIsLoggedIn] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        // Fetch user data when component mounts
        fetchUserData();
    }, []);

    const fetchUserData = async () => {
        try {
            const response = await fetch("http://localhost:5000/api/profile", {
                credentials: "include",
            });
            console.log(response)
            if (!response.ok) {
                throw new Error("Failed to fetch user data");
            }
            const userData = await response.json();
            console.log(userData);
            setUserData(userData);
        } catch (error) {
            console.error("Error fetching user data:", error);
        }
    };

    const handleLogout = async () => {
        try {
            const response = await fetch("http://localhost:5000/api/auth/logout", {
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

    const checkLoginStatus = async () => {
        try {
            const response = await fetch("http://localhost:5000/api/auth/islogged", {
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

    useEffect(() => {
        checkLoginStatus();
    }, []);

    return (
        <div>
            <AppBar position="static">
                <Toolbar>
                    <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
                        Profile
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
            <Container maxWidth="lg" style={{ marginTop: "50px" }}>
                <Typography variant="h4" gutterBottom>
                    Mes informations :
                </Typography>
                {userData ? (
                    <div>
                        <Typography variant="body1">
                            Nom : {userData?.name}
                        </Typography>
                        <Typography variant="body1">
                            Prénom : {userData?.firstname}
                        </Typography>
                        <Typography variant="body1">
                            Age : {userData?.age} ans
                        </Typography>
                        <Button
                            variant="contained"
                            color="primary"
                            component={Link}
                            to="/profile"
                            style={{ marginTop: "20px" }}
                        >
                            Modifier mon profil
                        </Button>
                    </div>
                ) : (
                    <Typography variant="body1">
                        Loading user data...
                    </Typography>
                )}
            </Container>
        </div>

    );
}
