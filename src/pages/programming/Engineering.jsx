import { useEffect, useState } from 'react';
// import { Dropdown, DropdownButton, Toast, ToastContainer } from 'react-bootstrap';
import { Box, Divider, FormControl, IconButton, InputLabel, MenuItem, Paper, Select, Tab, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Tabs } from '@mui/material';

import { CopyToClipboard } from 'react-copy-to-clipboard';
import Cookies from 'universal-cookie';

import PuffLoader from 'react-spinners/PuffLoader';

import { Icon } from 'react-icons-kit';
import { check } from 'react-icons-kit/entypo/check';
import RefreshIcon from '@mui/icons-material/Refresh';

import getAllJobs from '../../services/engineering/getAllJobs';
import getTBRJobs from '../../services/engineering/getTBRJobs';
import getFutureJobs from '../../services/engineering/getFutureJobs';
import getRepeatJobs from '../../services/engineering/getRepeatJobs';
import getOutsourceJobs from '../../services/engineering/getOutsourceJobs';
import getNextStep from '../../services/engineering/getNextStep';
import getPrints from '../../services/engineering/getPrints';
import getOutsourcePrints from '../../services/engineering/getOutsourcePrints';
import getAllUsers from '../../services/users/getAllUsers';
import getAllQCNotes from '../../services/qcinfo/getAllQCNotes';
import updateModel from '../../services/engineering/updateModel';
import updateExpedite from '../../services/engineering/updateExpedite';
import updateEngineer from '../../services/engineering/updateEngineer';
import updateJobStatus from '../../services/engineering/updateJobStatus';
import './engineering.css';

export const Engineering = () => {
  const cookies = new Cookies();
  let cookieData
  try {
    cookieData = jwt_decode(cookies.get('jwt'));
  } catch {
    cookieData = {
      'name': '',
      'role': 'employee',
      'engineering': false,
    };
  }

  const [searchedValueJobNo, setSearchedValueJobNo] = useState('');
  const [searchedValuePartNo, setSearchedValuePartNo] = useState('');
  const [searchedValueDueDate, setSearchedValueDueDate] = useState('');
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
  const [searchedRepeat, setSearchedRepeat] = useState([]);
  const [searchedOutsource, setSearchedOutsource] = useState([]);
  const [searchedNextStep, setSearchedNextStep] = useState([]);
  const [searchedPrints, setSearchedPrints] = useState([]);
  const [searchedOutsourcePrints, setSearchedOutsourcePrints] = useState([]);
  const [fullRepeats, setFullRepeats] = useState([]);
  const [fullOutsource, setFullOutsource] = useState([]);
  const [engineeringUsers, setEngineeringUsers] = useState([]);
  const [qcData, setQCData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedTab, setSelectedTab] = useState(0);

  const [dropdownTBRTitles, setDropdownTBRTitles] = useState({});
  const [dropdownFutureTitles, setDropdownFutureTitles] = useState({});
  const [dropdownTBRStatuses, setDropdownTBRStatuses] = useState({});
  const [dropdownFutureStatuses, setDropdownFutureStatuses] = useState({});

  const [tbr, setTbr] = useState('');
  const [future, setFuture] = useState('');
  const [repeat, setRepeat] = useState('');
  const [outsource, setOutsource] = useState('');
  const [active, setActive] = useState('Active');

  const fetchData = async () => {
    try {
      const [engRes, tbrRes, futureRes, nextStepRes, printsRes, repeatRes, outsourcePrintsRes, outsourceRes, userRes] = await Promise.all([
        getAllJobs(),
        getTBRJobs(),
        getFutureJobs(),
        getNextStep(),
        getPrints(),
        getRepeatJobs(),
        getOutsourcePrints(),
        getOutsourceJobs(),
        getAllUsers(),
      ]);

      setSearchedEng(engRes);

      setSearchedTBR(tbrRes);
      let tbrCount = tbrRes.filter(row => typeof row.JobNo !== 'undefined').length;
      setTbr(tbrCount > 0 ? `TBR (${tbrCount})` : 'TBR');

      setSearchedFuture(futureRes);
      let futureCount = futureRes.filter(row => typeof row.JobNo !== 'undefined' && row.User_Text3 !== 'REPEAT').length;
      setFuture(futureCount > 0 ? `Future (${futureCount})` : 'Future');

      setSearchedNextStep(nextStepRes);

      setSearchedPrints(printsRes);

      setSearchedRepeat(repeatRes);
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

      setSearchedOutsourcePrints(outsourcePrintsRes);

      setSearchedOutsource(outsourceRes);
      let outsourceCount = outsourceRes.length;
      setOutsource(outsourceCount > 0 ? `Outsource (${outsourceCount})` : 'Outsource');

      setFullOutsource(
        outsourceRes.map(v => {
          let obj = outsourcePrintsRes.find(x => x.PartNo === v.PartNo);
          v.DocNumber = obj ? obj.DocNumber : '';

          return v;
        })
      );

      setEngineeringUsers(userRes.data.filter(user => user.engineering).map(user => user.name.split(' ')[0]));

    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

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
  };

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
  };

  const fetchRepeatData = async () => {
    try {
      const [nextStepRes, printsRes, repeatRes] = await Promise.all([
        getNextStep(),
        getPrints(),
        getRepeatJobs(),
      ]);

      setSearchedNextStep(nextStepRes);

      setSearchedPrints(printsRes);

      setSearchedRepeat(repeatRes);
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
  };

  const fetchOutsourceData = async () => {
    try {
      const [outsourcePrintsRes, outsourceRes] = await Promise.all([
        getOutsourcePrints(),
        getOutsourceJobs(),
      ]);

      setSearchedOutsourcePrints(outsourcePrintsRes);

      setSearchedOutsource(outsourceRes);
      let outsourceCount = outsourceRes.length;
      setOutsource(outsourceCount > 0 ? `Outsource (${outsourceCount})` : 'Outsource');

      setFullOutsource(
        outsourceRes.map(v => {
          let obj = outsourcePrintsRes.find(x => x.PartNo === v.PartNo);
          v.DocNumber = obj ? obj.DocNumber : '';

          return v;
        })
      );

    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

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
  };

  const fetchQCData = async () => {
    try {
      const results = await getAllQCNotes();
      const custCodes = results.data.map(item => item.custCode);
      setQCData(custCodes);
    } catch (err) {
      console.error(err);
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

  const toggleExpedite = async (job) => {
    updateExpedite(job.dataValues.id);
    setUpdate(`Expedite ${job.dataValues.jobNo}`)
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
  };

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
  };

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
  };

  const handleTabChange = (event, newValue) => {
    setSelectedTab(newValue);
  };

  useEffect(() => {
    fetchData();
  }, [loading, update]);

  useEffect(() => {
    fetchQCData();
  }, []);

  return (
    <Box sx={{ width: '100%', height: '100%' }}>
      {loading ? (
        <Box>
          <PuffLoader color='red' />
        </Box>
      ) : (
        <Box sx={{ width: '100%' }}>
          <Tabs value={selectedTab} onChange={handleTabChange} centered>
            <Tab label={tbr} sx={{ width: '15%' }}/>
            <Tab label={future} sx={{ width: '15%' }}/>
            <Tab label={repeat} sx={{ width: '15%' }}/>
            <Tab label={outsource} sx={{ width: '15%' }}/>
          </Tabs>

          <Box>
            {selectedTab === 0 && (
              <Box>
                <TableContainer component={Paper}>
                  <Table>
                    <TableHead>
                      <TableRow>
                        <TableCell align='center'><input placeholder='Job No' /></TableCell>
                        <TableCell align='center'>Step No</TableCell>
                        <TableCell align='center'><input placeholder='Part No' /></TableCell>
                        <TableCell align='center'>Revision</TableCell>
                        <TableCell align='center'>Qty</TableCell>
                        <TableCell align='center'>Due Date</TableCell>
                        <TableCell align='center'><input placeholder='Customer' /></TableCell>
                        <TableCell align='center'><input placeholder='Type' /></TableCell>
                        <TableCell align='center'><input placeholder='Engineer' /></TableCell>
                        <TableCell align='center'>Model</TableCell>
                        <TableCell align='center'><input placeholder='Status' /></TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {searchedTBR.map((job, index) => (
                        <TableRow key={index}>
                          <TableCell align='center'>{job.JobNo}</TableCell>
                          <TableCell align='center'>{job.StepNo}</TableCell>
                          <TableCell align='center'>
                            <CopyToClipboard text={job.PartNo}>
                              <span>{job.PartNo}</span>
                            </CopyToClipboard>
                          </TableCell>
                          <TableCell align='center'>{job.Revision}</TableCell>
                          <TableCell align='center'>{job.EstimQty}</TableCell>
                          <TableCell align='center'>{job.DueDate.split('-')[1] + '/' + job.DueDate.split('-')[2].split('T')[0]}</TableCell>
                          <TableCell align='center'>{job.CustCode}</TableCell>
                          <TableCell align='center'>{job.User_Text3}</TableCell>
                          <TableCell align='center'>
                            <IconButton onClick={() => toggleModel(job)}>
                              {job.model && <Icon icon={check} />}
                            </IconButton>
                          </TableCell>
                          <TableCell align='center'>{job.Status}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>

                <IconButton onClick={fetchTBRData} className='refreshBtn'>
                  <RefreshIcon fontSize='large' />
                </IconButton>
              </Box>
            )}
          </Box>

          <Box>
            {selectedTab === 1 && (
              <Box sx={{ padding: '12px' }}>
                <TableContainer component={Paper}>
                  <Table>
                    <TableHead>
                      <TableRow>
                        <TableCell align='center' sx={{ width: '7%' }}><input type='text' placeholder='Job No' value={searchedValueJobNo || ''} onChange={(e) => setSearchedValueJobNo(e.target.value)} style={{ width: '100%', fontWeight: 'bold', fontSize: '14px', padding: '8px', border: 'none', outline: 'none', background: 'transparent', color: '#000', textAlign: 'center' }} /></TableCell>
                        <TableCell align='center' sx={{ fontWeight: 'bold', width: '5%' }}>Step No</TableCell>
                        <TableCell align='center' sx={{ width: '20%' }}><input type='text' placeholder='Part No' value={searchedValuePartNo || ''} onChange={(e) => setSearchedValuePartNo(e.target.value)} style={{ width: '100%', fontWeight: 'bold', fontSize: '14px', padding: '8px', border: 'none', outline: 'none', background: 'transparent', color: '#000', textAlign: 'center' }} /></TableCell>
                        <TableCell align='center' sx={{ fontWeight: 'bold', width: '5%' }}>Revision</TableCell>
                        <TableCell align='center' sx={{ fontWeight: 'bold', width: '5%' }}>Qty</TableCell>
                        <TableCell align='center' sx={{ fontWeight: 'bold', width: '6%' }}>Due Date</TableCell>
                        <TableCell align='center' sx={{ width: '14%' }}><input type='text' placeholder='Customer' value={searchedValueCustomer || ''} onChange={(e) => setSearchedValueCustomer(e.target.value)} style={{ width: '100%', fontWeight: 'bold', fontSize: '14px', padding: '8px', border: 'none', outline: 'none', background: 'transparent', color: '#000', textAlign: 'center' }} /></TableCell>
                        <TableCell align='center' sx={{ width: '7%' }}><input type='text' placeholder='Type' value={searchedValueType || ''} onChange={(e) => setSearchedValueType(e.target.value)} style={{ width: '100%', fontWeight: 'bold', fontSize: '14px', padding: '8px', border: 'none', outline: 'none', background: 'transparent', color: '#000', textAlign: 'center' }} /></TableCell>
                        <TableCell align='center' sx={{ width: '10%' }}><input type='text' placeholder='Engineer' value={searchedValueEngineer || ''} onChange={(e) => setSearchedValueEngineer(e.target.value)} style={{ width: '100%', fontWeight: 'bold', fontSize: '14px', padding: '8px', border: 'none', outline: 'none', background: 'transparent', color: '#000', textAlign: 'center' }} /></TableCell>
                        <TableCell align='center' sx={{ width: '6%' }}><input type='text' placeholder='Quote' value={searchedValueQuote || ''} onChange={(e) => setSearchedValueQuote(e.target.value)} style={{ width: '100%', fontWeight: 'bold', fontSize: '14px', padding: '8px', border: 'none', outline: 'none', background: 'transparent', color: '#000', textAlign: 'center' }} /></TableCell>
                        <TableCell align='center' sx={{ fontWeight: 'bold', width: '5%' }}>Model</TableCell>
                        <TableCell align='center' sx={{ width: '10%' }}><input type='text' placeholder='Status' value={searchedValueStatus || ''} onChange={(e) => setSearchedValueStatus(e.target.value)} style={{ width: '100%', fontWeight: 'bold', fontSize: '14px', padding: '8px', border: 'none', outline: 'none', background: 'transparent', color: '#000', textAlign: 'center' }} /></TableCell>
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
                            const qcClass = qcData.includes(job.CustCode) ? 'qc-row' : '';
                            const dropdownFutureTitle = dropdownFutureTitles[job.JobNo] || job.dataValues.engineer;
                            const dropdownFutureStatus = dropdownFutureStatuses[job.JobNo] || job.dataValues.jobStatus;
                            return (
                              <TableRow key={index} sx={{ backgroundColor: index % 2 === 0 ? '#f0f0f0' : '#fff' }} className={`${rowClass} ${qcClass}`}>
                                <TableCell align='center' sx={{ fontWeight: 'bold' }}>{job.JobNo}</TableCell>
                                <TableCell align='center'>{job.StepNo}</TableCell>
                                <TableCell align='center'>
                                  <CopyToClipboard text={job.PartNo}>
                                    <span>{job.PartNo}</span>
                                  </CopyToClipboard>
                                </TableCell>
                                <TableCell align='center'>{job.Revision}</TableCell>
                                <TableCell align='center'>{job.EstimQty}</TableCell>
                                <TableCell align='center'>{job.DueDate.split('-')[1] + '/' + job.DueDate.split('-')[2].split('T')[0]}</TableCell>
                                <TableCell align='center'>{job.CustCode}</TableCell>
                                <TableCell align='center'>{job.User_Text3}</TableCell>
                                
                                {cookieData.engineering ?
                                  <TableCell align='center'>
                                    <FormControl variant='standard' fullWidth>
                                      <Select
                                        value={dropdownFutureTitle || ''}
                                        onChange={(e) => handleFutureEngineer(job, e.target.value)}
                                        disableUnderline
                                        sx={{ fontSize: '14px', padding: '0', color: '#000', textAlign: 'center' }}
                                      >
                                        {engineeringUsers.map((user, n) => (
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
                                  <TableCell align='center'>{job.dataValues.engineer}</TableCell>
                                }

                                <TableCell align='center'>{job.QuoteNo}</TableCell>
                                <TableCell align='center'>
                                  <IconButton onClick={() => toggleModel(job)}>
                                    {job.dataValues.model && <Icon icon={check} />}
                                  </IconButton>
                                </TableCell>

                                {cookieData.engineering ?
                                  <TableCell align='center'>
                                    <FormControl variant='standard' fullWidth>
                                      <Select
                                        value={dropdownFutureStatus}
                                        onChange={(e) => handleFutureJobStatus(job, e.target.value)}
                                        disableUnderline
                                        sx={{ fontSize: '14px', padding: '0', color: '#000', textAlign: 'center' }}
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
                                  <TableCell align='center'>{job.dataValues.jobStatus}</TableCell>
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
              </Box>
            )}
          </Box>
        </Box>
      )}
    </Box>
  );
}