import React from 'react';
import { TesseractContext } from './TerreractProvider';

export const useTesseract = () => React.useContext(TesseractContext);
