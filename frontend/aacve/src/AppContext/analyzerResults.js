import { createContext, useContext } from 'react';

export const AnalyzerContext = createContext();

export function useAuth() {
  return useContext(AnalyzerContext);
}
