import { IconButton, Tooltip } from '@mui/material'
import ForwardIcon from '@mui/icons-material/Forward';

interface Props {
  handleClose: () => void;
}

export const GoBackToolbar = ({ handleClose }: Props) => {
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
        left: 12,
        right: 12,
        animation: 'fadeIn 0.3s'
      }}
    >
      <Tooltip title="Go back">
        <IconButton size="small" onClick={handleClose} sx={{ color: 'white', position: 'absolute', left: 8, bottom: 1, animation: 'fadeIn 0.3s' }}>
          <ForwardIcon fontSize="small" sx={{ transform: 'rotate(180deg)' }} />
        </IconButton>
      </Tooltip>
    </div>
  )
}