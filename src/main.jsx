// main.jsx
import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom'; // ← add this
import App from './App';
import { AuthProvider } from './context/useAuth';
import './index.css';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>        {/* ← wrap here */}
      <AuthProvider>
        <App />
      </AuthProvider>
    </BrowserRouter>       {/* ← close here */}
  </React.StrictMode>
);