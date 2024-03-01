import { Box, Divider } from '@mui/material';

const DisplayViewB = ({ title, values, color, icon }) => {
  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'flex-start', // Align items from top to bottom
        alignItems: 'flex-start', // Align items from right to left
        width: 180,
        borderRadius: '2%',
        bgcolor: color,
        color: '#fff', // Alterado para branco
        boxShadow: '0px 0px 10px rgba(0, 0, 0, 0.2)', // Adding box shadow
        padding: '20px',
        position: 'relative',
        '&:hover': {
          bgcolor: 'primary.dark',
        },
      }}
    >
      <h3>{title}</h3>
      <Divider sx={{ width: '100%', backgroundColor: '#fff' }} /> {/* Linha dividindo os parágrafos */}
      <ul>
        {values.map((value, index) => (
          <p key={index}>{value}</p>
        ))}
      </ul>
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
      </Box>
    </Box>
  );
};

export default DisplayViewB;
