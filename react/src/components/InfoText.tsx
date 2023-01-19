import { Typography } from '@mui/material'

interface Props {
  isFocusing: boolean;
  isResting: boolean;
  isFinished: boolean;
  isPending: boolean;
}

export const InfoText = ({ isFocusing, isResting, isFinished, isPending }: Props) => {
  return (
    <div>
      {isFocusing && isFinished && (
        <Typography variant="body1" sx={{ fontFamily: "'VT323', monospace", color: 'white', textAlign: 'center', marginBottom: '1rem', userSelect: 'none', fontSize: '1.3rem' }}>Focus time finished</Typography>
      )}

      {isFocusing && isPending && <Typography sx={{ fontFamily: "'VT323', monospace", textAlign: 'center', color: 'rgba(255,255,255,0.7)', userSelect: 'none', fontSize: '1.3rem' }} variant="body1">Focus Time</Typography>}
      {isResting && isPending && <Typography sx={{ fontFamily: "'VT323', monospace", textAlign: 'center', color: 'rgba(255,255,255,0.7)', userSelect: 'none', fontSize: '1.3rem' }} variant="body1">Rest Time</Typography>}
    </div>
  )
}
