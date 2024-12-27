import { Box, Paper, Table, TableBody, TableContainer, TableHead, TableRow, Typography } from '@mui/material';
import { format, parseISO } from 'date-fns';

import DataTableCell from '../shared/DataTableCell';
import StandardTableCell from '../shared/StandardTableCell';
import SearchTableCell from '../shared/SearchTableCell';

const MaintenanceTable = ({ records, fallbackMessage, onRowClick, searchTerms, onSearchChange }) => {
  return Array.isArray(records) && records.length > 0 ? (
    <Box sx={{ padding: '12px' }}>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <SearchTableCell
                width="10%"
                placeholder="Search Record"
                value={searchTerms.record}
                onChange={(e) => onSearchChange('record', e.target.value)}
              />
              <SearchTableCell
                width="25%"
                placeholder="Search Area"
                value={searchTerms.area}
                onChange={(e) => onSearchChange('area', e.target.value)}
              />
              <SearchTableCell
                width="25%"
                placeholder="Search Equipment"
                value={searchTerms.equipment}
                onChange={(e) => onSearchChange('equipment', e.target.value)}
              />
              <SearchTableCell
                width="20%"
                placeholder="Search Type"
                value={searchTerms.type}
                onChange={(e) => onSearchChange('type', e.target.value)}
              />
              <StandardTableCell width="20%">Completed</StandardTableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {records.map((record, index) => (
              <TableRow
                key={index}
                onClick={() => onRowClick(record)}
                sx={{
                  cursor: 'pointer',
                  backgroundColor: index % 2 === 0 ? '#f0f0f0' : '#fff',
                }}
              >
                <DataTableCell>{record.record}</DataTableCell>
                <DataTableCell>{record.area || 'N/A'}</DataTableCell>
                <DataTableCell>{record.equipment || 'Unknown'}</DataTableCell>
                <DataTableCell>{record.requestType || 'N/A'}</DataTableCell>
                <DataTableCell>
                  {record.updatedAt
                    ? format(parseISO(record.updatedAt), 'MM/dd/yyyy h:mm a')
                    : 'Not Completed'}
                </DataTableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  ) : (
    <Box
      sx={{
        width: '100%',
        textAlign: 'center',
        alignContent: 'center',
        overflowY: 'auto',
        height: '15vh',
      }}
    >
      <Typography variant="h4" sx={{ fontWeight: 'bold', margin: '16px' }}>
        {fallbackMessage}
      </Typography>
    </Box>
  );
};


export default MaintenanceTable;