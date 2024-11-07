import { useEffect, useState } from 'react';
import { Alert, Box, Button, Dialog, DialogActions, DialogContent, DialogTitle, Icon, IconButton, List, ListItem, Paper, Snackbar, Tab, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Tabs, TextField, Typography } from '@mui/material';

import { CopyToClipboard } from 'react-copy-to-clipboard';
import Cookies from 'universal-cookie';
import { jwtDecode } from 'jwt-decode';

import PuffLoader from 'react-spinners/PuffLoader';
import AddIcon from '@mui/icons-material/Add';
import CheckIcon from '@mui/icons-material/Check';
import HistoryIcon from '@mui/icons-material/History';
import RefreshIcon from '@mui/icons-material/Refresh';

import AddModal from '../../components/departments/AddModal';
import AllMaterialsModal from '../../components/departments/AllMaterialsModal';
import CompleteModal from '../../components/departments/CompleteModal';
import CopySnackbar from '../../components/shared/CopySnackbar';
import DepartmentTabs from '../../components/departments/DepartmentTabs';
import EditModal from '../../components/departments/EditModal';

import getTBRJobs from '../../services/slaser/getTBRJobs';
import getFRJobs from '../../services/slaser/getFRJobs';
import createMaterial from '../../services/material/createMaterial';
import getAllSLMaterials from '../../services/material/getAllSLMaterials';
import updateMaterial from '../../services/material/updateMaterial';
import updateCheck from '../../services/material/updateCheck';
import updateComplete from '../../services/material/updateComplete';
import updateNeed from '../../services/material/updateNeed';
import updateVerified from '../../services/material/updateVerified';

export const StaticLaser = () => {
  const cookies = new Cookies();
  let cookieData
  try {
    cookieData = jwtDecode(cookies.get('jwt'));
  } catch {
    cookieData = {
      'name': '',
      'role': 'employee',
      'laser': false,
    };
  }

  const [searchedValueJobNo, setSearchedValueJobNo] = useState('');
  const [searchedValuePartNo, setSearchedValuePartNo] = useState('');
  const [searchedValueCustomer, setSearchedValueCustomer] = useState('');
  const [searchedValueType, setSearchedValueType] = useState('');
  const [searchedValueMaterial, setSearchedValueMaterial] = useState('');
  const [searchedValueProgramNo, setSearchedValueProgramNo] = useState('');
  const [jobId, setJobId] = useState(0);
  const [selectedJob, setSelectedJob] = useState(null);
  const [update, setUpdate] = useState('');
  const [showToast, setShowToast] = useState(false);
  const [partCopy, setPartCopy] = useState('None');

  const [searchedTBR, setSearchedTBR] = useState([]);
  const [searchedFR, setSearchedFR] = useState([]);
  const [searchedSLPrograms, setSearchedSLPrograms] = useState([]);
  const [needsNestingTBR, setNeedsNestingTBR] = useState([]);
  const [needsNestingFuture, setNeedsNestingFuture] = useState([]);
  const [jobProgramNo, setJobProgramNo] = useState('None');
  const [loading, setLoading] = useState(true);
  const [show, setShow] = useState(false);
  const [showMaterials, setShowMaterials] = useState(false);
  const [showEdit, setShowEdit] = useState(false);
  const [showComplete, setShowComplete] = useState(false);
  const [selectedTab, setSelectedTab] = useState(0);

  const [programNo, setProgramNo] = useState('');
  const [material, setMaterial] = useState('');
  const [jobNo, setJobNo] = useState('');
  const [machine, setMachine] = useState('slaser');
  const [id, setId] = useState(0);

  const fetchData = async () => {
    try {
      const [tbrJobs, frJobs, slMaterials] = await Promise.all([
        getTBRJobs(),
        getFRJobs(),
        getAllSLMaterials()
      ]);

      setSearchedTBR(tbrJobs);
      setSearchedFR(frJobs);
      setSearchedSLPrograms(slMaterials.data);

      const uniq = [...new Set(slMaterials.data.flatMap(job => job.jobNo.length > 6 ? job.jobNo.split(' ') : job.jobNo))];

      if (uniq.length > 0) {
        let tbrJobsNeeded = tbrJobs.filter(job => !uniq.includes(job.JobNo))
        setNeedsNestingTBR(tbrJobsNeeded);

        let futureJobsNeeded = frJobs.filter(job => !uniq.includes(job.JobNo))
        setNeedsNestingFuture(futureJobsNeeded);
      } else {
        setNeedsNestingTBR(tbrJobs);
        setNeedsNestingFuture(frJobs);
      }

      setLoading(false);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  const handleClose = () => setShow(false);

  const handleSave = async () => {
    try {
      await createMaterial(programNo, material, jobNo, 'slaser', 'slaser')
      setId(0);
      setProgramNo('');
      setMaterial('');
      setJobNo('');
      setMachine('');
      setShow(false);
    } catch (err) {
      console.error(err);
    } finally {
      fetchData();
    }
  };

  const handleShow = () => {
    setShow(true);
  };

  const toggleCheck = async (job) => {
    try {
      await updateCheck(job.id)
      setUpdate(`Check ${job.id}`)
    } catch (err) {
      console.log(err);
    }
  }

  const handleShowComplete = (job) => {
    setShowComplete(true);
    setJobProgramNo(job.programNo);
    setJobId(job.id);
  };

  const handleCloseComplete = () => setShowComplete(false);

  const toggleComplete = async () => {
    setShowComplete(false);
    try {
      await updateComplete(jobId)
      setUpdate(`Complete ${jobId}`)
    } catch (err) {
      console.log(err);
    }
  }

  const toggleNeed = async (job) => {
    try {
      await updateNeed(job.id)
      setUpdate(`Need Matl ${job.id}`)
    } catch (err) {
      console.log(err);
    }
  }

  const toggleVerified = async (job) => {
    try {
      await updateVerified(job.id)
      setUpdate(`Verified ${job.id}`)
    } catch (err) {
      console.log(err);
    }
  }

  const handleUpdateJob = (job) => {
    setId(job.id);
    setProgramNo(job.programNo);
    setMaterial(job.material);
    setJobNo(job.jobNo);
    setMachine(job.machine);
    setShowEdit(true)
  };

  const handleCancel = () => {
    setProgramNo('');
    setMaterial('');
    setJobNo('');
    setMachine('');
    setShowEdit(false);
    setShow(false);
  }

  const handleUpdate = async () => {
    try {
      await updateMaterial(id, programNo, material, jobNo, machine);
      setId(0);
      setProgramNo('');
      setMaterial('');
      setJobNo('');
      setMachine('');
      setShowEdit(false);
    } catch (err) {
      console.error(err);
    } finally {
      fetchData();
    }
  }

  const handleMaterialsOpen = (job) => {
    setSelectedJob(job);
    setShowMaterials(true);
  }

  const handleMaterialsClose = () => {
    setShowMaterials(false);
  }

  const handleTabChange = (event, newValue) => {
    setSelectedTab(newValue);
  }

  useEffect(() => {
    fetchData();
  }, [loading, show, update]);

  return (
    <Box sx={{ width: '100%', textAlign: 'center', overflowY: 'auto', height: '100vh' }}>
      {loading ? (
        <Box>
          <Typography variant='h4' sx={{ fontWeight: 'bold', margin: '16px' }}>Static Laser</Typography>
          <Box sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', marginTop: '100px' }}>
            <PuffLoader color='red' />
          </Box>
        </Box>
      ) : (
        <Box sx={{ width: '100%' }}>
          <Typography variant='h4' sx={{ fontWeight: 'bold', margin: '16px' }}>Static Laser</Typography>

          <AddModal
            show={show}
            handleClose={handleClose}
            handleCancel={handleCancel}
            handleSave={handleSave}
            programNo={programNo}
            setProgramNo={setProgramNo}
            material={material}
            setMaterial={setMaterial}
            jobNo={jobNo}
            setJobNo={setJobNo}
            areaName='Static Laser'
          />

          <EditModal
            show={showEdit}
            handleClose={handleClose}
            handleCancel={handleCancel}
            handleUpdate={handleUpdate}
            programNo={programNo}
            setProgramNo={setProgramNo}
            material={material}
            setMaterial={setMaterial}
            jobNo={jobNo}
            setJobNo={setJobNo}
            areaName='Static Laser'
          />

          <CompleteModal
            show={showComplete}
            handleClose={handleCloseComplete}
            toggleComplete={toggleComplete}
            jobProgramNo={jobProgramNo}
          />

          <AllMaterialsModal
            show={showMaterials}
            handleClose={handleMaterialsClose}
            selectedJob={selectedJob}
            setShowToast={setShowToast}
            setPartCopy={setPartCopy}
          />

          <DepartmentTabs
            selectedTab={selectedTab}
            handleTabChange={handleTabChange}
            tabLabels={['Ready to Nest', 'Material', 'Programs', 'All Jobs']}
          />

          {/* READY TO NEST */}

          <Box>
            {selectedTab === 0 && (
              <Box sx={{ padding: '12px' }}>
                <TableContainer component={Paper}>
                  <Table>
                    <TableHead>
                      <TableRow>
                        <TableCell align='center' sx={{ width: '10%' }}><input type='text' placeholder='Job No' value={searchedValueJobNo || ''} onChange={(e) => setSearchedValueJobNo(e.target.value)} style={{ width: '100%', fontWeight: 'bold', fontSize: '15px', border: 'none', outline: 'none', background: 'transparent', color: '#000', textAlign: 'center' }} /></TableCell>
                        <TableCell align='center' sx={{ fontWeight: 'bold', width: '7%', fontSize: '15px' }}>Step No</TableCell>
                        <TableCell align='center' sx={{ width: '20%' }}><input type='text' placeholder='Part No' value={searchedValuePartNo || ''} onChange={(e) => setSearchedValuePartNo(e.target.value)} style={{ width: '100%', fontWeight: 'bold', fontSize: '15px', border: 'none', outline: 'none', background: 'transparent', color: '#000', textAlign: 'center' }} /></TableCell>
                        <TableCell align='center' sx={{ fontWeight: 'bold', width: '6%', fontSize: '15px' }}>Revision</TableCell>
                        <TableCell align='center' sx={{ fontWeight: 'bold', width: '6%', fontSize: '15px' }}>Qty</TableCell>
                        <TableCell align='center' sx={{ fontWeight: 'bold', width: '7%', fontSize: '15px' }}>Due Date</TableCell>
                        <TableCell align='center' sx={{ fontWeight: 'bold', width: '7%', fontSize: '15px' }}>Traveler</TableCell>
                        <TableCell align='center' sx={{ width: '10%' }}><input type='text' placeholder='Customer' value={searchedValueCustomer || ''} onChange={(e) => setSearchedValueCustomer(e.target.value)} style={{ width: '100%', fontWeight: 'bold', fontSize: '15px', border: 'none', outline: 'none', background: 'transparent', color: '#000', textAlign: 'center' }} /></TableCell>
                        <TableCell align='center' sx={{ width: '7%' }}><input type='text' placeholder='Type' value={searchedValueType || ''} onChange={(e) => setSearchedValueType(e.target.value)} style={{ width: '100%', fontWeight: 'bold', fontSize: '15px', border: 'none', outline: 'none', background: 'transparent', color: '#000', textAlign: 'center' }} /></TableCell>
                        <TableCell align='center' sx={{ width: '20%' }}><input type='text' placeholder='Materials' value={searchedValueMaterial || ''} onChange={(e) => setSearchedValueMaterial(e.target.value)} style={{ width: '100%', fontWeight: 'bold', fontSize: '15px', border: 'none', outline: 'none', background: 'transparent', color: '#000', textAlign: 'center' }} /></TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {needsNestingTBR.length >= 1 &&
                        <TableRow>
                          <TableCell colSpan={10} align='center' sx={{ fontWeight: 'bold', fontSize: '15px', backgroundColor: '#D1BBA8', p: 1.25 }}>TBR</TableCell>
                        </TableRow>
                      }
                      {needsNestingTBR
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
                          !searchedValueMaterial || row.SubPartNo
                            .toString()
                            .toLowerCase()
                            .includes(searchedValueMaterial.toString().toLowerCase())
                        )
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
                              <TableCell align='center' sx={{ fontSize: '15px', p: 0 }}>
                                <IconButton>
                                  {job.User_Date1 && <CheckIcon sx={{ fontSize: '20px', fontWeight: 'bold' }} />}
                                </IconButton>
                              </TableCell>
                              <TableCell align='center' sx={{ fontSize: '15px', p: 1.25 }}>{job.CustCode}</TableCell>
                              <TableCell align='center' sx={{ fontSize: '15px', p: 1.25 }}>{job.User_Text3}</TableCell>
                              <TableCell align='center' sx={{ fontSize: '15px', p: 1.25 }}>
                                {Array.isArray(job.SubPartNo) && job.SubPartNo.length === 1 ? (
                                  <CopyToClipboard text={job.SubPartNo[0]} onCopy={() => { setShowToast(true); setPartCopy(`${job.SubPartNo[0]}`); }}>
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
                                      '&:hover': {
                                        backgroundColor: 'transparent',
                                      },
                                      '&:focus': {
                                        outline: 'none',
                                      }
                                    }}
                                  >
                                    ...
                                  </Button>
                                )}
                              </TableCell>
                            </TableRow>
                          )
                        })
                      }
                      {needsNestingFuture.length >= 1 &&
                        <TableRow>
                          <TableCell colSpan={10} align='center' sx={{ fontWeight: 'bold', fontSize: '15px', backgroundColor: '#D1BBA8', p: 1.25 }}>FUTURE</TableCell>
                        </TableRow>
                      }
                      {needsNestingFuture
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
                          !searchedValueMaterial || row.SubPartNo
                            .toString()
                            .toLowerCase()
                            .includes(searchedValueMaterial.toString().toLowerCase())
                        )
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
                              <TableCell align='center' sx={{ fontSize: '15px', p: 0 }}>
                                <IconButton>
                                  {job.User_Date1 && <CheckIcon sx={{ fontSize: '20px', fontWeight: 'bold' }} />}
                                </IconButton>
                              </TableCell>
                              <TableCell align='center' sx={{ fontSize: '15px', p: 1.25 }}>{job.CustCode}</TableCell>
                              <TableCell align='center' sx={{ fontSize: '15px', p: 1.25 }}>{job.User_Text3}</TableCell>
                              <TableCell align='center' sx={{ fontSize: '15px', p: 1.25 }}>
                                {Array.isArray(job.SubPartNo) && job.SubPartNo.length === 1 ? (
                                  <CopyToClipboard text={job.SubPartNo[0]} onCopy={() => { setShowToast(true); setPartCopy(`${job.SubPartNo[0]}`); }}>
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
                                      '&:hover': {
                                        backgroundColor: 'transparent',
                                      },
                                      '&:focus': {
                                        outline: 'none',
                                      }
                                    }}
                                  >
                                    ...
                                  </Button>
                                )}
                              </TableCell>
                            </TableRow>
                          )
                        })
                      }
                    </TableBody>
                  </Table>
                </TableContainer>

                {cookieData.laser &&
                  <IconButton onClick={handleShow} sx={{ backgroundColor: '#111827', color: 'white', height: '52.5px', width: '52.5px', zIndex: 1000, position: 'fixed', bottom: '85px', right: '20px', '&:hover': { backgroundColor: '#374151', }, }}>
                    <AddIcon fontSize='large' />
                  </IconButton>
                }
                <IconButton onClick={fetchData} sx={{ backgroundColor: '#111827', color: 'white', height: '52.5px', width: '52.5px', zIndex: 1000, position: 'fixed', bottom: '20px', right: '20px', '&:hover': { backgroundColor: '#374151', }, }}>
                  <RefreshIcon fontSize='large' />
                </IconButton>

                <CopySnackbar
                  show={showToast}
                  onClose={() => setShowToast(false)}
                  message={`${partCopy} Copied To Clipboard`}
                />
              </Box>
            )}
          </Box>

          {/* MATERIAL */}

          <Box>
            {selectedTab === 1 && (
              <Box sx={{ padding: '12px' }}>
                <TableContainer component={Paper}>
                  <Table>
                    <TableHead>
                      <TableRow>
                        <TableCell align='center' sx={{ width: '15%' }}><input type='text' placeholder='Program No' value={searchedValueProgramNo || ''} onChange={(e) => setSearchedValueProgramNo(e.target.value)} style={{ width: '100%', fontWeight: 'bold', fontSize: '15px', border: 'none', outline: 'none', background: 'transparent', color: '#000', textAlign: 'center' }} /></TableCell>
                        <TableCell align='center' sx={{ width: '25%' }}><input type='text' placeholder='Material' value={searchedValueMaterial || ''} onChange={(e) => setSearchedValueMaterial(e.target.value)} style={{ width: '100%', fontWeight: 'bold', fontSize: '15px', border: 'none', outline: 'none', background: 'transparent', color: '#000', textAlign: 'center' }} /></TableCell>
                        <TableCell align='center' sx={{ width: '10%' }}><input type='text' placeholder='Job No' value={searchedValueJobNo || ''} onChange={(e) => setSearchedValueJobNo(e.target.value)} style={{ width: '100%', fontWeight: 'bold', fontSize: '15px', border: 'none', outline: 'none', background: 'transparent', color: '#000', textAlign: 'center' }} /></TableCell>
                        <TableCell align='center' sx={{ fontWeight: 'bold', width: '10%', fontSize: '15px' }}>Check</TableCell>
                        <TableCell align='center' sx={{ fontWeight: 'bold', width: '10%', fontSize: '15px' }}>Need</TableCell>
                        <TableCell align='center' sx={{ fontWeight: 'bold', width: '10%', fontSize: '15px' }}>On Order</TableCell>
                        <TableCell align='center' sx={{ fontWeight: 'bold', width: '10%', fontSize: '15px' }}>Expected</TableCell>
                        <TableCell align='center' sx={{ fontWeight: 'bold', width: '10%', fontSize: '15px' }}>Verified</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {searchedSLPrograms
                        .filter((row) =>
                          !searchedValueProgramNo || row.programNo
                            .toString()
                            .toLowerCase()
                            .includes(searchedValueProgramNo.toString().toLowerCase())
                        )
                        .filter((row) =>
                          !searchedValueMaterial || row.material
                            .toString()
                            .toLowerCase()
                            .includes(searchedValueMaterial.toString().toLowerCase())
                        )
                        .filter((row) =>
                          !searchedValueJobNo || row.jobNo
                            .toString()
                            .toLowerCase()
                            .includes(searchedValueJobNo.toString().toLowerCase())
                        )
                        .map((job, index) => {
                          return (
                            <TableRow key={index} sx={{ backgroundColor: index % 2 === 0 ? '#f0f0f0' : '#fff' }}>
                              {cookieData.laser ?
                                <TableCell align='center' sx={{ fontWeight: 'bold', fontSize: '15px', p: 1.25 }} onClick={() => handleUpdateJob(job)}>{job.programNo}</TableCell>
                                :
                                <TableCell align='center' sx={{ fontWeight: 'bold', fontSize: '15px', p: 1.25 }}>{job.programNo}</TableCell>
                              }
                              <TableCell align='center' sx={{ fontSize: '15px', p: 1.25 }}>{job.material}</TableCell>
                              <TableCell align='center' sx={{ fontSize: '15px', p: 1.25 }}>{job.jobNo}</TableCell>
                              {cookieData.laser ?
                                <>
                                  <TableCell align='center' sx={{ fontSize: '15px', p: 0 }} onClick={() => toggleCheck(job)}>
                                    <IconButton>
                                      {job.checkMatl && <CheckIcon sx={{ fontSize: '20px', fontWeight: 'bold' }} />}
                                    </IconButton>
                                  </TableCell>
                                  <TableCell align='center' sx={{ fontSize: '15px', p: 0 }} onClick={() => toggleNeed(job)}>
                                    <IconButton>
                                      {job.needMatl && <CheckIcon sx={{ fontSize: '20px', fontWeight: 'bold' }} />}
                                    </IconButton>
                                  </TableCell>
                                </>
                                :
                                <>
                                  <TableCell align='center' sx={{ fontSize: '15px', p: 0 }}>
                                    <Icon>
                                      {job.checkMatl && <CheckIcon sx={{ fontSize: '20px', fontWeight: 'bold' }} />}
                                    </Icon>
                                  </TableCell>
                                  <TableCell align='center' sx={{ fontSize: '15px', p: 0 }}>
                                    <Icon>
                                      {job.needMatl && <CheckIcon sx={{ fontSize: '20px', fontWeight: 'bold' }} />}
                                    </Icon>
                                  </TableCell>
                                </>
                              }
                              <TableCell align='center' sx={{ fontSize: '15px', p: 0 }}>
                                <Icon>
                                  {job.onOrder && <CheckIcon sx={{ fontSize: '20px', fontWeight: 'bold' }} />}
                                </Icon>
                              </TableCell>
                              {job.expected ?
                                <TableCell align='center' sx={{ fontSize: '15px', p: 1.25 }}>{job.expected.split('-')[1] + '/' + job.expected.split('-')[2].split('T')[0]}</TableCell>
                                :
                                <TableCell align='center' sx={{ fontSize: '15px', p: 1.25 }}></TableCell>
                              }
                              {cookieData.laser ?
                                <>
                                  <TableCell align='center' sx={{ fontSize: '15px', p: 0 }} onClick={() => toggleVerified(job)}>
                                    <IconButton>
                                      {job.verified && <CheckIcon sx={{ fontSize: '20px', fontWeight: 'bold' }} />}
                                    </IconButton>
                                  </TableCell>
                                </>
                                :
                                <>
                                  <TableCell align='center' sx={{ fontSize: '15px', p: 0 }}>
                                    <IconButton>
                                      {job.verified && <CheckIcon sx={{ fontSize: '20px', fontWeight: 'bold' }} />}
                                    </IconButton>
                                  </TableCell>
                                </>
                              }
                            </TableRow>
                          )
                        })
                      }
                    </TableBody>
                  </Table>
                </TableContainer>

                {cookieData.laser &&
                  <IconButton onClick={handleShow} sx={{ backgroundColor: '#111827', color: 'white', height: '52.5px', width: '52.5px', zIndex: 1000, position: 'fixed', bottom: '85px', right: '20px', '&:hover': { backgroundColor: '#374151', }, }}>
                    <AddIcon fontSize='large' />
                  </IconButton>
                }
                <IconButton onClick={fetchData} sx={{ backgroundColor: '#111827', color: 'white', height: '52.5px', width: '52.5px', zIndex: 1000, position: 'fixed', bottom: '20px', right: '20px', '&:hover': { backgroundColor: '#374151', }, }}>
                  <RefreshIcon fontSize='large' />
                </IconButton>
              </Box>
            )}
          </Box>

          {/* PROGRAMS */}

          <Box>
            {selectedTab === 2 && (
              <Box sx={{ padding: '12px' }}>
                <TableContainer component={Paper}>
                  <Table>
                    <TableHead>
                      <TableRow>
                        <TableCell align='center' sx={{ width: '15%' }}><input type='text' placeholder='Program No' value={searchedValueProgramNo || ''} onChange={(e) => setSearchedValueProgramNo(e.target.value)} style={{ width: '100%', fontWeight: 'bold', fontSize: '15px', border: 'none', outline: 'none', background: 'transparent', color: '#000', textAlign: 'center' }} /></TableCell>
                        <TableCell align='center' sx={{ width: '25%' }}><input type='text' placeholder='Material' value={searchedValueMaterial || ''} onChange={(e) => setSearchedValueMaterial(e.target.value)} style={{ width: '100%', fontWeight: 'bold', fontSize: '15px', border: 'none', outline: 'none', background: 'transparent', color: '#000', textAlign: 'center' }} /></TableCell>
                        <TableCell align='center' sx={{ width: '10%' }}><input type='text' placeholder='Job No' value={searchedValueJobNo || ''} onChange={(e) => setSearchedValueJobNo(e.target.value)} style={{ width: '100%', fontWeight: 'bold', fontSize: '15px', border: 'none', outline: 'none', background: 'transparent', color: '#000', textAlign: 'center' }} /></TableCell>
                        {cookieData.laser &&
                          <TableCell align='center' sx={{ fontWeight: 'bold', width: '10%', fontSize: '15px' }}>Completed</TableCell>
                        }
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {searchedSLPrograms
                        .filter((row) =>
                          !searchedValueProgramNo || row.programNo
                            .toString()
                            .toLowerCase()
                            .includes(searchedValueProgramNo.toString().toLowerCase())
                        )
                        .filter((row) =>
                          !searchedValueMaterial || row.material
                            .toString()
                            .toLowerCase()
                            .includes(searchedValueMaterial.toString().toLowerCase())
                        )
                        .filter((row) =>
                          !searchedValueJobNo || row.jobNo
                            .toString()
                            .toLowerCase()
                            .includes(searchedValueJobNo.toString().toLowerCase())
                        )
                        .map((job, index) => {
                          if (job.verified) {
                            return (
                              <TableRow key={index} sx={{ backgroundColor: index % 2 === 0 ? '#f0f0f0' : '#fff' }}>
                                {cookieData.laser ?
                                  <TableCell align='center' sx={{ fontWeight: 'bold', fontSize: '15px', p: 1.25 }} onClick={() => handleUpdateJob(job)}>{job.programNo}</TableCell>
                                  :
                                  <TableCell align='center' sx={{ fontWeight: 'bold', fontSize: '15px', p: 1.25 }}>{job.programNo}</TableCell>
                                }
                                <TableCell align='center' sx={{ fontSize: '15px', p: 1.25 }}>{job.material}</TableCell>
                                <TableCell align='center' sx={{ fontSize: '15px', p: 1.25 }}>{job.jobNo}</TableCell>
                                {cookieData.laser &&
                                  <TableCell align='center' sx={{ fontSize: '15px', p: 0 }}>
                                    <IconButton onClick={() => handleShowComplete(job)}>
                                      {<HistoryIcon sx={{ fontSize: '20px', fontWeight: 'bold' }} />}
                                    </IconButton>
                                  </TableCell>
                                }
                              </TableRow>
                            )
                          }
                        })
                      }
                    </TableBody>
                  </Table>
                </TableContainer>

                {cookieData.laser &&
                  <IconButton onClick={handleShow} sx={{ backgroundColor: '#111827', color: 'white', height: '52.5px', width: '52.5px', zIndex: 1000, position: 'fixed', bottom: '85px', right: '20px', '&:hover': { backgroundColor: '#374151', }, }}>
                    <AddIcon fontSize='large' />
                  </IconButton>
                }
                <IconButton onClick={fetchData} sx={{ backgroundColor: '#111827', color: 'white', height: '52.5px', width: '52.5px', zIndex: 1000, position: 'fixed', bottom: '20px', right: '20px', '&:hover': { backgroundColor: '#374151', }, }}>
                  <RefreshIcon fontSize='large' />
                </IconButton>
              </Box>
            )}
          </Box>

          {/* ALL JOBS */}

          <Box>
            {selectedTab === 3 && (
              <Box sx={{ padding: '12px' }}>
                <TableContainer component={Paper}>
                  <Table>
                    <TableHead>
                      <TableRow>
                        <TableCell align='center' sx={{ width: '10%' }}><input type='text' placeholder='Job No' value={searchedValueJobNo || ''} onChange={(e) => setSearchedValueJobNo(e.target.value)} style={{ width: '100%', fontWeight: 'bold', fontSize: '15px', border: 'none', outline: 'none', background: 'transparent', color: '#000', textAlign: 'center' }} /></TableCell>
                        <TableCell align='center' sx={{ fontWeight: 'bold', width: '7%', fontSize: '15px' }}>Step No</TableCell>
                        <TableCell align='center' sx={{ width: '20%' }}><input type='text' placeholder='Part No' value={searchedValuePartNo || ''} onChange={(e) => setSearchedValuePartNo(e.target.value)} style={{ width: '100%', fontWeight: 'bold', fontSize: '15px', border: 'none', outline: 'none', background: 'transparent', color: '#000', textAlign: 'center' }} /></TableCell>
                        <TableCell align='center' sx={{ fontWeight: 'bold', width: '6%', fontSize: '15px' }}>Revision</TableCell>
                        <TableCell align='center' sx={{ fontWeight: 'bold', width: '6%', fontSize: '15px' }}>Qty</TableCell>
                        <TableCell align='center' sx={{ fontWeight: 'bold', width: '7%', fontSize: '15px' }}>Due Date</TableCell>
                        <TableCell align='center' sx={{ fontWeight: 'bold', width: '7%', fontSize: '15px' }}>Traveler</TableCell>
                        <TableCell align='center' sx={{ width: '10%' }}><input type='text' placeholder='Customer' value={searchedValueCustomer || ''} onChange={(e) => setSearchedValueCustomer(e.target.value)} style={{ width: '100%', fontWeight: 'bold', fontSize: '15px', border: 'none', outline: 'none', background: 'transparent', color: '#000', textAlign: 'center' }} /></TableCell>
                        <TableCell align='center' sx={{ width: '7%' }}><input type='text' placeholder='Type' value={searchedValueType || ''} onChange={(e) => setSearchedValueType(e.target.value)} style={{ width: '100%', fontWeight: 'bold', fontSize: '15px', border: 'none', outline: 'none', background: 'transparent', color: '#000', textAlign: 'center' }} /></TableCell>
                        <TableCell align='center' sx={{ width: '20%' }}><input type='text' placeholder='Materials' value={searchedValueMaterial || ''} onChange={(e) => setSearchedValueMaterial(e.target.value)} style={{ width: '100%', fontWeight: 'bold', fontSize: '15px', border: 'none', outline: 'none', background: 'transparent', color: '#000', textAlign: 'center' }} /></TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {searchedTBR.length >= 1 &&
                        <TableRow>
                          <TableCell colSpan={10} align='center' sx={{ fontWeight: 'bold', fontSize: '15px', backgroundColor: '#D1BBA8', p: 1.25 }}>TBR</TableCell>
                        </TableRow>
                      }
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
                        .filter((row) =>
                          !searchedValueMaterial || row.SubPartNo
                            .toString()
                            .toLowerCase()
                            .includes(searchedValueMaterial.toString().toLowerCase())
                        )
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
                              <TableCell align='center' sx={{ fontSize: '15px', p: 0 }}>
                                <IconButton>
                                  {job.User_Date1 && <CheckIcon sx={{ fontSize: '20px', fontWeight: 'bold' }} />}
                                </IconButton>
                              </TableCell>
                              <TableCell align='center' sx={{ fontSize: '15px', p: 1.25 }}>{job.CustCode}</TableCell>
                              <TableCell align='center' sx={{ fontSize: '15px', p: 1.25 }}>{job.User_Text3}</TableCell>
                              <TableCell align='center' sx={{ fontSize: '15px', p: 1.25 }}>
                                {Array.isArray(job.SubPartNo) && job.SubPartNo.length === 1 ? (
                                  <CopyToClipboard text={job.SubPartNo[0]} onCopy={() => { setShowToast(true); setPartCopy(`${job.SubPartNo[0]}`); }}>
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
                                      '&:hover': {
                                        backgroundColor: 'transparent',
                                      },
                                      '&:focus': {
                                        outline: 'none',
                                      }
                                    }}
                                  >
                                    ...
                                  </Button>
                                )}
                              </TableCell>
                            </TableRow>
                          )
                        })
                      }
                      {searchedFR.length >= 1 &&
                        <TableRow>
                          <TableCell colSpan={10} align='center' sx={{ fontWeight: 'bold', fontSize: '15px', backgroundColor: '#D1BBA8', p: 1.25 }}>FUTURE</TableCell>
                        </TableRow>
                      }
                      {searchedFR
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
                          !searchedValueMaterial || row.SubPartNo
                            .toString()
                            .toLowerCase()
                            .includes(searchedValueMaterial.toString().toLowerCase())
                        )
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
                              <TableCell align='center' sx={{ fontSize: '15px', p: 0 }}>
                                <IconButton>
                                  {job.User_Date1 && <CheckIcon sx={{ fontSize: '20px', fontWeight: 'bold' }} />}
                                </IconButton>
                              </TableCell>
                              <TableCell align='center' sx={{ fontSize: '15px', p: 1.25 }}>{job.CustCode}</TableCell>
                              <TableCell align='center' sx={{ fontSize: '15px', p: 1.25 }}>{job.User_Text3}</TableCell>
                              <TableCell align='center' sx={{ fontSize: '15px', p: 1.25 }}>
                                {Array.isArray(job.SubPartNo) && job.SubPartNo.length === 1 ? (
                                  <CopyToClipboard text={job.SubPartNo[0]} onCopy={() => { setShowToast(true); setPartCopy(`${job.SubPartNo[0]}`); }}>
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
                                      '&:hover': {
                                        backgroundColor: 'transparent',
                                      },
                                      '&:focus': {
                                        outline: 'none',
                                      }
                                    }}
                                  >
                                    ...
                                  </Button>
                                )}
                              </TableCell>
                            </TableRow>
                          )
                        })
                      }
                    </TableBody>
                  </Table>
                </TableContainer>

                {cookieData.laser &&
                  <IconButton onClick={handleShow} sx={{ backgroundColor: '#111827', color: 'white', height: '52.5px', width: '52.5px', zIndex: 1000, position: 'fixed', bottom: '85px', right: '20px', '&:hover': { backgroundColor: '#374151', }, }}>
                    <AddIcon fontSize='large' />
                  </IconButton>
                }
                <IconButton onClick={fetchData} sx={{ backgroundColor: '#111827', color: 'white', height: '52.5px', width: '52.5px', zIndex: 1000, position: 'fixed', bottom: '20px', right: '20px', '&:hover': { backgroundColor: '#374151', }, }}>
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