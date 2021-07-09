import React, { useState } from "react";
import CssBaseline from '@material-ui/core/CssBaseline';
import Container from '@material-ui/core/Container';
import Grid from '@material-ui/core/Grid';
import atom from "./atom";
import { OpenCvProvider } from 'opencv-react'

const { 
  component: { DevStreamer, MediaSelector, TopBar }, 
  useStyle 
} = atom;

function App() {
  const classes = useStyle();
  const [stream, setStream] = useState();

  return (
    <>
      <OpenCvProvider openCvPath='/lib/opencv.js'>
        <CssBaseline />
        <TopBar />
        <Container maxWidth="xl">
          <Grid container className={classes.root} justifyContent="center" item xs={12} spacing={1}>
            <DevStreamer stream={stream} />
            <Grid container justifyContent="center" item xs={12}>
              <MediaSelector stream={stream} setStream={setStream} />
            </Grid>
          </Grid>
        </Container>
      </OpenCvProvider>
    </>
  );
}

export default App;
