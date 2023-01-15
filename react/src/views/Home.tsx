import { useEffect, useRef, useState } from "react";

import { IconButton, Tooltip, Typography } from "@mui/material";
import Countdown, { zeroPad } from "react-countdown";

import { RowRadioButtonsFocus } from "../components/RadioButtonsFocus";
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import StopIcon from '@mui/icons-material/Stop';
import DirectionsRunIcon from '@mui/icons-material/DirectionsRun';

import { getAppStorageStatus, getAppSyncPeriods, getBackgroundGif, setBadgeIconByColor } from "../utils/utils";
import { State, Status } from "../types/types";

import './styles.css';

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
  const [focusPeriod, setFocusPeriod] = useState('30');
  const [restPeriod, setRestPeriod] = useState('5');

  useEffect(() => {
    checkAppStatus();
  }, [appTime]);

  useEffect(() => {
    checkAppTimer();
    checkAppPeriods();
  }, []);

  const checkAppStatus = async () => {
    const { badge, color, status, type } = await getAppStorageStatus();

    divRef.current!.style.backgroundColor = color;
    setBadgeIconByColor(badge);
    setAppState({ status, type });
  };

  const checkAppTimer = async () => {
    const params = await chrome.storage.local.get(null);

    if (params.time) {
      setAppTime(Number(params.time));
    }
  };

  const checkAppPeriods = async () => {
    const { focusPeriod, restPeriod } = await getAppSyncPeriods();

    setFocusPeriod(focusPeriod);
    setRestPeriod(restPeriod);
  };

  const handleStartFocus = () => {
    const timeToWait = Number(focusPeriod) * 60 * 1000;
    setAppState({ status: 'focusing', type: 'pending' });
    setBadgeIconByColor('red');
    setAppTime(() => Date.now() + timeToWait);

    chrome.storage.local.set({ status: 'focusing' });
    chrome.storage.local.set({ type: 'pending' });
    chrome.storage.local.set({ time: Date.now() + timeToWait });
    chrome.alarms.create('focus', { delayInMinutes: Number(focusPeriod) });

    chrome.storage.sync.set({ focusPeriod });
    chrome.storage.sync.set({ restPeriod });

    // Due to refresh countdown component, to review
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
    setAppTime(Date.now() + timeToWait);

    chrome.storage.local.set({ status: 'resting' });
    chrome.storage.local.set({ type: 'pending' });
    chrome.storage.local.set({ time: Date.now() + timeToWait });
    chrome.alarms.create('rest', { delayInMinutes: Number(restPeriod) });

    // Due to refresh countdown component, to review
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

  const renderer = ({ minutes, seconds }: any) => {
    if (appState.status === 'focusing' && appState.type === 'finish') return;

    return (
      <div className="home__countdown--container">
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
    <div
      ref={divRef}
      className="home__container"
      style={{
        backgroundImage: getBackgroundGif({ type: appState.type, status: appState.status }),
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
            <RowRadioButtonsFocus onChange={onChangeFocusPeriod} value={focusPeriod} values={['30', '35', '40', '45']} label="Focus Time" />
            <div style={{ height: '1rem' }} />
            <RowRadioButtonsFocus onChange={onChangeRestPeriod} value={restPeriod} values={['5', '8', '10', '15']} label="Rest Time" />
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
            <Tooltip title={'Start Focus Time'}>
              <IconButton size="small" onClick={handleStartFocus} sx={{ color: 'white', position: 'absolute', right: 13, bottom: 10, border: '1px solid white' }}>
                <PlayArrowIcon fontSize="small" />
              </IconButton>
            </Tooltip>
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
          <IconButton
            size="small"
            onClick={handleClearAlarms}
            sx={{
              color: 'white',
              position: 'absolute',
              right: appState.status === 'resting' && appState.type === 'pending' ? 13 : 56,
              bottom: 10,
              border: '1px solid white'
            }}
          >
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