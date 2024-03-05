

// CRIAR ROTAS E PAGINAS DISTINTAS
//CRIAR AREA DE LOG IN
//CADASTRO ALTERA TODOS OS DEMAIS

import './App.css';
import { useState } from 'react';
import Cadastro from './pages/Cadastro';
import Navbar from './layout/Navbar';
import Agenda from './components/Agenda';
import Monitor from './pages/Monitor';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import CadastroView from './components/CadastroView';
import { DataProvider } from './contexts/DataContext';

const theme = createTheme();

function App() {
  const [currentPage, setCurrentPage] = useState('monitor');

  const renderCurrentPage = () => {
    switch (currentPage)
    {
      case 'cadastro':
        return <Cadastro />;
      case 'agenda':
        return <Agenda />;
      case 'cadastroview':
        return <CadastroView />;
      default:
        return <Monitor />;
    }
  };

  return (
    <ThemeProvider theme={theme}>
      <div className="App">
        <Navbar setCurrentPage={setCurrentPage} />
        <div className="content-container">
          <DataProvider>
            {renderCurrentPage()}
          </DataProvider>
        </div>
      </div>
    </ThemeProvider>
  );
}


export default App;
