import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { LanguageProvider } from './context/LanguageContext';
import Navbar from './components/Navbar';
import Sidebar from './components/Sidebar';
import Landing from './pages/Landing';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import ForecastPage from './pages/ForecastPage';
import CommoditiesPage from './pages/CommoditiesPage';
import SettingsPage from './pages/SettingsPage';
import AlertsPage from './pages/AlertsPage';
import AnalyticsPage from './pages/AnalyticsPage';

const PrivateRoute = ({ children }) => {
  const { user, loading } = useAuth();
  if (loading) return <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>Loading...</div>;
  return user ? children : <Navigate to="/login" />;
};

const Layout = ({ children }) => {
  const { user } = useAuth();
  return (
    <div style={{ display: 'flex', minHeight: 'calc(100vh - 64px)' }}>
      {user && <Sidebar />}
      <main style={{ flex: 1, marginLeft: user ? '256px' : 0, transition: 'margin 0.3s ease' }}>
        {children}
      </main>
    </div>
  );
};

function App() {
  return (
    <AuthProvider>
      <LanguageProvider>
        <Router>
          <div className="App" style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
            <Navbar />
            <Layout>
              <Routes>
                <Route path="/" element={<Landing />} />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                
                <Route path="/dashboard" element={<PrivateRoute><Dashboard /></PrivateRoute>} />
                <Route path="/forecast" element={<PrivateRoute><ForecastPage /></PrivateRoute>} />
                <Route path="/commodities" element={<PrivateRoute><CommoditiesPage /></PrivateRoute>} />
                <Route path="/alerts" element={<PrivateRoute><AlertsPage /></PrivateRoute>} />
                <Route path="/analytics" element={<PrivateRoute><AnalyticsPage /></PrivateRoute>} />
                <Route path="/settings" element={<PrivateRoute><SettingsPage /></PrivateRoute>} />
                
                {/* Fallback */}
                <Route path="*" element={<Navigate to="/" />} />
              </Routes>
            </Layout>
          </div>
        </Router>
      </LanguageProvider>
    </AuthProvider>
  );
}

export default App;
