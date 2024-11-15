import { Box, IconButton, Paper, Table, TableBody, TableContainer, TableHead, TableRow } from '@mui/material';
import { format, parseISO } from 'date-fns';
import CheckIcon from '@mui/icons-material/Check';
import DatePicker from 'react-datepicker';
import UpdateIcon from '@mui/icons-material/Update';
import 'react-datepicker/dist/react-datepicker.css';

import DataTableCell from '../shared/DataTableCell';
import SearchTableCell from '../shared/SearchTableCell';
import StandardTableCell from '../shared/StandardTableCell';

const PurchasingTable = ({
  data,
  areaFilters,
  areaName,
  searchedValueProgramNo,
  setSearchedValueProgramNo,
  searchedValueMaterial,
  setSearchedValueMaterial,
  searchedValueJobNo,
  setSearchedValueJobNo,
  handleDateChange,
  selectedDatesMaterial,
  toggleNeed,
  toggleOnOrder,
  toggleVerified,
  cookieData,
}) => {
  return (
    <Box sx={{ padding: '12px' }}>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <SearchTableCell
                width='10%'
                placeholder='Program No'
                value={searchedValueProgramNo}
                onChange={(e) => setSearchedValueProgramNo(e.target.value)}
              />
              <SearchTableCell
                width='25%'
                placeholder='Material'
                value={searchedValueMaterial}
                onChange={(e) => setSearchedValueMaterial(e.target.value)}
              />
              <SearchTableCell
                width='15%'
                placeholder='Job No'
                value={searchedValueJobNo}
                onChange={(e) => setSearchedValueJobNo(e.target.value)}
              />
              <StandardTableCell width='10%'>Area</StandardTableCell>
              <StandardTableCell width='8%'>Created</StandardTableCell>
              <StandardTableCell width='8%'>Need</StandardTableCell>
              {cookieData.purchasing && (
                <>
                  <StandardTableCell width='8%'>On Order</StandardTableCell>
                  <StandardTableCell width='8%'>Expected</StandardTableCell>
                  <StandardTableCell width='8%'>Verified</StandardTableCell>
                </>
              )}
            </TableRow>
          </TableHead>
          <TableBody>
            {data
              .filter((row) => areaFilters.includes(row.area))
              .filter((row) =>
                !searchedValueProgramNo ||
                row.programNo.toString().toLowerCase().includes(searchedValueProgramNo.toLowerCase())
              )
              .filter((row) =>
                !searchedValueMaterial ||
                row.material.toString().toLowerCase().includes(searchedValueMaterial.toLowerCase())
              )
              .filter((row) =>
                !searchedValueJobNo ||
                row.jobNo.toString().toLowerCase().includes(searchedValueJobNo.toLowerCase())
              )
              .map((job, index) => {
                const areaIndex = areaFilters.indexOf(job.area);
                const displayAreaName = areaIndex !== -1 ? areaName[areaIndex] : job.area;
                return (
                  <TableRow key={index} sx={{ backgroundColor: index % 2 === 0 ? '#f0f0f0' : '#fff' }}>
                    <DataTableCell bold>{job.programNo}</DataTableCell>
                    <DataTableCell>{job.material}</DataTableCell>
                    <DataTableCell>{job.jobNo}</DataTableCell>

                    <DataTableCell>{displayAreaName}</DataTableCell>

                    <DataTableCell>{job.createdAt && format(parseISO(job.createdAt), 'MM/dd h:mmb')}</DataTableCell>
                    <DataTableCell padding={0}>
                      <IconButton onClick={() => toggleNeed(job)}>
                        {job.needMatl && <CheckIcon sx={{ fontSize: '20px', fontWeight: 'bold' }} />}
                      </IconButton>
                    </DataTableCell>
                    {cookieData.purchasing && (
                      <>
                        <DataTableCell padding={0}>
                          <IconButton onClick={() => toggleOnOrder(job)}>
                            {job.onOrder && <CheckIcon sx={{ fontSize: '20px', fontWeight: 'bold' }} />}
                          </IconButton>
                        </DataTableCell>
                        <DataTableCell>
                          <DatePicker
                            selected={selectedDatesMaterial[job.id] || (job.expected ? new Date(job.expected + 'T00:00:00') : null)}
                            onChange={(date) => handleDateChange(job.id, date)}
                            dateFormat='MM/dd'
                            className='custom-date-picker'
                          />
                        </DataTableCell>
                        <DataTableCell padding={0}>
                          <IconButton onClick={() => toggleVerified(job)}>
                            <UpdateIcon sx={{ fontSize: '20px', fontWeight: 'bold' }} />
                          </IconButton>
                        </DataTableCell>
                      </>
                    )}
                  </TableRow>
                )
              })
            }
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
};

export default PurchasingTable;