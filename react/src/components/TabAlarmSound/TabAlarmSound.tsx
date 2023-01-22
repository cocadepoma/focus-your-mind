import { MouseEvent, useContext, useEffect, useRef, useState } from "react";

import { FormControl, FormControlLabel, IconButton, Radio, RadioGroup, Tooltip, Typography } from "@mui/material";
import PlayCircleOutlineIcon from '@mui/icons-material/PlayCircleOutline';

import { GoBackToolbar } from "..";

import { SOUND_ALARMS } from "../../constants";

import './styles.css';
import { SoundFile } from "../../types/types";
import { StopCircleOutlined } from "@mui/icons-material";
import { LanguageContext } from "../../contexts/LanguageContext/LanguageContext";

interface Props {
  handleClose: () => void;
}

export const TabAlarmSound = ({ handleClose }: Props) => {
  const { tr } = useContext(LanguageContext);

  const [value, setValue] = useState('');
  const [currentSound, setCurrentSound] = useState<SoundFile>();
  const [isLoading, setIsLoading] = useState(true);

  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    getSyncSoundApp();

    return () => {
      if (audioRef.current) {
        setCurrentSound(undefined);
        audioRef.current.pause();
      }
    }
  }, []);

  const getSyncSoundApp = async () => {
    const { sound = 'ping1' } = await chrome.storage.sync.get(null);

    setValue(sound);
    setIsLoading(false);
  };

  const onChange = (val: string) => {
    chrome.storage.sync.set({ sound: val });
    setValue(val);
  };

  const handlePlaySound = (event: MouseEvent, val: string) => {
    event.stopPropagation();

    if (currentSound) {
      stopSound();
    }

    const soundObj = SOUND_ALARMS.find(sound => sound.value === val);
    setCurrentSound(soundObj);
    audioRef.current = new Audio(soundObj?.path);
    audioRef.current.play();

    setTimeout(() => {
      stopSound();
    }, 5000);
  };

  const handleStopSound = () => {
    stopSound();
  };

  const stopSound = () => {
    setCurrentSound(undefined);
    audioRef.current!.pause();
  };

  return (
    <div className="tab-alarm-sound__container">
      <Typography variant="h6" sx={{ fontFamily: "'VT323', monospace", textAlign: 'center', color: '#fff', animation: 'fadeIn 0.3s' }}>
        {tr('Alarm Sounds')}
      </Typography>

      <FormControl fullWidth>
        <RadioGroup
          onChange={(e, value) => onChange(value)}
          value={value}
          color="secondary"
          sx={{ justifyContent: 'space-between', marginTop: '0.3rem' }}
        >
          {!isLoading && SOUND_ALARMS.map((sound) => (
            <div className="tab-alarm-sound__list--item" onClick={() => onChange(sound.value)}>
              <FormControlLabel
                sx={{
                  '& .PrivateSwitchBase-root': {
                    transition: 'all 0.3s ease-in-out',
                  },
                  '& .PrivateSwitchBase-root:hover': {
                    backgroundColor: 'rgb(244 176 243 / 5%)'
                  },
                  '& span.MuiFormControlLabel-label': { fontSize: '1rem', letterSpacing: '1.2px', fontFamily: "'VT323', monospace", userSelect: 'none', color: 'white' },
                }}
                value={sound.value}
                control={<Radio color='error' size='small' />}
                label={sound.label}
              />
              {
                currentSound?.value === sound.value
                  ? (
                    <Tooltip title={`${tr('Stop')} ${sound.label} ${tr('sound')}`}>
                      <IconButton size="small" onClick={handleStopSound} sx={{ color: 'white', animation: 'fadeIn 0.3s' }}>
                        <StopCircleOutlined fontSize="small" />
                      </IconButton>
                    </Tooltip>
                  )
                  : (
                    <Tooltip title={`${tr('Play')} ${sound.label} ${tr('sound')}`}>
                      <IconButton size="small" onClick={(e) => handlePlaySound(e, sound.value)} sx={{ color: 'white', animation: 'fadeIn 0.3s' }}>
                        <PlayCircleOutlineIcon fontSize="small" />
                      </IconButton>
                    </Tooltip>
                  )
              }

            </div>
          ))}
        </RadioGroup>
      </FormControl>
      <GoBackToolbar handleClose={handleClose} />
    </div>
  );
};
