import React, { useCallback, useEffect, useRef } from 'react';
import { Box, Grid } from '@material-ui/core';
import useStyle from '../style/useStyle';
import PropTypes from 'prop-types';
import util from '../../util'

const { clearCanvas, processFrame: { 
  useCvProcess,
  createProcessGrayScaleAndShow
} } = util;

const DevStreamer = (props) => {
  const { stream, setStream } = props;
  const classes = useStyle();

  const {
    preProcess,
    process: processGrayScaleAndShow,
    clearProcess,
    cv
  } = useCvProcess(createProcessGrayScaleAndShow);

  const videoRef = useRef(HTMLVideoElement.prototype);
  const canvasRef = useRef(HTMLCanvasElement.prototype);
  const srcRef = useRef(null);
  const captureRef = useRef();

  const clearEnv = useCallback(() => {
    if(srcRef.current) {
      srcRef.current.delete();
      srcRef.current = null;
    }
    if(timerRef.current) {
      cancelAnimationFrame(timerRef.current);
      timerRef.current = null;
    }
    clearCanvas(canvasRef.current);
    clearProcess();
  }, [clearProcess])

  const timerRef = useRef();
  const frameRateRef = useRef(30);

  const processFrame = useCallback(() => {
    try {
      captureRef.current.read(srcRef.current);

      processGrayScaleAndShow({
        src: srcRef.current,
        canvas: canvasRef.current
      })
      
      timerRef.current = requestAnimationFrame(processFrame);
    } catch (error) {
      console.error(error);
    }
  }, [processGrayScaleAndShow]);

  const start = useCallback(() => {
    console.debug(new Date(), 'start');

    const stream = videoRef.current.srcObject;
    const { frameRate } = stream.getVideoTracks()[0].getSettings();
    frameRateRef.current =frameRate ;
    srcRef.current = new cv.Mat(videoRef.current.height, videoRef.current.width, cv.CV_8UC4);
    captureRef.current = new cv.VideoCapture(videoRef.current);
    
    preProcess();

    timerRef.current = requestAnimationFrame(processFrame);
    // timerRef.current = setTimeout(processFrame, 0);
  }, [preProcess, processFrame, cv])

  useEffect(() => {
    if (stream && stream instanceof MediaStream && stream.active) {
      const videoEl = videoRef.current;
      const track = stream.getVideoTracks()[0];

      const handleTrackEnded = () => {
        console.debug(new Date(), 'track ended by user');
        setStream(null);
      }

      track.addEventListener('ended', handleTrackEnded);

      const { width, height } = track.getSettings();
      videoEl.width = width;
      videoEl.height = height;
      videoEl.srcObject = stream.clone();

      (async () => { 
        await videoEl.play();
        console.log('hi')
        start();
      })();

      return () => {
        console.debug(new Date(), 'remove stream')
        track.removeEventListener('ended', handleTrackEnded);
        videoEl.srcObject.getVideoTracks().forEach(track => track.stop());
        videoEl.srcObject = null;
        videoEl.removeAttribute('width');
        videoEl.removeAttribute('height');
        clearEnv();
      }
    }
  }, [stream, setStream, start, clearEnv]);

  return (
    <>
      {
        // process.env.NODE_ENV === 'deveolpment' && 
        (
          <Grid container justifyContent={'center'} item xs={12}>
            <Box className={classes.devStreamer} clone>
              <video ref={videoRef}></video>
            </Box>
          </Grid>
        )
      }
      <Grid container justifyContent={'center'} item xs={12}>
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
