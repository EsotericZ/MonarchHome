import { FormControl, Select } from '@mui/material';

const CustomSelect = ({ value, onChange, sx, children }) => {
  return (
    <FormControl variant='standard' fullWidth>
      <Select
        value={value || ''}
        onChange={onChange}
        disableUnderline
        sx={{
          fontSize: '15px',
          padding: '0',
          textAlign: 'center',
          overflowX: 'hidden',
          overflowY: 'hidden',
          '& .MuiSelect-icon': {
            display: value ? 'none' : 'block',
            right: value ? '0' : 'calc(50% - 12px)',
          },
          '& .MuiSelect-select': {
            padding: '0',
            marginRight: '-20px',
            textAlign: 'center',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
          },
          ...sx,
        }}
      >
        {children}
      </Select>
    </FormControl>
  );
};

export default CustomSelect;