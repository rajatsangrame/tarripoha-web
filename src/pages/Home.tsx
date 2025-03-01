import { Box, Typography } from '@mui/material';

export default function Home() {
  return (
    <Box
      sx={{
        py: 4,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        textAlign: 'center',
      }}
    >
      <Typography>Dashboard content for Home</Typography>
    </Box>
  );
}
