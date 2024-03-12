import React from 'react';
import { Divider, Box, Typography } from '@mui/material';

const BirthdayCard = ({values}) => {
  return (
      <Box
          sx={{
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'flex-start',
        alignItems: 'center',
        width: 200,
        borderRadius: '1%',
        bgcolor: '#0f333b',
        color: '#fff',
        boxShadow: '0px 0px 10px rgba(0, 0, 0, 0.5)',
        padding: '20px',
        '&:hover': {
          bgcolor: 'primary.dark',
        },
      }}
      >
      <Typography variant="h5" gutterBottom>Aniversariantes</Typography>
            <Divider sx={{ width: '100%', backgroundColor: '#fff' }} />
        {values.map((value, index) => (
          <Typography key={value.name} variant="body1">{value.name} - {value.formattedBirthday}</Typography>
        ))}
      </Box>
  );
};

export default BirthdayCard;

// import { Box, Divider, Typography, List, ListItem, ListItemText } from '@mui/material';

// const BirthdayCard = ({ title, values, color, icon }) => {
//   return (
//     <Box
//       sx={{
//         display: 'flex',
//         flexDirection: 'column',
//         justifyContent: 'flex-start',
//         alignItems: 'center',
//         width: 200,
//         borderRadius: '1%',
//         bgcolor: color,
//         color: '#fff',
//         boxShadow: '0px 0px 10px rgba(0, 0, 0, 0.5)',
//         padding: '20px',
//         '&:hover': {
//           bgcolor: 'primary.dark',
//         },
//       }}
//     >
//       <Typography variant="h5">{title}</Typography>
//       <Divider sx={{ width: '100%', backgroundColor: '#fff' }} />
//       <List>
//         {values.map((value, index) => (
//           <ListItem key={index}>
//             <ListItemText primary={value.name}  secondaryTypographyProps={value.formattedBirthday}/>
//           </ListItem>
//         ))}
//       </List>
//       {icon && (
//         <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', mt: 2 }}>
//           {icon}
//         </Box>
//       )}
//     </Box>
//   );
// };

// export default BirthdayCard;

