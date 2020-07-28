import { createContext, useContext } from 'react';

export const AnalyzerContext = createContext();

export function useAnalyzerContext() {
  return useContext(AnalyzerContext);
}
