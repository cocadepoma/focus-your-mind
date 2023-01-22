import { Typography } from '@mui/material'
import { useContext, useEffect, useState } from 'react';
import { LanguageContext } from '../../contexts/LanguageContext/LanguageContext';

const typographyStyles = {
  fontFamily: "'VT323', monospace",
  textAlign: 'center',
  color: 'rgba(255,255,255,0.7)',
  userSelect: 'none',
  fontSize: '1.1rem',
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
  const { tr } = useContext(LanguageContext);

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
        <Typography variant="body1" sx={typographyStyles}>{tr('Focus time finished')}</Typography>
      )}

      {isFocusing && isPending && (
        <>
          <Typography
            sx={typographyStyles}
            variant="body1"
          >
            {tr('Focus Time')}
          </Typography>

          {status === 'blacklist' && (
            <Typography
              className="message-pulse"
              sx={{ ...typographyStyles, ...blocklistStyles }}
              variant="body1"
            >
              {tr('Blacklist enabled')}
            </Typography>
          )}
          {status === 'whitelist' && (
            <Typography
              className="message-pulse"
              sx={{ ...typographyStyles, ...blocklistStyles }}
              variant="body1"
            >
              {tr('Whitelist enabled')}
            </Typography>
          )}
        </>
      )}

      {isResting && isPending && <Typography sx={typographyStyles} variant="body1">{tr('Rest Time')}</Typography>}
    </div>
  )
}
