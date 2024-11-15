import { useState } from 'react';
import { Box, Paper, Table, TableBody, TableContainer, TableHead, TableRow, TextField, Typography } from '@mui/material';

import { useUserContext } from '../../context/UserContext';

import getAllPOsDate from '../../services/sheetInventory/getAllPOsDate';
import getAllPOsPO from '../../services/sheetInventory/getAllPOsPO';

import CustomTabs from '../../components/shared/CustomTabs';
import DataTableCell from '../../components/shared/DataTableCell';
import MonarchButton from '../../components/shared/MonarchButton';
import PageContainer from '../../components/shared/PageContainer';
import StandardTableCell from '../../components/shared/StandardTableCell';

export const SheetInventory = () => {
  const { cookieData } = useUserContext();
  const [poNum, setPoNum] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [dataFetched, setDataFetched] = useState(false);
  const [poData, setPoData] = useState([]);
  const [selectedTab, setSelectedTab] = useState(0);

  const fetchPONum = async () => {
    try {
      const res = await getAllPOsPO(poNum);
      setPoData(res);
      setDataFetched(true);
    } catch (err) {
      console.error(err);
    }
  }

  const fetchPODate = async () => {
    try {
      const res = await getAllPOsDate(startDate, endDate);
      setPoData(res);
      setDataFetched(true);
    } catch (err) {
      console.error(err);
    }
  };

  const resetForm = () => {
    setDataFetched(false);
    setPoData([]);
    setPoNum('');
    setStartDate('');
    setEndDate('');
  };

  const groupedData = poData.reduce((acc, item) => {
    const material = item.Material;
    const estimatedSqFt = item.MaterialQty * item.JobQty;
    const actualSqFt = item.ActualSQFTJob;

    if (!acc[material]) {
      acc[material] = { material, totalEstSqFt: 0, totalActSqFt: 0 };
    }

    acc[material].totalEstSqFt += estimatedSqFt;
    acc[material].totalActSqFt += actualSqFt;

    return acc;
  }, {});

  const materialTotals = Object.values(groupedData).map(item => {
    const difference = (item.totalEstSqFt - item.totalActSqFt).toFixed(2);
    const percentageDiff = ((difference / item.totalEstSqFt) * 100).toFixed(1);
    return { ...item, difference, percentageDiff };
  });

  const handleTabChange = (event, newValue) => {
    setSelectedTab(newValue);
  }

  return (
    <PageContainer title='Sheet Inventory'>
      {cookieData.specialty ? (
        <Box sx={{ padding: '12px' }}>
          {!dataFetched ? (
            <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '30vh' }}>
              <Box sx={{ width: 'fit-content', marginTop: '20px' }}>
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <TextField
                    variant='outlined'
                    label='PO Number'
                    onChange={(e) => setPoNum(e.target.value)}
                    sx={{ marginRight: '20px' }}
                  />
                  <MonarchButton onClick={fetchPONum}>
                    Submit
                  </MonarchButton>
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'center', paddingTop: '60px' }}>
                  <TextField
                    type='date'
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    variant='outlined'
                    sx={{ marginRight: '20px' }}
                  />
                  <TextField
                    type='date'
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                    variant='outlined'
                    sx={{ marginRight: '20px' }}
                  />
                  <MonarchButton onClick={fetchPODate}>
                    Submit
                  </MonarchButton>
                </Box>
              </Box>
            </Box>
          ) : (
            <Box sx={{ width: '100%', px: 2 }}>
              <CustomTabs
                selectedTab={selectedTab}
                handleTabChange={handleTabChange}
                tabLabels={['Individual', 'Combined']}
              />
              {selectedTab === 0 && (
                <TableContainer component={Paper}>
                  <Table>
                    <TableHead>
                      <TableRow>
                        <StandardTableCell>PO Number</StandardTableCell>
                        <StandardTableCell>Job No</StandardTableCell>
                        <StandardTableCell>Part No</StandardTableCell>
                        <StandardTableCell>Material</StandardTableCell>
                        <StandardTableCell>Est Sq Ft</StandardTableCell>
                        <StandardTableCell>Act Sq Ft</StandardTableCell>
                        <StandardTableCell>+ / -</StandardTableCell>
                        <StandardTableCell>%</StandardTableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {poData.map((item, index) => {
                        const EstimatedSQFTJob = (item.MaterialQty * item.JobQty).toFixed(2);
                        const difference = (EstimatedSQFTJob - item.ActualSQFTJob).toFixed(2);
                        const percentageDiff = ((difference / EstimatedSQFTJob) * 100).toFixed(1);
                        return (
                          <TableRow key={index} sx={{ backgroundColor: index % 2 === 0 ? '#f0f0f0' : '#fff' }}>
                            <DataTableCell>{item.PONo}</DataTableCell>
                            <DataTableCell>{item.JobNo}</DataTableCell>
                            <DataTableCell>{item.PartNo}</DataTableCell>
                            <DataTableCell>{item.Material}</DataTableCell>
                            <DataTableCell>{EstimatedSQFTJob}</DataTableCell>
                            <DataTableCell>{item.ActualSQFTJob.toFixed(2)}</DataTableCell>
                            <DataTableCell sx={{ color: difference >= 0 ? 'green' : 'red', fontWeight: 'bold' }}>{difference}</DataTableCell>
                            <DataTableCell>{percentageDiff}%</DataTableCell>
                          </TableRow>
                        );
                      })}
                    </TableBody>
                  </Table>
                </TableContainer>
              )}

              {selectedTab === 1 && (
                <TableContainer component={Paper}>
                  <Table>
                    <TableHead>
                      <TableRow>
                        <StandardTableCell>Material</StandardTableCell>
                        <StandardTableCell>Total Est Sq Ft</StandardTableCell>
                        <StandardTableCell>Total Act Sq Ft</StandardTableCell>
                        <StandardTableCell>Total + / -</StandardTableCell>
                        <StandardTableCell>Total %</StandardTableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {materialTotals.map((item, index) => (
                        <TableRow key={index} sx={{ backgroundColor: index % 2 === 0 ? '#f0f0f0' : '#fff' }}>
                          <DataTableCell>{item.material}</DataTableCell>
                          <DataTableCell>{item.totalEstSqFt.toFixed(2)}</DataTableCell>
                          <DataTableCell>{item.totalActSqFt.toFixed(2)}</DataTableCell>
                          <DataTableCell sx={{ color: item.difference >= 0 ? 'green' : 'red', fontWeight: 'bold' }}>{item.difference}</DataTableCell>
                          <DataTableCell>{item.percentageDiff}%</DataTableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              )}

              <MonarchButton onClick={resetForm} sx={{ marginTop: '20px' }}>
                Reset
              </MonarchButton>
            </Box>
          )}
        </Box>
      ) : (
        <Box sx={{ width: '100%', textAlign: 'center', overflowY: 'auto', height: '100vh', paddingTop: '25vh' }}>
          <Typography variant='h4' sx={{ fontWeight: 'bold', margin: '16px' }}>You Don't Have Access To This Page</Typography>
        </Box>
      )}
    </PageContainer>
  );
};