import { proxy, useSnapshot } from 'valtio';

export const state = proxy({
  rows: [],
});

const createRow = ({ jobId, data: { text, confidence, blocks, paragraphs, lines } }) => ({
  jobId,
  text,
  confidence,
  blocks,
  paragraphs,
  lines,
});
export const actions = {
  addLog: (tesseractLog) => {
    state.rows.push(createRow(tesseractLog));
  },
  clearLogs: () => {
    state.rows.length = 0;
  },
};

export const useTesseractLogger = () => {
  const snapshot = useSnapshot(state);

  return snapshot.rows;
};
