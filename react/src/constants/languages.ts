import { Languages } from '../types/types';

interface ILanguages {
  value: Languages,
  label: string;
}

export const LANGUAGES: ILanguages[] = [
  {
    value: 'en',
    label: 'English'
  },
  {
    value: 'es',
    label: 'Español'
  },
  {
    value: 'fr',
    label: 'Français'
  },
  {
    value: 'de',
    label: 'Deutsch'
  }
];