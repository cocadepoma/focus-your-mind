import { IconButton, Tooltip } from "@mui/material";
import ForwardIcon from '@mui/icons-material/Forward';
import { GoBackToolbar } from "./GoBackToolbar";

interface Props {
  handleClose: () => void;
}

export const TabLanguage = ({ handleClose }: Props) => {

  return (
    <div>
      <h3>
        TabLanguage
      </h3>

      <GoBackToolbar handleClose={handleClose} />
    </div>
  );
};