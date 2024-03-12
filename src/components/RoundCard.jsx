import { Grid, Box, Typography, Divider } from '@mui/material';

const Roundcard = ({ title, value, color, icon }) => {
  return (
    <Grid item xs={12} sm={6} md={4} lg={8}>
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          width: '100%',
          height: '100%',
          borderRadius: '8px',
          bgcolor: color,
          color: 'white',
          padding: '20px',
          boxShadow: '0px 4px 8px rgba(0, 0, 0, 0.1)',
          transition: 'background-color 0.3s ease',
          '&:hover': {
            bgcolor: '#fdd835',
          },
        }}
      >
        <Box sx={{ fontSize: '2rem', fontWeight: 'bold' }}>
          {value}
        </Box>
        <Typography variant="subtitle1" sx={{ fontWeight: 'bold', color: '#000' }}>
          {title}
              </Typography>
         <Divider sx={{ width: '100%', backgroundColor: '#fff' }} />
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            width: '50px',
            height: '50px',
            borderRadius: '50%',
            bgcolor: 'rgba(255, 255, 255, 0.2)',
          }}
        >
          {icon}
        </Box>
      </Box>
    </Grid>
  );
};

export default Roundcard;