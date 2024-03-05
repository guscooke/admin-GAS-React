import React from 'react';
import { Grid, Box, Typography } from '@mui/material';

const BirthdayCard = ({ name, birthday }) => {
  return (
    <Grid item xs={6} lg={3}>
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          width: '100%',
          height: '100%',
          borderRadius: '2%',
          bgcolor: '#338496',
          color: '#fff',
          padding: '16px',
          boxShadow: '0px 0px 10px rgba(0, 0, 0, 0.2)',
        }}
      >
        <Typography variant="h5" gutterBottom>{name}</Typography>
        <Typography variant="body1">{birthday}</Typography>
      </Box>
    </Grid>
  );
};

export default BirthdayCard;
