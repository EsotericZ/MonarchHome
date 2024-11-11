import { useEffect, useState } from 'react';
import { Alert, Box, Divider, FormControl, IconButton, MenuItem, Paper, Select, Snackbar, Tab, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Tabs, Typography } from '@mui/material';

import { CopyToClipboard } from 'react-copy-to-clipboard';
import { useUserContext } from '../../context/UserContext';

import PuffLoader from 'react-spinners/PuffLoader';
import RefreshIcon from '@mui/icons-material/Refresh';

import getAllJobs from '../../services/engineering/getAllJobs';
import getTBRJobs from '../../services/engineering/getTBRJobs';
import getFutureJobs from '../../services/engineering/getFutureJobs';
import getAllUsers from '../../services/users/getAllUsers';
import updateTLStatus from '../../services/tlaser/updateTLStatus';
import updateTLProgrammer from '../../services/tlaser/updateTLProgrammer';
import './engineering.css';

export const TubeLaserProg = () => {
  const { cookieData } = useUserContext();
  const [searchedValueJobNo, setSearchedValueJobNo] = useState('');
  const [searchedValuePartNo, setSearchedValuePartNo] = useState('');
  const [searchedValueCustomer, setSearchedValueCustomer] = useState('');
  const [searchedValueType, setSearchedValueType] = useState('');
  const [searchedValueEngineer, setSearchedValueEngineer] = useState('');
  const [searchedValueProgrammer, setSearchedValueProgrammer] = useState('');
  const [searchedValueStatus, setSearchedValueStatus] = useState('');
  const [showToast, setShowToast] = useState(false);
  const [partCopy, setPartCopy] = useState('None');

  const [searchedEng, setSearchedEng] = useState([]);
  const [searchedTBR, setSearchedTBR] = useState([]);
  const [searchedFuture, setSearchedFuture] = useState([]);
  const [tlaserUsers, setTlaserUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedTab, setSelectedTab] = useState(0);

  const [dropdownTBRTitles, setDropdownTBRTitles] = useState({});
  const [dropdownFutureTitles, setDropdownFutureTitles] = useState({});
  const [dropdownTBRStatuses, setDropdownTBRStatuses] = useState({});
  const [dropdownFutureStatuses, setDropdownFutureStatuses] = useState({});

  const [tbr, setTbr] = useState('');
  const [future, setFuture] = useState('');

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

      let tbrCount = ((tbrRes.filter(row => (typeof row.JobNo !== 'undefined' && row.dataValues.jobStatus == 'TLASER'))).length);
      (tbrCount > 0) ? setTbr(`TBR (${tbrCount})`) : setTbr('TBR');

      let futureCount = ((futureRes.filter(row => (typeof row.JobNo !== 'undefined' && row.dataValues.jobStatus == 'TLASER'))).length);
      (futureCount > 0) ? setFuture(`Future (${futureCount})`) : setFuture('Future');

      setTlaserUsers(userRes.data.filter(user => user.tlaser).map(user => user.name.split(' ')[0]));
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  const handleTBRTLProgrammer = async (job, tlProgrammer) => {
    setDropdownTBRTitles(prevState => ({
      ...prevState,
      [job.JobNo]: tlProgrammer
    }));
    try {
      await updateTLProgrammer(job.dataValues.jobNo, tlProgrammer);
      const res = await getTBRJobs();
      setSearchedTBR(res);
    } catch (err) {
      console.log(err);
    }
  }

  const handleTBRJobStatus = async (job, tlStatus) => {
    setDropdownTBRStatuses(prevState => ({
      ...prevState,
      [job.JobNo]: tlStatus
    }));
    try {
      await updateTLStatus(job.dataValues.jobNo, tlStatus);
      const res = await getTBRJobs();
      setSearchedTBR(res);
    } catch (err) {
      console.log(err);
    }
  }

  const handleFutureTLProgrammer = async (job, tlProgrammer) => {
    setDropdownFutureTitles(prevState => ({
      ...prevState,
      [job.JobNo]: tlProgrammer
    }));
    try {
      await updateTLProgrammer(job.dataValues.jobNo, tlProgrammer);
      const res = await getFutureJobs();
      setSearchedFuture(res);
    } catch (err) {
      console.log(err);
    }
  }

  const handleFutureJobStatus = async (job, tlStatus) => {
    setDropdownFutureStatuses(prevState => ({
      ...prevState,
      [job.JobNo]: tlStatus
    }));
    try {
      await updateTLStatus(job.dataValues.jobNo, tlStatus);
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

  return (
    <Box sx={{ width: '100%', textAlign: 'center', overflowY: 'auto', height: '100vh' }}>
      {loading ? (
        <Box>
          <Typography variant='h4' sx={{ fontWeight: 'bold', margin: '16px' }}>Tube Laser</Typography>
          <Box sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', marginTop: '100px' }}>
            <PuffLoader color='red' />
          </Box>
        </Box>
      ) : (
        <Box sx={{ width: '100%' }}>
          <Typography variant='h4' sx={{ fontWeight: 'bold', margin: '16px' }}>Tube Laser</Typography>
          <Tabs value={selectedTab} onChange={handleTabChange} centered  TabIndicatorProps={{ style: {backgroundColor: 'red'} }}>
            <Tab label={tbr} sx={{ width: '15%', '&.Mui-selected': { color: 'red' }, '&:focus': { outline: 'none' } }} />
            <Tab label={future} sx={{ width: '15%', '&.Mui-selected': { color: 'red' }, '&:focus': { outline: 'none' } }} />
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
                        <TableCell align='center' sx={{ fontWeight: 'bold', width: '6%', fontSize: '15px' }}>Revision</TableCell>
                        <TableCell align='center' sx={{ fontWeight: 'bold', width: '6%', fontSize: '15px' }}>Qty</TableCell>
                        <TableCell align='center' sx={{ fontWeight: 'bold', width: '7%', fontSize: '15px' }}>Due Date</TableCell>
                        <TableCell align='center' sx={{ width: '10%' }}><input type='text' placeholder='Customer' value={searchedValueCustomer || ''} onChange={(e) => setSearchedValueCustomer(e.target.value)} style={{ width: '100%', fontWeight: 'bold', fontSize: '15px', border: 'none', outline: 'none', background: 'transparent', color: '#000', textAlign: 'center' }} /></TableCell>
                        <TableCell align='center' sx={{ width: '7%' }}><input type='text' placeholder='Type' value={searchedValueType || ''} onChange={(e) => setSearchedValueType(e.target.value)} style={{ width: '100%', fontWeight: 'bold', fontSize: '15px', border: 'none', outline: 'none', background: 'transparent', color: '#000', textAlign: 'center' }} /></TableCell>
                        <TableCell align='center' sx={{ width: '10%' }}><input type='text' placeholder='Engineer' value={searchedValueEngineer || ''} onChange={(e) => setSearchedValueEngineer(e.target.value)} style={{ width: '100%', fontWeight: 'bold', fontSize: '15px', border: 'none', outline: 'none', background: 'transparent', color: '#000', textAlign: 'center' }} /></TableCell>
                        <TableCell align='center' sx={{ width: '10%' }}><input type='text' placeholder='Programmer' value={searchedValueProgrammer || ''} onChange={(e) => setSearchedValueProgrammer(e.target.value)} style={{ width: '100%', fontWeight: 'bold', fontSize: '15px', border: 'none', outline: 'none', background: 'transparent', color: '#000', textAlign: 'center' }} /></TableCell>
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
                          if (!searchedValueProgrammer) { return true; }
                          if (!row || !row.dataValues || !row.dataValues.tlProgrammer) { return false; }
                          
                          return row.dataValues.tlProgrammer
                            .toString()
                            .toLowerCase()                                           
                            .includes(searchedValueProgrammer.toString().toLowerCase())
                        })
                        .filter((row) => {
                          if (!searchedValueStatus) { return true; }
                          if (!row || !row.dataValues || !row.dataValues.tlStatus) { return false; }
                          
                          return row.dataValues.tlStatus
                            .toString()
                            .toLowerCase()                                           
                            .includes(searchedValueStatus.toString().toLowerCase())
                        })
                        .map((job, index) => {
                          if (job.dataValues.jobStatus == 'TLASER') {
                            const rowClass = job.WorkCode == 'HOT' ? 'expedite-row' : '';
                            const dropdownTBRTitle = dropdownTBRTitles[job.JobNo] || job.dataValues.tlProgrammer;
                            const dropdownTBRStatus = dropdownTBRStatuses[job.JobNo] || job.dataValues.tlStatus;
                            return (
                              <TableRow key={index} sx={{ backgroundColor: index % 2 === 0 ? '#f0f0f0' : '#fff' }} className={`${rowClass}`}>
                                <TableCell align='center' sx={{ fontWeight: 'bold', fontSize: '15px', p: 1.25 }}>{job.JobNo}</TableCell>
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
                                <TableCell align='center' sx={{ fontSize: '15px', p: 1.25 }}>{job.dataValues.engineer}</TableCell>
                                
                                {cookieData.tlaser ?
                                  <TableCell align='center' sx={{ fontSize: '15px', p: 1.25 }}>
                                    <FormControl variant='standard' fullWidth>
                                      <Select
                                        value={dropdownTBRTitle || ''}
                                        onChange={(e) => handleTBRTLProgrammer(job, e.target.value)}
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
                                        {tlaserUsers.map((user, n) => (
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
                                  <TableCell align='center' sx={{ fontSize: '15px', p: 1.25 }}>{job.dataValues.tlProgrammer}</TableCell>
                                }

                                {cookieData.tlaser ?
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
                                        <MenuItem value=''>NONE</MenuItem>
                                        <Divider />
                                        <MenuItem value='DONE'>DONE</MenuItem>
                                      </Select>
                                    </FormControl>
                                  </TableCell>
                                :
                                  <TableCell align='center' sx={{ fontSize: '15px', p: 1.25 }}>{job.dataValues.tlStatus}</TableCell>
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
                        <TableCell align='center' sx={{ fontWeight: 'bold', width: '6%', fontSize: '15px' }}>Revision</TableCell>
                        <TableCell align='center' sx={{ fontWeight: 'bold', width: '6%', fontSize: '15px' }}>Qty</TableCell>
                        <TableCell align='center' sx={{ fontWeight: 'bold', width: '7%', fontSize: '15px' }}>Due Date</TableCell>
                        <TableCell align='center' sx={{ width: '10%' }}><input type='text' placeholder='Customer' value={searchedValueCustomer || ''} onChange={(e) => setSearchedValueCustomer(e.target.value)} style={{ width: '100%', fontWeight: 'bold', fontSize: '15px', border: 'none', outline: 'none', background: 'transparent', color: '#000', textAlign: 'center' }} /></TableCell>
                        <TableCell align='center' sx={{ width: '7%' }}><input type='text' placeholder='Type' value={searchedValueType || ''} onChange={(e) => setSearchedValueType(e.target.value)} style={{ width: '100%', fontWeight: 'bold', fontSize: '15px', border: 'none', outline: 'none', background: 'transparent', color: '#000', textAlign: 'center' }} /></TableCell>
                        <TableCell align='center' sx={{ width: '10%' }}><input type='text' placeholder='Engineer' value={searchedValueEngineer || ''} onChange={(e) => setSearchedValueEngineer(e.target.value)} style={{ width: '100%', fontWeight: 'bold', fontSize: '15px', border: 'none', outline: 'none', background: 'transparent', color: '#000', textAlign: 'center' }} /></TableCell>
                        <TableCell align='center' sx={{ width: '10%' }}><input type='text' placeholder='Programmer' value={searchedValueProgrammer || ''} onChange={(e) => setSearchedValueProgrammer(e.target.value)} style={{ width: '100%', fontWeight: 'bold', fontSize: '15px', border: 'none', outline: 'none', background: 'transparent', color: '#000', textAlign: 'center' }} /></TableCell>
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
                          if (!searchedValueProgrammer) { return true; }
                          if (!row || !row.dataValues || !row.dataValues.tlProgrammer) { return false; }
                          
                          return row.dataValues.tlProgrammer
                            .toString()
                            .toLowerCase()                                           
                            .includes(searchedValueProgrammer.toString().toLowerCase())
                        })
                        .filter((row) => {
                          if (!searchedValueStatus) { return true; }
                          if (!row || !row.dataValues || !row.dataValues.tlStatus) { return false; }
                          
                          return row.dataValues.tlStatus
                            .toString()
                            .toLowerCase()                                           
                            .includes(searchedValueStatus.toString().toLowerCase())
                        })
                        .map((job, index) => {
                          if (job.User_Text3 != 'REPEAT' && job.User_Text2 != '6. OUTSOURCE' && job.dataValues.jobStatus == 'TLASER') {
                            const rowClass = job.WorkCode == 'HOT' ? 'expedite-row' : '';
                            const dropdownFutureTitle = dropdownFutureTitles[job.JobNo] || job.dataValues.tlProgrammer;
                            const dropdownFutureStatus = dropdownFutureStatuses[job.JobNo] || job.dataValues.tlStatus;
                            return (
                              <TableRow key={index} sx={{ backgroundColor: index % 2 === 0 ? '#f0f0f0' : '#fff' }} className={`${rowClass}`}>
                                <TableCell align='center' sx={{ fontWeight: 'bold', fontSize: '15px', p: 1.25 }}>{job.JobNo}</TableCell>
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
                                <TableCell align='center' sx={{ fontSize: '15px', p: 1.25 }}>{job.dataValues.engineer}</TableCell>
                                
                                {cookieData.tlaser ?
                                  <TableCell align='center' sx={{ fontSize: '15px', p: 1.25 }}>
                                    <FormControl variant='standard' fullWidth>
                                      <Select
                                        value={dropdownFutureTitle || ''}
                                        onChange={(e) => handleFutureTLProgrammer(job, e.target.value)}
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
                                        {tlaserUsers.map((user, n) => (
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
                                  <TableCell align='center' sx={{ fontSize: '15px', p: 1.25 }}>{job.dataValues.tlProgrammer}</TableCell>
                                }

                                {cookieData.tlaser ?
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
                                        <MenuItem value=''>NONE</MenuItem>
                                        <Divider />
                                        <MenuItem value='DONE'>DONE</MenuItem>
                                      </Select>
                                    </FormControl>
                                  </TableCell>
                                :
                                  <TableCell align='center' sx={{ fontSize: '15px', p: 1.25 }}>{job.dataValues.tlStatus}</TableCell>
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

        </Box>
      )}
    </Box>
  );
}