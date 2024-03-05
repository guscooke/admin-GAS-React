import React, { useState, useEffect } from 'react';
import { CircularProgress, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, TextField, Button } from '@mui/material';

const CadastroView = () => {
  const [events, setEvents] = useState([]);
  const [filteredEvents, setFilteredEvents] = useState([]);
  const [filter, setFilter] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const eventsPerPage = 15;
  const [selectedMonth, setSelectedMonth] = useState(null);

  useEffect(() => {
    fetchEvents();
  }, []);

  useEffect(() => {
    applyFiltersAndPagination();
  }, [events, currentPage, selectedMonth, filter]);

  const fetchEvents = () => {
    setIsLoading(true);
    try {
      google.script.run
        .withSuccessHandler((fetchedEventsJson) => {
          const fetchedEvents = JSON.parse(fetchedEventsJson);
          setEvents(fetchedEvents);
          setIsLoading(false);
        })
        .withFailureHandler((err) => {
          console.error("Failed to fetch events:", err);
          setError("Failed to fetch events. Please try again later.");
          setIsLoading(false);
        })
        .getCadastro();
    } catch (err) {
      console.error("An error occurred while fetching events:", err);
      setError("An error occurred while fetching events.");
      setIsLoading(false);
    }
  };

  const applyFiltersAndPagination = () => {
    let filtered = [...events];

    if (selectedMonth !== null) {
      filtered = filtered.filter(event => {
        const eventDate = new Date(event.data);
        return eventDate.getMonth() === selectedMonth;
      });
    }

    if (filter.trim() !== '') {
      const filterLowerCase = filter.toLowerCase();
      filtered = filtered.filter(event =>
        event.nome.toLowerCase().includes(filterLowerCase) ||
          event.descricao.toLowerCase().includes(filterLowerCase) ||
          event.profissional.toLowerCase().includes(filterLowerCase) ||
           event.servico.toLowerCase().includes(filterLowerCase)
      );
    }

    filtered.sort((a, b) => new Date(b.data) - new Date(a.data));

    const indexOfLastEvent = currentPage * eventsPerPage;
    const indexOfFirstEvent = indexOfLastEvent - eventsPerPage;
    const currentEvents = filtered.slice(indexOfFirstEvent, indexOfLastEvent);

    setFilteredEvents(currentEvents);
  };

  const handleFilterChange = (e) => {
    const { value } = e.target;
    setFilter(value);
    setCurrentPage(1);
  };

  const handleMonthChange = (month) => {
    setSelectedMonth(month);
    setCurrentPage(1);
  };

  return (
    <div>
      <TextField
        id="search"
        label="Filter Events"
        variant="outlined"
        fullWidth
        margin="normal"
        value={filter}
        onChange={handleFilterChange}
      />
      <Button onClick={() => handleMonthChange(0)}>Back</Button>
      <Button onClick={() => handleMonthChange(1)}>FWD </Button>

      {isLoading ? (
        <CircularProgress />
      ) : (
        <>
          <TableContainer component={Paper}>
            <Table aria-label="simple table">
              <TableHead>
                <TableRow>
                  <TableCell>Data</TableCell>
                  <TableCell>Nome</TableCell>
                  <TableCell>Sobrenome</TableCell>
                  <TableCell>Novo</TableCell>
                  <TableCell>Serviço</TableCell>
                  <TableCell>Profissional</TableCell>
                  <TableCell>Descrição</TableCell>
                  <TableCell>Valor</TableCell>
                  <TableCell>Pagamento</TableCell>
                  <TableCell>Desconto</TableCell>
                  
                </TableRow>
              </TableHead>
              <TableBody>
                {filteredEvents.map((event, index) => (
                  <TableRow key={index}>
                    <TableCell>{new Date(event.data).toLocaleDateString('pt-BR')}</TableCell>
                    <TableCell>{event.nome}</TableCell>
                    <TableCell>{event.sobrenome}</TableCell>
                    <TableCell>{event.novo.toString()}</TableCell>
                    <TableCell>{event.servico}</TableCell>
                    <TableCell>{event.profissional}</TableCell>
                    <TableCell>{event.descricao}</TableCell>
                    <TableCell>{event.valor}</TableCell>
                    <TableCell>{event.pagamento}</TableCell>
                    <TableCell>{event.desconto}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </>
      )}
      {error && <div>Error: {error}</div>}
    </div>
  );
};

export default CadastroView;

// O PROBELMA AQUI ESTA NA PAGINAÇÃO E NOS BOTOES O MES Q ELE VOLTA É JAN E FEV

