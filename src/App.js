import React, { useMemo } from 'react';
import CssBaseline from '@material-ui/core/CssBaseline';
import { OpenCvProvider } from 'opencv-react';
import { createTheme, ThemeProvider } from '@material-ui/core/styles';
import Main from './page/Main';
import TopBar from './atom/component/TopBar';
import { TesseractProvider } from './util/TerreractProvider';
import { PSM } from 'tesseract.js';

const theme = createTheme();

function App() {
  const tesseractWorkerCreateOption = useMemo(
    () => ({
      logger: (m) => {
        // console.log(m)
      },
    }),
    []
  );
  const tesseractWorkerParameter = useMemo(
    () => ({
      tessedit_pageseg_mode: PSM.AUTO,
      user_defined_dpi: '70',
      tessedit_create_box: '1',
      tessedit_create_unlv: '1',
      tessedit_create_osd: '1',
    }),
    []
  );

  return (
    <>
      <OpenCvProvider openCvPath="/webrtc-tesseract/lib/opencv.js">
        <TesseractProvider workerCreateOption={tesseractWorkerCreateOption} workerParameter={tesseractWorkerParameter}>
          <ThemeProvider theme={theme}>
            <CssBaseline />
            <TopBar />
            <Main />
          </ThemeProvider>
        </TesseractProvider>
      </OpenCvProvider>
    </>
  );
}

export default App;
