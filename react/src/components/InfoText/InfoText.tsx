import { Typography } from '@mui/material'
import { useEffect, useState } from 'react';

const typographyStyles = {
  fontFamily: "'VT323', monospace",
  textAlign: 'center',
  color: 'rgba(255,255,255,0.7)',
  userSelect: 'none',
  fontSize: '1.3rem',
  animation: 'fadeIn 0.3s'
};

const blocklistStyles = {
  marginTop: '0.3rem',
  fontSize: '0.8rem',
  position: 'fixed',
  bottom: '19px',
  left: '50%',
  transform: 'translateX(-50%)',
  color: 'red'
};

interface Props {
  isFocusing: boolean;
  isResting: boolean;
  isFinished: boolean;
  isPending: boolean;
}

export const InfoText = ({ isFocusing, isResting, isFinished, isPending }: Props) => {
  const [status, setStatus] = useState<null | 'whitelist' | 'blacklist'>(null);

  useEffect(() => {
    checkIfIsWhiteOrBlackListEnabled();
  }, [isFocusing, isPending]);

  const checkIfIsWhiteOrBlackListEnabled = async () => {
    const params = await chrome.storage.sync.get(null);

    if (params.isWhiteListEnabled) {
      setStatus('whitelist');
      return;
    }

    if (params.isBlackListEnabled) {
      setStatus('blacklist');
      return;
    }

    setStatus(null);
  };

  return (
    <div>
      {isFocusing && isFinished && (
        <Typography variant="body1" sx={typographyStyles}>Focus time finished</Typography>
      )}

      {isFocusing && isPending && (
        <>
          <Typography
            sx={typographyStyles}
            variant="body1"
          >
            Focus Time
          </Typography>

          {status === 'blacklist' && <Typography className="message-pulse" sx={{ ...typographyStyles, ...blocklistStyles }} variant="body1">Black List Enabled</Typography>}
          {status === 'whitelist' && <Typography className="message-pulse" sx={{ ...typographyStyles, ...blocklistStyles }} variant="body1">White List Enabled</Typography>}
        </>
      )}

      {isResting && isPending && <Typography sx={typographyStyles} variant="body1">Rest Time</Typography>}
    </div>
  )
}
