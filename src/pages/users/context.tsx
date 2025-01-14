import { createContext, ReactNode, useState } from 'react';
import { Theme, ThemeContextType } from './types';

// Create a ThemeContext
const ThemeContext = createContext<ThemeContextType | null>(null);

// ThemeProvider component using <ThemeContext> directly as a provider
const ThemeProvider = ({ children }: { children: ReactNode }) => {
    const [theme, setTheme] = useState<Theme>({
        mode: 'light',
        colors: {
            background: '#fff',
            text: '#000',
        },
    });

    const toggleTheme = () => {
        setTheme((prevTheme) => {
            return prevTheme.mode === 'light'
                ? {
                      mode: 'dark',
                      colors: {
                          background: '#333',
                          text: '#0013e9',
                      },
                  }
                : {
                      mode: 'light',
                      colors: {
                          background: '#fff',
                          text: '#000',
                      },
                  };
        });
    };

    return (
        <ThemeContext value={{ theme, toggleTheme }}>{children}</ThemeContext>
    );
};

export { ThemeProvider, ThemeContext };
