'use client'

import { createTheme } from '@mui/material/styles';

const theme = createTheme({
  palette: {
    mode: 'dark',
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
      'Arial',
      'Helvetica',
      'sans-serif'
    ].join(','),
    fontSize: 12
  }
});

export default theme;
