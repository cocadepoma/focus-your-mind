import React, { useEffect, useState } from 'react'
import LANGS from '../../lang/lang.json';
import { Languages } from '../../types/types';
import { LanguageContext } from './LanguageContext';

interface Props {
  children: React.ReactNode;
}

type TypeLanguages = {
  [key in Languages]: {
    [key: string]: string
  }
}

export const LanguageProvider = ({ children }: Props) => {
  const [currentLanguage, setCurrentLanguage] = useState<Languages>('en');

  useEffect(() => {
    loadUserSyncLanguage();
  }, []);

  const loadUserSyncLanguage = async () => {
    const { language = 'en' } = await chrome.storage.sync.get(null);
    setCurrentLanguage(language);
  };

  const changeLanguage = (lang: Languages) => {
    setCurrentLanguage(lang);
  };

  const tr = (id: string) => {
    return (LANGS as TypeLanguages)[currentLanguage][id] || id;
  };

  return (
    <LanguageContext.Provider value={{
      currentLanguage,
      changeLanguage,
      tr,
    }}>
      {children}
    </LanguageContext.Provider>
  )
}
