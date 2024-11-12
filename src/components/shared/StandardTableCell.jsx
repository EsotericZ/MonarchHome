import { TableCell } from '@mui/material';

const StandardTableCell = ({ width, children }) => {
  return (
    <TableCell align='center' sx={{ fontWeight: 'bold', width, fontSize: '15px' }}>
      {children}
    </TableCell>
  );
};

export default StandardTableCell;