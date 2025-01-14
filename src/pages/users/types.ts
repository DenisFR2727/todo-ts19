export interface ThemeContextType {
    theme: Theme;
    toggleTheme: () => void;
}

export interface Colors {
    background: string;
    text: string;
}

export interface Theme {
    mode: 'light' | 'dark';
    colors: Colors;
}
