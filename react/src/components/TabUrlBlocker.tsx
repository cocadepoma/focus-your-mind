import { FormControlLabel, IconButton, Switch, Tooltip, Typography } from "@mui/material";
import ForwardIcon from '@mui/icons-material/Forward';
import { GoBackToolbar } from "./GoBackToolbar";
import { useEffect, useState } from "react";
import PlaylistAddIcon from '@mui/icons-material/PlaylistAdd';
import { WhiteList } from "./WhiteList";
import { BlackList } from "./BlackList";


const switchStyles = {
  animation: 'fadeIn 0.3s',
  '& .MuiTypography-body1': {
    color: 'rgba(255,255,255,0.7)',
    '&:hover': {
      backgroundColor: 'rgb(255 126 255 / 7%)',
    },
  },
  '& .MuiSwitch-switchBase.Mui-checked': {
    color: '#fff',
    '&:hover': {
      backgroundColor: 'rgb(255 126 255 / 7%)',
    },
  },
  '& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track': {
    backgroundColor: 'rgb(255 163 254)',
  },
}
interface Props {
  handleClose: () => void;
}

export const TabUrlBlocker = ({ handleClose }: Props) => {
  const [switchState, setSwitchState] = useState({
    isWhiteListEnabled: false,
    isBlackListEnabled: false,
  });

  const [isBlackListViewEnabled, setIsBlackListViewEnabled] = useState(false);
  const [isWhiteListViewEnabled, setIsWhiteListViewEnabled] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    checkSyncStorageStatus();
  }, []);

  const checkSyncStorageStatus = async () => {
    const { isWhiteListEnabled = false, isBlackListEnabled = false } = await chrome.storage.sync.get(null);
    setSwitchState({
      isWhiteListEnabled,
      isBlackListEnabled
    });

    setIsLoading(false);
  };

  const onSwitchChange = (type: 'blacklist' | 'whitelist') => {
    if (switchState.isBlackListEnabled && type === 'whitelist') {
      setSwitchState({
        isBlackListEnabled: false,
        isWhiteListEnabled: true,
      });
      chrome.storage.sync.set({
        isBlackListEnabled: false,
        isWhiteListEnabled: true,
      });
      return;
    }

    if (switchState.isWhiteListEnabled && type === 'blacklist') {
      setSwitchState({
        isBlackListEnabled: true,
        isWhiteListEnabled: false,
      });
      chrome.storage.sync.set({
        isBlackListEnabled: true,
        isWhiteListEnabled: false,
      });
      return;
    }

    if (type === 'whitelist') {
      setSwitchState({
        ...switchState,
        isWhiteListEnabled: !switchState.isWhiteListEnabled,
      });
      chrome.storage.sync.set({
        ...switchState,
        isWhiteListEnabled: !switchState.isWhiteListEnabled,
      });
      return;
    }

    setSwitchState({
      ...switchState,
      isBlackListEnabled: !switchState.isBlackListEnabled
    });
    chrome.storage.sync.set({
      ...switchState,
      isBlackListEnabled: !switchState.isBlackListEnabled
    });

  };

  const handleStartClose = () => {
    if (isBlackListViewEnabled || isWhiteListViewEnabled) {
      setIsBlackListViewEnabled(false);
      setIsWhiteListViewEnabled(false);
    } else {
      handleClose();
    }
  }

  return (
    <div style={{ animation: 'fadeIn 0.3s' }}>
      {!isBlackListViewEnabled && !isWhiteListViewEnabled && (
        <Typography variant="h6" sx={{ fontFamily: "'VT323', monospace", textAlign: 'center', color: '#fff', animation: 'fadeIn 0.3s' }}>
          URL Blocker
        </Typography>
      )}

      {
        !isBlackListViewEnabled && !isWhiteListViewEnabled && !isLoading && (
          <div className="tab-url-blocker__container" style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', height: '2.8rem' }}>
              <FormControlLabel
                label="BlackList"
                control={
                  <Switch
                    sx={switchStyles}
                    checked={switchState.isBlackListEnabled}
                    onChange={() => onSwitchChange('blacklist')}
                  />
                }
              />
              <Tooltip title="Add URL to Blacklist">
                <IconButton disabled={!switchState.isBlackListEnabled} size="small" onClick={() => setIsBlackListViewEnabled(true)} sx={{ color: 'white', animation: 'fadeIn 0.3s' }}>
                  <PlaylistAddIcon fontSize="medium" />
                </IconButton>
              </Tooltip>
            </div>
            <Typography variant="body1" sx={{ fontFamily: "'VT323', monospace", color: 'rgba(255,255,255,0.75)', animation: 'fadeIn 0.3s', fontSize: '0.8rem', marginTop: '-0.5rem' }}>
              Pages added in the blacklist will be blocked in focus time.
            </Typography>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', height: '3rem' }}>
              <FormControlLabel
                label="Whitelist"
                control={
                  <Switch
                    sx={switchStyles}
                    checked={switchState.isWhiteListEnabled}
                    onChange={() => onSwitchChange('whitelist')}
                  />
                }
              />

              <Tooltip title="Add URL to Whitelist">
                <IconButton disabled={!switchState.isWhiteListEnabled} size="small" onClick={() => setIsWhiteListViewEnabled(true)} sx={{ color: 'white', animation: 'fadeIn 0.3s' }}>
                  <PlaylistAddIcon fontSize="medium" />
                </IconButton>
              </Tooltip>
            </div>
            <Typography variant="body1" sx={{ fontFamily: "'VT323', monospace", color: 'rgba(255,255,255,0.75)', animation: 'fadeIn 0.3s', fontSize: '0.8rem', marginTop: '-0.5rem' }}>
              Only pages included in the whitelist will be allowed in focus time.
            </Typography>
          </div>
        )
      }

      {isBlackListViewEnabled && !isWhiteListViewEnabled && <BlackList />}

      {!isBlackListViewEnabled && isWhiteListViewEnabled && <WhiteList />}

      <GoBackToolbar handleClose={handleStartClose} />
    </div>
  );
};
