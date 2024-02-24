import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import './App.css';
import LoginPage from './components/LoginPage/LoginPage';
import Dashboard from './components/Dashboard/Dashboard';
import { AuthProvider } from './Auth';
import { ContextProvider } from "./components/Context";

function App() {
  return (
      <AuthProvider>
            <ContextProvider>
                <Router>
                    <Routes>
                        <Route path="/" element={<LoginPage />} />
                        <Route path="/dashboard" element={<Dashboard />} />
                    </Routes>
                </Router>
            </ContextProvider>
      </AuthProvider>
  );
}

export default App;
