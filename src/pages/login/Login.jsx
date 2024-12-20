import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Cookies from 'universal-cookie';
import { jwtDecode } from 'jwt-decode';
import { Alert, Box, TextField, Typography } from '@mui/material';

import { useUserContext } from '../../context/UserContext';
import login from '../../services/portal/login';
import MonarchButton from '../../components/shared/MonarchButton';

export const Login = () => {
  const navigate = useNavigate();
  const { cookieData, setCookieData, loggedIn, setLoggedIn } = useUserContext();
  const cookies = new Cookies();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loginFail, setLoginFail] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await login(username, password);
      cookies.set('jwt', res.accessToken);
      setCookieData(jwtDecode(cookies.get('jwt')));
      setLoggedIn(true);
      navigate('/');
    } catch (error) {
      setLoginFail(true);
      console.error('Login failed:', error);
    }
  }

  return (
    <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', width: '100%' }}>
      {loggedIn ? (
        <Typography variant='h5'>Signed in as {cookieData.name}</Typography>
      ) : (
        <Box sx={{ width: '400px' }}>
          <form onSubmit={handleSubmit}>
            <Box sx={{ marginBottom: 2 }}>
              <Typography variant='h4' align='center' gutterBottom>
                Sign In
              </Typography>
              {loginFail && (
                <Alert severity='error' sx={{ marginBottom: 2 }}>
                  Incorrect Username or Password
                </Alert>
              )}
            </Box>

            <TextField
              fullWidth
              label='Username'
              variant='outlined'
              margin='normal'
              onChange={(e) => setUsername(e.target.value)}
            />
            <TextField
              fullWidth
              label='Password'
              variant='outlined'
              margin='normal'
              type='password'
              onChange={(e) => setPassword(e.target.value)}
            />
            <Box sx={{ marginTop: 2 }}>
              <MonarchButton type='submit'>
                Submit
              </MonarchButton>
            </Box>
            <Typography variant='body2' align='right' sx={{ marginTop: 2 }}>
              Forgot <a href='#'>password?</a>
            </Typography>
          </form>
        </Box>
      )}
    </Box>
  );
}