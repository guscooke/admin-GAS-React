import './App.css';
import Cadastro from './pages/Cadastro';
import Navbar from './layout/Navbar';
import Agenda from './components/Agenda'
import Monitor from './pages/Monitor'
import { createTheme, ThemeProvider } from '@mui/material/styles';
import CadastroView from './pages/CadastroView';
import CadastroContainer from './pages/CadastroCntr';
import { DataProvider } from './contexts/DataContext';
const theme = createTheme();

function App() {
  return (
    <ThemeProvider theme={theme}>
      <div className="App">
        <Navbar />
        <div className="content-container"> {/* Add a container for the content */}
          <DataProvider>
            <Monitor />
            <Cadastro />
            <CadastroView />
          </DataProvider>
          {/* <Agenda /> */}
        </div>
      </div>
    </ThemeProvider>
  );
}

export default App;



// CRIAR ROTAS E PAGINAS DISTINTAS
//CRIAR AREA DE LOG IN