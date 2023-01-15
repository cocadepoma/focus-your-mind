import { useEffect, useRef, useState } from "react";

import { IconButton, Tooltip, Typography } from "@mui/material";
import Countdown, { zeroPad } from "react-countdown";

import { RowRadioButtonsFocus } from "../components/RadioButtonsFocus";
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import StopIcon from '@mui/icons-material/Stop';
import DirectionsRunIcon from '@mui/icons-material/DirectionsRun';

type Status = 'focusing' | 'resting';

type State = 'not-started' | 'pending' | 'finish';

interface AppState {
  status: Status,
  type: State,
};

const initialState: AppState = {
  status: 'focusing',
  type: 'not-started',
};

export const Home = () => {
  const divRef = useRef<HTMLDivElement>(null);
  const [appState, setAppState] = useState<AppState>({
    status: 'focusing',
    type: 'not-started',
  });

  const [appTime, setAppTime] = useState<number>(Date.now() + 10000);
  const [focusPeriod, setFocusPeriod] = useState('1');
  const [restPeriod, setRestPeriod] = useState('0.5');

  useEffect(() => {
    checkAppStatusColor();
  }, [appTime]);

  useEffect(() => {
    checkAppTimer();
  }, []);

  const checkAppStatusColor = async () => {
    const params = await chrome.storage.local.get(null);
    let color = '';

    switch (params.type) {
      case 'finish':
        if (params.status === 'resting') {
          setBadgeIconByColor('green');
          color = 'rgb(31 76 58)';
        } else {
          setBadgeIconByColor('yellow');
          color = 'rgb(137 116 0)';
        }
        break;
      case 'pending':
        if (params.status === 'focusing') {
          setBadgeIconByColor('red');
          color = 'rgb(111 13 13)';
        } else {
          setBadgeIconByColor('blue');
          color = '#476db2';
        }
        break;
      case 'not-started':
        setBadgeIconByColor('green');
        color = 'rgb(31 76 58)';
        break;
    }

    divRef.current!.style.backgroundColor = color;

    setAppState({
      status: params.status,
      type: params.type,
    });
  };

  const checkAppTimer = async () => {
    const params = await chrome.storage.local.get(null);

    if (params.time) {
      setAppTime(Number(params.time));
    }
  };

  const handleStartFocus = () => {
    const timeToWait = Number(focusPeriod) * 60 * 1000;
    setAppState({
      status: 'focusing',
      type: 'pending',
    });
    divRef.current!.style.backgroundColor = 'rgb(111 13 13)';
    setBadgeIconByColor('red');
    chrome.storage.local.set({ status: 'focusing' });
    chrome.storage.local.set({ type: 'pending' });
    chrome.storage.local.set({ time: Date.now() + timeToWait });

    chrome.alarms.create('focus', { delayInMinutes: Number(focusPeriod) });

    setAppTime(() => Date.now() + timeToWait);

    const timer = setInterval(() => {
      setAppTime(prevTime => prevTime - 1);
    }, 1000);

    return () => {
      clearInterval(timer);
    }
  };

  const handleStartRest = () => {
    chrome.alarms.clearAll();

    const timeToWait = Number(restPeriod) * 60 * 1000;

    setBadgeIconByColor('blue');
    chrome.storage.local.set({ status: 'resting' });
    chrome.storage.local.set({ type: 'pending' });
    chrome.storage.local.set({ time: Date.now() + timeToWait });

    setAppTime(Date.now() + timeToWait);
    chrome.alarms.create('rest', { delayInMinutes: Number(restPeriod) });

    const timer = setInterval(() => {
      setAppTime(prevTime => prevTime - 1);
    }, 1000);

    return () => {
      clearInterval(timer);
    }
  };

  const handleClearAlarms = () => {
    chrome.alarms.clearAll();

    setAppState(initialState);
    setBadgeIconByColor('green');
    setAppTime(Date.now());
    divRef.current!.style.backgroundColor = 'rgb(31 76 58)';

    chrome.storage.local.set({ status: 'focusing' });
    chrome.storage.local.set({ type: 'not-started' });
    chrome.storage.local.set({ time: Date.now() });
  };

  const onChangeFocusPeriod = (value: string) => {
    setFocusPeriod(value);
  };

  const onChangeRestPeriod = (value: string) => {
    setRestPeriod(value);
  };

  const getBackgroundGif = () => {
    if (appState.type === 'pending' && appState.status === 'focusing') {
      return `linear-gradient(to bottom, rgba(66,18, 18, .85), rgba(66,18, 18, .85)), url("./img/cyberpunk-1.gif")`;
    }

    if (appState.type === 'pending' && appState.status === 'resting') {
      return `linear-gradient(to bottom, rgba(18,42, 66, .85), rgba(18,42, 66, .85)), url("./img/cyberpunk.gif")`;
    }

    if (appState.status === 'focusing' && appState.type === 'finish') {
      return `linear-gradient(to bottom, rgba(66,63, 18, .85), rgba(66,63, 18, .85)), url("./img/minion.webp")`;
    }
  };

  const renderer = ({ minutes, seconds }: any) => {
    if (appState.status === 'focusing' && appState.type === 'finish') return;

    return (
      <div style={{
        display: 'flex',
        gap: '5px',
        fontWeight: 'bold',
        fontSize: 30,
        alignItems: 'center',
        justifyContent: 'center',
        color: '#010101b5',
        fontFamily: '"Wallpoet", cursive',
        backgroundColor: 'rgba(255,255,255,0.7)',
        width: '8rem',
        margin: '0 auto',
      }}>
        <span>
          {zeroPad(minutes)}
        </span>
        <span style={{ paddingBottom: 2 }}>
          :
        </span>
        <span>
          {zeroPad(seconds)}
        </span>
      </div>
    )
  };

  return (
    <div ref={divRef}
      style={{
        width: '25rem',
        height: '17rem',
        backgroundColor: 'black',
        display: 'flex',
        flexDirection: 'column',
        gap: '1rem',
        padding: '1.1rem 1rem 1rem 1rem',
        border: '10px solid #0000001c',
        position: 'relative',
        backgroundImage: getBackgroundGif(),
        backgroundPosition: 'center',
        backgroundSize: 'cover',
      }}
    >
      <Countdown
        date={appTime}
        renderer={renderer}
      />

      {
        ((appState.status === 'focusing' && appState.type === 'not-started') || (appState.status === 'resting' && appState.type === 'finish')) && (
          <div style={{ display: 'flex', justifyContent: 'space-evenly' }}>
            <RowRadioButtonsFocus onChange={onChangeFocusPeriod} value={focusPeriod} values={['1', '1.5', '2']} label="Focus Time" />
            <div style={{ height: '1rem' }} />
            <RowRadioButtonsFocus onChange={onChangeRestPeriod} value={restPeriod} values={['0.5', '1', '1.5']} label="Rest Time" />
          </div>
        )
      }

      {
        appState.type === 'pending' && (
          <div>
            {appState.status === 'focusing' && <Typography sx={{ textAlign: 'center', color: 'rgba(255,255,255,0.7)' }} variant="body1">Focus Time</Typography>}
            {appState.status === 'resting' && <Typography sx={{ textAlign: 'center', color: 'rgba(255,255,255,0.7)' }} variant="body1">Rest Time</Typography>}
          </div>
        )
      }

      <div style={{ display: 'flex', justifyContent: 'center' }}>
        {
          ((appState.status === 'focusing' && appState.type === 'not-started') || (appState.status === 'resting' && appState.type === 'finish')) && (
            <>
              <Tooltip title={'Start Focus Time'}>
                <IconButton size="small" onClick={handleStartFocus} sx={{ color: 'white', position: 'absolute', right: 13, bottom: 10, border: '1px solid white' }}>
                  <PlayArrowIcon fontSize="small" />
                </IconButton>
              </Tooltip>
            </>
          )
        }

        {
          appState.status === 'focusing' && appState.type === 'finish' && (
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              <Typography variant="body1" sx={{ color: 'white', textAlign: 'center', marginBottom: '1rem' }}>Focus time finished, Let's take a nap!</Typography>

              <Tooltip title={'Start Rest Time'}>
                <IconButton size="small" onClick={handleStartRest} sx={{ color: 'white', position: 'absolute', right: 13, bottom: 10, border: '1px solid white' }}>
                  <PlayArrowIcon fontSize="small" />
                </IconButton>
              </Tooltip>
            </div>
          )
        }

        <Tooltip title="Stop">
          <IconButton size="small" onClick={handleClearAlarms} sx={{
            color: 'white',
            position: 'absolute',
            right: appState.status === 'resting' && appState.type === 'pending' ? 13 : 56,
            bottom: 10,
            border: '1px solid white'
          }}>
            <StopIcon fontSize="small" />
          </IconButton>
        </Tooltip>

        {
          appState.status === 'focusing' && appState.type === 'pending' && (
            <Tooltip title={'Skip and Rest'}>
              <IconButton size="small" onClick={handleStartRest} sx={{ color: 'white', position: 'absolute', right: 13, bottom: 10, border: '1px solid white' }}>
                <DirectionsRunIcon fontSize="small" />
              </IconButton>
            </Tooltip>
          )
        }

      </div>
    </div >
  );
};

const setBadgeIconByColor = (color: string) => {
  chrome.action.setIcon({
    path: {
      "16": `./icons/${color}/16-${color}.png`,
      "32": `./icons/${color}/32-${color}.png`,
      "48": `./icons/${color}/48-${color}.png`,
      "128": `./icons/${color}/128-${color}.png`,
    }
  });
};