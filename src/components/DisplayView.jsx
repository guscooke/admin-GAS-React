import { Grid, Icon, Box } from '@mui/material';

const DisplayView = ({ title, value, color, icon }) => {
  return (
    <Grid item sx={{padding:'1%'}} xs={6} lg={8}>
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'row',
          justifyContent: 'center', // Align items from top to bottom
          alignItems: 'center', // Align items from right to left
          width: '100%',
          height:'70%',
          borderRadius: '2%',
          bgcolor: color,
          color: 'secondary.contrastText', // Change text color to contrastText
          padding: '16px',
          position: 'relative',
          boxShadow: '0px 0px 10px rgba(0, 0, 0, 0.2)', // Adding box shadow
          '&:hover': {
            bgcolor: 'primary.dark',
          },
        }}
      >
        <h2 style={{ marginTop:50 , fontSize: '3rem' }}>{value}</h2>
        <p style={{fontWeight: 'bold', color:'yellowgreen', margin: 0, fontSize: '1,2 rem' }}>{title}</p>
        <Box
          sx={{
            position: 'absolute',
            top: 0,
            left: 0,
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            width: '50px',
            height: '50px',
          }}
        >
          {icon}
          {/* <p style={{ margin: 5 }}>{percentage}%</p> */}
        </Box>
      </Box>
    </Grid>
  );
};

export default DisplayView;
