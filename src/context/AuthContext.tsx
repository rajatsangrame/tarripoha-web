import { createContext, useContext, useState } from 'react';
import { jwtDecode } from 'jwt-decode';

type AuthContextType = {
  user: User | null;
  login: (token: string) => void;
  logout: () => void;
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
  const [user, setUser] = useState<User | null>(null);

  const login = (token: string) => {
    sessionStorage.setItem('jwt_token', token);
    const decoded: any = jwtDecode(token);
    setUser({
      username: decoded.username,
      firstName: decoded.firstName,
      lastName: decoded.lastName,
      email: decoded.email
    } as User);
  };

  const logout = () => {
    sessionStorage.removeItem('jwt_token');
    setUser(null);
  };

  const getToken = () => {
    const token = sessionStorage.getItem('jwt_token');
    return token;
  };

  return <AuthContext.Provider value={{ user, login, logout, getToken }}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within an AuthProvider');
  return context;
};
