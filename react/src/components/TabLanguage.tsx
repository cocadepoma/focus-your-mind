import { IconButton, Tooltip } from "@mui/material";
import ForwardIcon from '@mui/icons-material/Forward';
import { GoBackToolbar } from "./GoBackToolbar";
import { useEffect } from "react";

interface Props {
  handleClose: () => void;
}

export const TabLanguage = ({ handleClose }: Props) => {

  useEffect(() => {
    localStorage.setItem('lastView', 'language');

    return () => {
      localStorage.setItem('lastView', 'home');
    }
  }, []);

  return (
    <div>
      <h3>
        TabLanguage
      </h3>

      <GoBackToolbar handleClose={handleClose} />
    </div>
  );
};
