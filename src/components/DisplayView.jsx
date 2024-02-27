import React from 'react';
import {Box} from '@mui/material';


const DisplayView = ({ title, value }) => {
    return (
        <Box
            sx={{
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                alignItems: 'center',
                width: 150,
                height: 150,
                borderRadius: '20%',
                bgcolor: 'primary.main',
                color: 'primary.contrastText', // Change text color to contrastText
                '&:hover': {
                    bgcolor: 'primary.dark',
                },
            }}
        >
            <h2>{title}</h2>
            <h1 style={{ margin: 0 }}>R$ {value}</h1> {/* Added inline style to remove default margin */}
        </Box>

    );
};

export default DisplayView;

// preciso melhorar a cor , talvez o formato e tb passar a cor de acordo com o mes
//já que é um componente só.