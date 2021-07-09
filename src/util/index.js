import processFrame from "./processFrame";

const clearCanvas = (canvas) => {
  canvas.getContext('2d').clearRect(0, 0, canvas.width, canvas.height);
  canvas.getContext('2d').beginPath();
  canvas.removeAttribute('width');
  canvas.removeAttribute('height');
}

const util = {
  clearCanvas,
  processFrame,
}

export default util;
