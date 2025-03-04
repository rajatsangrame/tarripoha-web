import React from 'react';
import { Alert, AlertTitle, Snackbar } from '@mui/material';
import { useSnackbarStore } from '../store/snackbarStore';

const GlobalSnackbar: React.FC = () => {
  const { open, message, severity, hideSnackbar } = useSnackbarStore();

  return (
    <Snackbar
      open={open}
      autoHideDuration={2000}
      onClose={hideSnackbar}
      anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
    >
      <Alert onClose={hideSnackbar} severity={severity} sx={{ width: '100%' }}>
        <AlertTitle>{severity.charAt(0).toUpperCase() + severity.slice(1)}</AlertTitle>
        {message}
      </Alert>
    </Snackbar>
  );
};

export default GlobalSnackbar;
