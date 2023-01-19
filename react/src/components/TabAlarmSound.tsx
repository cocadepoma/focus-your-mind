import { IconButton, Tooltip } from "@mui/material";
import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew';
import { GoBackToolbar } from "./GoBackToolbar";
interface Props {
  handleClose: () => void;
}

export const TabAlarmSound = ({ handleClose }: Props) => {

  return (
    <div>
      <h3>
        Tab alarm sound
      </h3>

      <GoBackToolbar handleClose={handleClose} />
    </div>
  );
};
