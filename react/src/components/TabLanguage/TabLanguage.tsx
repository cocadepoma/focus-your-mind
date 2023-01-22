import { useContext, useEffect, useState } from "react";

import { FormControl, FormControlLabel, Radio, RadioGroup, Typography } from "@mui/material";
import { GoBackToolbar } from "../GoBackToolbar/GoBackToolbar";
import { LANGUAGES } from "../../constants";

import './styles.css';
import { LanguageContext } from '../../contexts/LanguageContext/LanguageContext';
import { Languages } from "../../types/types";

interface Props {
  handleClose: () => void;
}

export const TabLanguage = ({ handleClose }: Props) => {
  const { currentLanguage, changeLanguage, tr } = useContext(LanguageContext);

  const onChange = (val: Languages) => {
    chrome.storage.sync.set({ language: val });
    changeLanguage(val);
  };

  return (
    <div className="tab-language__container">
      <Typography variant="h6" sx={{ fontFamily: "'VT323', monospace", textAlign: 'center', color: '#fff', animation: 'fadeIn 0.3s' }}>
        {tr('Language Selector')}
      </Typography>

      <FormControl fullWidth>
        <RadioGroup
          onChange={(e, value) => onChange(value as Languages)}
          value={currentLanguage}
          color="secondary"
          sx={{ justifyContent: 'space-between', marginTop: '0.3rem' }}
        >
          {LANGUAGES.map((lang) => (
            <div className="tab-language__list--item" onClick={() => onChange(lang.value)}>
              <FormControlLabel
                sx={{
                  '& .PrivateSwitchBase-root': {
                    transition: 'all 0.3s ease-in-out',
                  },
                  '& .PrivateSwitchBase-root:hover': {
                    backgroundColor: 'rgb(244 176 243 / 5%)'
                  },
                  '& span.MuiFormControlLabel-label': { fontSize: '1rem', letterSpacing: '1.2px', fontFamily: "'VT323', monospace", userSelect: 'none', color: 'white' },
                }}
                value={lang.value}
                control={<Radio color='error' size='small' />}
                label={lang.label}
              />
            </div>
          ))}
        </RadioGroup>
      </FormControl>
      <GoBackToolbar handleClose={handleClose} />
    </div>
  );
};
