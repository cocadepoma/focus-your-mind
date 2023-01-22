import { SoundFile } from "../types/types";

import alarm from '../sounds/sound_alarm.mp3';
import happyDay from '../sounds/sound_happyday.mp3';
import light from '../sounds/sound_light.mp3';
import ping1 from '../sounds/sound_ping1.mp3';
import ping2 from '../sounds/sound_ping2.mp3';
import softchime from '../sounds/sound_softchime.mp3';


export const SOUND_ALARMS: SoundFile[] = [
  {
    value: 'alarm',
    label: 'Alarm',
    path: alarm,
  },
  {
    value: 'happyday',
    label: 'Happyday',
    path: happyDay,
  },
  {
    value: 'light',
    label: 'Light',
    path: light,
  },
  {
    value: 'ping1',
    label: 'Ping 1',
    path: ping1,
  },
  {
    value: 'ping2',
    label: 'Ping 2',
    path: ping2,
  },
  {
    value: 'softchime',
    label: 'Softchime',
    path: softchime,
  },
];