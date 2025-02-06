"use client";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import axios from "axios";
import { FaAngleLeft } from "react-icons/fa6";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import {
  Box,
  Button,
  CircularProgress,
  Container,
  TextField,
  Typography,
  IconButton,
  InputAdornment,
} from "@mui/material";

export default function SignUpPage() {
  const router = useRouter();
  const [user, setUser] = useState({ username: "", email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [buttonDisabled, setButtonDisabled] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [touched, setTouched] = useState({ username: false, email: false });

  // Email validation regex
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  // Check if the username contains only numbers
  const isNumeric = (str) => /^\d+$/.test(str);

  const onSignUp = async () => {
    if (!emailRegex.test(user.email)) {
      setError("Invalid email format.");
      return;
    }
    if (isNumeric(user.username)) {
      setError("Username cannot be only numbers.");
      return;
    }

    try {
      setLoading(true);
      setError("");
      const response = await axios.post("/api/user/signup", user);
      console.log("Signup successful", response.data);
      router.push("/login");
    } catch (error) {
      setError("Signup failed, please try again.");
      console.log("Signup failed", error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    setButtonDisabled(
      !user.username || !user.email || !user.password || isNumeric(user.username) || !emailRegex.test(user.email)
    );
  }, [user]);

  return (
    <Container maxWidth="sm">
      <Box
        display="flex"
        flexDirection="column"
        alignItems="center"
        justifyContent="center"
        minHeight="100vh"
      >
        <Typography variant="h4" gutterBottom>
          {loading ? "Processing..." : "Free Sign Up"}
        </Typography>

        <TextField
          fullWidth
          label="Your Username"
          variant="outlined"
          margin="normal"
          type="text"
          value={user.username}
          onChange={(e) => setUser({ ...user, username: e.target.value })}
          onBlur={() => setTouched({ ...touched, username: true })}
          error={touched.username && isNumeric(user.username)}
          helperText={touched.username && isNumeric(user.username) ? "Username cannot be only numbers" : ""}
        />

        <TextField
          fullWidth
          label="Your Email"
          variant="outlined"
          margin="normal"
          type="email"
          value={user.email}
          onChange={(e) => setUser({ ...user, email: e.target.value })}
          onBlur={() => setTouched({ ...touched, email: true })}
          error={touched.email && !emailRegex.test(user.email)}
          helperText={touched.email && !emailRegex.test(user.email) ? "Enter a valid email address" : ""}
        />

        <TextField
          fullWidth
          label="Your Password"
          variant="outlined"
          margin="normal"
          type={showPassword ? "text" : "password"}
          value={user.password}
          onChange={(e) => setUser({ ...user, password: e.target.value })}
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <IconButton onClick={() => setShowPassword(!showPassword)} edge="end">
                  {showPassword ? <VisibilityOff /> : <Visibility />}
                </IconButton>
              </InputAdornment>
            ),
          }}
        />

        {error && (
          <Typography color="error" variant="body2" mt={1}>
            {error}
          </Typography>
        )}

        <Button
          fullWidth
          variant="contained"
          color="primary"
          size="large"
          sx={{ mt: 2 }}
          onClick={onSignUp}
          disabled={buttonDisabled || loading}
        >
          {loading ? <CircularProgress size={24} color="inherit" /> : "Register My Account Now"}
        </Button>

        <Typography variant="body2" sx={{ mt: 2 }}>
          Already have an account?{" "}
          <Link
            href="/login"
            style={{
              textDecoration: "none",
              color: "#2e7d32",
              fontWeight: "bold",
            }}
          >
            Login here
          </Link>
        </Typography>

        <Link
          href="/"
          style={{
            textDecoration: "none",
            color: "gray",
            display: "flex",
            alignItems: "center",
            marginTop: "16px",
          }}
        >
          <FaAngleLeft />{" "}
          <Typography variant="body2" ml={1}>
            Back to Homepage
          </Typography>
        </Link>
      </Box>
    </Container>
  );
}