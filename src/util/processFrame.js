import { useOpenCv } from "opencv-react";
import { useMemo } from "react";

// const vMatrixVisible = () => {
//   return true;
// }


const useCvProcess = (createProcess) => {
  const { cv, loaded } = useOpenCv();
  const [
    preProcess,
    process, 
    clearProcess
  ] = useMemo(() => createProcess(cv, loaded), [cv, loaded, createProcess]);

  return { preProcess, process, clearProcess, cv, loaded };
}

const createProcessGrayScaleAndShow = (cv, loaded) => {
  if (loaded) {
    let dst;
    window.PROCESS_DST = dst;

    return [
      () => {
        dst = new cv.Mat();
      },
      ({ src, canvas }) => {
        
        cv.cvtColor(src, dst, cv.COLOR_RGBA2GRAY);
        cv.imshow(canvas, dst);

      },
      () => {
        dst.delete();
        dst = null;
      }
    ]
  } else {
    return [() => {}, () => {}]
  }
}

const processFrame = {
  useCvProcess,
  createProcessGrayScaleAndShow
}

export default processFrame;
