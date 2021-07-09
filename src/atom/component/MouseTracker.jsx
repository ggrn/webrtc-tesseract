import { Tooltip } from '@material-ui/core';
import { useEffect } from 'react';
import { useCallback, useMemo } from 'react';
import { proxy, useSnapshot } from 'valtio'
import PropTypes from 'prop-types';
import { useRef } from 'react';

const MouseTracker = (props) => {
  const { children } = props;
  const ref = useRef();

  const state = useMemo(() => proxy({ 
    x: null,
    y: null,
  }), []);
  const snap = useSnapshot(state)

  const handleMouseOver = useCallback(
    /**
     * @returns {import('react').MouseEventHandler}
     * @param {MouseEvent} e 
     */
    (e) => {
      if (e.target instanceof HTMLVideoElement && e.layerX >= 0 && e.layerY >= 0) {
        state.x = e.layerX;
        state.y = e.layerY;
      } else {
        state.x = null;
        state.y = null;
      }
    }, [state]
  )

  useEffect(() => {
    const el = ref.current;
    el.addEventListener('mousemove', handleMouseOver);
    return () => {
      el.removeEventListener('mousemove', handleMouseOver);
    };
  }, [handleMouseOver]);

  const getTitle = useCallback(() => {
    if(snap.x !== null && snap.y !== null) {
      return `x:${snap.x}, y:${snap.y}`;
    } else {
      return ""
    }
  }, [snap]);

  return (
    <Tooltip followCursor title={getTitle()} ref={ref}>
      {children}
    </Tooltip>
  )
}

MouseTracker.propTypes = {
  children: PropTypes.element.isRequired
}

export default MouseTracker;
