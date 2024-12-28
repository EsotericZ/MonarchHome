import { useState } from 'react';
import { Box, Paper, Table, TableBody, TableContainer, TableHead, TableRow, Typography, Button, IconButton } from '@mui/material';
import { format, parseISO } from 'date-fns';

import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';

import DataTableCell from '../shared/DataTableCell';
import StandardTableCell from '../shared/StandardTableCell';
import SearchTableCell from '../shared/SearchTableCell';

const MaintenanceTable = ({ 
  records, 
  fallbackMessage, 
  onRowClick, 
  searchTerms, 
  onSearchChange,
}) => {
  const [currentPage, setCurrentPage] = useState(0);
  const rowsPerPage = 15;

  const totalPages = Math.ceil(records.length / rowsPerPage);

  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
  };

  const getPaginatedRecords = () => {
    const sortedRecords = [...records].sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt)); // Sort by updatedAt, newest first
    const startIndex = currentPage * rowsPerPage;
    const endIndex = startIndex + rowsPerPage;
    return sortedRecords.slice(startIndex, endIndex);
  };

  const generatePageNumbers = () => {
    const pages = [];

    if (totalPages <= 5) {
      for (let i = 0; i < totalPages; i++) {
        pages.push(i);
      }
    } else {
      if (currentPage > 2) {
        pages.push(0, '...', currentPage - 1);
      } else {
        pages.push(0, 1);
      }

      if (currentPage !== 0 && currentPage !== totalPages - 1) {
        pages.push(currentPage);
      }

      if (currentPage < totalPages - 3) {
        pages.push(currentPage + 1, '...');
      } else {
        pages.push(totalPages - 2, totalPages - 1);
      }

      pages.push(totalPages - 1);
    }

    return [...new Set(pages)];
  };

  return (
    <Box sx={{ padding: '12px' }}>
      {Array.isArray(records) && records.length > 0 ? (
        <Box>
          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  <SearchTableCell
                    width='10%'
                    placeholder='Record'
                    value={searchTerms.record}
                    onChange={(e) => onSearchChange('record', e.target.value)}
                  />
                  <SearchTableCell
                    width='25%'
                    placeholder='Area'
                    value={searchTerms.area}
                    onChange={(e) => onSearchChange('area', e.target.value)}
                  />
                  <SearchTableCell
                    width='25%'
                    placeholder='Equipment'
                    value={searchTerms.equipment}
                    onChange={(e) => onSearchChange('equipment', e.target.value)}
                  />
                  <SearchTableCell
                    width='20%'
                    placeholder='Type'
                    value={searchTerms.type}
                    onChange={(e) => onSearchChange('type', e.target.value)}
                  />
                  <StandardTableCell width='20%'>Completed</StandardTableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {getPaginatedRecords().map((record, index) => (
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

          <Box
            sx={{
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              marginTop: '16px',
              gap: 1,
            }}
          >
            <IconButton
              disabled={currentPage === 0}
              onClick={() => handlePageChange(currentPage - 1)}
            >
              <ChevronLeftIcon />
            </IconButton>

            {generatePageNumbers().map((page, index) => (
              <Button
                key={index}
                onClick={() => typeof page === 'number' && handlePageChange(page)}
                disabled={page === '...' || page === currentPage}
                sx={{
                  minWidth: '40px',
                  fontWeight: page === currentPage ? 'bold' : 'normal',
                }}
              >
                {page === '...' ? '...' : page + 1}
              </Button>
            ))}

            <IconButton
              disabled={currentPage === totalPages - 1}
              onClick={() => handlePageChange(currentPage + 1)}
            >
              <ChevronRightIcon />
            </IconButton>
          </Box>
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
          <Typography variant='h4' sx={{ fontWeight: 'bold', margin: '16px' }}>
            {fallbackMessage}
          </Typography>
        </Box>
      )}
    </Box>
  );
};

export default MaintenanceTable;