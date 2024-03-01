import React, { useState, useEffect } from 'react';
import { CircularProgress, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, TextField } from '@mui/material';

const CadastroView = () => {
  const [events, setEvents] = useState([]);
  const [filteredEvents, setFilteredEvents] = useState([]);
  const [filter, setFilter] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = () => {
    setIsLoading(true);
    try {
      google.script.run
        .withSuccessHandler((fetchedEventsJson) => {
          const fetchedEvents = JSON.parse(fetchedEventsJson);
          setEvents(fetchedEvents);
          setFilteredEvents(fetchedEvents); // Set filtered events as well
          setIsLoading(false);
        })
        .withFailureHandler((err) => {
          console.error("Failed to fetch events:", err);
          setError("Failed to fetch events. Please try again later.");
          setIsLoading(false);
        })
        .getCadastro(); // Call getCadastro function
    } catch (err) {
      console.error("An error occurred while fetching events:", err);
      setError("An error occurred while fetching events.");
      setIsLoading(false);
    }
  };

  const handleFilterChange = (e) => {
    const value = e.target.value.toLowerCase();
    setFilter(value);

    if (!value) {
      setFilteredEvents(events); // Reset filtered events if filter is empty
      return;
    }

    const filtered = events.filter(event =>
      event.nome.toLowerCase().includes(value) || // Assuming event name is the property to filter
      event.descricao.toLowerCase().includes(value) // Add more properties as needed for filtering
    );

    setFilteredEvents(filtered);
  };

  return (
    <div>
      <TextField
        id="search"
        label="Filter Events"
        variant="outlined"
        fullWidth
        margin="normal"
        onChange={handleFilterChange}
      />
      {isLoading ? (
        <CircularProgress />
      ) : (
        <TableContainer component={Paper}>
          <Table aria-label="simple table">
            <TableHead>
              <TableRow>
                <TableCell>Data</TableCell>
                <TableCell>Serviço</TableCell>
                <TableCell>Profissional</TableCell>
                <TableCell>Descrição</TableCell>
                <TableCell>Valor</TableCell>
                <TableCell>Desconto</TableCell>
                <TableCell>Nome</TableCell>
                <TableCell>Sobrenome</TableCell>
                <TableCell>Novo</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredEvents.map((event, index) => (
                <TableRow key={index}>
                  <TableCell>{event.data}</TableCell>
                  <TableCell>{event.servico}</TableCell>
                  <TableCell>{event.profissional}</TableCell>
                  <TableCell>{event.descricao}</TableCell>
                  <TableCell>{event.valor}</TableCell>
                  <TableCell>{event.desconto}</TableCell>
                  <TableCell>{event.nome}</TableCell>
                  <TableCell>{event.sobrenome}</TableCell>
                  <TableCell>{event.novo.toString()}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}
      {error && <div>Error: {error}</div>}
    </div>
  );
};

export default CadastroView;


//precisamos ter um tipo de filtro para o mes e mostrar 30/50 por pagina 
