import React, { useState } from 'react';
import Grid from '@mui/material/Grid';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Autocomplete from '@mui/material/Autocomplete';
import Paper from '@mui/material/Paper';
import FormControlLabel from '@mui/material/FormControlLabel';
// import Monitor from './Monitor';
import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';

export default function Cadastro() {
    const initialFormData = {
        data: '',
        categorias: [],
        especialista: [],
        desconto:[],
        descricao: '',
        valor: '', // No initial value
        nome: '',
        sobrenome: '',
        novo: false
    };

    const [formData, setFormData] = useState(initialFormData);
    const [dataList, setDataList] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState();
    const [success, setSuccess] = useState();

    const handleInputChange = (event) => {
        const { name, value } = event.target;
        setFormData(prevFormData => ({
            ...prevFormData,
            [name]: value, // Update the corresponding field in the form data
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
    
    const handleRadioChange = (event) => {
        setFormData({
            ...formData,
            novo: event.target.value === 'true' // Convert string to boolean
        });
    };

    const handleSubmit = (event) => {
        event.preventDefault();
        if (isLoading) return;
        setIsLoading(true);
        setError();
        setSuccess();
        setDataList([...dataList, { ...formData }]);
        setFormData(initialFormData);      
            try {
            // Call Google Apps Script function to insert data
            const server = google.script.run.withFailureHandler((error) => {
                setError(error.message);
                setIsLoading(false);
                updateData();
            });
            const call = server.withSuccessHandler(() => {
                setSuccess("Your message was successfully sent to the Google Sheet database!");
                setIsLoading(false);
            });
                call.doInsertData(formData);
                // call.getSumOfValues();
        } catch (error) {
            setError(error.message);
            setIsLoading(false);
        }        
    }
    

    const handleEdit = (index) => {
        setFormData(dataList[index]); // Set the form data to edit
    };

    const handleDelete = async (index) => {
        const newDataList = [...dataList];
        newDataList.splice(index, 1);
        setDataList(newDataList);

        try {
            await google.script.run.doDeleteData(dataList[index]);
            console.log("Row deleted successfully from Google Sheets.");
        } catch (error) {
            console.error("Error deleting row from Google Sheets:", error);
        }
    };

    const categories = [
        'Design',
        'Fio a Fio',
        'Híbrido',
        'Volume Brasileiro',
        'Micro Labial',
        'Micro Sobrancelha',
        'Microagulhamento'
    ];

    const specialists = [
        'Tatiana',
        'Luiza',
        'Thais'
    ];

    const discount = [
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
                                    renderInput={(params) => <TextField name="categorias" {...params} label="Serviço" variant="outlined"  />}
                                    value={formData.categorias || []}
                                    onChange={handleCategoriaChange}
                                    isOptionEqualToValue={(option, value) => option === value}
                                    fullWidth
                                    margin="normal"
                                    required // Make categorias required
                                />
                            </Grid>
                        </Grid>
                         <Grid container spacing={2}>
                       
                            <Grid item xs={6}>
                                 <RadioGroup
                                    aria-label="novo"
                                    name="novo"
                                    value={formData.novo.toString()} // Convert boolean to string
                                    onChange={handleRadioChange}
                                >
                                    <FormControlLabel value="true" control={<Radio />} label="Cliente Nova" />
                                    {/* <FormControlLabel value="false" control={<Radio />} label="Não Novo" /> */}
                                </RadioGroup>
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
                            required // Make valor required
                        />
                             {/* <Grid item xs={6}> */}
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
                            {/* </Grid> */}
                        <Button type="submit" variant="contained" color="primary">
                            Enviar
                        </Button>
                    </form>
                </Paper>
            </Grid>
           
             <Grid item xs={12} sm={6}>
                <Paper elevation={3} style={{ padding: '20px', backgroundColor: '#f0f0f0' }}>
                    <div style={{ textAlign: 'center', overflowX: 'auto' }}>
                        <p>Últimos Cadastros</p>
                        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 'small' }}>
                            <thead>
                                <tr>
                                    <th>Data</th>
                                    <th>Serviço</th>
                                    <th>Profissional</th>
                                    <th>Descrição</th>
                                    <th>Valor</th>
                                    <th>Desconto</th>
                                    <th>Nome</th>
                                    <th>Sobrenome</th>
                                    <th>Novo</th>
                                  
                                    <th>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {dataList.slice(-5).map((data, index) => (
                                    <tr key={index} style={{ borderBottom: '1px solid #ddd' }}>
                                        <td>{data.data}</td>
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
                                        <td>{data.descricao}</td>
                                        <td>{data.valor}</td>
                                            <td>
                                            {data.desconto.map((desconto, index) => (
                                                <span key={index} style={{ marginRight: '5px' }}>{desconto + ','}</span>
                                            ))}
                                        </td>
                                        <td>{data.nome}</td>
                                        <td>{data.sobrenome}</td>
                                        <td>{data.novo}</td>
                                     
                                        
                                        <td>
                                            <Button onClick={() => handleEdit(index)}>Editar</Button>
                                            <Button onClick={() => handleDelete(index)}>Deletar</Button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </Paper>
            </Grid>
        </Grid>
    );
}

// TO BE DONE
//ATUALIZAR CONFORME APERTO O SUBMIT OU SEJA O MONITOR TD ATUALIZA
// SEPARAR O STYLE EM LINHA VER SE JOGO EM OUTRO LUGAR
//PRECISO CRIAR OUTRO COMPONENTE PARA RENDERIZAR OS SERVIÇO DO GOOGLE PARA O REACT
// BOTOES DELETAR E EDITAR NAO FUNCIONAM DE FATO

// DONE DONE DONE DONE BELLOW
//CRIAR MAIS 2 CAMPOS CLIENTE: NOVO RADIO BUTTON E
//PRESENTE, PROMOCIONAL, 10%, 5%,


