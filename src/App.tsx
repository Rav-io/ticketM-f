import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import './App.css';
import LoginPage from './components/LoginPage';
import Dashboard from './components/Dashboard/Dashboard';
import { AuthProvider } from './Auth';
import { ContextProvider } from "./components/Context";
import ProjectDetails from "./components/ProjectDetails/ProjectDetails";
import ErrorPage from "./components/ErrorPage";

function App() {
  return (
      <AuthProvider>
            <ContextProvider>
                <Router>
                    <Routes>
                        <Route path="/" element={<LoginPage />} />
                        <Route path="/dashboard" element={<Dashboard />} />
                        <Route path="/project/:id" element={<ProjectDetails />} />
                        <Route path="*" element={<ErrorPage />} />
                    </Routes>
                </Router>
            </ContextProvider>
      </AuthProvider>
  );
}

export default App;
