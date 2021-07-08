import React, { useCallback, useEffect, useRef, useState } from 'react';
import { Box, Grid } from '@material-ui/core';
import useStyle from '../style/useStyle';
import PropTypes from 'prop-types';
import { useOpenCv } from 'opencv-react';

const DevStreamer = (props) => {
  const { stream } = props;
  const classes = useStyle();

  const { cv } = useOpenCv();

  const videoRef = useRef(HTMLVideoElement.prototype);
  const canvasRef = useRef(HTMLCanvasElement.prototype);

  const [start, setStart] = useState(false);

  const srcRef = useRef();
  const dstRef = useRef();
  const captureRef = useRef();

  useEffect(() => {
    if (stream && stream instanceof MediaStream && stream.active) {
      const videoEl = videoRef.current;
      const { width, height } = stream.getVideoTracks()[0].getSettings();
      videoEl.width = width;
      videoEl.height = height;
      videoEl.srcObject = stream.clone();
      videoEl.play();

      setStart(true);

      return () => {
        console.debug('clean dev streamer');
        videoEl.srcObject.getTracks().forEach(track => track.stop());
        videoEl.srcObject = null;
        setStart(false);
      }
    }
  }, [stream]);

  const frameRateRef = useRef(30);
  const process = useCallback(() => {
    try {
      const begin = Date.now();
      captureRef.current.read(srcRef.current);
      cv.cvtColor(srcRef.current, dstRef.current, cv.COLOR_RGBA2GRAY);
      cv.imshow(canvasRef.current, dstRef.current);

      const delay = 1000/frameRateRef - (Date.now() - begin);
      setTimeout(process, delay);
    } catch (error) {
      console.error(error);
    }
  }, [cv])

  useEffect(() => {
    if (cv && stream && start) {

      if(videoRef.current) {
        const { width, height, frameRate } = stream.getVideoTracks()[0].getSettings();
        srcRef.current = new cv.Mat(height, width, cv.CV_8UC4);
        dstRef.current = new cv.Mat(height, width, cv.CV_8UC1);
        frameRateRef.current = frameRate;
        captureRef.current = new cv.VideoCapture(videoRef.current);
        console.log(srcRef.current);
        setTimeout(process, 0);
      }

      return () => {
        if(srcRef.current) {
          srcRef.current.delete();
        }
        if(dstRef.current) {
          dstRef.current.delete();
        }
      }
    }
  }, [stream, start, cv, process]);

  return (
    <>
      <Grid container item xs={6}>
        <Box className={classes.devStreamer} clone>
          <video ref={videoRef}></video>
        </Box>
      </Grid>
      <Grid container item xs={6}>
        <Box className={classes.devStreamer} clone>
          <canvas ref={canvasRef}></canvas>
        </Box>
      </Grid>
    </>
  )
}

DevStreamer.propTypes = {
  stream: PropTypes.instanceOf(MediaStream)
}

export default DevStreamer;
