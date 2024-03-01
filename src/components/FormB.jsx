
import { Box, Icon } from '@mui/material';

const DisplayView = ({ title, values, color }) => {
  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'flex-start', // Align items from top to bottom
        alignItems: 'flex-start', // Align items from right to left
        width: 180,
        borderRadius: '5%',
        bgcolor: 'yellowgreen',
        color: color,
        padding: '16px',
        position: 'relative',
        '&:hover': {
          bgcolor: 'primary.dark',
        },
      }}
    >
      <h3>{title}</h3>
      <ul>
        {values.map((value, index) => (
          <li key={index}>{value}</li>
        ))}
      </ul>
      <Box
        sx={{
          position: 'absolute',
          bottom: '0',
          left: '0',
          width: '100%',
          textAlign: 'right',
        }}
      >
        <Icon></Icon>
      </Box>
    </Box>
  );
};

export default DisplayView;