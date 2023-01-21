import { IconButton, Tooltip } from "@mui/material";
import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew';
import { GoBackToolbar } from "./GoBackToolbar";
import { useEffect } from "react";
interface Props {
  handleClose: () => void;
}

export const TabAlarmSound = ({ handleClose }: Props) => {
  useEffect(() => {
    localStorage.setItem('lastView', 'sounds');

    return () => {
      localStorage.setItem('lastView', 'home');
    }
  }, []);
  return (
    <div>
      <h3>
        Tab alarm sound
      </h3>

      <GoBackToolbar handleClose={handleClose} />
    </div>
  );
};
