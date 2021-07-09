import { useOpenCv } from "opencv-react";
import { useMemo } from "react";

// const vMatrixVisible = () => {
//   return true;
// }


const useCvProcess = (createProcess) => {
  const { cv, loaded } = useOpenCv();
  const [process, clearProcess] = useMemo(() => createProcess(cv, loaded), [cv, loaded, createProcess]);

  return { process, clearProcess, cv, loaded };
}

const createProcessGrayScaleAndShow = (cv, loaded) => {
  if (loaded) {
    const dst = new cv.Mat();
    window.PROCESS_DST = dst;

    return [
      ({ src, canvas }) => {

        cv.cvtColor(src, dst, cv.COLOR_RGBA2GRAY);
        cv.imshow(canvas, dst);

      },
      () => {
        dst.delete();
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
