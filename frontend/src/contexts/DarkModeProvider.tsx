import React, { createContext, useState } from "react";

const DarkModeContext = createContext({});

const DarkModeProvider = (children: any) => {
  const [darkMode, setDarkMode] = useState(false);
  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
  };

  return (
    <>
      <DarkModeContext.Provider value={{ darkMode, toggleDarkMode }}>
        {children}
      </DarkModeContext.Provider>
    </>
  );
};
export  {DarkModeContext, DarkModeProvider};
