import { Fab, Zoom, useTheme } from '@material-ui/core';
import CastIcon from '@material-ui/icons/Cast';
import CancelPresentationIcon from '@material-ui/icons/CancelPresentation';
import React, { useEffect, useState, useCallback, useMemo } from 'react';
import CannotUseModal from '../modal/CannotUseModal';
import PropTypes from 'prop-types';
import useStyle from '../style/useStyle';


const MediaSelector = (props) => {
  const { stream, setStream } = props;
  const classes = useStyle();
  const theme = useTheme();

  const transitionDuration = {
    enter: theme.transitions.duration.enteringScreen,
    exit: theme.transitions.duration.leavingScreen,
  };

  const [cannotUseModalOpen, setCannotUseModalOpen] = useState(false);
  const handleCannotUseModalOpen = useCallback(() => {
    setCannotUseModalOpen(open => !open);
  }, [])

  useEffect(() => {
    if(!!!navigator?.mediaDevices?.getDisplayMedia) {
      setCannotUseModalOpen(true);
    }
  }, []);

  useEffect(() => {
    if(stream) {
      return () => {
        stream.getTracks().forEach(track => track.stop());
      }
    }
  }, [stream])

  const handleCastClick = useCallback(
    /**
     * @param {import('react').MouseEvent} e 
     * @returns {Promise<import('react').MouseEventHandler>}
     */
    async e => {
      try {
        const mediaStream = await navigator.mediaDevices.getDisplayMedia({ audio: false });
        setStream(mediaStream);
      } catch (error) {
        console.error("Error: " + error);
      }
    }, [setStream]
  );

  const handleCancelClick = useCallback(
    /**
     * @param {import('react').MouseEvent} e 
     * @returns {Promise<import('react').MouseEventHandler>}
     */
    async e => {
      try {
        setStream(null);
      } catch (error) {
        console.error("Error: " + error);
      }
    }, [setStream]
  );

  const fabs = useMemo(() => [
    {
      color: 'primary',
      className: classes.fab,
      icon: <CastIcon className={classes.extendedIcon} />,
      label: '화면 선택',
      onClick: handleCastClick
    },
    {
      color: 'secondary',
      className: classes.fab,
      icon: <CancelPresentationIcon className={classes.extendedIcon} />,
      label: '종료',
      onClick: handleCancelClick
    }
  ], [classes.fab, classes.extendedIcon, handleCastClick, handleCancelClick]);

  return (
    <>
      {
        fabs.map((fab, index) => (
            <Zoom
              key={fab.color}
              in={index === 0 ? !stream : !!stream}
              timeout={transitionDuration}
              style={{
                transitionDelay: `${(index === 0 ? !stream : !!stream) ? transitionDuration.exit : 0}ms`,
              }}
              unmountOnExit
            >
              <Fab 
                variant="extended"
                aria-label={fab.label}
                className={fab.className}
                color={fab.color}
                onClick={fab.onClick}
              >
                {fab.icon}
                {fab.label}
              </Fab>
            </Zoom>
          )
        )
      }
      {/* <Button variant="contained" color={ stream ? "secondary" : "primary" } disableElevation onClick={handleClick}>
        { stream ? "종료" : "화면 선택" }
      </Button> */}
      <CannotUseModal open={cannotUseModalOpen} handleOpen={handleCannotUseModalOpen} />
    </>
  )
};

MediaSelector.propTypes = {
  stream: PropTypes.instanceOf(MediaStream),
  setStream: PropTypes.func.isRequired,
};

export default MediaSelector;
