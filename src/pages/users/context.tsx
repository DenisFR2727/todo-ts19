import { createContext, ReactNode, useState } from 'react';

export interface ThemeContextType {
    theme: Theme;
    toggleTheme: () => void;
}

interface Colors {
    background: string;
    text: string;
}

export interface Theme {
    mode: 'light' | 'dark';
    colors: Colors;
}

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
                          text: '#fff',
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
