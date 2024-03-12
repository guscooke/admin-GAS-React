// TO BE DONE
//PRECISO CRIAR OUTRO COMPONENTE PARA RENDERIZAR OS SERVIÇO DO GOOGLE PARA O REACT
// BOTOES DELETAR E EDITAR NAO FUNCIONAM DE FATO
// CLIENTES NOVA A DATA ESTA DANDO ERRADA COM O ANO 1969

// DONE DONE DONE DONE BELLOW
//CRIAR MAIS 2 CAMPOS CLIENTE: NOVO RADIO BUTTON E
//PRESENTE, PROMOCIONAL, 10%, 5%,
//CAMPO OPÇÃO PAGAMENTO - DINHEIRO/CARTAO
//ATUALIZAR CONFORME APERTO O SUBMIT OU SEJA O MONITOR TD ATUALIZA
import React, { useState, useEffect } from 'react';
import Grid from '@mui/material/Grid';
// import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Autocomplete from '@mui/material/Autocomplete';
import Paper from '@mui/material/Paper';
import CircularProgress from '@mui/material/CircularProgress';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import Fab from '@mui/material/Fab';
// import NavigationIcon from '@mui/icons-material/Navigation';
import Stack from '@mui/material/Stack';
// import AdapterDateFns from '@mui/lab/AdapterDateFns';
// import LocalizationProvider from '@mui/lab/LocalizationProvider';
// import DatePicker from '@mui/lab/DatePicker';
// import { DatePicker } from '@mui/x-date-pickers'
import TextField from '@mui/material/TextField';


export default function Cadastro() {
    const initialFormData = {
        data: '',
        categorias: [],
        especialista: [],
        desconto: [],
        descricao: '',
        valor: '',
        nome: '',
        sobrenome: '',
        novo: false,
        pagamento: '',
    };

    const initialAdditionalFormData = {
        nome: '',
        sobrenome:'',
        telefone: '',
        email: '',
        dataNascimento: '',
    };

    const [formData, setFormData] = useState(initialFormData);
    const [additionalFormData, setAdditionalFormData] = useState(initialAdditionalFormData);
    const [dataList, setDataList] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [isNewClient, setIsNewClient] = useState(false);
    const [isUltimosCadastros, setUlitmosCadastros] = useState(false);

    useEffect(() => {
        const storedDataList = localStorage.getItem('dataList');
        if (storedDataList) {
            setDataList(JSON.parse(storedDataList));
        }
    }, []);

    const handleInputChange = (event) => {
        const { name, value } = event.target;
        setFormData(prevFormData => ({
            ...prevFormData,
            [name]: value,
        }));
    };

    const handleCategoriaChange = (event, newValue) => {
        const categoriasArray = newValue ? [...newValue] : [];
        setFormData({ ...formData, categorias: categoriasArray });
    };

    const handleSpecialistaChange = (event, newValue) => {
        const especialistaArray = newValue ? [...newValue] : [];
        setFormData({ ...formData, especialista: especialistaArray });
    };

    const handleDiscountChange = (event, newValue) => {
        const discountArray = newValue ? [...newValue] : [];
        setFormData({ ...formData, desconto: discountArray });
    };

        const handlePaymentChange = (event, newValue) => {
        setFormData({ ...formData, pagamento: newValue });
    };

    const handleAdditionalInputChange = (event) => {
        const { name, value } = event.target;
        setAdditionalFormData(prevData => ({
            ...prevData,
            [name]: value
        }));
    };
////helper///
  const handleClientSubmit = async () => {
    if (!isNewClient || isLoading) return;

    try {
        const clientData = {
            nome: additionalFormData.nome,
            sobrenome: additionalFormData.sobrenome,
            telefone: additionalFormData.telefone,
            email: additionalFormData.email,
            dataNascimento:formatDate(additionalFormData.dataNascimento)
        };

        const server = google.script.run.withSuccessHandler(() => {
            setSuccess("Your message was successfully sent to the 'cliente' spreadsheet!");
            setIsLoading(false);
            setIsNewClient(false);
            setAdditionalFormData(initialAdditionalFormData);
        }).withFailureHandler((error) => {
            setError(error.message);
            setIsLoading(false);
        });

        setIsLoading(true);
        await server.insertNewClient(clientData);
    } catch (error) {
        setError(error.message);
        setIsLoading(false);
    }
};


    const formatDate = (date) => {
        const [year, month, day] = date.split('-');
        return `${day}/${month}/${year}`;
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        if (isLoading) return;
        setIsLoading(true);
        setError('');
        setSuccess('');

        try {
            const server = google.script.run.withSuccessHandler(() => {
                setSuccess("Your message was successfully sent to the Google Sheet database!");
                setIsLoading(false);
                const newDataList = [...dataList, { ...formData }];
                setDataList(newDataList);
                localStorage.setItem('dataList', JSON.stringify(newDataList));
                setFormData(initialFormData);
            }).withFailureHandler((error) => {
                setError(error.message);
                setIsLoading(false);
            });
            await server.doInsertData(formData);
            // await server.insertNewClient({ nome: formData.nome, sobrenome: formData.sobrenome, ...additionalFormData });
        } catch (error) {
            setError(error.message);
            setIsLoading(false);
        }
    };

    const handleEdit = (index) => {
        setFormData(dataList[index]);
    };

    const handleDelete = async (index) => {
        const newDataList = [...dataList];
        newDataList.splice(index, 1);
        setDataList(newDataList);
        localStorage.setItem('dataList', JSON.stringify(newDataList));

        try {
            await google.script.run.doDeleteData(dataList[index]);
            console.log("Row deleted successfully from Google Sheets.");
        } catch (error) {
            console.error("Error deleting row from Google Sheets:", error);
        }
    };

    const categories = [
        'Design de Sobrancelhas',
        'Cílios Fio a Fio',
        'Cílios Híbrido',
        'Cílios Volume Brasileiro',
        'Micro Labial',
        'Micro Sobrancelha',
        'Microagulhamento',
        'Manutenção Extensão',
        'Retoque Micro',
        'Delíneado',
        'Hidragloss',
        'Hidraface',
        'Combo Hidraface',
        'Combo Hidragloss'
    ];

    const specialists = [
        'Tatiana',
        'Luiza',
        'Thais'
    ];

    const discount = [
        'N/A',
        'Presente',
        'promocional',
        'pacote',
        '5%',
        '10%',
        '15%',
        '20%',
        '30%',
        '50%'
    ];

    const payment = [
        'cartão',
        'Dinheiro'
    ];

    return (
        <Grid container justifyContent="center" spacing={2}>
         
            <Grid item xs={12} sm={6}>
                <Paper elevation={3} style={{ padding: '20px', marginBottom: '20px', backgroundColor: '#f0f0f0' }}>
                    <form className="form" onSubmit={handleSubmit}>

                        <Grid container spacing={2}>
                            <Grid item xs={12}>
                                 <TextField
                                    name="data"
                                    label=""
                                    type="date"
                                    variant="outlined"
                                    value={formData.data}
                                    onChange={handleInputChange}
                                    fullWidth
                                    margin="normal"
                                />
                                    {/* <DatePicker
        label="Data"
        value={formData.data}
        onChange={handleInputChange}
        renderInput={(params) => <TextField {...params} />}
        inputFormat="dd/MM/yyyy"
      /> */}
                            </Grid>
                        </Grid>
                        <Grid container spacing={2}>
                            <Grid item xs={6}>
                                <TextField
                                    name="nome"
                                    label="Nome"
                                    variant="outlined"
                                    value={formData.nome}
                                    onChange={handleInputChange}
                                    fullWidth
                                    margin="normal"
                                    required
                                />
                            </Grid>
                            <Grid item xs={6}>
                                <TextField
                                    name="sobrenome"
                                    label="Sobrenome"
                                    variant="outlined"
                                    value={formData.sobrenome}
                                    onChange={handleInputChange}
                                    fullWidth
                                    margin="normal"
                                    required
                                />
                            </Grid>
                        </Grid>
                        <Grid container spacing={2}>
                            <Grid item xs={6}>
                                <Autocomplete
                                    multiple
                                    options={specialists}
                                    renderInput={(params) => <TextField name="especialista" {...params} label="Especialistas" variant="outlined" />}
                                    value={formData.especialista || []}
                                    onChange={handleSpecialistaChange}
                                    isOptionEqualToValue={(option, value) => option === value}
                                    fullWidth
                                    margin="normal"
                                    required
                                />
                            </Grid>
                            <Grid item xs={6}>
                                <Autocomplete
                                    multiple
                                    options={categories}
                                    renderInput={(params) => <TextField name="categorias" {...params} label="Serviço" variant="outlined" />}
                                    value={formData.categorias || []}
                                    onChange={handleCategoriaChange}
                                    isOptionEqualToValue={(option, value) => option === value}
                                    fullWidth
                                    margin="normal"
                                    required
                                />
                            </Grid>
                        </Grid>
                  
                        <TextField
                            name="descricao"
                            label="Descrição"
                            multiline
                            rows={2}
                            variant="outlined"
                            value={formData.descricao}
                            onChange={handleInputChange}
                            fullWidth
                            margin="normal"
                        />
                        <TextField
                            name="valor"
                            label="Valor"
                            variant="outlined"
                            fullWidth
                            margin="normal"
                            value={formData.valor}
                            onChange={handleInputChange}
                            required
                        />
                        <Grid>
                            <Autocomplete
                                options={payment}
                                renderInput={(params) => <TextField name="pagamento" {...params} label="Método" variant="outlined" />}
                                value={formData.pagamento || []}
                                onChange={handlePaymentChange}
                                isOptionEqualToValue={(option, value) => option === value}
                                fullWidth
                                margin="normal"
                                required
                            />
                        </Grid>
                        <Grid>
                            <Autocomplete
                                multiple
                                options={discount}
                                renderInput={(params) => <TextField name="desconto" {...params} label="Desconto" variant="outlined" />}
                                value={formData.desconto || []}
                                onChange={handleDiscountChange}
                                isOptionEqualToValue={(option, value) => option === value}
                                fullWidth
                                margin="normal"
                                required
                            />
                        </Grid>
                        <Grid container justifyContent="center">
                            <Button type="submit" variant="contained" color="primary">
                                {isLoading ? <CircularProgress size={24} color="inherit" /> : "Enviar"}
                            </Button>
                        </Grid>
                    </form>
                </Paper>
            </Grid>
            <Grid item xs={12} sm={6}>
                {/* BTN FOR OPEN FORM AND CADASTRADOS DIALOG */}
            <Stack direction="row" justifyItems={'center'} spacing={1}>
                    <Fab
                        variant="extended" size="medium" color="primary"
                        onClick={() => setIsNewClient(prevState => !prevState)}
                    >
                        Cliente Nova
                        </Fab>
                    <Fab
                        variant="extended" size="medium" color="primary"
                    onClick={() => setUlitmosCadastros(prevState => !prevState)}
                    >
                        Cadastradas
                        </Fab>
                    
                    </Stack>
            </Grid>
          {/* CLIENTE NOVO DIALOG */}
            <Dialog open={isNewClient} onClose={() => setIsNewClient(false)}>
                <DialogTitle>Novo Cliente</DialogTitle>
                <DialogContent>
                     <Grid container spacing={2}>
                            <Grid item xs={6}>
                                <TextField
                                    name="nome"
                                    label="Nome"
                                    variant="outlined"
                                    value={additionalFormData.nome}
                                    onChange={handleAdditionalInputChange}
                                    fullWidth
                                    margin="normal"
                                    required
                                />
                            </Grid>
                            <Grid item xs={6}>
                                <TextField
                                    name="sobrenome"
                                    label="Sobrenome"
                                    variant="outlined"
                                    value={additionalFormData.sobrenome}
                                    onChange={handleAdditionalInputChange}
                                    fullWidth
                                    margin="normal"
                                    required
                                />
                            </Grid>
                        </Grid>
                    <TextField
                        name="telefone"
                        label="Telefone"
                        variant="outlined"
                        value={additionalFormData.telefone}
                        onChange={handleAdditionalInputChange}
                        fullWidth
                        margin="normal"
                    />
                    <TextField
                        name="email"
                        label="Email"
                        variant="outlined"
                        value={additionalFormData.email}
                        onChange={handleAdditionalInputChange}
                        fullWidth
                        margin="normal"
                    />
                    <TextField
                        name="dataNascimento"
                        label=""
                        type="date"
                        variant="outlined"
                        value={additionalFormData.dataNascimento}
                        onChange={handleAdditionalInputChange}
                        fullWidth
                        margin="normal"
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setIsNewClient(false)}>Cancelar</Button>
                    <Button onClick={handleClientSubmit} color="primary">
                        {isLoading ? <CircularProgress size={24} color="inherit" /> : "Enviar"}
                    </Button>
                </DialogActions>
            </Dialog>
            {/* ////////////////////////ultimos cadastros- DIALOG////////////////////////////// */}

            <Dialog
                fullScreen
                open={isUltimosCadastros}
                onClose={() => setUlitmosCadastros(false)}>
                    <Paper elevation={3} style={{ padding: '20px', backgroundColor: '#f0f0f0' }}>
                        <div style={{ textAlign: 'center', overflowX: 'auto' }}>
                            <p>Últimos Cadastros</p>
                            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 'small' }}>
                                <thead>
                                    <tr>
                                        <th>Data</th>
                                        <th>Nome</th>
                                        <th>Sobrenome</th>
                                        <th>Nova</th>
                                        <th>Serviço</th>
                                        <th>Profissional</th>
                                        <th>Valor</th>
                                        <th>Pagamento</th>
                                        <th>Desconto</th>
                                        <th>Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {dataList.slice(-5).map((data, index) => (
                                        <tr key={index} style={{ borderBottom: '1px solid #ddd' }}>
                                            <td>{formatDate(data.data)}</td>
                                            <td>{data.nome}</td>
                                            <td>{data.sobrenome}</td>
                                            <td>{data.novo ? 'Sim' : 'Não'}</td>
                                            <td>
                                                {data.categorias.map((categoria, index) => (
                                                    <span key={index} style={{ marginRight: '5px' }}>{categoria + ','}</span>
                                                ))}
                                            </td>
                                            <td>
                                                {data.especialista.map((especialista, index) => (
                                                    <span key={index} style={{ marginRight: '5px' }}>{especialista + ','}</span>
                                                ))}
                                            </td>
                                            <td>{data.valor}</td>
                                            <td>{data.pagamento}</td>
                                            <td>
                                                {data.desconto.map((desconto, index) => (
                                                    <span key={index} style={{ marginRight: '5px' }}>{desconto + ','}</span>
                                                ))}
                                            </td>
                                            <td>
                                                <Button onClick={() => handleEdit(index)}>Editar</Button>
                                                <Button onClick={() => handleDelete(index)}>Deletar</Button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                        </table>
                            <Button variant="outlined" onClick={() => setUlitmosCadastros(false)}>
                                fechar
                            </Button>
                        </div>
                    </Paper>
            </Dialog>
        </Grid>
    );
}

