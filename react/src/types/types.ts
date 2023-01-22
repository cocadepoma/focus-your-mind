export type Status = 'focusing' | 'resting';

export type State = 'not-started' | 'pending' | 'finish';

export interface SoundFile {
  value: string;
  label: string;
  path: string;
}

export type Languages = 'en' | 'es' | 'fr' | 'de';