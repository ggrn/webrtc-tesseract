import React, { useState } from 'react';
import Container from '@material-ui/core/Container';
import Grid from '@material-ui/core/Grid';
import atom from '../atom';

const {
  component: { DevStreamer, MediaSelector },
  useStyle,
} = atom;

const Main = () => {
  const classes = useStyle();
  const [stream, setStream] = useState();

  return (
    <Container maxWidth="xl" className={classes.root}>
      <Grid container item xs={12} spacing={1}>
        <DevStreamer stream={stream} setStream={setStream} />
      </Grid>
      <MediaSelector stream={stream} setStream={setStream} />
    </Container>
  );
};

export default Main;
