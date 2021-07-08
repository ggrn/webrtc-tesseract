import { Button } from '@material-ui/core';
import React, { useEffect, useState, useCallback } from 'react';
import CannotUseModal from '../modal/CannotUseModal';
import PropTypes from 'prop-types';

const MediaSelector = (props) => {
  const { stream, setStream } = props;

  // const [selected, setSelected] = useState();
  const [cannotUseModalOpen, setCannotUseModalOpen] = useState(false);
  const handleCannotUseModalOpen = useCallback(() => {
    setCannotUseModalOpen(open => !open);
  }, [])

  useEffect(() => {
    if(!!!navigator?.mediaDevices?.getDisplayMedia) {
      setCannotUseModalOpen(true);
    }
  }, []);

  
  const handleClick = useCallback(
    /**
     * @param {import('react').MouseEvent} e 
     * @returns {Promise<import('react').MouseEventHandler>}
     */
    async e => {
      try {
        if (!stream) {
          const mediaStream = await navigator.mediaDevices.getDisplayMedia({ audio: false });
          setStream(mediaStream);
        } else {
          setStream(undefined);
        }
      } catch (error) {
        console.error("Error: " + error);
      }
    }, [stream, setStream]
  )

  useEffect(() => {
    if(stream) {
      return () => {
        stream.getTracks().forEach(track => track.stop());
      }
    }
  }, [stream])

  return (
    <>
      <Button variant="contained" color={ stream ? "secondary" : "primary" } disableElevation onClick={handleClick}>
        { stream ? "종료" : "화면 선택" }
      </Button>
      <CannotUseModal open={cannotUseModalOpen} handleOpen={handleCannotUseModalOpen} />
    </>
  )
};

MediaSelector.propTypes = {
  stream: PropTypes.instanceOf(MediaStream),
  setStream: PropTypes.func.isRequired,
};

export default MediaSelector;
