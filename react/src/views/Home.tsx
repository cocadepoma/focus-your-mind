import { useContext, useEffect, useRef, useState } from "react";

import Countdown, { zeroPad } from "react-countdown";

import {
  InfoText,
  ActionButtons,
  TabUrlBlocker,
  TabAlarmSound,
  TabLanguage,
  RowRadioButtonsFocus
} from "../components";

import {
  getAppStorageStatus,
  getAppSyncPeriods,
  getBackgroundGif,
  setBadgeIconByColor
} from "../utils/utils";

import { State, Status } from "../types/types";

import './styles.css';
import { LanguageContext } from "../contexts/LanguageContext/LanguageContext";
interface AppState {
  status: Status,
  type: State,
};

const initialState: AppState = {
  status: 'focusing',
  type: 'not-started',
};

export const Home = () => {
  const { tr } = useContext(LanguageContext);

  const divRef = useRef<HTMLDivElement>(null);
  const [appState, setAppState] = useState<AppState>({
    status: 'focusing',
    type: 'not-started',
  });

  const [appTime, setAppTime] = useState<number>(Date.now() + 1000);
  const [focusPeriod, setFocusPeriod] = useState('30');
  const [restPeriod, setRestPeriod] = useState('5');
  const [isURLBlockerTabEnabled, setIsURLBlockerTabEnabled] = useState(false);
  const [isLanguageTabEnabled, setIsLanguageTabEnabled] = useState(false);
  const [isAlarmTabEnabled, setIsAlarmTabEnabled] = useState(false);

  const isFocusing = appState.status === 'focusing';
  const isResting = appState.status === 'resting';

  const isNotStarted = appState.type === 'not-started';
  const isPending = appState.type === 'pending';
  const isFinished = appState.type === 'finish';

  const isInIdle = (isFocusing && isNotStarted);
  const isRestingFinished = (isResting && isFinished);

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
    localStorage.clear();

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
    localStorage.clear();

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

  const handleStopFocus = () => {
    localStorage.clear();

    chrome.alarms.clearAll();

    setBadgeIconByColor('yellow');
    setAppTime(Date.now());

    chrome.storage.local.set({ status: 'focusing' });
    chrome.storage.local.set({ type: 'finish' });
    chrome.storage.local.set({ time: Date.now() });
  };

  const handleClearAlarms = () => {
    localStorage.clear();

    chrome.alarms.clearAll();

    setAppState(initialState);
    setBadgeIconByColor('purple');
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

  const renderer = ({ minutes, seconds }: { minutes: string | number, seconds: string | number }) => {
    if (isFocusing && isFinished) return;
    if (isInIdle || isRestingFinished) return;

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
      {
        !isAlarmTabEnabled && !isURLBlockerTabEnabled && !isLanguageTabEnabled && (
          <>
            <Countdown
              className="home__countdown"
              date={appTime}
              renderer={renderer}
            />

            {
              (isInIdle || isRestingFinished) && (
                <>
                  <div className="home__countdown--container">
                    <span>
                      {zeroPad(focusPeriod)}
                    </span>
                    <span style={{ paddingBottom: 2 }}>
                      :
                    </span>
                    <span>
                      {zeroPad(0)}
                    </span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-evenly', marginTop: '0.4rem' }}>
                    <RowRadioButtonsFocus onChange={onChangeFocusPeriod} value={focusPeriod} values={['30', '35', '40']} label={tr('Focus Time')} />
                    <div style={{ height: '1rem' }} />
                    <RowRadioButtonsFocus onChange={onChangeRestPeriod} value={restPeriod} values={['5', '8', '10']} label={tr('Rest Time')} />
                  </div>
                </>
              )
            }

            <InfoText isFocusing={isFocusing} isResting={isResting} isFinished={isFinished} isPending={isPending} />

            <ActionButtons
              handleClearAlarms={handleClearAlarms}
              handleStartRest={handleStartRest}
              handleStopFocus={handleStopFocus}
              handleStartFocus={handleStartFocus}
              isInIdle={isInIdle}
              isRestingFinished={isRestingFinished}
              isFinished={isFinished}
              isFocusing={isFocusing}
              isPending={isPending}
              isResting={isResting}
              handleOpenURLTab={() => setIsURLBlockerTabEnabled(true)}
              handleOpenAlarmTab={() => setIsAlarmTabEnabled(true)}
              handleOpenLanguageTab={() => setIsLanguageTabEnabled(true)}
            />
          </>
        )
      }

      {isURLBlockerTabEnabled && <TabUrlBlocker handleClose={() => setIsURLBlockerTabEnabled(false)} />}
      {isAlarmTabEnabled && <TabAlarmSound handleClose={() => setIsAlarmTabEnabled(false)} />}
      {isLanguageTabEnabled && <TabLanguage handleClose={() => setIsLanguageTabEnabled(false)} />}

    </div >
  );
};
