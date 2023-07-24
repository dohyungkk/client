import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

import { TextField, Button } from "@mui/material";
import CssBaseline from "@mui/material/CssBaseline";
import Box from "@mui/material/Box";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import Avatar from "@mui/material/Avatar";

import axios from 'axios';

const defaultTheme = createTheme();
const LoginPage = ({ onLogin }) => {
  const [creds, setCreds] = useState({});
  const [errorMessage, setErrorMessage] = useState('')
  
  const navigate = useNavigate();
  
  const SERVER_URL = process.env.REACT_APP_SERVER_URL;

  const requestLogin = (e) => {
    e.preventDefault()
    axios.post(`${SERVER_URL}/login`, {
      email: creds.email,
      password: creds.password
    })
    .then((response) => {
      onLogin && onLogin({ session: response.data.secret_key })
      const user = { username: creds.email, session: response.data.secret_key };
      onLogin(user);
      localStorage.setItem("session", JSON.stringify(user));
      navigate("/vehicles")
    })
    .catch((error) => {
      setErrorMessage(error.response.data.message)
    });
  }

  return (
    <ThemeProvider theme={defaultTheme}>
      <Container component="main" maxWidth="xs">
        <CssBaseline />
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
            Sign in
          </Typography>
          <form onSubmit={requestLogin}>
            <Box component="div" noValidate sx={{ mt: 1 }}>
              <TextField
                margin="normal"
                required
                fullWidth
                id="email"
                label="Email Address"
                name="email"
                type="email"
                autoComplete="email"
                value={creds.email}
                onChange={(e) => setCreds({ ...creds, email: e.target.value })}
                autoFocus
              />
              <TextField
                margin="normal"
                required
                fullWidth
                name="password"
                label="Password"
                type="password"
                id="password"
                value={creds.password}
                onChange={(e) => setCreds({ ...creds, password: e.target.value })}
                autoComplete="current-password"
              />
              <p>{errorMessage}</p>
              <Button
                type="submit"
                fullWidth
                variant="contained"
                sx={{ mt: 3, mb: 2 }}
              >
                Log In
              </Button>
            </Box>
          </form>
        </Box>
      </Container>
    </ThemeProvider>
  );
};

export default LoginPage;