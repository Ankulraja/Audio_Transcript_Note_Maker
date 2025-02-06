"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import axios from "axios";
import { FaAngleLeft } from "react-icons/fa6";
import {
  Box,
  Button,
  CircularProgress,
  Container,
  TextField,
  Typography,
} from "@mui/material";
import { useAuth } from "../../context/AuthContext";
export default function LoginPage() {
  const router = useRouter();
  const [user, setUser] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [buttonDisabled, setButtonDisabled] = useState(true);
  const [touched, setTouched] = useState({ email: false, password: false });
  const { login } = useAuth(); 
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  
  const onLogin = async () => {
    if (!emailRegex.test(user.email)) {
      setError("Invalid email format.");
      return;
    }

    try {
      setLoading(true);
      setError("");
      const response = await axios.post("/api/user/login", user);
      if (response.status === 200) {
        login(response.data.token,response.data.user);
        router.push("/dashboard");
      } else {
        throw new Error("Unexpected response");
      }
    } catch (error) {
      setError("Invalid email or password");
      console.error("Login failed", error.response?.data || error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    setButtonDisabled(
      !user.email || !user.password || !emailRegex.test(user.email)
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
          {loading ? "We're logging you in..." : "Account Login"}
        </Typography>

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
          type="password"
          value={user.password}
          onChange={(e) => setUser({ ...user, password: e.target.value })}
          onBlur={() => setTouched({ ...touched, password: true })}
          error={touched.password && user.password.length < 6}
          helperText={touched.password && user.password.length < 6 ? "Password must be at least 6 characters long" : ""}
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
          onClick={onLogin}
          disabled={buttonDisabled || loading}
        >
          {loading ? <CircularProgress size={24} color="inherit" /> : "Login"}
        </Button>

        <Typography variant="body2" sx={{ mt: 2 }}>
          Don't have an account?{" "}
          <Link
            href="/sign-up"
            style={{
              textDecoration: "none",
              color: "#2e7d32",
              fontWeight: "bold",
            }}
          >
            Register your free account now
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