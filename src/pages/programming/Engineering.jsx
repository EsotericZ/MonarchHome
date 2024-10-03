import { useEffect, useState } from 'react';
import { Dropdown, DropdownButton, Toast, ToastContainer } from 'react-bootstrap';
import { Container, Tabs, Tab, TableContainer, Table, TableHead, TableBody, TableRow, TableCell, Paper, Button, IconButton, Typography, Box } from '@mui/material';

import { CopyToClipboard } from 'react-copy-to-clipboard';
import Cookies from 'universal-cookie';
// import { decode as jwt_decode } from 'jwt-decode';

import PuffLoader from "react-spinners/PuffLoader";

import { Icon } from 'react-icons-kit';
import { check } from 'react-icons-kit/entypo/check';
import { refresh } from 'react-icons-kit/fa/refresh';
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
  
    //     // <Box sx={{ width: '100%', overflowX: 'hidden', padding: 2, border: '1px solid green' }}>
    //     <Box sx={{ width: '95%', overflowX: 'hidden', padding: 2 }}>
    //       <Tabs
    //         value={selectedTab}
    //         onChange={handleTabChange}
    //         centered
    //         indicatorColor="primary"
    //         textColor="primary"
    //       >
    //         <Tab label={tbr} />
    //         <Tab label={future} />
    //         <Tab label={repeat} />
    //         <Tab label={outsource} />
    //       </Tabs>

    //       <Box sx={{ width: '100%', overflowX: 'hidden', padding: 2 }}>
    //         {selectedTab === 0 && (
    //           <Box sx={{ maxWidth: '100%', overflowX: 'auto' }}>
    //             <TableContainer component={Paper}>
    //               <Table>
    //                 <TableHead>
    //                   <TableRow>
    //                     <TableCell align="center"><input placeholder='Job No' /></TableCell>
    //                     <TableCell align="center">Step No</TableCell>
    //                     <TableCell align="center"><input placeholder='Part No' /></TableCell>
    //                     <TableCell align="center">Revision</TableCell>
    //                     <TableCell align="center">Qty</TableCell>
    //                     <TableCell align="center">Due Date</TableCell>
    //                     <TableCell align="center"><input placeholder='Customer' /></TableCell>
    //                     <TableCell align="center"><input placeholder='Type' /></TableCell>
    //                     <TableCell align="center"><input placeholder='Engineer' /></TableCell>
    //                     <TableCell align="center">Model</TableCell>
    //                     <TableCell align="center"><input placeholder='Status' /></TableCell>
    //                   </TableRow>
    //                 </TableHead>
    //                 <TableBody>
    //                   {searchedTBR.map((job, index) => (
    //                     <TableRow key={index}>
    //                       <TableCell align="center">{job.JobNo}</TableCell>
    //                       <TableCell align="center">{job.StepNo}</TableCell>
    //                       <TableCell align="center">
    //                         <CopyToClipboard text={job.PartNo}>
    //                           <span>{job.PartNo}</span>
    //                         </CopyToClipboard>
    //                       </TableCell>
    //                       <TableCell align="center">{job.Revision}</TableCell>
    //                       <TableCell align="center">{job.EstimQty}</TableCell>
    //                       <TableCell align="center">{job.DueDate.split('-')[1] + '/' + job.DueDate.split('-')[2].split('T')[0]}</TableCell>
    //                       <TableCell align="center">{job.CustCode}</TableCell>
    //                       <TableCell align="center">{job.User_Text3}</TableCell>
    //                       <TableCell align="center">
    //                         <IconButton onClick={() => toggleModel(job)}>
    //                           {job.model && <Icon icon={check} />}
    //                         </IconButton>
    //                       </TableCell>
    //                       <TableCell align="center">{job.Status}</TableCell>
    //                     </TableRow>
    //                   ))}
    //                 </TableBody>
    //               </Table>
    //             </TableContainer>

    //             <IconButton onClick={fetchTBRData} className="refreshBtn">
    //               <RefreshIcon fontSize="large" />
    //             </IconButton>
    //           </Box>
    //         )}
    //       </Box>
    //     </Box>
    //   )}
    // </Box>
    <Box sx={{ width: '100%', height: '100%', border: '1px solid red' }}>
      {loading ? (
        <Box>
          <PuffLoader color="red" />
        </Box>
      ) : (
        // <Box sx={{ width: '100%', border: '1px solid green' }}>
        //   <Tabs centered>
        //     <Tab label={tbr} sx={{ width: '50%' }}/>
        //     <Tab label={future} sx={{ width: '50%' }}/>
        //     <Tab label={repeat} sx={{ width: '50%' }}/>
        //     <Tab label={outsource} sx={{ width: '50%' }}/>
        //   </Tabs>
        // </Box>
        <h1>w</h1>
      )}
    </Box >
  );
}