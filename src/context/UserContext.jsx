import { createContext, useContext, useState, useEffect } from 'react';

const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [cookieData, setCookieData] = useState(() => {
    const savedData = localStorage.getItem('cookieData');
    return savedData ? JSON.parse(savedData) : {
      name: '',
      role: 'employee',
      backlog: false,
      engineering: false,
      forming: false,
      laser: false,
      machining: false,
      maintenance: false,
      punch: false,
      purchasing: false,
      quality: false,
      saw: false,
      shear: false,
      shipping: false,
      specialty: false,
      tlaser: false,
    };
  });

  const [loggedIn, setLoggedIn] = useState(() => {
    return cookieData && cookieData.name ? true : false;
  });

  useEffect(() => {
    localStorage.setItem('cookieData', JSON.stringify(cookieData));
    setLoggedIn(cookieData && cookieData.name ? true : false);
  }, [cookieData]);

  return (
    <UserContext.Provider value={{ 
      cookieData, 
      setCookieData,
      loggedIn,
      setLoggedIn,
    }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUserContext = () => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error('useUserContext must be used within a UserProvider');
  }
  return context;
};