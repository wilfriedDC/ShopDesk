import React, {
  createContext,
  useEffect,
  useState
} from 'react';

export const AuthContext = createContext(null);

export function AuthProvider({ children }) {

  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {

    const savedUser = localStorage.getItem(
      'shopdesk_user'
    );

    if (savedUser) {

      try {

        setUser(
          JSON.parse(savedUser)
        );

      } catch (error) {

        console.error(
          'Erreur utilisateur sauvegardé :',
          error
        );

        localStorage.removeItem(
          'shopdesk_user'
        );

      }

    }

    setLoading(false);

  }, []);


  const login = (userData) => {

    setUser(userData);

    localStorage.setItem(
      'shopdesk_user',
      JSON.stringify(userData)
    );

  };


  const logout = () => {

    setUser(null);

    localStorage.removeItem(
      'shopdesk_user'
    );

  };


  return (

    <AuthContext.Provider
      value={{
        user,
        loading,
        login,
        logout
      }}
    >

      {children}

    </AuthContext.Provider>

  );

}