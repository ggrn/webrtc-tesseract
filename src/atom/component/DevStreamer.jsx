import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Box, Grid, Paper, TableContainer, Table, TableHead, TableCell, TableBody, TablePagination } from '@material-ui/core';
import useStyle from '../style/useStyle';
import PropTypes from 'prop-types';
import util from '../../util'
import MouseTracker from './MouseTracker';
import { TableRow } from '@material-ui/core';
import { useTesseractLogger } from '../../util/TesseractLogger'

const { clearCanvas, processFrame: { 
  useCvProcess,
  createProcessGrayScaleAndShow
} } = util;

const DevStreamer = (props) => {
  const { stream, setStream } = props;
  const classes = useStyle();
  const rows = useTesseractLogger();

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

    const { srcObject: stream, videoHeight: height, videoWidth: width } = videoRef.current;
    const { frameRate } = stream.getVideoTracks()[0].getSettings();
    frameRateRef.current = frameRate ;
    srcRef.current = new cv.Mat(height, width, cv.CV_8UC4);
    captureRef.current = new cv.VideoCapture(videoRef.current);
    
    preProcess();

    timerRef.current = requestAnimationFrame(processFrame);
    // timerRef.current = setTimeout(processFrame, 0);
  }, [preProcess, processFrame, cv])

  useEffect(() => {
    if (stream && stream instanceof MediaStream && stream.active) {
      const videoEl = videoRef.current;
      videoEl.srcObject = stream.clone();

      const track = stream.getVideoTracks()[0];

      const handleTrackEnded = () => {
        console.debug(new Date(), 'track ended by user');
        setStream(null);
      }
      track.addEventListener('ended', handleTrackEnded);

      (async () => { 
        await videoEl.play();
        const { videoHeight: height, videoWidth: width } = videoRef.current;
        // const { width, height } = videoEl.srcObject.getVideoTracks()[0].getSettings();
        videoRef.current.width = width;
        videoRef.current.height = height;
        console.log('hi', height, width, videoRef.current.videoHeight, videoRef.current.videoWidth);
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

  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const columns = useMemo(() => [
    { id: 'jobId', label: 'job ID' },
    { id: 'text', label: 'text' }
  ], [])
  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };

  return (
    <>
      {
        // process.env.NODE_ENV === 'deveolpment' && 
        (
          <MouseTracker>
            <Grid container justifyContent={'center'} item xs={6}>
              <Box className={classes.devStreamer} clone>
                <video className={classes.devStreamerMedia} ref={videoRef}></video>
              </Box>
            </Grid>
          </MouseTracker>
        )
      }
      <Grid container justifyContent={'center'} item xs={6}>
        <Box className={classes.devStreamer} clone>
          <canvas className={classes.devStreamerMedia} ref={canvasRef}></canvas>
        </Box>
      </Grid>
      <Grid item xs={12}>
        <Paper>
          <TableContainer>
            <Table className={classes.table} size="small">
              <TableHead>
                <TableRow>
                  {columns.map(column => (
                    <TableCell
                      key={column.id}
                    >
                      {column.label}
                    </TableCell>
                  ))}
                </TableRow>
              </TableHead>
              <TableBody>
                {
                  rows.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((row) => {
                    return (
                      <TableRow hover role="checkbox" tabIndex={-1} key={row.code}>
                        {columns.map((column) => {
                          const value = row[column.id];
                          return (
                            <TableCell key={column.id}>
                              {value/* {column.format && typeof value === 'number' ? column.format(value) : value} */}
                            </TableCell>
                          );
                        })}
                      </TableRow>
                    )
                  })
                }
              </TableBody>
            </Table>
          </TableContainer>
          <TablePagination 
            rowsPerPageOptions={[10, 25, 100]}
            component="div"
            count={rows.length}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
          />
        </Paper>
      </Grid>
    </>
  )
}

DevStreamer.propTypes = {
  stream: PropTypes.instanceOf(MediaStream)
}

export default DevStreamer;
