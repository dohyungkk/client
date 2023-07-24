import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

import { Avatar, Button, Container, CssBaseline, TextField, ThemeProvider, Typography } from "@mui/material";
import { createTheme } from "@mui/material/styles";
import Box from "@mui/material/Box";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";

import axios from 'axios';

// Retrieved from https://mui.com/material-ui/getting-started/templates/sign-in/
const defaultTheme = createTheme();

const LoginPage = () => {
  const [creds, setCreds] = useState({});
  const [errorMessage, setErrorMessage] = useState('')
  
  const navigate = useNavigate();
  
  const SERVER_URL = process.env.REACT_APP_SERVER_URL;

  const requestLogin = (e) => {
    e.preventDefault()

    // Posting email and password for logging in to the backend (validation in backend) 
    axios.post(`${SERVER_URL}/login`, {
      email: creds.email,
      password: creds.password
    })
    .then((response) => {
      // Adding email and secret_key, which can be found at server/controller/loginController line 65
      const user = { email: creds.email, secret_key: response.data.secret_key };

      // Preventing logging out automatically when refreshing
      localStorage.setItem("session", JSON.stringify(user));
      navigate("/vehicles")
    })
    .catch((error) => {
      setErrorMessage(error.response.data.message)
    });
  }

  return (
    // Retrieved from https://mui.com/material-ui/getting-started/templates/sign-in/
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
                autoComplete="password"
              />
              <b className="b_error">{errorMessage}</b>
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