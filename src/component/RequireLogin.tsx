import React from 'react';
import { Box, Button, Card, Typography } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import LoginIcon from '@mui/icons-material/Login';

const RequireLogin: React.FC = () => {

  const navigate = useNavigate();

  return (
    <Box display="flex" justifyContent="center" alignItems="center" sx={{ mt: 8 }} >
      <Card
        sx={{
          p: 4,
          borderRadius: 3,
          boxShadow: 6,
          textAlign: 'center',
          maxWidth: 400,
        }}
      >
        <Typography variant="h5" fontWeight="bold" gutterBottom>
          You need to log in
        </Typography>
        <Typography variant="body1" sx={{ mb: 3, color: 'text.secondary' }}>
          Please sign in to access this feature.
        </Typography>
        <Button
          startIcon={<LoginIcon />}
          variant="contained"
          size="large"
          sx={{ borderRadius: 2, boxShadow: 2 }}
          onClick={() => navigate('/login')}
        >
          Login
        </Button>
      </Card>
    </Box >
  );
};

export default RequireLogin;