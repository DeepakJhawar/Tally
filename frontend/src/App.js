import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Dashboard from "./pages/Dashboard";
import ResetPassword from "./pages/resetPassword";
import ForgotPassword from "./pages/forgotPassword";
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import Problems from "./components/Problems";
import Contest from "./components/Contest";
import CodingArena from "./pages/CodingArena";
import CodingPlayGround from "./pages/CodingPlayground";
import Contribute from "./components/Contribute";
import AdminPage from "./pages/AdminPage";

const darkTheme = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: '#000000', // Black
    },
    secondary: {
      main: '#404040', // Dark gray
    },
    background: {
      default: '#000000', // Black background for the whole app
      paper: '#121212', // Slightly lighter black for paper elements
    },
  },
});

function App() {
  return (
    <ThemeProvider theme={darkTheme}>
      <CssBaseline />
      <Router>
        <Routes>
          <Route path="/" element={<Home />}>
            <Route index element={<Problems />} />
            <Route path="/" element={<Problems />} />
            <Route path="/contest" element={<Contest />} /> 
            <Route path="/contribute" element={<Contribute />}></Route>
          </Route>
          <Route path="/codingPlayground" element={<CodingPlayGround/>} />
          <Route path="/codingArena" element={<CodingArena />}/>
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/reset-password" element={<ResetPassword />} />
          <Route path="/admin" element={<AdminPage/>} />
        </Routes>
      </Router>
    </ThemeProvider>
  );
}

export default App;
