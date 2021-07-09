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
    // let dst2;
    // const rect = new cv.Rect(337, 120, 696, 576);
    window.PROCESS_DST = dst;

    return [
      () => {
        dst = new cv.Mat();
        // dst2 = new cv.Mat();
      },
      ({ src, canvas }) => {
        // dst = src.roi(rect);
        // cv.cvtColor(dst, dst2, cv.COLOR_RGBA2GRAY);
        cv.cvtColor(src, dst, cv.COLOR_RGBA2GRAY);
        cv.imshow(canvas, dst);

      },
      () => {
        dst.delete();
        // dst2.delete();
        dst = null;
        // dst2 = null;
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
