// import { Box, IconButton } from '@mui/material';
// import NavigateBeforeIcon from '@mui/icons-material/NavigateBefore';
// import NavigateNextIcon from '@mui/icons-material/NavigateNext';

// const DisplayChange = ({ title, value, color, onPrevMonth, onNextMonth }) => {
//   return (
//     <Box
//       sx={{
//         display: 'flex',
//         flexDirection: 'column',
//         justifyContent: 'flex-start', // Align items from top to bottom
//         alignItems: 'flex-start', // Align items from right to left
//         width: 180,
//         height: 70,
//         borderRadius: '1%',
//         bgcolor: color,
//         boxShadow: '0px 0px 10px rgba(0, 0, 0, 0.2)', // Adding box shadow
//         color: 'primary.contrastText', // Change text color to contrastText
//         padding: '16px',
//         position: 'relative',
//         '&:hover': {
//           bgcolor: 'primary.dark',
//         },
//       }}
//     >
//       <h1 style={{ margin: 0, fontSize: '2rem' }}>{value}</h1>
//       <p style={{ marginTop: 5, fontSize: '1rem' }}>{title}</p>
//       <Box
//         sx={{
//           position: 'absolute',
//           bottom: '0',
//           left: '0',
//           width: '100%',
//           display: 'flex',
//           justifyContent: 'space-between',
//           alignItems: 'center',
//         }}
//       >
//         <IconButton onClick={onPrevMonth}>
//           <NavigateBeforeIcon />
//         </IconButton>
//         <IconButton onClick={onNextMonth}>
//           <NavigateNextIcon />
//         </IconButton>
//       </Box>
//     </Box>
//   );
// };

// export default DisplayChange;
