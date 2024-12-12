import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Login from './components/Auth/Login';
import Register from './components/Auth/Register';
import PassageDisplay from './components/PassageDisplay';
import ProtectedRoute from './components/ProtectedRoute';
import EssaysList from './components/EssaysList';
import Dashboard from './components/Dashboard'; // Import Dashboard
import LandingPage from './components/LandingPage/LandingPage';
import FavoriteTopics from './components/Onboarding/FavoriteTopics';


const App = () => {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/onboarding" element={<ProtectedRoute><FavoriteTopics /></ProtectedRoute>} />
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/essays"
            element={
              <ProtectedRoute>
                <EssaysList />
              </ProtectedRoute>
            }
          />
          <Route
            path="/essays/:essayId"
            element={
              <ProtectedRoute>
                <PassageDisplay />
              </ProtectedRoute>
            }
          />
        </Routes>
      </Router>
    </AuthProvider>
  );
};

export default App;
