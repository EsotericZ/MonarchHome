import { TableCell } from '@mui/material';

const SearchTableCell = ({ width, placeholder, value, onChange }) => {
  return (
    <TableCell align='center' sx={{ width }}>
      <input
        type='text'
        placeholder={placeholder}
        value={value || ''}
        onChange={onChange}
        style={{
          width: '100%',
          fontWeight: 'bold',
          fontSize: '15px',
          border: 'none',
          outline: 'none',
          background: 'transparent',
          color: '#000',
          textAlign: 'center',
        }}
      />
    </TableCell>
  );
};

export default SearchTableCell;
