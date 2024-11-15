import { useState } from 'react';
import { Box, TextField, Typography } from '@mui/material';

import { useUserContext } from '../../context/UserContext';

import getJobRange from '../../services/efficiency/getJobRange';
import getLastTwenty from '../../services/efficiency/getLastTwenty';
import getSingleJob from '../../services/efficiency/getSingleJob';

import MonarchButton from '../../components/shared/MonarchButton';
import PageContainer from '../../components/shared/PageContainer';

const headers = [
  { label: 'Job No', key: 'JobNo' },
  { label: 'Part No', key: 'PartNo' },
  { label: 'Step No', key: 'StepNo' },
  { label: 'Work Center', key: 'WorkCntr' },
  { label: 'Actual Start Date', key: 'ActualStartDate' },
  { label: 'Estimated Hours', key: 'TotEstHrs' },
  { label: 'Actual Hours', key: 'TotActHrs' },
  { label: 'Status', key: 'Status' },
];

export const Efficiency = () => {
  const { cookieData } = useUserContext();
  const [singleJob, setSingleJob] = useState('');
  const [startJob, setStartJob] = useState('');
  const [finishJob, setFinishJob] = useState('');

  const fetchSingleExportCSV = async () => {
    try {
      const res = await getSingleJob(singleJob);

      const csvData = res.map(item => {
        const startDate = item.ActualStartDate ? item.ActualStartDate.split('T')[0] : '';

        return {
          JobNo: item.JobNo,
          PartNo: item.PartNo,
          StepNo: item.StepNo,
          WorkCntr: item.WorkCntr,
          ActualStartDate: startDate,
          TotEstHrs: item.TotEstHrs,
          TotActHrs: item.TotActHrs,
          Status: item.Status,
        }
      });

      const csvContent = [
        headers.map(header => header.label).join(','),
        ...csvData.map(item => Object.values(item).join(','))
      ].join('\n');

      const blob = new Blob([csvContent], { type: 'text/csv' });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `${singleJob}.csv`);
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (err) {
      console.error(err);
    }
  };

  const fetchMultiExportCSV = async () => {
    try {
      const res = await getJobRange(startJob, finishJob);

      const csvData = res.map(item => {
        const startDate = item.ActualStartDate ? item.ActualStartDate.split('T')[0] : '';

        return {
          JobNo: item.JobNo,
          PartNo: item.PartNo,
          StepNo: item.StepNo,
          WorkCntr: item.WorkCntr,
          ActualStartDate: startDate,
          TotEstHrs: item.TotEstHrs,
          TotActHrs: item.TotActHrs,
          Status: item.Status,
        }
      });

      const csvContent = [
        headers.map(header => header.label).join(','),
        ...csvData.map(item => Object.values(item).join(','))
      ].join('\n');

      const blob = new Blob([csvContent], { type: 'text/csv' });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `${startJob}-${finishJob}.csv`);
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (err) {
      console.error(err);
    }
  };

  const fetchLastTwentyCSV = async () => {
    try {
      const res = await getLastTwenty();

      const csvData = res.map(item => {
        const startDate = item.ActualStartDate ? item.ActualStartDate.split('T')[0] : '';

        return {
          JobNo: item.JobNo,
          PartNo: item.PartNo,
          StepNo: item.StepNo,
          WorkCntr: item.WorkCntr,
          ActualStartDate: startDate,
          TotEstHrs: item.TotEstHrs,
          TotActHrs: item.TotActHrs,
          Status: item.Status,
        }
      });

      const csvContent = [
        headers.map(header => header.label).join(','),
        ...csvData.map(item => Object.values(item).join(','))
      ].join('\n');

      const blob = new Blob([csvContent], { type: 'text/csv' });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `LastTen.csv`);
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <PageContainer title='Efficiency'>
      {cookieData.specialty ? (
        <Box sx={{ padding: '12px' }}>
          <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '30vh' }}>
            <Box sx={{ width: 'fit-content', marginTop: '20px' }}>
              <Typography variant='h4' sx={{ fontWeight: 'bold', margin: '16px' }}>Single Job</Typography>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', mb: 2 }}>
                <TextField
                  variant='outlined'
                  label='Job No'
                  onChange={(e) => setSingleJob(e.target.value)}
                  sx={{ marginRight: '20px' }}
                />
                <MonarchButton onClick={fetchSingleExportCSV}>
                  Submit
                </MonarchButton>
              </Box>
            </Box>

            <Box sx={{ width: 'fit-content', marginTop: '40px' }}>
              <Typography variant='h4' sx={{ fontWeight: 'bold', margin: '16px' }}>Job Range</Typography>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', mb: 2 }}>
                <TextField
                  variant='outlined'
                  label='Lower Job No'
                  onChange={(e) => setStartJob(e.target.value)}
                  sx={{ marginRight: '20px' }}
                />
                <TextField
                  variant='outlined'
                  label='Upper Job No'
                  onChange={(e) => setFinishJob(e.target.value)}
                  sx={{ marginRight: '20px' }}
                />
                <MonarchButton onClick={fetchMultiExportCSV}>
                  Submit
                </MonarchButton>
              </Box>
            </Box>

            <Box sx={{ width: 'fit-content', marginTop: '40px' }}>
              <Typography variant='h4' sx={{ fontWeight: 'bold', margin: '16px' }}>Get Last 10 Closed Orders</Typography>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <MonarchButton onClick={fetchLastTwentyCSV}>
                  Submit
                </MonarchButton>
              </Box>
            </Box>
          </Box>
        </Box>
      ) : (
        <Box sx={{ width: '100%', textAlign: 'center', overflowY: 'auto', height: '100vh', paddingTop: '25vh' }}>
          <Typography variant='h4' sx={{ fontWeight: 'bold', margin: '16px' }}>You Don't Have Access To This Page</Typography>
        </Box>
      )}
    </PageContainer>
  );
};