import React, { useState } from 'react';
import { Select, MenuItem, Grid } from '@mui/material';

function Navbar({ setCurrentPage }) {
  const [currentPageValue, setCurrentPageValue] = useState('');

  const handleChange = (event) => {
    setCurrentPageValue(event.target.value);
    setCurrentPage(event.target.value); // Se você precisar usar setCurrentPage, faça isso aqui
  };

  return (
    <Grid container spacing={2} alignItems="center" justifyContent="flex-start">
      <Grid item>
        <Select
          value={currentPageValue}
          onChange={handleChange}
          variant="outlined"
          displayEmpty
          inputProps={{ 'aria-label': 'select current page' }}
        >
          <MenuItem value="" disabled>
            Select Page
          </MenuItem>
          <MenuItem value="monitor">Dashboard</MenuItem>
          <MenuItem value="cadastro">Cadastrar-serviço</MenuItem>
          {/* <MenuItem value="cadastro">Cadastrar-cliente</MenuItem> */}
          <MenuItem value="agenda">ver-Agenda</MenuItem>
          <MenuItem value="cadastroview">Ver-Serviços</MenuItem>
        </Select>
      </Grid>
    </Grid>
  );
}

export default Navbar;






