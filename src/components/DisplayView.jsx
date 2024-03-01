import { Grid, Icon, Box } from '@mui/material';
import CurrencyExchangeOutlinedIcon from '@mui/icons-material/CurrencyExchangeOutlined';

const DisplayView = ({ title, value, color }) => {
  return (
    <Grid item sx={{padding:'1%'}} xs={6} lg={8}>
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'row',
          justifyContent: 'center', // Align items from top to bottom
          alignItems: 'center', // Align items from right to left
          width: '100%',
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
        <p style={{ margin: 0, fontSize: '0.8rem' }}>{title}</p>
        <Box
          sx={{
            position: 'absolute',
            bottom: '0',
            left: '0',
            width: '100%',
            textAlign: 'right',
          }}
        >
          <CurrencyExchangeOutlinedIcon/>
          {/* <p style={{ margin: 5 }}>{percentage}%</p> */}
        </Box>
      </Box>
    </Grid>
  );
};

export default DisplayView;
