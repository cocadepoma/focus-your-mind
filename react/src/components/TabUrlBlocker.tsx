import { IconButton, Tooltip } from "@mui/material";
import ForwardIcon from '@mui/icons-material/Forward';
import { GoBackToolbar } from "./GoBackToolbar";

interface Props {
  handleClose: () => void;
}

export const TabUrlBlocker = ({ handleClose }: Props) => {

  return (
    <div>
      <h3>
        TabUrlBlocker

      </h3>

      <GoBackToolbar handleClose={handleClose} />
    </div>
  );
};
