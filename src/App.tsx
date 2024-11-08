import "./App.css";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { AuthProvider} from "./AuthContext";
import ProtectedRoute from "./ProtectedRoute";
import Homepage from "./components/routes/Homepage";
import { ThemeProvider } from "./components/theme-provider";
import Dashboard from "./dashboard/Dashboard";



function App() {
  return (
    <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
    <AuthProvider>
    <Router>
        <Routes>
            <Route path="/" element={<Homepage />} />
            <Route
                        path="/dashboard"
                        element={
                            <ProtectedRoute>
                                <Dashboard />
                            </ProtectedRoute>
                        }
                    />
    
        </Routes>
    </Router>
</AuthProvider>
    </ThemeProvider>
  );
}

export default App;
