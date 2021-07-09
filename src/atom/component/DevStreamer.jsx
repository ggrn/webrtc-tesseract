import React, { useCallback, useEffect, useRef, useState } from 'react';
import { Box, Grid } from '@material-ui/core';
import useStyle from '../style/useStyle';
import PropTypes from 'prop-types';
import util from '../../util'

const { clearCanvas, processFrame: { 
  useCvProcess,
  createProcessGrayScaleAndShow
} } = util;

const DevStreamer = (props) => {
  const { stream } = props;
  const classes = useStyle();

  const { process: processGrayScaleAndShow, clearProcess, cv } = useCvProcess(createProcessGrayScaleAndShow);

  const videoRef = useRef(HTMLVideoElement.prototype);
  const canvasRef = useRef(HTMLCanvasElement.prototype);

  const [start, setStart] = useState(false);

  const srcRef = useRef(null);
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
        videoEl.removeAttribute('width');
        videoEl.removeAttribute('height');
        setStart(false);
      }
    }
  }, [stream]);

  const clearEnv = useCallback(() => {
    if(srcRef.current) {
      srcRef.current.delete();
      srcRef.current = null;
    }
    if(timerRef.current) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }
    clearCanvas(canvasRef.current);
    clearProcess();
  }, [clearProcess])

  const timerRef = useRef();
  const frameRateRef = useRef(30);
  const processFrame = useCallback(() => {
    try {
      const begin = Date.now();
      captureRef.current.read(srcRef.current);
      
      processGrayScaleAndShow({
        src: srcRef.current,
        canvas: canvasRef.current
      })
      
      const delay = 1000/frameRateRef - (Date.now() - begin);
      timerRef.current = setTimeout(processFrame, delay);

    } catch (error) {
      setStart(false);
    }
  }, [processGrayScaleAndShow])

  useEffect(() => {
    if (cv && stream && start) {
      console.info(new Date(), 'start')

      if(videoRef.current) {
        const { width, height, frameRate } = stream.getVideoTracks()[0].getSettings();
        srcRef.current = new cv.Mat(height, width, cv.CV_8UC4);
        frameRateRef.current = frameRate;
        captureRef.current = new cv.VideoCapture(videoRef.current);
        // console.log(Date.now(), srcRef.current);
        timerRef.current = setTimeout(processFrame, 0);
      }

      return () => {
        clearEnv();
      }
    }
  }, [stream, start, cv, processFrame, clearEnv]);

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
