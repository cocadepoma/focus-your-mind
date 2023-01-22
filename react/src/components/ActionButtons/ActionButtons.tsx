import { IconButton, Tooltip } from '@mui/material'

import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import StopIcon from '@mui/icons-material/Stop';
import DirectionsRunIcon from '@mui/icons-material/DirectionsRun';
import ForwardIcon from '@mui/icons-material/Forward';

import HttpIcon from '@mui/icons-material/Http';
import VolumeUpIcon from '@mui/icons-material/VolumeUp';
import PublicIcon from '@mui/icons-material/Public';
import { LanguageContext } from '../../contexts/LanguageContext/LanguageContext';
import { useContext } from 'react';

const iconButtonStyles = {
  color: 'white',
  position: 'absolute',
  left: 8,
  bottom: 1,
  animation: 'fadeIn 0.3s',
};

interface Props {
  isFocusing: boolean;
  isFinished: boolean;
  isResting: boolean;
  isPending: boolean;
  isInIdle: boolean;
  isRestingFinished: boolean;


  handleStartRest: () => void;
  handleClearAlarms: () => void;
  handleStopFocus: () => void;
  handleStartFocus: () => void;
  handleOpenURLTab: () => void;
  handleOpenAlarmTab: () => void;
  handleOpenLanguageTab: () => void;
}

export const ActionButtons = ({
  isFocusing,
  isFinished,
  isResting,
  isPending,
  isInIdle,
  isRestingFinished,

  handleStartRest,
  handleClearAlarms,
  handleStopFocus,
  handleStartFocus,
  handleOpenURLTab,
  handleOpenAlarmTab,
  handleOpenLanguageTab,
}: Props) => {
  const { tr } = useContext(LanguageContext);

  return (
    <div
      style={{
        display: 'flex',
        justifyContent: 'center',
        height: '2rem',
        backgroundColor: 'rgb(255 255 255 / 7%)',
        boxShadow: 'rgb(0 0 0 / 42%) 3px 2px 4px -2px',
        position: 'fixed',
        bottom: 12,
        left: 17,
        right: 17,
        animation: 'fadeIn 0.3s'
      }}
    >
      {
        (isInIdle || isRestingFinished) && (
          <>
            <Tooltip title={tr('URL Blocker')}>
              <IconButton size="small" onClick={handleOpenURLTab} sx={iconButtonStyles}>
                <HttpIcon fontSize="small" />
              </IconButton>
            </Tooltip>

            <Tooltip title={tr('Alarm Sounds')}>
              <IconButton size="small" onClick={handleOpenAlarmTab} sx={{ ...iconButtonStyles, left: 45 }}>
                <VolumeUpIcon fontSize="small" />
              </IconButton>
            </Tooltip>

            <Tooltip title={tr('Language')}>
              <IconButton size="small" onClick={handleOpenLanguageTab} sx={{ ...iconButtonStyles, left: 82 }}>
                <PublicIcon fontSize="small" />
              </IconButton>
            </Tooltip>

            <Tooltip title={tr('Start Focus Time')}>
              <IconButton size="small" onClick={handleStartFocus} sx={{ ...iconButtonStyles, right: 8, left: 'unset' }}>
                <PlayArrowIcon fontSize="small" />
              </IconButton>
            </Tooltip>
          </>
        )
      }

      {
        isFocusing && isFinished && (
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <Tooltip title={tr('Start Rest Time')}>
              <IconButton size="small" onClick={handleStartRest} sx={{ ...iconButtonStyles, right: 8, left: 'unset' }}>
                <ForwardIcon fontSize="small" />
              </IconButton>
            </Tooltip>
          </div>
        )
      }

      {
        (!isInIdle && !isRestingFinished) && (
          <Tooltip title={tr('Stop')}>
            <IconButton
              size="small"
              onClick={handleClearAlarms}
              sx={{
                color: 'white',
                position: 'absolute',
                right: isResting && isPending ? 8 : 45,
                bottom: 1,
                animation: 'fadeIn 0.3s'
              }}
            >
              <StopIcon fontSize="small" />
            </IconButton>
          </Tooltip>
        )
      }


      {
        isFocusing && isPending && (
          <Tooltip title={tr('Skip and Rest')}>
            <IconButton size="small" onClick={handleStopFocus} sx={{ ...iconButtonStyles, right: 8, left: 'unset' }}>
              <DirectionsRunIcon fontSize="small" />
            </IconButton>
          </Tooltip>
        )
      }
    </div>
  )
}
