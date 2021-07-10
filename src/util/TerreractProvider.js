import React, { useCallback, useMemo, useState } from 'react';
import { createScheduler, createWorker } from 'tesseract.js';

const TesseractContext = React.createContext();

const { Consumer: TesseractConsumer, Provider } = TesseractContext;

export { TesseractConsumer, TesseractContext };

export const TesseractProvider = ({
  workerCreateOption,
  children,
  onLoad,
  useSchedule = true,
  workerNumber = 3,
  loadLanguage = 'eng',
  initialize = 'eng',
  workerParameter = {},
}) => {
  const [loaded, setLoaded] = useState(false);

  const handleOnLoaded = useCallback(
    ({ workers, scheduler }) => {
      if (onLoad) {
        onLoad({ workers, scheduler });
      }
      setLoaded(true);
    },
    [onLoad]
  );

  const scheduler = useMemo(() => useSchedule && createScheduler(), [useSchedule]);

  const workers = useMemo(
    () =>
      Promise.all(
        ((arr) => arr.fill())(new Array(workerNumber)).map(async () => {
          const worker = createWorker(workerCreateOption);
          console.log(new Date(), 'load worker');
          await worker.load();
          await worker.loadLanguage(loadLanguage);
          await worker.initialize(initialize);
          await worker.setParameters(workerParameter);

          return worker;
        })
      ).then((workers) => {
        if (useSchedule) {
          workers.forEach((worker) => {
            scheduler.addWorker(worker);
          });
        }
        handleOnLoaded({ workers, scheduler });
      }),
    [workerCreateOption, workerNumber, loadLanguage, initialize, workerParameter, useSchedule, scheduler, handleOnLoaded]
  );

  const providerValue = useMemo(
    () => ({
      scheduler,
      workers,
      loaded,
    }),
    [loaded, scheduler, workers]
  );

  return <Provider value={providerValue}>{children}</Provider>;
};
