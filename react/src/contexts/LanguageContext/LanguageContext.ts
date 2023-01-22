import { createContext } from "react";
import { Languages } from '../../types/types';


export interface LanguageContextProps {
  currentLanguage: Languages;

  changeLanguage: (lang: Languages) => void;
  tr: (id: string) => string;
}

export const LanguageContext = createContext({} as LanguageContextProps);