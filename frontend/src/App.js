import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import ResetPassword from "./pages/resetPassword";
import ForgotPassword from "./pages/forgotPassword";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import Problems from "./components/Problems";
import Contest from "./components/Contest";
import CodingArena from "./pages/CodingArena";
import CodingPlayGround from "./pages/CodingPlayground";
import Contribute from "./components/Contribute";
import Landing from "./components/Landing";
import AdminPage from "./pages/AdminPage";
import { AuthProvider } from "./AuthContext";

const darkTheme = createTheme({
  palette: {
    mode: "dark",
    primary: {
      main: "#000000",
    },
    secondary: {
      main: "#404040",
    },
    background: {
      default: "#000000",
      paper: "#121212", 
    },
  },
});

function App() {
  return (
    <AuthProvider>
      <ThemeProvider theme={darkTheme}>
        <CssBaseline />
        <Router>
          <Routes>
            <Route path="/" element={<Home />}>
              <Route path="/" element={<Landing />} />
              <Route path="/problems" element={<Problems />} />
              <Route path="/contest" element={<Contest />} />
              <Route path="/contribute" element={<Contribute />} />
            </Route>
            <Route path="/problem/:problem_id" element={<CodingArena />} />
            <Route path="/playground" element={<CodingPlayGround />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
            <Route path="/reset-password" element={<ResetPassword />} />
            <Route path="/admin" element={<AdminPage />} />
          </Routes>
        </Router>
      </ThemeProvider>
    </AuthProvider>
  );
}

export default App;
