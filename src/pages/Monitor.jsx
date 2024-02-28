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
    const [percentageDifference, setPercentageDifference] = useState(null);
    const [topServices, setTopServices] = useState([]);
    const [topClients, setTopClients] = useState([]);
    const [topSpecialists, setTopSpecialists] = useState([]);


    const fetchSumOfValues = async () => {
        try {
            setIsLoading(true);
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

    const fetchSumOfPreviousMonth = async () =>
 {
        try {
            setIsLoading(true);
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

    const fetchTopServicesAndClients = async () => {
        try {
            setIsLoading(true);
            const response = await google.script.run.withFailureHandler((error) => {
                setError(error.message);
                setIsLoading(false);
            }).withSuccessHandler((response) => {
                setTopServices(response.topServices);
                setTopClients(response.topClients);
                setTopSpecialists(response.topSpecialists);
                setIsLoading(false);
            }).getTopServicesAndClients();

            console.log("Top services and clients:", response);
        } catch (error) {
            setError(error.message);
            setIsLoading(false);
            console.error("Error fetching top services and clients:", error.message);
        }
    };

    useEffect(() => {
        fetchSumOfValues();
        fetchSumOfPreviousMonth();
        fetchTopServicesAndClients();
    }, []);

    useEffect(() => {
        const months = ['Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho', 'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'];
        const currentMonth = new Date().getMonth();
        setCurrentMonthText(months[currentMonth]);
        const previousMonth = currentMonth === 0 ? 11 : currentMonth - 1;
        setPreviousMonth(months[previousMonth]);

        if (sumOfValues !== null && sumOfPreviousMonth !== null) {
            if (sumOfPreviousMonth !== 0) {
                const difference = sumOfValues - sumOfPreviousMonth;
                const percentageDifference = ((difference / sumOfPreviousMonth) * 100).toFixed(2);
                setPercentageDifference(percentageDifference + '%');
            } else {
                setPercentageDifference('N/A');
            }
        }
    }, [sumOfValues, sumOfPreviousMonth]);                       


    return (
        <div>
            {isLoading && <p>Loading...</p>}
            {sumOfValues !== null && (
                <Grid container spacing={2}>
                    <Grid item xs={12} lg={3}>
                        <DisplayView value={sumOfPreviousMonth} title={previousMonth} />
                    </Grid>
                    <Grid item xs={12} lg={3}>
                        <DisplayView value={sumOfValues} title={currentMonthText} />
                    </Grid>
                    <Grid item xs={12} lg={3}>
                         <DisplayView value={percentageDifference} title='Percentual' />

                        {/* <p>Percentage Difference: {percentageDifference}</p> */}
                    </Grid>
                    <Grid item xs={12} lg={3}>
                        <h3>Top 5 Services:</h3>
                        <ul>
                            {topServices.map((service, index) => (
                                <li key={index}>{service}</li>
                            ))}
                        </ul>
                        <h3>Top 5 Clients:</h3>
                        <ul>
                            {topClients.map((client, index) => (
                                <li key={index}>{client}</li>
                            ))}
                        </ul>
                        <h3>Top Specialists:</h3>
                        <ul>
                            {topSpecialists.map((specialist, index) => (
                                <li key={index}>{specialist}</li>
                            ))}
                        </ul>
                    </Grid>
                </Grid>
            )}
        </div>
    );
}



 
// TO BE DONE
// MES atual, falta somente inserir a (0,00) virgula;
//RETORNO NUMEROS VISUALIZAR
//ATUALIZAR - AUTOMATICO
// MUDAR AS CORES DAS BOLAS/ CARD

//DONE
//MES ANTERIOR
//TOP 5 SERVIÇOS
//TOP 5 CLIENTES
