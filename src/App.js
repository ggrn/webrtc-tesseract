import React from "react";
import CssBaseline from '@material-ui/core/CssBaseline';
import { OpenCvProvider } from 'opencv-react'
import { createTheme, ThemeProvider } from '@material-ui/core/styles';
import Main from "./page/Main";
import TopBar from "./atom/component/TopBar";


const theme = createTheme();

function App() {
  return (
    <>
      <OpenCvProvider openCvPath='/lib/opencv.js'>
        <ThemeProvider theme={theme}>
          <CssBaseline />
          <TopBar />
          <Main />
        </ThemeProvider>
      </OpenCvProvider>
    </>
  );
}

export default App;
