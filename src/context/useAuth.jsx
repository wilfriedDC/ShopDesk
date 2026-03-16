// src/context/useAuth.jsx
import { createContext, useContext, useState } from 'react';

const AuthContext = createContext(null);

const MOCK_USER = {
  name: "Wilfried DC",
  role: "Gestionnaire",
  avatarUrl: null,
  boutiqueName: "Boutique Centrale"
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const loading = false;

  const login = (userData) => setUser(userData ?? MOCK_USER);
  const logout = () => setUser(null);

  return (
    <AuthContext.Provider value={{ user, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext); // ← this line must exist