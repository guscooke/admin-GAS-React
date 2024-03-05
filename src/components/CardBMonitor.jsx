import { Box, Divider, Typography, List, ListItem, ListItemText } from '@mui/material';

const CardBMonitor = ({ title, values, color, icon }) => {
  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'flex-start',
        alignItems: 'center',
        width: 200,
        borderRadius: '1%',
        bgcolor: color,
        color: '#fff',
        boxShadow: '0px 0px 10px rgba(0, 0, 0, 0.5)',
        padding: '20px',
        '&:hover': {
          bgcolor: 'primary.dark',
        },
      }}
    >
      <Typography variant="h5">{title}</Typography>
      <Divider sx={{ width: '100%', backgroundColor: '#fff' }} />
      <List>
        {values.map((value, index) => (
          <ListItem key={index}>
            <ListItemText primary={value} />
          </ListItem>
        ))}
      </List>
      {icon && (
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', mt: 2 }}>
          {icon}
        </Box>
      )}
    </Box>
  );
};

export default CardBMonitor;

