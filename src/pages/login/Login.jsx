import { useState } from 'react';
import Cookies from 'universal-cookie';
import { jwtDecode } from "jwt-decode";
import { Alert, Box, Button, TextField, Typography } from '@mui/material';
import login from '../../services/portal/login';

export const Login = () => {
  const cookies = new Cookies();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [cookieData, setCookieData] = useState('');
  const [loggedIn, setLoggedIn] = useState(false);
  const [loginFail, setLoginFail] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await login(username, password);
      cookies.set('jwt', res.accessToken);
      setCookieData(jwtDecode(cookies.get('jwt')));
      setLoggedIn(true);
      window.location.href = '/';
    } catch (error) {
      setLoginFail(true);
      console.error('Login failed:', error);
    }
  }

  return (
    <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', width: '100%' }}>
      {loggedIn ? (
        <Typography variant="h5">Signed in as {cookieData.name}</Typography>
      ) : (
        <Box sx={{ width: '400px' }}>
          <form onSubmit={handleSubmit}>
            <Box sx={{ marginBottom: 2 }}>
              <Typography variant="h4" align="center" gutterBottom>
                Sign In
              </Typography>
              {loginFail && (
                <Alert severity="error" sx={{ marginBottom: 2 }}>
                  Incorrect Username or Password
                </Alert>
              )}
            </Box>

            <TextField
              fullWidth
              label="Username"
              variant="outlined"
              margin="normal"
              onChange={(e) => setUsername(e.target.value)}
            />
            <TextField
              fullWidth
              label="Password"
              variant="outlined"
              margin="normal"
              type="password"
              onChange={(e) => setPassword(e.target.value)}
            />
            <Box sx={{ marginTop: 2 }}>
              <Button fullWidth variant="contained" color="error" type="submit">
                Submit
              </Button>
            </Box>
            <Typography variant="body2" align="right" sx={{ marginTop: 2 }}>
              Forgot <a href="#">password?</a>
            </Typography>
          </form>
        </Box>
      )}
    </Box>
  );
}