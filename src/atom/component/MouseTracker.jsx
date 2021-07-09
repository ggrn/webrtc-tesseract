import { Tooltip } from '@material-ui/core';
import { useEffect, useState, useRef, useCallback, useMemo } from 'react';
import { proxy, useSnapshot } from 'valtio'
import PropTypes from 'prop-types';

const MouseTracker = (props) => {
  const { children } = props;
  const ref = useRef();
  const [point, setPoint] = useState({ x: null, y: null });

  const state = useMemo(() => proxy({
    x: null,
    y: null,
  }), []);
  const snap = useSnapshot(state);

  const handleMouseOver = useCallback(
    /**
     * @returns {import('react').MouseEventHandler}
     * @param {MouseEvent} e 
     */
    (e) => {
      if (!e.ctrlKey) {
        if (e.target instanceof HTMLVideoElement && e.layerX >= 0 && e.layerY >= 0) {
          state.x = e.layerX;
          state.y = e.layerY;
        } else {
          state.x = null;
          state.y = null;
        }
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

  const handleMouseClick = useCallback(
    /**
     * @returns {import('react').MouseEventHandler}
     * @param {MouseEvent} e 
     */
    (e) => {
      const x = e.ctrlKey ? snap.x : e.layerX;
      const y = e.ctrlKey ? snap.y : e.layerY;

      console.log({ x, y });
      if (e.target instanceof HTMLVideoElement && x >= 0 && y >= 0) {
        if (point.x !== null && point.y !== null) {
          console.log({ 
            x1: point.x, y1: point.y,
            x2: x, y2: y,
            point1: point, point2: { x, y },
            width: Math.abs(point.x - x), height: Math.abs(point.y - y)
          })
          setPoint({ x: null, y: null });
        } else {
          setPoint({ x, y });
        }
      }
    }, [snap, point]
  )
  useEffect(() => {
    const el = ref.current;
    el.addEventListener('click', handleMouseClick);
    return () => {
      el.removeEventListener('click', handleMouseClick);
    };
  }, [handleMouseClick]);

  const getTitle = useCallback(() => {
    if(snap.x !== null && snap.y !== null) {
      return `x:${snap.x}, y:${snap.y}`;
    } else {
      return ""
    }
  }, [snap]);

  return (
    <Tooltip followCursor={true} title={getTitle()} ref={ref}>
      {children}
    </Tooltip>
  )
}

MouseTracker.propTypes = {
  children: PropTypes.element.isRequired
}

export default MouseTracker;
