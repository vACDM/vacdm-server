import { createContext, useState, Dispatch, SetStateAction, useEffect } from "react";

const AuthContext = createContext<{auth: Object, setAuth: Dispatch<SetStateAction<{}>>}>({auth: {}, setAuth: () => {}});

export const AuthProvider = ({children}: {children: any}) => {
  const [auth, setAuth] = useState({});

  useEffect(() => {
    

  }, [])



  return (
    <>
      <AuthContext.Provider value={{ auth, setAuth }}>
        {children}
      </AuthContext.Provider>
    </>
  );
};
export default AuthContext;
