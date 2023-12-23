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
}>({ auth: { user: undefined }, setAuth: () => {} });

export const AuthProvider = ({ children }: PropsWithChildren) => {
  const [auth, setAuth] = useState<{ user: User | undefined }>({ user: undefined });

  const navigate = useNavigate();

  useEffect(() => {
    authService
      .getProfile()
      .then((user) => {
        setAuth({ user });
      })
      .catch(() => {
        setAuth({ user: undefined });
        navigate('/auth-failure');
      });
  }, []);

  return (
    <>
      <AuthContext.Provider value={{ auth, setAuth }}>
        {children}
      </AuthContext.Provider>
    </>
  );
};
export default AuthContext;
