import React from "react";
import { useRouter } from "next/router";
import { useAuth } from "../context/AuthContext";
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import { styled } from "@mui/system";

const Logo = styled("img")({
  height: "40px",
  marginRight: "16px",
});

function Navbar() {
  const { isAuthenticated, logout } = useAuth();
  const router = useRouter();

  const handleLogout = () => {
    logout();
    router.push("/login");
  };

  return (
    <AppBar position="static" sx={{ backgroundColor: "primary.main" }}>
      <Toolbar>
        <Logo
          src="https://st2.depositphotos.com/4035913/6124/i/450/depositphotos_61243831-stock-photo-letter-s-logo.jpg"
          alt="Logo"
        />
        <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
          Note-Maker-App
        </Typography>

        {isAuthenticated ? (
          <>
            <Button color="inherit" href="/dashboard">
              Dashboard
            </Button>
            <Button color="inherit" onClick={handleLogout}>
              Logout
            </Button>
          </>
        ) : (
          <>
            <Button color="inherit" href="/sign-up">
              Signup
            </Button>
            <Button color="inherit" href="/login">
              Login
            </Button>
          </>
        )}
      </Toolbar>
    </AppBar>
  );
}

export default Navbar;