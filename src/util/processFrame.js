import { useOpenCv } from "opencv-react";
import { useMemo } from "react";
import { useTesseract } from './useTesseract';
import { actions } from './TesseractLogger';

// const vMatrixVisible = () => {
//   return true;
// }


const useCvProcess = (createProcess) => {
  const { cv, loaded } = useOpenCv();
  const { scheduler } = useTesseract();
  const [
    preProcess,
    process, 
    clearProcess
  ] = useMemo(() => createProcess(cv, loaded, scheduler), [cv, loaded, createProcess, scheduler]);

  return { preProcess, process, clearProcess, cv, loaded };
}


/**
 * 
 * @param {import("opencv-react").cv} cv 
 * @param {boolean} loaded 
 * @param {import("tesseract.js").Scheduler} scheduler 
 * @returns 
 */
const createProcessGrayScaleAndShow = (cv, loaded, scheduler) => {
  if (loaded) {
    let dst;
    // let dst2;
    // const rect = new cv.Rect(337, 120, 696, 576);
    window.PROCESS_DST = dst;

    return [
      () => {
        dst = new cv.Mat();
        actions.clearLogs();
        // dst2 = new cv.Mat();
      },
      ({ src, canvas }) => {
        // dst = src.roi(rect);
        // cv.cvtColor(dst, dst2, cv.COLOR_RGBA2GRAY);
        cv.cvtColor(src, dst, cv.COLOR_RGBA2GRAY);
        cv.imshow(canvas, dst);

        if (scheduler.getQueueLen() < 5) {
          console.debug(new Date(), 'add job');
          (async () => {
            actions.addLog(await scheduler.addJob('recognize', canvas));
            // console.log(log);
          })()
        }

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
  createProcessGrayScaleAndShow,
}

export default processFrame;
