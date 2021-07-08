import React from 'react';
import { Modal, Backdrop, Fade } from '@material-ui/core';
import PropTypes from 'prop-types';
import useStyle from '../style/useStyle';

const CannotUseModal = ({ open, handleOpen }) => {
  const classes = useStyle();

  return (
    <Modal 
      aria-labelledby="cannot-use-modal"
      aria-describedby="cannot-use-this-site-without-chrome"
      className={classes.cannotUseModal}
      open={open}
      onClose={handleOpen}
      closeAfterTransition
      BackdropComponent={Backdrop}
      BackdropProps={{
        timeout: 500,
      }}
    >
      <Fade in={open}>
        <div className={classes.paper}>
          <h2 id="transition-modal-title">사용 불가</h2>
          <p id="transition-modal-description">Chrome에서만 정상 동작합니다.</p>
        </div>
      </Fade>
    </Modal>
  )
}


CannotUseModal.defaultProps = {
  open: false,
}

CannotUseModal.propTypes = {
  open: PropTypes.bool.isRequired,
  handleOpen: PropTypes.func.isRequired,
}

export default CannotUseModal;
