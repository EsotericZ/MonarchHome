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
      shipping: false,
      tlaser: false,
      saw: false,
      shear: false,
    };
  });

  useEffect(() => {
    localStorage.setItem('cookieData', JSON.stringify(cookieData));
  }, [cookieData]);

  return (
    <UserContext.Provider value={{ cookieData, setCookieData }}>
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