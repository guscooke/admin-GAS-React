//function getCalendar here

import React, { useState, useEffect } from 'react';
import { CircularProgress, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, TextField } from '@mui/material';

const Agenda = () => {
  const [events, setEvents] = useState([]);
  const [filteredEvents, setFilteredEvents] = useState([]);
  const [filter, setFilter] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = () => {
    setIsLoading(true);
    try {
      // Assuming 'getCalendarEvents' is your Google Apps Script function
      google.script.run
        .withSuccessHandler((fetchedEvents) => {
          setEvents(fetchedEvents);
          setFilteredEvents(fetchedEvents); // Set filtered events as well
          setIsLoading(false);
        })
        .withFailureHandler((err) => {
          setError("Failed to fetch events. Please try again later.");
          setIsLoading(false);
        })
        .getCalendarEvents(); // Make sure this matches your Google Apps Script function name
    } catch (err) {
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
      event[1].toLowerCase().includes(value) || // Assuming event title is at index 1
      event[0].toLowerCase().includes(value)    // Assuming event date is at index 0
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
                <TableCell>Nome</TableCell>
                <TableCell>Inicio</TableCell>
                <TableCell>Termino</TableCell>
                {/* <TableCell>Description</TableCell> */}
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredEvents.map((row, index) => (
                <TableRow key={index}>
                  <TableCell>{row[0]}</TableCell>
                  <TableCell>{row[1]}</TableCell>
                  <TableCell>{row[2]}</TableCell>
                  <TableCell>{row[3]}</TableCell>
                  {/* <TableCell>{row[4]}</TableCell> */}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}
      {error && <p style={{ color: 'red' }}>{error}</p>}
    </div>
  );
};

export default Agenda;


//AGENDA VIEW
//DIVIDIDA ENTRE 3 AGENDAS (PROFISSIONAIS)