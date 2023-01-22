import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormControl from '@mui/material/FormControl';
import { Typography } from '@mui/material';

interface Props {
  onChange: (value: string) => void;
  value: string;
  values: string[];
  label: string;
}

export const RowRadioButtonsFocus = ({ value, onChange, values, label }: Props) => {
  return (
    <div>
      <Typography variant="body1" sx={{ fontFamily: "'VT323', monospace", fontSize: '1.1rem', userSelect: 'none', color: 'white' }}>{label}</Typography>

      <FormControl fullWidth>
        <RadioGroup
          aria-labelledby="demo-row-radio-buttons-group-label"
          name="row-radio-buttons-group"
          onChange={(e, value) => onChange(value)}
          value={value}
          color="secondary"
          sx={{ justifyContent: 'space-between' }}
        >
          {values.map((val, i) => (
            <FormControlLabel
              key={`${val}-${i}`}
              sx={{
                '& .PrivateSwitchBase-root:hover': {
                  backgroundColor: 'rgb(244 176 243 / 11%)'
                },
                '& span.MuiFormControlLabel-label': { fontSize: '1.1rem', letterSpacing: '1.2px', fontFamily: "'VT323', monospace", userSelect: 'none', color: 'white', paddingLeft: '.4rem' },
                marginRight: i - 1 === values.length ? 0 : 'inherit'
              }}
              value={val}
              control={<Radio color='error' size='small' />}
              label={`${val} min.`}
            />
          ))}
        </RadioGroup>
      </FormControl>
    </div>
  );
}