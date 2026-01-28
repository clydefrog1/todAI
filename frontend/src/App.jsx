import { Container, Typography, Box, Paper } from '@mui/material';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';

function App() {
  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: 3,
        }}
      >
        <Typography
          variant="h2"
          component="h1"
          sx={{
            fontWeight: 700,
            background: 'linear-gradient(45deg, #2196F3 30%, #21CBF3 90%)',
            backgroundClip: 'text',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
          }}
        >
          todAI
        </Typography>
        <Typography variant="h6" color="text.secondary" textAlign="center">
          Your intelligent task management application
        </Typography>

        <Paper
          elevation={3}
          sx={{
            p: 4,
            mt: 4,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: 2,
            maxWidth: 500,
            width: '100%',
          }}
        >
          <CheckCircleOutlineIcon color="success" sx={{ fontSize: 60 }} />
          <Typography variant="h5" textAlign="center">
            Setup Complete!
          </Typography>
          <Typography variant="body1" color="text.secondary" textAlign="center">
            The todAI application is successfully configured. You can now start
            building task management features.
          </Typography>
          <Box
            component="ul"
            sx={{
              mt: 2,
              pl: 2,
              '& li': {
                mb: 1,
                color: 'text.secondary',
              },
            }}
          >
            <li>Backend running on port 5000</li>
            <li>Frontend running on port 5173</li>
            <li>RTK Query configured for API calls</li>
            <li>Material UI theme ready</li>
          </Box>
        </Paper>
      </Box>
    </Container>
  );
}

export default App;
