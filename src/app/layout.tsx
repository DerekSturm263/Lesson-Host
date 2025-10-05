import { Metadata } from "next";
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';

import "./globals.css";
import '@fontsource/roboto/300.css';
import '@fontsource/roboto/400.css';
import '@fontsource/roboto/500.css';
import '@fontsource/roboto/700.css';

const darkTheme = createTheme({
  palette: {
    primary: {
      light: '#43b1e4',
      main: '#3490c2',
      dark: '#265f8c',
      contrastText: '#fff',
    },
    secondary: {
      light: '#d8863c',
      main: '#c26634',
      dark: '#9c5f3d',
      contrastText: '#fff',
    },
  },
  typography: {
    fontFamily: [
      'Lexend',
      'Roboto',
      'Arial',
      'Helvetica',
      'sans-serif'
    ].join(','),
    fontSize: 12
  }
});

export const metadata: Metadata = {
  title: "MySkillStudy.com",
  description: "Learn anything by practicing skills and creating projects.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <ThemeProvider theme={darkTheme}>
        <CssBaseline />
        
        <body>
          {children}
        </body>
      </ThemeProvider>
    </html>
  );
}
