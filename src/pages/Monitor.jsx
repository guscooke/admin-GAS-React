import React, { useState, useEffect } from 'react';
import DisplayView from '../components/DisplayView';
import Grid from '@mui/material/Grid';


export default function Monitor() {
    const [sumOfValues, setSumOfValues] = useState(null);
    const [sumOfPreviousMonth, setSumOfPreviousMonth] = useState(null);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [currentMonthText, setCurrentMonthText] = useState('');
    const [previousMonth, setPreviousMonth] = useState('');


    const fetchSumOfValues = async () => {

    
        try {
            setIsLoading(true);

            // Chama a função do Google Apps Script para buscar o total dos valores
            const response = await google.script.run.withFailureHandler((error) => {
                setError(error.message);
                setIsLoading(false);
            }).withSuccessHandler((response) => {
                setSumOfValues(response);
                setSuccess("Total successfully fetched.");
                setIsLoading(false);
            }).getSumOfValues();

            console.log("Sum of values:", response);
        } catch (error) {
            setError(error.message);
            setIsLoading(false);
            console.error("Error fetching sum of values:", error.message);
        }
    };

      const fetchSumOfPreviousMonth = async () => {

    
        try {
            setIsLoading(true);

            // Chama a função do Google Apps Script para buscar o total dos valores
            const response = await google.script.run.withFailureHandler((error) => {
                setError(error.message);
                setIsLoading(false);
            }).withSuccessHandler((response) => {
                setSumOfPreviousMonth(response);
                setSuccess("Total successfully fetched.");
                setIsLoading(false);
            }).getSumOfPreviousMonth();

            console.log("Sum of values:", response);
        } catch (error) {
            setError(error.message);
            setIsLoading(false);
            console.error("Error fetching sum of values:", error.message);
        }
    };
    useEffect(() => {
        // Fetch sum of values when the component mounts
        fetchSumOfValues();
        fetchSumOfPreviousMonth();
    }, []);

    // const currentMonth = new Date().getMonth() + 1; // Get current month
    // console.log(currentMonth);
        useEffect(() => {
        // Set the current month text
        const months = ['Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho', 'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'];
        const currentMonth = new Date().getMonth();
            setCurrentMonthText(months[currentMonth]);
            const previousMonth = currentMonth === 0 ? 11 : currentMonth - 1; // Handle January (month index 0)
            setPreviousMonth(months[previousMonth]);

            
        
        // Log the current month for testing
        console.log("Current month:", months[currentMonth]);
    }, []);

    return (
        <div>
            {/* Display sum of values */}
            {isLoading && <p>Loading...</p>}
            {/* {error && <p>Error: {error}</p>}
            {success && <p>Success: {success}</p>} */}
            {sumOfValues !== null && (
                 <Grid container spacing={2}>
                    <Grid item xs={6} lg={3} sx={{ marginRight: '10px' }}> {/* Add margin to create space */}
                        <DisplayView value={sumOfPreviousMonth} title={previousMonth} />
                    </Grid>
                    <Grid item xs={6} lg={3} sx={{ marginRight: '10px' }}> {/* Add margin to create space */}
                        <DisplayView value={sumOfValues} title={currentMonthText} />
                    </Grid>
                    <Grid item xs={6} lg={3}>

                        {/* TOP 3 SERVICES */}
                    </Grid>
                    <Grid item xs={6} lg={3}>
                        {/* TOP 5 CLIENTES */}
                    </Grid>
                </Grid>
            )}
        </div>
    );
}
 
// TO BE DONE
// MES atual, falta somente inserir a (0,00) virgula;
//TOP 5 SERVIÇOS
//TOP 5 CLIENTES
//RETORNO NUMEROS VISUALIZAR
//ATUALIZAR
// MUDAR AS CORES DAS BOLAS

//DONE
//MES ANTERIOR
