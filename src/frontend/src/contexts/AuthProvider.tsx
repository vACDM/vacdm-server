import {
  createContext,
  useState,
  Dispatch,
  SetStateAction,
  useEffect,
  PropsWithChildren,
} from 'react';
import { useNavigate } from 'react-router-dom';

import authService from '../services/AuthService';

import User from '@/shared/interfaces/user.interface';

const AuthContext = createContext<{
  auth: {
    user: User | undefined
  };
  setAuth: Dispatch<SetStateAction<{ user: User | undefined }>>;
  authenticate: () => void;
  logout: () => void;
}>({ auth: { user: undefined }, setAuth() {}, authenticate() {}, logout() {} });

export const AuthProvider = ({ children }: PropsWithChildren) => {
  const [auth, setAuth] = useState<{ user: User | undefined }>({ user: undefined });

  const navigate = useNavigate();

  function authenticate() {
    window.location.replace('/api/auth');
  }
  
  async function logout() {
    await authService.logout();

    window.location.reload();
  }

  useEffect(() => {
    authService
      .getProfile()
      .then((user) => {
        setAuth({ user });
      })
      .catch((error) => {
        console.error(error);
        setAuth({ user: undefined });
        navigate('/auth-failure');
      });
  }, []);

  return (
    <>
      <AuthContext.Provider value={{ auth, setAuth, authenticate, logout }}>
        {children}
      </AuthContext.Provider>
    </>
  );
};
export default AuthContext;
