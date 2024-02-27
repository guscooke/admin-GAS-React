import './App.css';
import Cadastro from './pages/Cadastro';
import Navbar from './layout/Navbar';
import Agenda from './components/Agenda'
import Monitor from './pages/Monitor'
import { createTheme, ThemeProvider } from '@mui/material/styles';

const theme = createTheme();

function App() {
  return (
    <ThemeProvider theme={theme}>
      <div className="App">
        <Navbar />
        <div className="content-container"> {/* Add a container for the content */}
          {/* <header className="App-header"> */}
          {/* <Monitor /> */}
          <Cadastro />
          <Agenda />
          {/* </header> */}
        </div>
      </div>
    </ThemeProvider>
  );
}

export default App;


