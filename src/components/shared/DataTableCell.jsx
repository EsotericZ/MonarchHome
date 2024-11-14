import { TableCell } from '@mui/material';

const DataTableCell = ({ padding=1.25, bold=false, children, onClick }) => {
  return (
    <TableCell 
      align='center' 
      onClick={onClick}
      sx={{ 
        fontSize: '15px', 
        p: padding,
        fontWeight: bold ? 'bold' : 'normal',
      }}
    >
      {children}
    </TableCell>
  );
};

export default DataTableCell;