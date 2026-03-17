// App.jsx
import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './context/useAuth';
import Login from './pages/Login';
import Layout from './components/Layout';
import Dashboard from './pages/Dashboard';
import Caisse from './pages/Caisse';
import Produit_stock from './pages/Produit_stock';
import Facture from './pages/Facture';
import Settings from './assets/Settings';
// Protects routes — redirects to /login if not logged in
const ProtectedRoute = ({ children }) => {
  const { user } = useAuth();
  return user ? children : <Navigate to="/login" />;
};

const App = () => {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />

      <Route path="/" element={<ProtectedRoute><Layout><Dashboard /></Layout></ProtectedRoute>} />
      <Route path="/caisse" element={<ProtectedRoute><Layout><Caisse /></Layout></ProtectedRoute>} />
      <Route path='/facture' element={<ProtectedRoute><Layout><Facture/></Layout></ProtectedRoute>} />
      <Route path='/produit' element={<ProtectedRoute><Layout><Produit_stock/></Layout></ProtectedRoute>} />
      <Route path='/settings' element={<ProtectedRoute><Layout><Settings/></Layout></ProtectedRoute>} />

      <Route path="*" element={<Navigate to="/login" />} />
    </Routes>
  );
};



export default App;