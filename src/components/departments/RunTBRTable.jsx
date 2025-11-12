import { Box, Button, IconButton, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from '@mui/material';
import { CopyToClipboard } from 'react-copy-to-clipboard';
import CheckIcon from '@mui/icons-material/Check';

import AddButton from '../shared/AddButton';
import CopySnackbar from '../shared/CopySnackbar';
import DataTableCell from '../shared/DataTableCell';
import RefreshButton from '../shared/RefreshButton';
import SearchTableCell from '../shared/SearchTableCell';
import StandardTableCell from '../shared/StandardTableCell';

const RunTBRTable = ({
  cookieData,
  cookieDataKey,
  handleMaterialsOpen,
  needsNestingTBR,
  onAddClick,
  onCloseSnackbar,
  onRefresh,
  partCopy,
  searchedValues,
  setPartCopy,
  setSearchedValues,
  setShowToast,
  showToast,
}) => {
  const handleInputChange = (key, value) => {
    setSearchedValues((prev) => ({
      ...prev,
      [key]: value
    }));
  };

  const renderTableRows = (jobs) =>
    jobs
      .filter((row) => typeof row.JobNo !== 'undefined')
      .filter((row) =>
        !searchedValues.jobNo || row.JobNo.toString().toLowerCase().includes(searchedValues.jobNo.toLowerCase())
      )
      .filter((row) =>
        !searchedValues.partNo || row.PartNo.toString().toLowerCase().includes(searchedValues.partNo.toLowerCase())
      )
      .filter((row) =>
        !searchedValues.customer || row.CustCode.toString().toLowerCase().includes(searchedValues.customer.toLowerCase())
      )
      .filter((row) =>
        !searchedValues.type || row.User_Text3.toString().toLowerCase().includes(searchedValues.type.toLowerCase())
      )
      .filter((row) =>
        !searchedValues.material || row.SubPartNo.toString().toLowerCase().includes(searchedValues.material.toLowerCase())
      )
      .map((job, index) => (
        <TableRow key={index} sx={{ backgroundColor: index % 2 === 0 ? '#f0f0f0' : '#fff' }}>
          <DataTableCell bold>{job.JobNo}</DataTableCell>
          <DataTableCell>{job.StepNo}</DataTableCell>
          <DataTableCell>
            <CopyToClipboard
              text={job.PartNo}
              onCopy={() => {
                setShowToast(true);
                setPartCopy(`${job.PartNo}`);
              }}
            >
              <span>{job.PartNo}</span>
            </CopyToClipboard>
          </DataTableCell>
          <DataTableCell>{job.Revision}</DataTableCell>
          <DataTableCell>{job.EstimQty}</DataTableCell>
          <DataTableCell>
            {job.DueDate.split('-')[1] + '/' + job.DueDate.split('-')[2].split('T')[0]}
          </DataTableCell>
          <DataTableCell>{job.CustCode}</DataTableCell>
          <DataTableCell>{job.User_Text3}</DataTableCell>
          <DataTableCell>
            {Array.isArray(job.SubPartNo) && job.SubPartNo.length === 1 ? (
              <CopyToClipboard
                text={job.SubPartNo[0]}
                onCopy={() => {
                  setShowToast(true);
                  setPartCopy(`${job.SubPartNo[0]}`);
                }}
              >
                <span>{job.SubPartNo[0]}</span>
              </CopyToClipboard>
            ) : (
              <Button
                onClick={() => handleMaterialsOpen(job)}
                sx={{
                  padding: 0,
                  minWidth: 'auto',
                  background: 'none',
                  border: 'none',
                  boxShadow: 'none',
                  textTransform: 'none',
                  '&:hover': { backgroundColor: 'transparent' },
                  '&:focus': { outline: 'none' },
                }}
              >
                ...
              </Button>
            )}
          </DataTableCell>

          <DataTableCell padding={0} align="center">
            {job.Verified && (
              <CheckIcon sx={{ fontSize: '20px', fontWeight: 'bold' }} />
            )}
          </DataTableCell>
        </TableRow>
      ));

  return (
    <Box sx={{ padding: '12px' }}>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <SearchTableCell width='10%' placeholder='Job No' value={searchedValues.jobNo}
                onChange={(e) => handleInputChange('jobNo', e.target.value)} />
              <StandardTableCell width='7%'>Step No</StandardTableCell>
              <SearchTableCell width='20%' placeholder='Part No' value={searchedValues.partNo}
                onChange={(e) => handleInputChange('partNo', e.target.value)} />
              <StandardTableCell width='6%'>Revision</StandardTableCell>
              <StandardTableCell width='6%'>Qty</StandardTableCell>
              <StandardTableCell width='7%'>Due</StandardTableCell>
              <SearchTableCell width='10%' placeholder='Customer' value={searchedValues.customer}
                onChange={(e) => handleInputChange('customer', e.target.value)} />
              <SearchTableCell width='7%' placeholder='Type' value={searchedValues.type}
                onChange={(e) => handleInputChange('type', e.target.value)} />
              <SearchTableCell width='20%' placeholder='Materials' value={searchedValues.material}
                onChange={(e) => handleInputChange('material', e.target.value)} />
              <StandardTableCell width='7%'>Verified</StandardTableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {needsNestingTBR.length >= 1 && (
              <TableRow>
                <TableCell colSpan={10} align='center'
                  sx={{ fontWeight: 'bold', fontSize: '15px', backgroundColor: '#D1BBA8', p: 1.25 }}>
                  TBR
                </TableCell>
              </TableRow>
            )}
            {renderTableRows(needsNestingTBR)}
          </TableBody>
        </Table>
      </TableContainer>

      {cookieData[cookieDataKey] && <AddButton onClick={onAddClick} />}
      <RefreshButton onClick={onRefresh} />

      <CopySnackbar
        show={showToast}
        onClose={onCloseSnackbar}
        message={`${partCopy} Copied To Clipboard`}
      />
    </Box>
  );
};

export default RunTBRTable;