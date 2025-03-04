import React, { createContext, useContext } from 'react';
import { jwtDecode } from 'jwt-decode';

type AuthContextType = {
  // eslint-disable-next-line
  login: (token: string) => User;
  logout: () => void;
  getUser: () => User | null;
  getToken: () => string | null;
};

type User = {
  username: string
  email: string
  firstName: string
  lastName: string
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {

  const login = (token: string) => {
    localStorage.setItem('jwt_token', token);
    const decoded: User = jwtDecode(token);
    return {
      username: decoded.username,
      firstName: decoded.firstName,
      lastName: decoded.lastName,
      email: decoded.email
    } as User;
  };

  const getUser = () => {
    const token = localStorage.getItem('jwt_token');
    return token ? jwtDecode(token) as User : null;
  };

  const logout = () => {
    localStorage.removeItem('jwt_token');
  };

  const getToken = () => {
    const token = localStorage.getItem('jwt_token');
    return token;
  };

  return <AuthContext.Provider value={{ getUser, login, logout, getToken }}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within an AuthProvider');
  return context;
};
