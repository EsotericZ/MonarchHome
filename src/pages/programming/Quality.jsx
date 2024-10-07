import { useEffect, useState } from 'react';
import { Alert, Box, Divider, FormControl, IconButton, MenuItem, Paper, Select, Snackbar, Tab, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Tabs, Typography } from '@mui/material';

import { CopyToClipboard } from 'react-copy-to-clipboard';
import Cookies from 'universal-cookie';
import { jwtDecode } from "jwt-decode";

import PuffLoader from 'react-spinners/PuffLoader';
import CheckIcon from '@mui/icons-material/Check';
import RefreshIcon from '@mui/icons-material/Refresh';

import getAllJobs from '../../services/engineering/getAllJobs';
import getTBRJobs from '../../services/engineering/getTBRJobs';
import getFutureJobs from '../../services/engineering/getFutureJobs';
import getAllUsers from '../../services/users/getAllUsers';
import updateInspector from '../../services/quality/updateInspector';
import updateStatus from '../../services/quality/updateStatus';
import './engineering.css';

export const Quality = () => {
  const cookies = new Cookies();
  let cookieData
  try {
    cookieData = jwtDecode(cookies.get('jwt'));
  } catch {
    cookieData = {
      'name': '',
      'role': 'employee',
      'quality': false,
    };
  }

  const [searchedValueJobNo, setSearchedValueJobNo] = useState('');
  const [searchedValuePartNo, setSearchedValuePartNo] = useState('');
  const [searchedValueCustomer, setSearchedValueCustomer] = useState('');
  const [searchedValueType, setSearchedValueType] = useState('');
  const [searchedValueEngineer, setSearchedValueEngineer] = useState('');
  const [searchedValueInspector, setSearchedValueInspector] = useState('');
  const [searchedValueStatus, setSearchedValueStatus] = useState('');
  const [searchedValueArea, setSearchedValueArea] = useState('');
  const [showToast, setShowToast] = useState(false);
  const [partCopy, setPartCopy] = useState('None');

  const [searchedEng, setSearchedEng] = useState([]);
  const [searchedTBR, setSearchedTBR] = useState([]);
  const [searchedFuture, setSearchedFuture] = useState([]);
  const [qualityUsers, setQualityUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedTab, setSelectedTab] = useState(0);

  const [dropdownTBRTitles, setDropdownTBRTitles] = useState({});
  const [dropdownFutureTitles, setDropdownFutureTitles] = useState({});
  const [dropdownTBRStatuses, setDropdownTBRStatuses] = useState({});
  const [dropdownFutureStatuses, setDropdownFutureStatuses] = useState({});

  const [tbr, setTbr] = useState('');
  const [future, setFuture] = useState('');
  const [proto, setProto] = useState('');

  const fetchData = async () => {
    try {
      const [allRes, tbrRes, futureRes, userRes] = await Promise.all([
        getAllJobs(),
        getTBRJobs(),
        getFutureJobs(),
        getAllUsers(),
      ]);

      setSearchedEng(allRes);
      setSearchedTBR(tbrRes);
      setSearchedFuture(futureRes);

      let protoCount = ((allRes.filter(row => (typeof row.JobNo !== 'undefined' && row.dataValues.jobStatus == 'PROTO'))).length);
      (protoCount > 0) ? setProto(`Prototype (${protoCount})`) : setProto('Prototype');

      let tbrCount = ((tbrRes.filter(row => (typeof row.JobNo !== 'undefined' && (row.dataValues.jobStatus == 'QC' || row.dataValues.jobStatus == 'CHECKING')))).length);
      (tbrCount > 0) ? setTbr(`TBR (${tbrCount})`) : setTbr('TBR');

      let futureCount = ((futureRes.filter(row => (typeof row.JobNo !== 'undefined' && (row.dataValues.jobStatus == 'QC' || row.dataValues.jobStatus == 'CHECKING')))).length);
      (futureCount > 0) ? setFuture(`Future (${futureCount})`) : setFuture('Future');

      setQualityUsers(userRes.data.filter(user => user.quality).map(user => user.name.split(' ')[0]));

    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  const handleTBRInspector = async (job, inspector) => {
    setDropdownTBRTitles(prevState => ({
      ...prevState,
      [job.JobNo]: inspector
    }));
    try {
      await updateInspector(job.dataValues.jobNo, inspector);
      const res = await getTBRJobs();
      setSearchedTBR(res);
    } catch (err) {
      console.log(err);
    }
  }

  const handleTBRStatus = async (job, jobStatus) => {
    setDropdownTBRStatuses(prevState => ({
      ...prevState,
      [job.JobNo]: jobStatus
    }));
    try {
      await updateStatus(job.dataValues.jobNo, jobStatus);
      const res = await getTBRJobs();
      setSearchedTBR(res);
    } catch (err) {
      console.log(err);
    }
  }

  const handleFutureInspector = async (job, inspector) => {
    setDropdownFutureTitles(prevState => ({
      ...prevState,
      [job.JobNo]: inspector
    }));
    try {
      await updateInspector(job.dataValues.jobNo, inspector);
      const res = await getFutureJobs();
      setSearchedFuture(res);
    } catch (err) {
      console.log(err);
    }
  }

  const handleFutureStatus = async (job, jobStatus) => {
    setDropdownFutureStatuses(prevState => ({
      ...prevState,
      [job.JobNo]: jobStatus
    }));
    try {
      await updateStatus(job.dataValues.jobNo, jobStatus);
      const res = await getFutureJobs();
      setSearchedFuture(res);
    } catch (err) {
      console.log(err);
    }
  }

  const handleTabChange = (event, newValue) => {
    setSelectedTab(newValue);
  }

  useEffect(() => {
      fetchData();
  }, [loading]);

  let qcCustomers = [
    'AIRC',
    'FAT',
    'JFT',
    'JUWI',
    'MBI',
    'MSM',
    'NFT',
    'PROVISION',
    'PVM',
    'QL',
    'SFAB',
    'STONEAGE',
    'THS',
    'TRELL',
    'VERIS'
];

  return (
    <Box sx={{ width: '100%', textAlign: 'center', overflowY: 'auto', height: '100vh' }}>
      {loading ? (
        <Box>
          <Typography variant="h4" sx={{ fontWeight: 'bold', margin: '16px' }}>Quality</Typography>
          <Box sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', marginTop: '100px' }}>
            <PuffLoader color='red' />
          </Box>
        </Box>
      ) : (
        <Box sx={{ width: '100%' }}>
          <Typography variant="h4" sx={{ fontWeight: 'bold', margin: '16px' }}>Quality</Typography>
          <Tabs value={selectedTab} onChange={handleTabChange} centered  TabIndicatorProps={{ style: {backgroundColor: 'red'} }}>
            <Tab label={tbr} sx={{ width: '15%', '&.Mui-selected': { color: 'red' }, '&:focus': { outline: 'none' } }} />
            <Tab label={future} sx={{ width: '15%', '&.Mui-selected': { color: 'red' }, '&:focus': { outline: 'none' } }} />
            <Tab label={proto} sx={{ width: '15%', '&.Mui-selected': { color: 'red' }, '&:focus': { outline: 'none' } }} />
          </Tabs>

{/* TBR JOBS */}

          <Box>
            {selectedTab === 0 && (
              <Box sx={{ padding: '12px' }}>
                <TableContainer component={Paper}>
                  <Table>
                    <TableHead>
                      <TableRow>
                        <TableCell align='center' sx={{ width: '7%' }}><input type='text' placeholder='Job No' value={searchedValueJobNo || ''} onChange={(e) => setSearchedValueJobNo(e.target.value)} style={{ width: '100%', fontWeight: 'bold', fontSize: '15px', border: 'none', outline: 'none', background: 'transparent', color: '#000', textAlign: 'center' }} /></TableCell>
                        <TableCell align='center' sx={{ width: '20%' }}><input type='text' placeholder='Part No' value={searchedValuePartNo || ''} onChange={(e) => setSearchedValuePartNo(e.target.value)} style={{ width: '100%', fontWeight: 'bold', fontSize: '15px', border: 'none', outline: 'none', background: 'transparent', color: '#000', textAlign: 'center' }} /></TableCell>
                        <TableCell align='center' sx={{ fontWeight: 'bold', width: '5%', fontSize: '15px' }}>Revision</TableCell>
                        <TableCell align='center' sx={{ fontWeight: 'bold', width: '5%', fontSize: '15px' }}>Qty</TableCell>
                        <TableCell align='center' sx={{ fontWeight: 'bold', width: '6%', fontSize: '15px' }}>Due Date</TableCell>
                        <TableCell align='center' sx={{ width: '14%' }}><input type='text' placeholder='Customer' value={searchedValueCustomer || ''} onChange={(e) => setSearchedValueCustomer(e.target.value)} style={{ width: '100%', fontWeight: 'bold', fontSize: '15px', border: 'none', outline: 'none', background: 'transparent', color: '#000', textAlign: 'center' }} /></TableCell>
                        <TableCell align='center' sx={{ width: '7%' }}><input type='text' placeholder='Type' value={searchedValueType || ''} onChange={(e) => setSearchedValueType(e.target.value)} style={{ width: '100%', fontWeight: 'bold', fontSize: '15px', border: 'none', outline: 'none', background: 'transparent', color: '#000', textAlign: 'center' }} /></TableCell>
                        <TableCell align='center' sx={{ width: '10%' }}><input type='text' placeholder='Engineer' value={searchedValueEngineer || ''} onChange={(e) => setSearchedValueEngineer(e.target.value)} style={{ width: '100%', fontWeight: 'bold', fontSize: '15px', border: 'none', outline: 'none', background: 'transparent', color: '#000', textAlign: 'center' }} /></TableCell>
                        <TableCell align='center' sx={{ width: '10%' }}><input type='text' placeholder='Inspector' value={searchedValueInspector || ''} onChange={(e) => setSearchedValueInspector(e.target.value)} style={{ width: '100%', fontWeight: 'bold', fontSize: '15px', border: 'none', outline: 'none', background: 'transparent', color: '#000', textAlign: 'center' }} /></TableCell>
                        <TableCell align='center' sx={{ fontWeight: 'bold', width: '5%', fontSize: '15px' }}>Model</TableCell>
                        <TableCell align='center' sx={{ width: '10%' }}><input type='text' placeholder='Status' value={searchedValueStatus || ''} onChange={(e) => setSearchedValueStatus(e.target.value)} style={{ width: '100%', fontWeight: 'bold', fontSize: '15px', border: 'none', outline: 'none', background: 'transparent', color: '#000', textAlign: 'center' }} /></TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {searchedTBR
                        .filter(row => typeof row.JobNo !== 'undefined')
                        .filter((row) => 
                          !searchedValueJobNo || row.JobNo
                            .toString()
                            .toLowerCase()
                            .includes(searchedValueJobNo.toString().toLowerCase())
                        )
                        .filter((row) => 
                          !searchedValuePartNo || row.PartNo
                            .toString()
                            .toLowerCase()
                            .includes(searchedValuePartNo.toString().toLowerCase())
                        )
                        .filter((row) => 
                          !searchedValueCustomer || row.CustCode
                            .toString()
                            .toLowerCase()
                            .includes(searchedValueCustomer.toString().toLowerCase())
                        )
                        .filter((row) => 
                          !searchedValueType || row.User_Text3
                            .toString()
                            .toLowerCase()
                            .includes(searchedValueType.toString().toLowerCase())
                        )
                        .filter((row) => {
                          if (!searchedValueEngineer) { return true; }
                          if (!row || !row.dataValues || !row.dataValues.engineer) { return false; }
                          
                          return row.dataValues.engineer
                            .toString()
                            .toLowerCase()                                           
                            .includes(searchedValueEngineer.toString().toLowerCase())
                        })
                        .filter((row) => {
                          if (!searchedValueInspector) { return true; }
                          if (!row || !row.dataValues || !row.dataValues.inspector) { return false; }
                          
                          return row.dataValues.inspector
                            .toString()
                            .toLowerCase()                                           
                            .includes(searchedValueInspector.toString().toLowerCase())
                        })
                        .filter((row) => {
                          if (!searchedValueStatus) { return true; }
                          if (!row || !row.dataValues || !row.dataValues.jobStatus) { return false; }
                          
                          return row.dataValues.jobStatus
                            .toString()
                            .toLowerCase()                                           
                            .includes(searchedValueStatus.toString().toLowerCase())
                        })
                        .map((job, index) => {
                          if (job.dataValues.jobStatus == 'QC' || job.dataValues.jobStatus == 'CHECKING') {
                            const rowClass = job.WorkCode == 'HOT' ? 'expedite-row' : '';
                            const qcClass = qcCustomers.includes(job.CustCode) ? 'qc-row' : '';
                            const dropdownTBRTitle = dropdownTBRTitles[job.JobNo] || job.dataValues.inspector;
                            const dropdownTBRStatus = dropdownTBRStatuses[job.JobNo] || job.dataValues.jobStatus;
                            return (
                              <TableRow key={index} sx={{ backgroundColor: index % 2 === 0 ? '#f0f0f0' : '#fff' }} className={`${rowClass} ${qcClass}`}>
                                <TableCell align='center' sx={{ fontWeight: 'bold', fontSize: '15px' }}>{job.JobNo}</TableCell>
                                <TableCell align='center' sx={{ fontSize: '15px' }}>
                                  <CopyToClipboard text={job.PartNo} onCopy={() => { setShowToast(true); setPartCopy(`${job.PartNo}`); }}>
                                    <span>{job.PartNo}</span>
                                  </CopyToClipboard>
                                </TableCell>
                                <TableCell align='center' sx={{ fontSize: '15px' }}>{job.Revision}</TableCell>
                                <TableCell align='center' sx={{ fontSize: '15px' }}>{job.EstimQty}</TableCell>
                                <TableCell align='center' sx={{ fontSize: '15px' }}>{job.DueDate.split('-')[1] + '/' + job.DueDate.split('-')[2].split('T')[0]}</TableCell>
                                <TableCell align='center' sx={{ fontSize: '15px' }}>{job.CustCode}</TableCell>
                                <TableCell align='center' sx={{ fontSize: '15px' }}>{job.User_Text3}</TableCell>
                                <TableCell align='center' sx={{ fontSize: '15px' }}>{job.dataValues.engineer}</TableCell>
                                
                                {cookieData.quality ?
                                  <TableCell align='center' sx={{ fontSize: '15px' }}>
                                    <FormControl variant='standard' fullWidth>
                                      <Select
                                        value={dropdownTBRTitle || ''}
                                        onChange={(e) => handleTBRInspector(job, e.target.value)}
                                        disableUnderline
                                        sx={{
                                          fontSize: '15px',
                                          padding: '0',
                                          textAlign: 'center',
                                          overflowX: 'hidden',
                                          overflowY: 'hidden',
                                          '& .MuiSelect-icon': {
                                            display: dropdownTBRTitle ? 'none' : 'block',
                                            right: dropdownTBRTitle ? '0' : 'calc(50% - 12px)',
                                          },
                                          '& .MuiSelect-select': {
                                            padding: '0',
                                            marginRight: '-20px',
                                            textAlign: 'center',
                                            display: 'flex',
                                            justifyContent: 'center',
                                            alignItems: 'center',
                                          },
                                        }}
                                      >
                                        {qualityUsers.map((user, n) => (
                                          <MenuItem key={n} value={user}>
                                            {user}
                                          </MenuItem>
                                        ))}
                                        <Divider />
                                        <MenuItem value=''>None</MenuItem>
                                      </Select>
                                    </FormControl>
                                  </TableCell>
                                :
                                  <TableCell align='center' sx={{ fontSize: '15px' }}>{job.dataValues.inspector}</TableCell>
                                }

                                <TableCell align='center' sx={{ fontSize: '15px', padding: 0 }}>
                                  <IconButton onClick={() => toggleModel(job)}>
                                    {job.dataValues.model && <CheckIcon />}
                                  </IconButton>
                                </TableCell>

                                {cookieData.quality ?
                                  <TableCell align='center' sx={{ fontSize: '15px' }}>
                                    <FormControl variant='standard' fullWidth>
                                      <Select
                                        value={dropdownTBRStatus || ''}
                                        onChange={(e) => handleTBRStatus(job, e.target.value)}
                                        disableUnderline
                                        sx={{
                                          fontSize: '15px',
                                          padding: '0',
                                          textAlign: 'center',
                                          overflowX: 'hidden',
                                          overflowY: 'hidden',
                                          '& .MuiSelect-icon': {
                                            display: dropdownTBRStatus ? 'none' : 'block',
                                            right: dropdownTBRStatus ? '0' : 'calc(50% - 12px)',
                                          },
                                          '& .MuiSelect-select': {
                                            padding: '0',
                                            marginRight: '-20px',
                                            textAlign: 'center',
                                            display: 'flex',
                                            justifyContent: 'center',
                                            alignItems: 'center',
                                          },
                                        }}
                                      >
                                        <MenuItem value='CHECKING'>CHECKING</MenuItem>
                                        <MenuItem value='REWORK'>REWORK</MenuItem>
                                        <MenuItem value='DONE'>DONE</MenuItem>
                                        <Divider />
                                        <MenuItem value='QC'>QC</MenuItem>
                                      </Select>
                                    </FormControl>
                                  </TableCell>
                                :
                                  <TableCell align='center' sx={{ fontSize: '15px' }}>{job.dataValues.jobStatus}</TableCell>
                                }
                              </TableRow>
                            )
                          }
                        })
                      }
                    </TableBody>
                  </Table>
                </TableContainer>

                <IconButton onClick={fetchData} sx={{ backgroundColor: '#111827', color: 'white', height: '52.5px', width: '52.5px', zIndex: 1000, position: 'fixed', bottom: '20px', right: '20px','&:hover': { backgroundColor: '#374151', }, }}>
                  <RefreshIcon fontSize='large' />
                </IconButton>
                <Snackbar
                  open={showToast}
                  autoHideDuration={3000}
                  onClose={() => setShowToast(false)}
                  anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                  sx={{ marginRight: '100px' }}
                >
                  <Alert
                    onClose={() => setShowToast(false)}
                    severity='success'
                    sx={{ width: '100%' }}
                  >
                    <strong>{partCopy} Copied To Clipboard</strong>
                  </Alert>
                </Snackbar>
              </Box>
            )}
          </Box>

{/* FUTURE JOBS */}

          <Box>
            {selectedTab === 1 && (
              <Box sx={{ padding: '12px' }}>
                <TableContainer component={Paper}>
                  <Table>
                    <TableHead>
                      <TableRow>
                        <TableCell align='center' sx={{ width: '7%' }}><input type='text' placeholder='Job No' value={searchedValueJobNo || ''} onChange={(e) => setSearchedValueJobNo(e.target.value)} style={{ width: '100%', fontWeight: 'bold', fontSize: '15px', border: 'none', outline: 'none', background: 'transparent', color: '#000', textAlign: 'center' }} /></TableCell>
                        <TableCell align='center' sx={{ width: '20%' }}><input type='text' placeholder='Part No' value={searchedValuePartNo || ''} onChange={(e) => setSearchedValuePartNo(e.target.value)} style={{ width: '100%', fontWeight: 'bold', fontSize: '15px', border: 'none', outline: 'none', background: 'transparent', color: '#000', textAlign: 'center' }} /></TableCell>
                        <TableCell align='center' sx={{ fontWeight: 'bold', width: '5%', fontSize: '15px' }}>Revision</TableCell>
                        <TableCell align='center' sx={{ fontWeight: 'bold', width: '5%', fontSize: '15px' }}>Qty</TableCell>
                        <TableCell align='center' sx={{ fontWeight: 'bold', width: '6%', fontSize: '15px' }}>Due Date</TableCell>
                        <TableCell align='center' sx={{ width: '14%' }}><input type='text' placeholder='Customer' value={searchedValueCustomer || ''} onChange={(e) => setSearchedValueCustomer(e.target.value)} style={{ width: '100%', fontWeight: 'bold', fontSize: '15px', border: 'none', outline: 'none', background: 'transparent', color: '#000', textAlign: 'center' }} /></TableCell>
                        <TableCell align='center' sx={{ width: '7%' }}><input type='text' placeholder='Type' value={searchedValueType || ''} onChange={(e) => setSearchedValueType(e.target.value)} style={{ width: '100%', fontWeight: 'bold', fontSize: '15px', border: 'none', outline: 'none', background: 'transparent', color: '#000', textAlign: 'center' }} /></TableCell>
                        <TableCell align='center' sx={{ width: '10%' }}><input type='text' placeholder='Engineer' value={searchedValueEngineer || ''} onChange={(e) => setSearchedValueEngineer(e.target.value)} style={{ width: '100%', fontWeight: 'bold', fontSize: '15px', border: 'none', outline: 'none', background: 'transparent', color: '#000', textAlign: 'center' }} /></TableCell>
                        <TableCell align='center' sx={{ width: '10%' }}><input type='text' placeholder='Inspector' value={searchedValueInspector || ''} onChange={(e) => setSearchedValueInspector(e.target.value)} style={{ width: '100%', fontWeight: 'bold', fontSize: '15px', border: 'none', outline: 'none', background: 'transparent', color: '#000', textAlign: 'center' }} /></TableCell>
                        <TableCell align='center' sx={{ fontWeight: 'bold', width: '5%', fontSize: '15px' }}>Model</TableCell>
                        <TableCell align='center' sx={{ width: '10%' }}><input type='text' placeholder='Status' value={searchedValueStatus || ''} onChange={(e) => setSearchedValueStatus(e.target.value)} style={{ width: '100%', fontWeight: 'bold', fontSize: '15px', border: 'none', outline: 'none', background: 'transparent', color: '#000', textAlign: 'center' }} /></TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {searchedFuture
                        .filter(row => typeof row.JobNo !== 'undefined')
                        .filter((row) => 
                          !searchedValueJobNo || row.JobNo
                            .toString()
                            .toLowerCase()
                            .includes(searchedValueJobNo.toString().toLowerCase())
                        )
                        .filter((row) => 
                          !searchedValuePartNo || row.PartNo
                            .toString()
                            .toLowerCase()
                            .includes(searchedValuePartNo.toString().toLowerCase())
                        )
                        .filter((row) => 
                          !searchedValueCustomer || row.CustCode
                            .toString()
                            .toLowerCase()
                            .includes(searchedValueCustomer.toString().toLowerCase())
                        )
                        .filter((row) => 
                          !searchedValueType || row.User_Text3
                            .toString()
                            .toLowerCase()
                            .includes(searchedValueType.toString().toLowerCase())
                        )
                        .filter((row) => {
                          if (!searchedValueEngineer) { return true; }
                          if (!row || !row.dataValues || !row.dataValues.engineer) { return false; }
                          
                          return row.dataValues.engineer
                            .toString()
                            .toLowerCase()                                           
                            .includes(searchedValueEngineer.toString().toLowerCase())
                        })
                        .filter((row) => {
                          if (!searchedValueInspector) { return true; }
                          if (!row || !row.dataValues || !row.dataValues.inspector) { return false; }
                          
                          return row.dataValues.inspector
                            .toString()
                            .toLowerCase()                                           
                            .includes(searchedValueInspector.toString().toLowerCase())
                        })
                        .filter((row) => {
                          if (!searchedValueStatus) { return true; }
                          if (!row || !row.dataValues || !row.dataValues.jobStatus) { return false; }
                          
                          return row.dataValues.jobStatus
                            .toString()
                            .toLowerCase()                                           
                            .includes(searchedValueStatus.toString().toLowerCase())
                        })
                        .map((job, index) => {
                          if (job.User_Text3 != 'REPEAT' && job.User_Text2 != '6. OUTSOURCE' && job.dataValues.jobStatus == 'QC' || job.dataValues.jobStatus == 'CHECKING') {
                            const rowClass = job.WorkCode == 'HOT' ? 'expedite-row' : '';
                            const qcClass = qcCustomers.includes(job.CustCode) ? 'qc-row' : '';
                            const dropdownFutureTitle = dropdownFutureTitles[job.JobNo] || job.dataValues.inspector;
                            const dropdownFutureStatus = dropdownFutureStatuses[job.JobNo] || job.dataValues.jobStatus;
                            return (
                              <TableRow key={index} sx={{ backgroundColor: index % 2 === 0 ? '#f0f0f0' : '#fff' }} className={`${rowClass} ${qcClass}`}>
                                <TableCell align='center' sx={{ fontWeight: 'bold', fontSize: '15px' }}>{job.JobNo}</TableCell>
                                <TableCell align='center' sx={{ fontSize: '15px' }}>
                                  <CopyToClipboard text={job.PartNo} onCopy={() => { setShowToast(true); setPartCopy(`${job.PartNo}`); }}>
                                    <span>{job.PartNo}</span>
                                  </CopyToClipboard>
                                </TableCell>
                                <TableCell align='center' sx={{ fontSize: '15px' }}>{job.Revision}</TableCell>
                                <TableCell align='center' sx={{ fontSize: '15px' }}>{job.EstimQty}</TableCell>
                                <TableCell align='center' sx={{ fontSize: '15px' }}>{job.DueDate.split('-')[1] + '/' + job.DueDate.split('-')[2].split('T')[0]}</TableCell>
                                <TableCell align='center' sx={{ fontSize: '15px' }}>{job.CustCode}</TableCell>
                                <TableCell align='center' sx={{ fontSize: '15px' }}>{job.User_Text3}</TableCell>
                                <TableCell align='center' sx={{ fontSize: '15px' }}>{job.dataValues.engineer}</TableCell>
                                
                                {cookieData.quality ?
                                  <TableCell align='center' sx={{ fontSize: '15px' }}>
                                    <FormControl variant='standard' fullWidth>
                                      <Select
                                        value={dropdownFutureTitle || ''}
                                        onChange={(e) => handleFutureInspector(job, e.target.value)}
                                        disableUnderline
                                        sx={{
                                          fontSize: '15px',
                                          padding: '0',
                                          textAlign: 'center',
                                          overflowX: 'hidden',
                                          overflowY: 'hidden',
                                          '& .MuiSelect-icon': {
                                            display: dropdownFutureTitle ? 'none' : 'block',
                                            right: dropdownFutureTitle ? '0' : 'calc(50% - 12px)',
                                          },
                                          '& .MuiSelect-select': {
                                            padding: '0',
                                            marginRight: '-20px',
                                            textAlign: 'center',
                                            display: 'flex',
                                            justifyContent: 'center',
                                            alignItems: 'center',
                                          },
                                        }}
                                      >
                                        {qualityUsers.map((user, n) => (
                                          <MenuItem key={n} value={user}>
                                            {user}
                                          </MenuItem>
                                        ))}
                                        <Divider />
                                        <MenuItem value=''>None</MenuItem>
                                      </Select>
                                    </FormControl>
                                  </TableCell>
                                :
                                  <TableCell align='center' sx={{ fontSize: '15px' }}>{job.dataValues.inspector}</TableCell>
                                }

                                <TableCell align='center' sx={{ fontSize: '15px', padding: 0 }}>
                                  <IconButton onClick={() => toggleModel(job)}>
                                    {job.dataValues.model && <CheckIcon />}
                                  </IconButton>
                                </TableCell>

                                {cookieData.quality ?
                                  <TableCell align='center' sx={{ fontSize: '15px' }}>
                                    <FormControl variant='standard' fullWidth>
                                      <Select
                                        value={dropdownFutureStatus || ''}
                                        onChange={(e) => handleFutureStatus(job, e.target.value)}
                                        disableUnderline
                                        sx={{
                                          fontSize: '15px',
                                          padding: '0',
                                          textAlign: 'center',
                                          overflowX: 'hidden',
                                          overflowY: 'hidden',
                                          '& .MuiSelect-icon': {
                                            display: dropdownFutureStatus ? 'none' : 'block',
                                            right: dropdownFutureStatus ? '0' : 'calc(50% - 12px)',
                                          },
                                          '& .MuiSelect-select': {
                                            padding: '0',
                                            marginRight: '-20px',
                                            textAlign: 'center',
                                            display: 'flex',
                                            justifyContent: 'center',
                                            alignItems: 'center',
                                          },
                                        }}
                                      >
                                        <MenuItem value='CHECKING'>CHECKING</MenuItem>
                                        <MenuItem value='REWORK'>REWORK</MenuItem>
                                        <MenuItem value='DONE'>DONE</MenuItem>
                                        <Divider />
                                        <MenuItem value='QC'>QC</MenuItem>
                                      </Select>
                                    </FormControl>
                                  </TableCell>
                                :
                                  <TableCell align='center' sx={{ fontSize: '15px' }}>{job.dataValues.jobStatus}</TableCell>
                                }
                              </TableRow>
                            )
                          }
                        })
                      }
                    </TableBody>
                  </Table>
                </TableContainer>

                <IconButton onClick={fetchData} sx={{ backgroundColor: '#111827', color: 'white', height: '52.5px', width: '52.5px', zIndex: 1000, position: 'fixed', bottom: '20px', right: '20px','&:hover': { backgroundColor: '#374151', }, }}>
                  <RefreshIcon fontSize='large' />
                </IconButton>
                <Snackbar
                  open={showToast}
                  autoHideDuration={3000}
                  onClose={() => setShowToast(false)}
                  anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                  sx={{ marginRight: '100px' }}
                >
                  <Alert
                    onClose={() => setShowToast(false)}
                    severity='success'
                    sx={{ width: '100%' }}
                  >
                    <strong>{partCopy} Copied To Clipboard</strong>
                  </Alert>
                </Snackbar>
              </Box>
            )}
          </Box>

{/* PROTOTYPES */}

          <Box>
            {selectedTab === 2 && (
              <Box sx={{ padding: '12px' }}>
                <TableContainer component={Paper}>
                  <Table>
                    <TableHead>
                      <TableRow>
                        <TableCell align='center' sx={{ width: '7%' }}><input type='text' placeholder='Job No' value={searchedValueJobNo || ''} onChange={(e) => setSearchedValueJobNo(e.target.value)} style={{ width: '100%', fontWeight: 'bold', fontSize: '15px', border: 'none', outline: 'none', background: 'transparent', color: '#000', textAlign: 'center' }} /></TableCell>
                        <TableCell align='center' sx={{ width: '20%' }}><input type='text' placeholder='Part No' value={searchedValuePartNo || ''} onChange={(e) => setSearchedValuePartNo(e.target.value)} style={{ width: '100%', fontWeight: 'bold', fontSize: '15px', border: 'none', outline: 'none', background: 'transparent', color: '#000', textAlign: 'center' }} /></TableCell>
                        <TableCell align='center' sx={{ fontWeight: 'bold', width: '5%', fontSize: '15px' }}>Revision</TableCell>
                        <TableCell align='center' sx={{ fontWeight: 'bold', width: '5%', fontSize: '15px' }}>Qty</TableCell>
                        <TableCell align='center' sx={{ fontWeight: 'bold', width: '6%', fontSize: '15px' }}>Due Date</TableCell>
                        <TableCell align='center' sx={{ width: '14%' }}><input type='text' placeholder='Customer' value={searchedValueCustomer || ''} onChange={(e) => setSearchedValueCustomer(e.target.value)} style={{ width: '100%', fontWeight: 'bold', fontSize: '15px', border: 'none', outline: 'none', background: 'transparent', color: '#000', textAlign: 'center' }} /></TableCell>
                        <TableCell align='center' sx={{ width: '7%' }}><input type='text' placeholder='Type' value={searchedValueType || ''} onChange={(e) => setSearchedValueType(e.target.value)} style={{ width: '100%', fontWeight: 'bold', fontSize: '15px', border: 'none', outline: 'none', background: 'transparent', color: '#000', textAlign: 'center' }} /></TableCell>
                        <TableCell align='center' sx={{ width: '10%' }}><input type='text' placeholder='Area' value={searchedValueArea || ''} onChange={(e) => setSearchedValueArea(e.target.value)} style={{ width: '100%', fontWeight: 'bold', fontSize: '15px', border: 'none', outline: 'none', background: 'transparent', color: '#000', textAlign: 'center' }} /></TableCell>
                        <TableCell align='center' sx={{ width: '10%' }}><input type='text' placeholder='Status' value={searchedValueStatus || ''} onChange={(e) => setSearchedValueStatus(e.target.value)} style={{ width: '100%', fontWeight: 'bold', fontSize: '15px', border: 'none', outline: 'none', background: 'transparent', color: '#000', textAlign: 'center' }} /></TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {searchedEng
                        .filter(row => typeof row.JobNo !== 'undefined')
                        .filter((row) => 
                          !searchedValueJobNo || row.JobNo
                            .toString()
                            .toLowerCase()
                            .includes(searchedValueJobNo.toString().toLowerCase())
                        )
                        .filter((row) => 
                          !searchedValuePartNo || row.PartNo
                            .toString()
                            .toLowerCase()
                            .includes(searchedValuePartNo.toString().toLowerCase())
                        )
                        .filter((row) => 
                          !searchedValueCustomer || row.CustCode
                            .toString()
                            .toLowerCase()
                            .includes(searchedValueCustomer.toString().toLowerCase())
                        )
                        .filter((row) => 
                          !searchedValueType || row.User_Text3
                            .toString()
                            .toLowerCase()
                            .includes(searchedValueType.toString().toLowerCase())
                        )
                        .filter((row) => 
                          !searchedValueType || row.User_Text2
                            .toString()
                            .toLowerCase()
                            .includes(searchedValueArea.toString().toLowerCase())
                        )
                        .filter((row) => {
                          if (!searchedValueStatus) { return true; }
                          if (!row || !row.dataValues || !row.dataValues.jobStatus) { return false; }
                          
                          return row.dataValues.jobStatus
                            .toString()
                            .toLowerCase()                                           
                            .includes(searchedValueStatus.toString().toLowerCase())
                        })
                        .map((job, index) => {
                          if (job.dataValues.jobStatus == 'PROTO') {
                            return (
                              <TableRow key={index} sx={{ backgroundColor: index % 2 === 0 ? '#f0f0f0' : '#fff' }}>
                                <TableCell align='center' sx={{ fontWeight: 'bold', fontSize: '15px' }}>{job.JobNo}</TableCell>
                                <TableCell align='center' sx={{ fontSize: '15px' }}>
                                  <CopyToClipboard text={job.PartNo} onCopy={() => { setShowToast(true); setPartCopy(`${job.PartNo}`); }}>
                                    <span>{job.PartNo}</span>
                                  </CopyToClipboard>
                                </TableCell>
                                <TableCell align='center' sx={{ fontSize: '15px' }}>{job.Revision}</TableCell>
                                <TableCell align='center' sx={{ fontSize: '15px' }}>{job.EstimQty}</TableCell>
                                <TableCell align='center' sx={{ fontSize: '15px' }}>{job.DueDate.split('-')[1] + '/' + job.DueDate.split('-')[2].split('T')[0]}</TableCell>
                                <TableCell align='center' sx={{ fontSize: '15px' }}>{job.CustCode}</TableCell>
                                <TableCell align='center' sx={{ fontSize: '15px' }}>{job.User_Text3}</TableCell>
                                <TableCell align='center' sx={{ fontSize: '15px' }}>{job.User_Text2}</TableCell>
                              </TableRow>
                            )
                          }
                        })
                      }
                    </TableBody>
                  </Table>
                </TableContainer>

                <IconButton onClick={fetchData} sx={{ backgroundColor: '#111827', color: 'white', height: '52.5px', width: '52.5px', zIndex: 1000, position: 'fixed', bottom: '20px', right: '20px','&:hover': { backgroundColor: '#374151', }, }}>
                  <RefreshIcon fontSize='large' />
                </IconButton>
                <Snackbar
                  open={showToast}
                  autoHideDuration={3000}
                  onClose={() => setShowToast(false)}
                  anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                  sx={{ marginRight: '100px' }}
                >
                  <Alert
                    onClose={() => setShowToast(false)}
                    severity='success'
                    sx={{ width: '100%' }}
                  >
                    <strong>{partCopy} Copied To Clipboard</strong>
                  </Alert>
                </Snackbar>
              </Box>
            )}
          </Box>

        </Box>
      )}
    </Box>
  );
}