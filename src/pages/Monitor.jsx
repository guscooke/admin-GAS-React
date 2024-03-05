import React, { useState, useEffect } from 'react';
import Grid from '@mui/material/Grid';
import DisplayView from '../components/DisplayView';
import CardBMonitor from '../components/CardBMonitor'
import CurrencyExchangeOutlinedIcon from '@mui/icons-material/CurrencyExchangeOutlined';
import LoopOutlinedIcon from '@mui/icons-material/LoopOutlined';
import QueryStatsOutlinedIcon from '@mui/icons-material/QueryStatsOutlined';
import EmojiEventsOutlinedIcon from '@mui/icons-material/EmojiEventsOutlined';
import BirthdayCard from '../components/BirthdayCard';

export default function Monitor() {
    const [sumOfValues, setSumOfValues] = useState(null);
    const [birthdayData, setBirthdayData] = useState(''); // Estado para armazenar os dados de aniversário
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

    const fetchBirthdayData = async () => {
        try {
            setIsLoading(true);
            const response = await google.script.run.withFailureHandler((error) => {
                setError(error.message);
                setIsLoading(false);
            }).withSuccessHandler((response) => {
                setBirthdayData(response);
                setSuccess("Birthday data successfully fetched.");
                setIsLoading(false);
            }).checkUpcomingBirthdays();
        } catch (error) {
            setError(error.message);
            setIsLoading(false);
            console.error("Error fetching birthday data:", error.message);
        }
    };

    useEffect(() => {
        fetchSumOfValues();
        fetchSumOfPreviousMonth();
        fetchTopServicesAndClients();
        fetchBirthdayData();
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
                const percentageDifference = ((difference / sumOfPreviousMonth) * 10).toFixed(2);
                setPercentageDifference(percentageDifference + '%');
            } else {
                setPercentageDifference('N/A');
            }
        }
    }, [sumOfValues, sumOfPreviousMonth]);                       


    return (
        <div>
            {/* //por a esquerda// */}
            {/* <h3>Dashboard</h3> */}
      {isLoading && <p>Loading...</p>}
      {sumOfValues !== null && (
        <Grid container spacing={2} justifyContent={'center '} justifyItems={'center'}> {/* Adjust spacing between grid items */}
  {/* DisplayView cards */}
  <Grid item xs={6} sm={4} md={3} lg={3}> {/* Adjust grid item sizes */}
    <DisplayView value={sumOfPreviousMonth} title={previousMonth} color={'#0f333b'} icon={<CurrencyExchangeOutlinedIcon />} />
  </Grid>
  <Grid item xs={6} sm={4} md={3} lg={3}> {/* Adjust grid item sizes */}
    <DisplayView value={sumOfValues} title={currentMonthText} color={'#338493'} icon={<CurrencyExchangeOutlinedIcon />} />
  </Grid>
  <Grid item xs={6} sm={4} md={3} lg={3}> {/* Adjust grid item sizes */}
    <DisplayView elevation={3} value={percentageDifference} title='Comparação' color={'#0f333b'} icon={<QueryStatsOutlinedIcon />} />
  </Grid>
  <Grid item xs={6} sm={4} md={3} lg={3}> {/* Adjust grid item sizes */}
    <DisplayView elevation={3} value='43' title='Retorno' color={'#338496'} icon={<LoopOutlinedIcon />} />
  </Grid>
  <Grid item xs={6} sm={4} md={3} lg={3}> {/* Adjust grid item sizes */}
    <DisplayView elevation={3} value='12' title='XPTO' color={'#338496'} icon={''} />
  </Grid>
  {/* CardBMonitor cards */}
  <Grid item xs={6} sm={4} md={3} lg={3}> {/* Adjust grid item sizes */}
    <CardBMonitor values={topClients} title="Top Clientes" color={'#338496'} icon={<EmojiEventsOutlinedIcon />} />
  </Grid>
  <Grid item xs={6} sm={4} md={3} lg={3}> {/* Adjust grid item sizes */}
    <CardBMonitor values={topServices} title="Top Serviços" color={'#338496'} icon={<EmojiEventsOutlinedIcon />} />
                    </Grid>
                     <Grid item xs={12} lg={12}>
                        <BirthdayCard birthdayData={birthdayData} />
                    </Grid>
        </Grid>
      )}
    </div>
  );
};



 
// TO BE DONE
// MES atual, falta somente inserir a (0,00) virgula;
//LOGICA DO RETORNO DO SERVIÇO 12 dias cilios e 30 micro com alerta no cel - AQUI ABRIR UM POPOVER COM AS CLIENTES A RETORNAR
//DEVEM SER DUAS BOXES OU OUTRA SOLUÇÃO COMO UMA TABELA PEQUENA
//fazer um box onde podemos ver semana a semana o profissional e o serviço mais feito
// UMA OUTRA PAUTA Q É EM CIMA DO FINANCEIRO/LUIZA
//ANIVERSARIANTE DO MES
//PRECISAMOS SABER O GASTO DAS CLIENTES AQUI OU EM OUTRO LUGAR



