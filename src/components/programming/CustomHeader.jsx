import { TableRow } from '@mui/material';

import SearchTableCell from '../shared/SearchTableCell';
import StandardTableCell from '../shared/StandardTableCell';

const CustomHeader = ({ columns }) => {
  return (
    <TableRow>
      {columns.map((column, index) =>
        column.isSearchable ? (
          <SearchTableCell
            key={index}
            width={column.width}
            placeholder={column.placeholder}
            value={column.value}
            onChange={column.onChange}
          />
        ) : (
          <StandardTableCell key={index} width={column.width}>
            {column.label}
          </StandardTableCell>
        )
      )}
    </TableRow>
  );
};

export default CustomHeader;