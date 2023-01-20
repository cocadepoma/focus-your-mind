import React, { useState } from 'react';

import { IconButton, Tooltip, Typography } from '@mui/material'
import { InputBase } from '@mui/material';
import KeyboardReturnIcon from '@mui/icons-material/KeyboardReturn';

export const WhiteList = () => {
  const [value, setValue] = useState('');

  const handleInputChange = (event: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>) => {
    setValue(event.target.value);
  };

  const onFormSubmit = () => {
    setValue('');
  };

  return (
    <div className="whitelist__container">
      <Typography variant="h6" sx={{ fontFamily: "'VT323', monospace", textAlign: 'center', color: '#fff', animation: 'fadeIn 0.3s' }}>
        White List
      </Typography>

      <div style={{ display: 'flex', alignItems: 'center', gap: '1.2rem' }}>
        <InputBase
          type="url"
          value={value}
          onChange={handleInputChange}
          sx={{ width: '100%', backgroundColor: 'rgba(255, 255, 255, 0.7)', padding: '0 0.4rem', fontFamily: "'VT323', monospace", color: 'purple' }}
        />

        <Tooltip title="Add URL">
          <IconButton type="submit" disabled={value.length === 0 || false} size="small" onClick={onFormSubmit} sx={{ color: 'white', animation: 'fadeIn 0.3s' }}>
            <KeyboardReturnIcon fontSize="small" />
          </IconButton>
        </Tooltip>
      </div>

    </div>
  );
};
