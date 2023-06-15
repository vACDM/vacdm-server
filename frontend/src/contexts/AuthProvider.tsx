import {
  createContext,
  useState,
  Dispatch,
  SetStateAction,
  useEffect,
} from "react";
import authService from "../services/AuthService";

import { useNavigate } from "react-router-dom";

const AuthContext = createContext<{
  auth: Object;
  setAuth: Dispatch<SetStateAction<{}>>;
}>({ auth: {}, setAuth: () => {} });

export const AuthProvider = ({ children }: { children: any }) => {
  const [auth, setAuth] = useState({});

  const navigate = useNavigate();

  useEffect(() => {
    authService
      .getProfile()
      .then((data) => {
        setAuth({ user: data });
      })
      .catch((e) => {
        setAuth({});
        navigate("/");
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
