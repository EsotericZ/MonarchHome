import { Box, Icon, IconButton, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from '@mui/material';

import CheckIcon from '@mui/icons-material/Check';

import AddButton from '../shared/AddButton';
import RefreshButton from '../shared/RefreshButton';
import SearchTableCell from '../shared/SearchTableCell';
import StandardTableCell from '../shared/StandardTableCell';

const MaterialTable = ({
  cookieData,
  cookieDataKey,
  handleUpdateJob,
  onAddClick,
  onRefresh,
  searchedPrograms,
  searchedValues,
  selectedTab,
  setSearchedValues,
  toggleCheck,
  toggleNeed,
  toggleVerified,
}) => {
  const handleInputChange = (key, value) => {
    setSearchedValues((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  return (
    <Box>
      {selectedTab === 1 && (
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
                  <StandardTableCell width='10%'>Check</StandardTableCell>
                  <StandardTableCell width='10%'>Need</StandardTableCell>
                  <StandardTableCell width='10%'>On Order</StandardTableCell>
                  <StandardTableCell width='10%'>Expected</StandardTableCell>
                  <StandardTableCell width='10%'>Verified</StandardTableCell>
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
                  .map((job, index) => (
                    <TableRow key={index} sx={{ backgroundColor: index % 2 === 0 ? '#f0f0f0' : '#fff' }}>
                      {cookieData[cookieDataKey] ? (
                        <TableCell
                          align="center"
                          sx={{ fontWeight: 'bold', fontSize: '15px', p: 1.25 }}
                          onClick={() => handleUpdateJob(job)}
                        >
                          {job.programNo}
                        </TableCell>
                      ) : (
                        <TableCell align="center" sx={{ fontWeight: 'bold', fontSize: '15px', p: 1.25 }}>
                          {job.programNo}
                        </TableCell>
                      )}
                      <TableCell align="center" sx={{ fontSize: '15px', p: 1.25 }}>{job.material}</TableCell>
                      <TableCell align="center" sx={{ fontSize: '15px', p: 1.25 }}>{job.jobNo}</TableCell>
                      <TableCell align="center" sx={{ fontSize: '15px', p: 0 }}>
                        <IconButton onClick={() => cookieData[cookieDataKey] && toggleCheck(job)}>
                          {job.checkMatl && <CheckIcon sx={{ fontSize: '20px', fontWeight: 'bold' }} />}
                        </IconButton>
                      </TableCell>
                      <TableCell align="center" sx={{ fontSize: '15px', p: 0 }}>
                        <IconButton onClick={() => cookieData[cookieDataKey] && toggleNeed(job)}>
                          {job.needMatl && <CheckIcon sx={{ fontSize: '20px', fontWeight: 'bold' }} />}
                        </IconButton>
                      </TableCell>
                      <TableCell align="center" sx={{ fontSize: '15px', p: 0 }}>
                        <Icon>
                          {job.onOrder && <CheckIcon sx={{ fontSize: '20px', fontWeight: 'bold' }} />}
                        </Icon>
                      </TableCell>
                      <TableCell align="center" sx={{ fontSize: '15px', p: 1.25 }}>
                        {job.expected ? `${job.expected.split('-')[1]}/${job.expected.split('-')[2].split('T')[0]}` : ''}
                      </TableCell>
                      <TableCell align="center" sx={{ fontSize: '15px', p: 0 }}>
                        <IconButton onClick={() => cookieData[cookieDataKey] && toggleVerified(job)}>
                          {job.verified && <CheckIcon sx={{ fontSize: '20px', fontWeight: 'bold' }} />}
                        </IconButton>
                      </TableCell>
                    </TableRow>
                  ))}
              </TableBody>
            </Table>
          </TableContainer>

          {cookieData[cookieDataKey] && <AddButton onClick={onAddClick} />}
          <RefreshButton onClick={onRefresh} />
        </Box>
      )}
    </Box>
  );
};

export default MaterialTable;