import { useEffect, useState } from 'react';
import { Alert, Box, Divider, FormControl, IconButton, MenuItem, Paper, Select, Snackbar, Tab, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Tabs, Typography } from '@mui/material';

import { CopyToClipboard } from 'react-copy-to-clipboard';
import { useUserContext } from '../../context/UserContext';

import PuffLoader from 'react-spinners/PuffLoader';
import CheckIcon from '@mui/icons-material/Check';
import RefreshIcon from '@mui/icons-material/Refresh';

import getAllJobs from '../../services/machining/getAllJobs';
import getTBRJobs from '../../services/machining/getTBRJobs';
import getFutureJobs from '../../services/machining/getFutureJobs';
import getRepeatJobs from '../../services/machining/getRepeatJobs';
import getNextStep from '../../services/engineering/getNextStep';
import getPrints from '../../services/engineering/getPrints';
import getAllUsers from '../../services/users/getAllUsers';
import updateModel from '../../services/engineering/updateModel';
import updateEngineer from '../../services/engineering/updateEngineer';
import updateJobStatus from '../../services/engineering/updateJobStatus';
import './engineering.css';

export const Machining = () => {
  const { cookieData } = useUserContext();
  const [searchedValueJobNo, setSearchedValueJobNo] = useState('');
  const [searchedValuePartNo, setSearchedValuePartNo] = useState('');
  const [searchedValueCustomer, setSearchedValueCustomer] = useState('');
  const [searchedValueType, setSearchedValueType] = useState('');
  const [searchedValueStep, setSearchedValueStep] = useState('');
  const [searchedValueEngineer, setSearchedValueEngineer] = useState('');
  const [searchedValueQuote, setSearchedValueQuote] = useState('');
  const [searchedValueStatus, setSearchedValueStatus] = useState('');
  const [searchedValueArea, setSearchedValueArea] = useState('');
  const [showToast, setShowToast] = useState(false);
  const [partCopy, setPartCopy] = useState('None');
  const [update, setUpdate] = useState('');

  const [searchedEng, setSearchedEng] = useState([]);
  const [searchedTBR, setSearchedTBR] = useState([]);
  const [searchedFuture, setSearchedFuture] = useState([]);
  const [fullRepeats, setFullRepeats] = useState([]);
  const [machiningUsers, setMachiningUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedTab, setSelectedTab] = useState(0);

  const [dropdownTBRTitles, setDropdownTBRTitles] = useState({});
  const [dropdownFutureTitles, setDropdownFutureTitles] = useState({});
  const [dropdownTBRStatuses, setDropdownTBRStatuses] = useState({});
  const [dropdownFutureStatuses, setDropdownFutureStatuses] = useState({});

  const [tbr, setTbr] = useState('');
  const [future, setFuture] = useState('');
  const [repeat, setRepeat] = useState('');
  const [active, setActive] = useState('Active');

  const fetchData = async () => {
    try {
      const [engRes, tbrRes, futureRes, nextStepRes, printsRes, repeatRes, userRes] = await Promise.all([
        getAllJobs(),
        getTBRJobs(),
        getFutureJobs(),
        getNextStep(),
        getPrints(),
        getRepeatJobs(),
        getAllUsers(),
      ]);

      setSearchedEng(engRes);

      setSearchedTBR(tbrRes);
      let tbrCount = tbrRes.filter(row => typeof row.JobNo !== 'undefined').length;
      setTbr(tbrCount > 0 ? `TBR (${tbrCount})` : 'TBR');

      setSearchedFuture(futureRes);
      let futureCount = futureRes.filter(row => typeof row.JobNo !== 'undefined' && row.User_Text3 !== 'REPEAT').length;
      setFuture(futureCount > 0 ? `Future (${futureCount})` : 'Future');

      let repeatCount = repeatRes.length;
      setRepeat(repeatCount > 0 ? `Repeat (${repeatCount})` : 'Repeat');

      setFullRepeats(
        repeatRes.map(v => {
          let obj1 = nextStepRes.find(o => o.JobNo === v.JobNo);
          if (obj1) {
            v.WorkCntr = obj1.WorkCntr;
          }

          let obj = printsRes.find(x => x.PartNo === v.PartNo);
          v.DocNumber = obj ? obj.DocNumber : '';

          return v;
        })
      );

      setMachiningUsers(userRes.data.filter(user => user.machining).map(user => user.name.split(' ')[0]));

    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  const fetchTBRData = async () => {
    try {
      const [tbrRes] = await Promise.all([
        getTBRJobs(),
      ]);

      setSearchedTBR(tbrRes);
      let tbrCount = tbrRes.filter(row => typeof row.JobNo !== 'undefined').length;
      setTbr(tbrCount > 0 ? `TBR (${tbrCount})` : 'TBR');

    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  const fetchFutureData = async () => {
    try {
      const [futureRes] = await Promise.all([
        getFutureJobs(),
      ]);

      setSearchedFuture(futureRes);
      let futureCount = futureRes.filter(row => typeof row.JobNo !== 'undefined' && row.User_Text3 !== 'REPEAT').length;
      setFuture(futureCount > 0 ? `Future (${futureCount})` : 'Future');

    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  const fetchRepeatData = async () => {
    try {
      const [nextStepRes, printsRes, repeatRes] = await Promise.all([
        getNextStep(),
        getPrints(),
        getRepeatJobs(),
      ]);

      let repeatCount = repeatRes.length;
      setRepeat(repeatCount > 0 ? `Repeat (${repeatCount})` : 'Repeat');

      setFullRepeats(
        repeatRes.map(v => {
          let obj1 = nextStepRes.find(o => o.JobNo === v.JobNo);
          if (obj1) {
            v.WorkCntr = obj1.WorkCntr;
          }

          let obj = printsRes.find(x => x.PartNo === v.PartNo);
          v.DocNumber = obj ? obj.DocNumber : '';

          return v;
        })
      );

    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  const fetchActiveData = async () => {
    try {
      const [engRes] = await Promise.all([
        getAllJobs(),
      ]);

      setSearchedEng(engRes);

    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  const toggleModel = async (job) => {
    try {
      await updateModel(job.dataValues.id);

    } catch (err) {
      console.log(err);
    } finally {
      setUpdate(`Model ${job.dataValues.jobNo}`)
    }
  }

  const handleTBREngineer = async (job, engineer) => {
    setDropdownTBRTitles(prevState => ({
      ...prevState,
      [job.JobNo]: engineer
    }));
    try {
      await updateEngineer(job.dataValues.jobNo, engineer);
      const res = await getTBRJobs();
      setSearchedTBR(res);
    } catch (err) {
      console.log(err);
    }
  }

  const handleTBRJobStatus = async (job, jobStatus) => {
    setDropdownTBRStatuses(prevState => ({
      ...prevState,
      [job.JobNo]: jobStatus
    }));
    try {
      await updateJobStatus(job.dataValues.jobNo, jobStatus);
      const res = await getTBRJobs();
      setSearchedTBR(res);
    } catch (err) {
      console.log(err);
    }
  }

  const handleFutureEngineer = async (job, engineer) => {
    setDropdownFutureTitles(prevState => ({
      ...prevState,
      [job.JobNo]: engineer
    }));
    try {
      await updateEngineer(job.dataValues.jobNo, engineer);
      const res = await getFutureJobs();
      setSearchedFuture(res);
    } catch (err) {
      console.log(err)
    }
  }

  const handleFutureJobStatus = async (job, jobStatus) => {
    setDropdownFutureStatuses(prevState => ({
      ...prevState,
      [job.JobNo]: jobStatus
    }));
    try {
      await updateJobStatus(job.dataValues.jobNo, jobStatus);
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
  }, [loading, update]);

  return (
    <Box sx={{ width: '100%', textAlign: 'center', overflowY: 'auto', height: '100vh' }}>
      {loading ? (
        <Box>
          <Typography variant='h4' sx={{ fontWeight: 'bold', margin: '16px' }}>Machining</Typography>
          <Box sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', marginTop: '100px' }}>
            <PuffLoader color='red' />
          </Box>
        </Box>
      ) : (
        <Box sx={{ width: '100%' }}>
          <Typography variant='h4' sx={{ fontWeight: 'bold', margin: '16px' }}>Machining</Typography>
          <Tabs value={selectedTab} onChange={handleTabChange} centered  TabIndicatorProps={{ style: {backgroundColor: 'red'} }}>
            <Tab label={tbr} sx={{ width: '15%', '&.Mui-selected': { color: 'red' }, '&:focus': { outline: 'none' } }} />
            <Tab label={future} sx={{ width: '15%', '&.Mui-selected': { color: 'red' }, '&:focus': { outline: 'none' } }} />
            <Tab label={repeat} sx={{ width: '15%', '&.Mui-selected': { color: 'red' }, '&:focus': { outline: 'none' } }} />
            <Tab label={active} sx={{ width: '15%', '&.Mui-selected': { color: 'red' }, '&:focus': { outline: 'none' } }} />
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
                        <TableCell align='center' sx={{ fontWeight: 'bold', width: '6%', fontSize: '15px' }}>Step No</TableCell>
                        <TableCell align='center' sx={{ width: '20%' }}><input type='text' placeholder='Part No' value={searchedValuePartNo || ''} onChange={(e) => setSearchedValuePartNo(e.target.value)} style={{ width: '100%', fontWeight: 'bold', fontSize: '15px', border: 'none', outline: 'none', background: 'transparent', color: '#000', textAlign: 'center' }} /></TableCell>
                        <TableCell align='center' sx={{ fontWeight: 'bold', width: '5%', fontSize: '15px' }}>Revision</TableCell>
                        <TableCell align='center' sx={{ fontWeight: 'bold', width: '5%', fontSize: '15px' }}>Qty</TableCell>
                        <TableCell align='center' sx={{ fontWeight: 'bold', width: '7%', fontSize: '15px' }}>Due Date</TableCell>
                        <TableCell align='center' sx={{ width: '12%' }}><input type='text' placeholder='Customer' value={searchedValueCustomer || ''} onChange={(e) => setSearchedValueCustomer(e.target.value)} style={{ width: '100%', fontWeight: 'bold', fontSize: '15px', border: 'none', outline: 'none', background: 'transparent', color: '#000', textAlign: 'center' }} /></TableCell>
                        <TableCell align='center' sx={{ width: '7%' }}><input type='text' placeholder='Type' value={searchedValueType || ''} onChange={(e) => setSearchedValueType(e.target.value)} style={{ width: '100%', fontWeight: 'bold', fontSize: '15px', border: 'none', outline: 'none', background: 'transparent', color: '#000', textAlign: 'center' }} /></TableCell>
                        <TableCell align='center' sx={{ width: '10%' }}><input type='text' placeholder='Engineer' value={searchedValueEngineer || ''} onChange={(e) => setSearchedValueEngineer(e.target.value)} style={{ width: '100%', fontWeight: 'bold', fontSize: '15px', border: 'none', outline: 'none', background: 'transparent', color: '#000', textAlign: 'center' }} /></TableCell>
                        <TableCell align='center' sx={{ width: '6%' }}><input type='text' placeholder='Quote' value={searchedValueQuote || ''} onChange={(e) => setSearchedValueQuote(e.target.value)} style={{ width: '100%', fontWeight: 'bold', fontSize: '15px', border: 'none', outline: 'none', background: 'transparent', color: '#000', textAlign: 'center' }} /></TableCell>
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
                          if (!searchedValueQuote) { return true; }
                          if (!row || !row.QuoteNo ) { return false; }
                          
                          return row.QuoteNo
                            .toString()
                            .toLowerCase()                                           
                            .includes(searchedValueQuote.toString().toLowerCase())
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
                          const rowClass = job.WorkCode == 'HOT' ? 'expedite-row' : '';
                          const dropdownTBRTitle = dropdownTBRTitles[job.JobNo] || job.dataValues.engineer;
                          const dropdownTBRStatus = dropdownTBRStatuses[job.JobNo] || job.dataValues.jobStatus;
                          return (
                            <TableRow key={index} sx={{ backgroundColor: index % 2 === 0 ? '#f0f0f0' : '#fff' }} className={`${rowClass}`}>
                              <TableCell align='center' sx={{ fontWeight: 'bold', fontSize: '15px', p: 1.25 }}>{job.JobNo}</TableCell>
                              <TableCell align='center' sx={{ fontSize: '15px', p: 1.25 }}>{job.StepNo}</TableCell>
                              <TableCell align='center' sx={{ fontSize: '15px', p: 1.25 }}>
                                <CopyToClipboard text={job.PartNo} onCopy={() => { setShowToast(true); setPartCopy(`${job.PartNo}`); }}>
                                  <span>{job.PartNo}</span>
                                </CopyToClipboard>
                              </TableCell>
                              <TableCell align='center' sx={{ fontSize: '15px', p: 1.25 }}>{job.Revision}</TableCell>
                              <TableCell align='center' sx={{ fontSize: '15px', p: 1.25 }}>{job.EstimQty}</TableCell>
                              <TableCell align='center' sx={{ fontSize: '15px', p: 1.25 }}>{job.DueDate.split('-')[1] + '/' + job.DueDate.split('-')[2].split('T')[0]}</TableCell>
                              <TableCell align='center' sx={{ fontSize: '15px', p: 1.25 }}>{job.CustCode}</TableCell>
                              <TableCell align='center' sx={{ fontSize: '15px', p: 1.25 }}>{job.User_Text3}</TableCell>
                              
                              {cookieData.machining ?
                                <TableCell align='center' sx={{ fontSize: '15px', p: 1.25 }}>
                                  <FormControl variant='standard' fullWidth>
                                    <Select
                                      value={dropdownTBRTitle || ''}
                                      onChange={(e) => handleTBREngineer(job, e.target.value)}
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
                                      {machiningUsers.map((user, n) => (
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
                                <TableCell align='center' sx={{ fontSize: '15px', p: 1.25 }}>{job.dataValues.engineer}</TableCell>
                              }

                              <TableCell align='center' sx={{ fontSize: '15px', p: 1.25 }}>{job.QuoteNo}</TableCell>
                              <TableCell align='center' sx={{ fontSize: '15px', p: 0 }}>
                                <IconButton onClick={() => toggleModel(job)}>
                                  {job.dataValues.model && <CheckIcon sx={{ fontSize: '20px', fontWeight: 'bold' }} />}
                                </IconButton>
                              </TableCell>

                              {cookieData.machining ?
                                <TableCell align='center' sx={{ fontSize: '15px', p: 1.25 }}>
                                  <FormControl variant='standard' fullWidth>
                                    <Select
                                      value={dropdownTBRStatus || ''}
                                      onChange={(e) => handleTBRJobStatus(job, e.target.value)}
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
                                      <MenuItem value='WIP'>WIP</MenuItem>
                                      <MenuItem value='FORMING'>FORMING</MenuItem>
                                      <MenuItem value='FINALIZE'>FINALIZE</MenuItem>
                                      <MenuItem value='TLASER'>TLASER</MenuItem>
                                      <MenuItem value='QC'>QC</MenuItem>
                                      <MenuItem value='REWORK'>REWORK</MenuItem>
                                      <MenuItem value='HOLD'>HOLD</MenuItem>
                                      <MenuItem value='PROTO'>PROTO</MenuItem>
                                      <MenuItem value='DONE'>DONE</MenuItem>
                                      <Divider />
                                      <MenuItem value='CLOCK'>CLOCK</MenuItem>
                                    </Select>
                                  </FormControl>
                                </TableCell>
                              :
                                <TableCell align='center' sx={{ fontSize: '15px', p: 1.25 }}>{job.dataValues.jobStatus}</TableCell>
                              }
                            </TableRow>
                          )
                        })
                      }
                    </TableBody>
                  </Table>
                </TableContainer>

                <IconButton onClick={fetchTBRData} sx={{ backgroundColor: '#111827', color: 'white', height: '52.5px', width: '52.5px', zIndex: 1000, position: 'fixed', bottom: '20px', right: '20px','&:hover': { backgroundColor: '#374151', }, }}>
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
                        <TableCell align='center' sx={{ fontWeight: 'bold', width: '6%', fontSize: '15px' }}>Step No</TableCell>
                        <TableCell align='center' sx={{ width: '20%' }}><input type='text' placeholder='Part No' value={searchedValuePartNo || ''} onChange={(e) => setSearchedValuePartNo(e.target.value)} style={{ width: '100%', fontWeight: 'bold', fontSize: '15px', border: 'none', outline: 'none', background: 'transparent', color: '#000', textAlign: 'center' }} /></TableCell>
                        <TableCell align='center' sx={{ fontWeight: 'bold', width: '5%', fontSize: '15px' }}>Revision</TableCell>
                        <TableCell align='center' sx={{ fontWeight: 'bold', width: '5%', fontSize: '15px' }}>Qty</TableCell>
                        <TableCell align='center' sx={{ fontWeight: 'bold', width: '7%', fontSize: '15px' }}>Due Date</TableCell>
                        <TableCell align='center' sx={{ width: '12%' }}><input type='text' placeholder='Customer' value={searchedValueCustomer || ''} onChange={(e) => setSearchedValueCustomer(e.target.value)} style={{ width: '100%', fontWeight: 'bold', fontSize: '15px', border: 'none', outline: 'none', background: 'transparent', color: '#000', textAlign: 'center' }} /></TableCell>
                        <TableCell align='center' sx={{ width: '7%' }}><input type='text' placeholder='Type' value={searchedValueType || ''} onChange={(e) => setSearchedValueType(e.target.value)} style={{ width: '100%', fontWeight: 'bold', fontSize: '15px', border: 'none', outline: 'none', background: 'transparent', color: '#000', textAlign: 'center' }} /></TableCell>
                        <TableCell align='center' sx={{ width: '10%' }}><input type='text' placeholder='Engineer' value={searchedValueEngineer || ''} onChange={(e) => setSearchedValueEngineer(e.target.value)} style={{ width: '100%', fontWeight: 'bold', fontSize: '15px', border: 'none', outline: 'none', background: 'transparent', color: '#000', textAlign: 'center' }} /></TableCell>
                        <TableCell align='center' sx={{ width: '6%' }}><input type='text' placeholder='Quote' value={searchedValueQuote || ''} onChange={(e) => setSearchedValueQuote(e.target.value)} style={{ width: '100%', fontWeight: 'bold', fontSize: '15px', border: 'none', outline: 'none', background: 'transparent', color: '#000', textAlign: 'center' }} /></TableCell>
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
                          if (!searchedValueQuote) { return true; }
                          if (!row || !row.QuoteNo ) { return false; }
                          
                          return row.QuoteNo
                            .toString()
                            .toLowerCase()                                           
                            .includes(searchedValueQuote.toString().toLowerCase())
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
                          if (job.User_Text3 != 'REPEAT' && job.User_Text2 != '6. OUTSOURCE') {
                            const rowClass = job.WorkCode == 'HOT' ? 'expedite-row' : '';
                            const dropdownFutureTitle = dropdownFutureTitles[job.JobNo] || job.dataValues.engineer;
                            const dropdownFutureStatus = dropdownFutureStatuses[job.JobNo] || job.dataValues.jobStatus;
                            return (
                              <TableRow key={index} sx={{ backgroundColor: index % 2 === 0 ? '#f0f0f0' : '#fff' }} className={`${rowClass}`}>
                                <TableCell align='center' sx={{ fontWeight: 'bold', fontSize: '15px', p: 1.25 }}>{job.JobNo}</TableCell>
                                <TableCell align='center' sx={{ fontSize: '15px', p: 1.25 }}>{job.StepNo}</TableCell>
                                <TableCell align='center' sx={{ fontSize: '15px', p: 1.25 }}>
                                  <CopyToClipboard text={job.PartNo} onCopy={() => { setShowToast(true); setPartCopy(`${job.PartNo}`); }}>
                                    <span>{job.PartNo}</span>
                                  </CopyToClipboard>
                                </TableCell>
                                <TableCell align='center' sx={{ fontSize: '15px', p: 1.25 }}>{job.Revision}</TableCell>
                                <TableCell align='center' sx={{ fontSize: '15px', p: 1.25 }}>{job.EstimQty}</TableCell>
                                <TableCell align='center' sx={{ fontSize: '15px', p: 1.25 }}>{job.DueDate.split('-')[1] + '/' + job.DueDate.split('-')[2].split('T')[0]}</TableCell>
                                <TableCell align='center' sx={{ fontSize: '15px', p: 1.25 }}>{job.CustCode}</TableCell>
                                <TableCell align='center' sx={{ fontSize: '15px', p: 1.25 }}>{job.User_Text3}</TableCell>
                                
                                {cookieData.machining ?
                                  <TableCell align='center' sx={{ fontSize: '15px', p: 1.25 }}>
                                    <FormControl variant='standard' fullWidth>
                                      <Select
                                        value={dropdownFutureTitle || ''}
                                        onChange={(e) => handleFutureEngineer(job, e.target.value)}
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
                                        {machiningUsers.map((user, n) => (
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
                                  <TableCell align='center' sx={{ fontSize: '15px', p: 1.25 }}>{job.dataValues.engineer}</TableCell>
                                }

                                <TableCell align='center' sx={{ fontSize: '15px', p: 1.25 }}>{job.QuoteNo}</TableCell>
                                <TableCell align='center' sx={{ fontSize: '15px', p: 0 }}>
                                  <IconButton onClick={() => toggleModel(job)}>
                                    {job.dataValues.model && <CheckIcon sx={{ fontSize: '20px', fontWeight: 'bold' }} />}
                                  </IconButton>
                                </TableCell>

                                {cookieData.machining ?
                                  <TableCell align='center' sx={{ fontSize: '15px', p: 1.25 }}>
                                    <FormControl variant='standard' fullWidth>
                                      <Select
                                        value={dropdownFutureStatus || ''}
                                        onChange={(e) => handleFutureJobStatus(job, e.target.value)}
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
                                        <MenuItem value='WIP'>WIP</MenuItem>
                                        <MenuItem value='FORMING'>FORMING</MenuItem>
                                        <MenuItem value='FINALIZE'>FINALIZE</MenuItem>
                                        <MenuItem value='TLASER'>TLASER</MenuItem>
                                        <MenuItem value='QC'>QC</MenuItem>
                                        <MenuItem value='REWORK'>REWORK</MenuItem>
                                        <MenuItem value='HOLD'>HOLD</MenuItem>
                                        <MenuItem value='PROTO'>PROTO</MenuItem>
                                        <MenuItem value='DONE'>DONE</MenuItem>
                                        <Divider />
                                        <MenuItem value='CLOCK'>CLOCK</MenuItem>
                                      </Select>
                                    </FormControl>
                                  </TableCell>
                                :
                                  <TableCell align='center' sx={{ fontSize: '15px', p: 1.25 }}>{job.dataValues.jobStatus}</TableCell>
                                }
                              </TableRow>
                            )
                          }
                        })
                      }
                    </TableBody>
                  </Table>
                </TableContainer>

                <IconButton onClick={fetchFutureData} sx={{ backgroundColor: '#111827', color: 'white', height: '52.5px', width: '52.5px', zIndex: 1000, position: 'fixed', bottom: '20px', right: '20px','&:hover': { backgroundColor: '#374151', }, }}>
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

{/* REPEAT JOBS */}

          <Box>
            {selectedTab === 2 && (
              <Box sx={{ padding: '12px' }}>
                <TableContainer component={Paper}>
                  <Table>
                    <TableHead>
                      <TableRow>
                        <TableCell align='center' sx={{ width: '10%' }}><input type='text' placeholder='Job No' value={searchedValueJobNo || ''} onChange={(e) => setSearchedValueJobNo(e.target.value)} style={{ width: '100%', fontWeight: 'bold', fontSize: '15px', border: 'none', outline: 'none', background: 'transparent', color: '#000', textAlign: 'center' }} /></TableCell>
                        <TableCell align='center' sx={{ fontWeight: 'bold', width: '7%', fontSize: '15px' }}>Step No</TableCell>
                        <TableCell align='center' sx={{ width: '20%' }}><input type='text' placeholder='Part No' value={searchedValuePartNo || ''} onChange={(e) => setSearchedValuePartNo(e.target.value)} style={{ width: '100%', fontWeight: 'bold', fontSize: '15px', border: 'none', outline: 'none', background: 'transparent', color: '#000', textAlign: 'center' }} /></TableCell>
                        <TableCell align='center' sx={{ fontWeight: 'bold', width: '10%', fontSize: '15px' }}>Revision</TableCell>
                        <TableCell align='center' sx={{ fontWeight: 'bold', width: '8%', fontSize: '15px' }}>Qty</TableCell>
                        <TableCell align='center' sx={{ fontWeight: 'bold', width: '10%', fontSize: '15px' }}>Due Date</TableCell>
                        <TableCell align='center' sx={{ width: '10%' }}><input type='text' placeholder='Customer' value={searchedValueCustomer || ''} onChange={(e) => setSearchedValueCustomer(e.target.value)} style={{ width: '100%', fontWeight: 'bold', fontSize: '15px', border: 'none', outline: 'none', background: 'transparent', color: '#000', textAlign: 'center' }} /></TableCell>
                        <TableCell align='center' sx={{ fontWeight: 'bold', width: '10%', fontSize: '15px' }}>Type</TableCell>
                        <TableCell align='center' sx={{ width: '10%' }}><input type='text' placeholder='Next Step' value={searchedValueStep || ''} onChange={(e) => setSearchedValueStep(e.target.value)} style={{ width: '100%', fontWeight: 'bold', fontSize: '15px', border: 'none', outline: 'none', background: 'transparent', color: '#000', textAlign: 'center' }} /></TableCell>
                        <TableCell align='center' sx={{ fontWeight: 'bold', width: '5%', fontSize: '15px' }}>Print</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {fullRepeats
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
                          if (!searchedValueStep) { return true; }
                          if (!row || !row.WorkCntr) { return false; }
                          
                          return row.WorkCntr
                            .toString() 
                            .toLowerCase()                                           
                            .includes(searchedValueStep.toString().toLowerCase())
                        })
                        .map((job, index) => {
                          return (
                            <TableRow key={index} sx={{ backgroundColor: index % 2 === 0 ? '#f0f0f0' : '#fff' }}>
                              <TableCell align='center' sx={{ fontWeight: 'bold', fontSize: '15px', p: 1.25 }}>{job.JobNo}</TableCell>
                              <TableCell align='center' sx={{ fontSize: '15px', p: 1.25 }}>{job.StepNo}</TableCell>
                              <TableCell align='center' sx={{ fontSize: '15px', p: 1.25 }}>
                                <CopyToClipboard text={job.PartNo} onCopy={() => { setShowToast(true); setPartCopy(`${job.PartNo}`); }}>
                                  <span>{job.PartNo}</span>
                                </CopyToClipboard>
                              </TableCell>
                              <TableCell align='center' sx={{ fontSize: '15px', p: 1.25 }}>{job.Revision}</TableCell>
                              <TableCell align='center' sx={{ fontSize: '15px', p: 1.25 }}>{job.EstimQty}</TableCell>
                              <TableCell align='center' sx={{ fontSize: '15px', p: 1.25 }}>{job.DueDate.split('-')[1] + '/' + job.DueDate.split('-')[2].split('T')[0]}</TableCell>
                              <TableCell align='center' sx={{ fontSize: '15px', p: 1.25 }}>{job.CustCode}</TableCell>
                              <TableCell align='center' sx={{ fontSize: '15px', p: 1.25 }}>{job.User_Text3}</TableCell>
                              <TableCell align='center' sx={{ fontSize: '15px', p: 1.25 }}>{job.WorkCntr}</TableCell>
                              <TableCell align='center' sx={{ fontSize: '15px', p: 0 }}>
                                <IconButton>
                                  {job.DocNumber && <CheckIcon sx={{ fontSize: '20px', fontWeight: 'bold' }} />}
                                </IconButton>
                              </TableCell>
                            </TableRow>
                          )
                        })
                      }
                    </TableBody>
                  </Table>
                </TableContainer>

                <IconButton onClick={fetchRepeatData} sx={{ backgroundColor: '#111827', color: 'white', height: '52.5px', width: '52.5px', zIndex: 1000, position: 'fixed', bottom: '20px', right: '20px','&:hover': { backgroundColor: '#374151', }, }}>
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

{/* ACTIVE JOBS */}

          <Box>
            {selectedTab === 3 && (
              <Box sx={{ padding: '12px' }}>
                <TableContainer component={Paper}>
                  <Table>
                    <TableHead>
                      <TableRow>
                        <TableCell align='center' sx={{ width: '11%' }}><input type='text' placeholder='Job No' value={searchedValueJobNo || ''} onChange={(e) => setSearchedValueJobNo(e.target.value)} style={{ width: '100%', fontWeight: 'bold', fontSize: '15px', border: 'none', outline: 'none', background: 'transparent', color: '#000', textAlign: 'center' }} /></TableCell>
                        <TableCell align='center' sx={{ width: '23%' }}><input type='text' placeholder='Part No' value={searchedValuePartNo || ''} onChange={(e) => setSearchedValuePartNo(e.target.value)} style={{ width: '100%', fontWeight: 'bold', fontSize: '15px', border: 'none', outline: 'none', background: 'transparent', color: '#000', textAlign: 'center' }} /></TableCell>
                        <TableCell align='center' sx={{ fontWeight: 'bold', width: '11%', fontSize: '15px' }}>Revision</TableCell>
                        <TableCell align='center' sx={{ fontWeight: 'bold', width: '11%', fontSize: '15px' }}>Qty</TableCell>
                        <TableCell align='center' sx={{ fontWeight: 'bold', width: '11%', fontSize: '15px' }}>Due Date</TableCell>
                        <TableCell align='center' sx={{ width: '11%' }}><input type='text' placeholder='Customer' value={searchedValueCustomer || ''} onChange={(e) => setSearchedValueCustomer(e.target.value)} style={{ width: '100%', fontWeight: 'bold', fontSize: '15px', border: 'none', outline: 'none', background: 'transparent', color: '#000', textAlign: 'center' }} /></TableCell>
                        <TableCell align='center' sx={{ width: '11%' }}><input type='text' placeholder='Type' value={searchedValueType || ''} onChange={(e) => setSearchedValueType(e.target.value)} style={{ width: '100%', fontWeight: 'bold', fontSize: '15px', border: 'none', outline: 'none', background: 'transparent', color: '#000', textAlign: 'center' }} /></TableCell>
                        <TableCell align='center' sx={{ width: '11%' }}><input type='text' placeholder='Area' value={searchedValueArea || ''} onChange={(e) => setSearchedValueArea(e.target.value)} style={{ width: '100%', fontWeight: 'bold', fontSize: '15px', border: 'none', outline: 'none', background: 'transparent', color: '#000', textAlign: 'center' }} /></TableCell>
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
                          !searchedValueArea || row.User_Text2
                            .toString()
                            .toLowerCase()
                            .includes(searchedValueArea.toString().toLowerCase())
                        )
                        .map((job, index) => {
                          const rowClass = job.WorkCode == 'HOT' ? 'expedite-row' : '';
                          return (
                            <TableRow key={index} sx={{ backgroundColor: index % 2 === 0 ? '#f0f0f0' : '#fff' }} className={rowClass}>
                              <TableCell align='center' sx={{ fontWeight: 'bold', fontSize: '15px', padding: 0 }}>{job.JobNo}</TableCell>
                              <TableCell align='center' sx={{ fontSize: '15px', padding: 0 }}>
                                <CopyToClipboard text={job.PartNo} onCopy={() => { setShowToast(true); setPartCopy(`${job.PartNo}`); }}>
                                  <span>{job.PartNo}</span>
                                </CopyToClipboard>
                              </TableCell>
                              <TableCell align='center' sx={{ fontSize: '15px', p: 1.25 }}>{job.Revision}</TableCell>
                              <TableCell align='center' sx={{ fontSize: '15px', p: 1.25 }}>{job.EstimQty}</TableCell>
                              <TableCell align='center' sx={{ fontSize: '15px', p: 1.25 }}>{job.DueDate.split('-')[1] + '/' + job.DueDate.split('-')[2].split('T')[0]}</TableCell>
                              <TableCell align='center' sx={{ fontSize: '15px', p: 1.25 }}>{job.CustCode}</TableCell>
                              <TableCell align='center' sx={{ fontSize: '15px', p: 1.25 }}>{job.User_Text3}</TableCell>
                              <TableCell align='center' sx={{ fontSize: '15px', p: 1.25 }}>{job.User_Text2}</TableCell>
                            </TableRow>
                          )
                        })
                      }
                    </TableBody>
                  </Table>
                </TableContainer>

                <IconButton onClick={fetchActiveData} sx={{ backgroundColor: '#111827', color: 'white', height: '52.5px', width: '52.5px', zIndex: 1000, position: 'fixed', bottom: '20px', right: '20px','&:hover': { backgroundColor: '#374151', }, }}>
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