import React, { useState, useEffect } from 'react';
import Grid from '@mui/material/Grid';
import DisplayView from '../components/DisplayView';
import CardBMonitor from '../components/CardBMonitor'
import CurrencyExchangeOutlinedIcon from '@mui/icons-material/CurrencyExchangeOutlined';
import LoopOutlinedIcon from '@mui/icons-material/LoopOutlined';
import QueryStatsOutlinedIcon from '@mui/icons-material/QueryStatsOutlined';
import EmojiEventsOutlinedIcon from '@mui/icons-material/EmojiEventsOutlined';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import AddCircleOutlineOutlinedIcon from '@mui/icons-material/AddCircleOutlineOutlined';
import BirthdayCard from '../components/BirthdayCard';
import Roundcard from '../components/RoundCard';
// import ReturnServicesCard from '../components/CardForServices'

export default function Monitor() {
    const [currentDateTime, setCurrentDateTime] = useState(new Date());
    const [sumOfValues, setSumOfValues] = useState({
        totalSum: 0,
        atendimentos: 0,
        sumByDay: 0
    });
    const [sumOfPreviousMonth, setSumOfPreviousMonth] = useState({
        sum: 0,
        atendimentos:0
    });
    const [birthdayData, setBirthdayData] = useState([]); // Estado para armazenar os dados de aniversário
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [currentMonthText, setCurrentMonthText] = useState('');
    const [previousMonth, setPreviousMonth] = useState('');
    // const [percentageDifference, setPercentageDifference] = useState(null);
    const [topServices, setTopServices] = useState([]);
    const [topClients, setTopClients] = useState([]);
    const [topSpecialists, setTopSpecialists] = useState([]);
    const [returnServicesInfo, setReturnServicesInfo] = useState({
    totalReturnServices: 0,
    returnServicesByType: {
        'Cílios': 0,
        'Micro': 0
    },
    returnAlerts: []
});

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
                console.log("Birthday data:", response); // Adicione esta linha para verificar os dados retornados
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

        const fetchTotalReturnServices = async () => {
            try {
                setIsLoading(true);
                const response = await google.script.run.withFailureHandler((error) => {
                    setError(error.message);
                    setIsLoading(false);
                }).withSuccessHandler((response) => {
                    console.log("total:", response); // Adicione esta linha para verificar os dados retornados
                    setReturnServicesInfo(prevState => ({
                        ...prevState,
                        totalReturnServices: response // Atualiza apenas o totalReturnServices
                    }));
                    setSuccess("Total data successfully fetched.");
                    setIsLoading(false);
                }).getTotalReturnServices();
            } catch (error) {
                setError(error.message);
                setIsLoading(false);
                console.error("Error fetching total return services:", error.message);
            }
        };


        const fetchReturnServicesByType = async () => {
            try {
                setIsLoading(true);
                const response = await google.script.run.withFailureHandler((error) => {
                    setError(error.message);
                    setIsLoading(false);
                }).withSuccessHandler((response) => {
                    console.log("Service Total por tipo:", response); // Verify the returned data
                    setReturnServicesInfo(prevState => ({
                        ...prevState,
                        returnServicesByType: response // Update returnServicesByType
                    }));
                    setSuccess("Return services by type fetched successfully.");
                    setIsLoading(false);
                }).getReturnServicesByType();
            } catch (error) {
                setError(error.message);
                setIsLoading(false);
                console.error("Error fetching return services by type:", error.message);
            }
        };

        const fetchReturnAlerts = async () => {
            try {
                setIsLoading(true);
                const response = await google.script.run.withFailureHandler((error) => {
                    setError(error.message);
                    setIsLoading(false);
                }).withSuccessHandler((response) => {
                    console.log("Return alerts:", response); // Verify the returned data
                    if (response && Array.isArray(response)) { // Check if response is an array
                        setReturnServicesInfo(prevState => ({
                            ...prevState,
                            returnAlerts: response // Update returnAlerts with the array of objects
                        }));
                        setSuccess("Return alerts fetched successfully.");
                    } else {
                        setError("Returned data is invalid.");
                    }
                    setIsLoading(false);
                }).getReturnAlerts();
            } catch (error) {
                setError(error.message);
                setIsLoading(false);
                console.error("Error fetching return alerts:", error.message);
            }
        };

        useEffect(() => {
        const interval = setInterval(() => {
        setCurrentDateTime(new Date());
        }, 1000); // Update every second

        // Cleanup function to clear interval when component unmounts
        return () => clearInterval(interval);
    }, []);

    // Format the date and time
    const options = { day: '2-digit', month: '2-digit', year: 'numeric' };
    const formattedDateTime = currentDateTime.toLocaleString('pt-BR',options);
        // Format the date

    useEffect(() => {
    const fetchData = async () => {
        try {
            setIsLoading(true);
            await fetchSumOfValues();
            await fetchSumOfPreviousMonth();
            await fetchTopServicesAndClients();
            await fetchBirthdayData();
            await fetchTotalReturnServices();
            await fetchReturnServicesByType();
            await fetchReturnAlerts();


            setIsLoading(false);
        } catch (error) {
            setError(error.message);
            setIsLoading(false);
            console.error("Error fetching data:", error.message);
        }
    };

    fetchData();
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
                const percentageDifference = ((difference / sumOfPreviousMonth) * 10).toFixed(1);
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
      {sumOfValues !== null (
 <Grid container spacing={2} justifyContent={'center '} justifyItems={'center'}> {/* Adjust spacing between grid items */}
                    {/* DisplayView cards */}
                    {/* <p>Current Date and Time: {formattedDateTime}</p> */}
  <Grid item xs={6} sm={4} md={3} lg={3}> {/* Adjust grid item sizes */}
    <Roundcard value={formattedDateTime} title={''} color={'#338493'} icon={<CalendarMonthIcon />} />
  </Grid>
  <Grid item xs={6} sm={4} md={3} lg={3}> {/* Adjust grid item sizes */}
    <DisplayView value={sumOfPreviousMonth.sum} title={previousMonth} color={'#0f333b'} icon={<CurrencyExchangeOutlinedIcon />} />
  </Grid>
  <Grid item xs={6} sm={4} md={3} lg={3}> {/* Adjust grid item sizes */}
    <DisplayView value={sumOfValues.totalSum} title={currentMonthText} color={'#338493'} icon={<CurrencyExchangeOutlinedIcon />} />
  </Grid>
  <Grid item xs={6} sm={4} md={3} lg={3}> {/* Adjust grid item sizes */}
    <DisplayView elevation={3} value={sumOfPreviousMonth.atendimentos} title='vendas Mês Passado' color={'#0f333b'} icon={<QueryStatsOutlinedIcon />} />
</Grid>
 <Grid item xs={6} sm={4} md={3} lg={3}> {/* Adjust grid item sizes */}
    <DisplayView elevation={3} value={sumOfValues.atendimentos} title='Vendas Total' color={'#338496'} icon={<QueryStatsOutlinedIcon />} />
  </Grid>
  <Grid item xs={6} sm={4} md={3} lg={3}> {/* Adjust grid item sizes */}
    <DisplayView elevation={3} value={returnServicesInfo.totalReturnServices} title='Retorno Total' color={'#338496'} icon={<LoopOutlinedIcon />} />
  </Grid>
<Grid item xs={6} sm={4} md={3} lg={3}>
    <DisplayView elevation={3} value={returnServicesInfo.returnServicesByType['Micro']} title='Retorno Micro' color={'#338496'} icon={<LoopOutlinedIcon />} />
</Grid>
<Grid item xs={6} sm={4} md={3} lg={3}>
    <DisplayView elevation={3} value={returnServicesInfo.returnServicesByType['Cílios']} title='Retorno Cílios' color={'#338496'} icon={<LoopOutlinedIcon />} />
</Grid>

  {/* CardBMonitor cards */}
  <Grid item xs={6} sm={4} md={3} lg={3}> {/* Adjust grid item sizes */}
    <CardBMonitor values={topClients} title="Top Clientes" color={'#338496'} icon={<EmojiEventsOutlinedIcon />} />
  </Grid>
  <Grid item xs={6} sm={4} md={3} lg={3}> {/* Adjust grid item sizes */}
    <CardBMonitor values={topServices} title="Top Serviços" color={'#338496'} icon={<EmojiEventsOutlinedIcon />} />
  </Grid>
    <Grid item xs={6} sm={4} md={3} lg={3}>
    <BirthdayCard values={birthdayData} />
    </Grid>
 {/* <Grid container spacing={3}>
     <ReturnServicesCard values={returnServicesInfo.returnAlerts}/>
    </Grid> */}
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
//PRECISAMOS SABER O GASTO DAS CLIENTES AQUI OU EM OUTRO LUGAR
//O ANIVERSÁRIO ALERTA


