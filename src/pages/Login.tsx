import { useState } from 'react';
import {
  Box,
  Button,
  Card,
  CircularProgress,
  TextField,
  Typography,
  useTheme
} from '@mui/material';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { useSnackbarStore } from '../store/snackbarStore';

export default function Login() {
  const [credentials, setCredentials] = useState({ username: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();
  const showSnackbar = useSnackbarStore((state) => state.showSnackbar);
  const theme = useTheme();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCredentials({ ...credentials, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await fetch('http://localhost:3001/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(credentials),
      });
      if (!response.ok) throw new Error('Invalid login credentials');

      const data = await response.json();
      login(data.accessToken);
      navigate('/home', { replace: true });
      showSnackbar('Logged in successfully!');
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box
      display="flex"
      justifyContent="center"
      sx={{
        mt: 8,
      }}
    >
      <Card
        sx={{
          padding: 4,
          borderRadius: 3,
          boxShadow: theme.palette.mode === 'dark' ? 6 : 3,
          width: 350,
          textAlign: 'center',
        }}
      >
        <Typography
          variant="h4"
          fontWeight="bold"
          color="primary"
          mb={2}
          sx={{
            textShadow: theme.palette.mode === 'dark' ? '0px 0px 10px rgba(255,255,255,0.2)' : 'none'
          }}
        >
          Login
        </Typography>
        <Box component="form" onSubmit={handleSubmit}>
          <TextField
            fullWidth
            variant="outlined"
            label="Email or Username"
            name="username"
            value={credentials.username}
            onChange={handleChange}
            margin="normal"
            required
          />
          <TextField
            fullWidth
            variant="outlined"
            label="Password"
            type="password"
            name="password"
            value={credentials.password}
            onChange={handleChange}
            margin="normal"
            required
          />
          {error && (
            <Typography color="error" mt={1}>
              {error}
            </Typography>
          )}
          <Button
            type="submit"
            variant="contained"
            color="primary"
            fullWidth
            sx={{
              mt: 2,
              py: 1,
              fontSize: '1rem',
              borderRadius: 2,
              transition: '0.3s ease-in-out',
              '&:hover': {
                transform: 'scale(1.05)',
              },
            }}
            disabled={loading}
          >
            {loading ? <CircularProgress size={24} color="inherit" /> : 'Login'}
          </Button>
        </Box>
      </Card>
    </Box>
  );
}
