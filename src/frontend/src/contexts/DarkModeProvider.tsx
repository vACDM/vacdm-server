import {
  createContext,
  useEffect,
  useState,
} from 'react';

type DarkModeContextProps = {
  darkMode: boolean;
  changeDarkMode: () => void;
};

const DarkModeContext = createContext<DarkModeContextProps>(
  {} as DarkModeContextProps,
);

function getDarkModeState(): boolean {
  // Local Storage
  const lsDarkMode = window.localStorage.getItem('dark-mode');
  // OS
  const osDarkMode =
    window.matchMedia &&
    window.matchMedia('(prefers-color-scheme: dark)').matches;

  if (lsDarkMode != null) {
    return lsDarkMode === 'true';
  }

  return osDarkMode;
}

export const DarkModeProvider = ({ children }: { children: any }) => {
  const [darkMode, setDarkMode] = useState<boolean>(getDarkModeState());
  
  useEffect(() => {
    setDarkMode(!darkMode);
    
    const html = document.getElementById('dark-mode-selector');
    if (html == null) return;

    if (darkMode) {
      html.setAttribute('data-mode', 'dark');
      window.localStorage.setItem('dark-mode', 'true');
    } else {
      html.removeAttribute('data-mode');
      window.localStorage.setItem('dark-mode', 'false');
    }
  }, []);

  function changeDarkMode() {
     
    setDarkMode(!darkMode);

    const html = document.getElementById('dark-mode-selector');
    if (html == null) return;

    if (darkMode) {
      html.setAttribute('data-mode', 'dark');
      window.localStorage.setItem('dark-mode', 'true');
    } else {
      html.removeAttribute('data-mode');
      window.localStorage.setItem('dark-mode', 'false');
    }
  }

  return (
    <>
      <DarkModeContext.Provider value={{ darkMode, changeDarkMode }}>
        {children}
      </DarkModeContext.Provider>
    </>
  );
};

export default DarkModeContext;
