import React, { createContext, useState, useContext, useEffect } from 'react';

const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [loggedInUser, setLoggedInUser] = useState(null);

  useEffect(() => {
    // Initialize state from session storage
    const user = JSON.parse(sessionStorage.getItem('loggedInUser'));
    if (user) {
      setLoggedInUser(user);
    }
  }, []);

  const login = (user) => {
    setLoggedInUser(user);
    sessionStorage.setItem('loggedInUser', JSON.stringify(user));
  };

  const logout = () => {
    sessionStorage.removeItem('loggedInUser');
    setLoggedInUser(null);
  };

  return (
    <UserContext.Provider value={{ loggedInUser, login, logout }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => useContext(UserContext);
