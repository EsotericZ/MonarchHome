import { Box, IconButton, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from '@mui/material';

import HistoryIcon from '@mui/icons-material/History';

import AddButton from '../shared/AddButton';
import DataTableCell from '../shared/DataTableCell';
import RefreshButton from '../shared/RefreshButton';
import SearchTableCell from '../shared/SearchTableCell';
import StandardTableCell from '../shared/StandardTableCell';

const ProgramTable = ({
  cookieDataKey,
  cookieData,
  handleUpdateJob,
  handleShowComplete,
  onAddClick,
  onRefresh,
  searchedPrograms,
  searchedValues,
  selectedTab,
  setSearchedValues,
}) => {
  const handleInputChange = (key, value) => {
    setSearchedValues((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  return (
    // <Box>
    //   {selectedTab === 2 && (
        <Box sx={{ padding: '12px' }}>
          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  <SearchTableCell 
                    width='15%'
                    placeholder='Program No'
                    value={searchedValues.programNo}
                    onChange={(e) => handleInputChange('programNo', e.target.value)}
                  />
                  <SearchTableCell 
                    width='25%'
                    placeholder='Material'
                    value={searchedValues.material}
                    onChange={(e) => handleInputChange('material', e.target.value)}
                  />
                  <SearchTableCell 
                    width='10%'
                    placeholder='Job No'
                    value={searchedValues.jobNo}
                    onChange={(e) => handleInputChange('jobNo', e.target.value)}
                  />
                  {cookieData[cookieDataKey] && (
                    <StandardTableCell width='10%'>Completed</StandardTableCell>
                  )}
                </TableRow>
              </TableHead>
              <TableBody>
                {searchedPrograms
                  .filter((row) =>
                    !searchedValues.programNo || row.programNo.toLowerCase().includes(searchedValues.programNo.toLowerCase())
                  )
                  .filter((row) =>
                    !searchedValues.material || row.material.toLowerCase().includes(searchedValues.material.toLowerCase())
                  )
                  .filter((row) =>
                    !searchedValues.jobNo || row.jobNo.toLowerCase().includes(searchedValues.jobNo.toLowerCase())
                  )
                  .filter((row) => row.verified) 
                  .map((job, index) => (
                    <TableRow key={index} sx={{ backgroundColor: index % 2 === 0 ? '#f0f0f0' : '#fff' }}>
                      {cookieData[cookieDataKey] ? (
                        <DataTableCell
                          bold
                          onClick={() => handleUpdateJob(job)}
                        >
                          {job.programNo}
                        </DataTableCell>
                      ) : (
                        <DataTableCell sx={{ fontWeight: 'bold' }}>
                          {job.programNo}
                        </DataTableCell>
                      )}
                      <DataTableCell>{job.material}</DataTableCell>
                      <DataTableCell>{job.jobNo}</DataTableCell>
                      {cookieData[cookieDataKey] && (
                        <DataTableCell padding={0}>
                          <IconButton onClick={() => handleShowComplete(job)}>
                            <HistoryIcon sx={{ fontSize: '20px', fontWeight: 'bold' }} />
                          </IconButton>
                        </DataTableCell>
                      )}
                    </TableRow>
                  ))}
              </TableBody>
            </Table>
          </TableContainer>

          {cookieData[cookieDataKey] && <AddButton onClick={onAddClick} />}
          <RefreshButton onClick={onRefresh} />
        </Box>
    //   )}
    // </Box>
  );
};

export default ProgramTable;