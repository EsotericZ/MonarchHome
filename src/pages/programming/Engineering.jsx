import { useEffect, useState } from 'react';
import { Box, Divider, FormControl, IconButton, MenuItem, Paper, Table, TableBody, TableContainer, TableHead, TableRow } from '@mui/material';

import { CopyToClipboard } from 'react-copy-to-clipboard';
import { useUserContext } from '../../context/UserContext';

import CopySnackbar from '../../components/shared/CopySnackbar';
import CustomHeader from '../../components/programming/CustomHeader';
import CustomSelect from '../../components/programming/CustomSelect';
import DataTableCell from '../../components/shared/DataTableCell';
import CustomTabs from '../../components/shared/CustomTabs';
import PageContainer from '../../components/shared/PageContainer';
import RefreshButton from '../../components/shared/RefreshButton';

import CheckIcon from '@mui/icons-material/Check';

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
import updateEngineer from '../../services/engineering/updateEngineer';
import updateJobStatus from '../../services/engineering/updateJobStatus';

export const Engineering = () => {
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

  const fetchOutsourceData = async () => {
    try {
      const [outsourcePrintsRes, outsourceRes] = await Promise.all([
        getOutsourcePrints(),
        getOutsourceJobs(),
      ]);

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

  useEffect(() => {
    fetchQCData();
  }, []);

  let rowIndex = 1;

  const tbrFutureColumnConfig = [
    { label: 'Job No', width: '7%', isSearchable: true, value: searchedValueJobNo, onChange: (e) => setSearchedValueJobNo(e.target.value), placeholder: 'Job No' },
    { label: 'Step No', width: '7%', isSearchable: false },
    { label: 'Part No', width: '20%', isSearchable: true, value: searchedValuePartNo, onChange: (e) => setSearchedValuePartNo(e.target.value), placeholder: 'Part No' },
    { label: 'Revision', width: '5%', isSearchable: false },
    { label: 'Qty', width: '5%', isSearchable: false },
    { label: 'Due Date', width: '7%', isSearchable: false },
    { label: 'Customer', width: '12%', isSearchable: true, value: searchedValueCustomer, onChange: (e) => setSearchedValueCustomer(e.target.value), placeholder: 'Customer' },
    { label: 'Type', width: '7%', isSearchable: true, value: searchedValueType, onChange: (e) => setSearchedValueType(e.target.value), placeholder: 'Type' },
    { label: 'Engineer', width: '10%', isSearchable: true, value: searchedValueEngineer, onChange: (e) => setSearchedValueEngineer(e.target.value), placeholder: 'Engineer' },
    { label: 'Quote', width: '6%', isSearchable: true, value: searchedValueQuote, onChange: (e) => setSearchedValueQuote(e.target.value), placeholder: 'Quote' },
    { label: 'Model', width: '7%', isSearchable: false },
    { label: 'Status', width: '10%', isSearchable: true, value: searchedValueStatus, onChange: (e) => setSearchedValueStatus(e.target.value), placeholder: 'Status' },
  ];

  const repeatColumnConfig = [
    { label: 'Job No', width: '10%', isSearchable: true, value: searchedValueJobNo, onChange: (e) => setSearchedValueJobNo(e.target.value), placeholder: 'Job No' },
    { label: 'Step No', width: '7%', isSearchable: false },
    { label: 'Part No', width: '20%', isSearchable: true, value: searchedValuePartNo, onChange: (e) => setSearchedValuePartNo(e.target.value), placeholder: 'Part No' },
    { label: 'Revision', width: '10%', isSearchable: false },
    { label: 'Qty', width: '8%', isSearchable: false },
    { label: 'Due Date', width: '10%', isSearchable: false },
    { label: 'Customer', width: '10%', isSearchable: true, value: searchedValueCustomer, onChange: (e) => setSearchedValueCustomer(e.target.value), placeholder: 'Customer' },
    { label: 'Type', width: '10%', isSearchable: true, value: searchedValueType, onChange: (e) => setSearchedValueType(e.target.value), placeholder: 'Type' },
    { label: 'Next Step', width: '10%', isSearchable: true, value: searchedValueStep, onChange: (e) => setSearchedValueStep(e.target.value), placeholder: 'Next Step' },
    { label: 'Print', width: '5%', isSearchable: false },
  ];

  const outsourceColumnConfig = [
    { label: 'Job No', width: '10%', isSearchable: true, value: searchedValueJobNo, onChange: (e) => setSearchedValueJobNo(e.target.value), placeholder: 'Job No' },
    { label: 'Step No', width: '7%', isSearchable: false },
    { label: 'Part No', width: '20%', isSearchable: true, value: searchedValuePartNo, onChange: (e) => setSearchedValuePartNo(e.target.value), placeholder: 'Part No' },
    { label: 'Revision', width: '10%', isSearchable: false },
    { label: 'Qty', width: '8%', isSearchable: false },
    { label: 'Due Date', width: '10%', isSearchable: false },
    { label: 'Customer', width: '10%', isSearchable: true, value: searchedValueCustomer, onChange: (e) => setSearchedValueCustomer(e.target.value), placeholder: 'Customer' },
    { label: 'Quote', width: '10%', isSearchable: true, value: searchedValueQuote, onChange: (e) => setSearchedValueQuote(e.target.value), placeholder: 'Quote' },
    { label: 'Type', width: '10%', isSearchable: true, value: searchedValueType, onChange: (e) => setSearchedValueType(e.target.value), placeholder: 'Type' },
    { label: 'Print', width: '5%', isSearchable: false },
  ];

  const activeColumnConfig = [
    { label: 'Job No', width: '11%', isSearchable: true, value: searchedValueJobNo, onChange: (e) => setSearchedValueJobNo(e.target.value), placeholder: 'Job No' },
    { label: 'Part No', width: '23%', isSearchable: true, value: searchedValuePartNo, onChange: (e) => setSearchedValuePartNo(e.target.value), placeholder: 'Part No' },
    { label: 'Revision', width: '11%', isSearchable: false },
    { label: 'Qty', width: '11%', isSearchable: false },
    { label: 'Due Date', width: '11%', isSearchable: false },
    { label: 'Customer', width: '11%', isSearchable: true, value: searchedValueCustomer, onChange: (e) => setSearchedValueCustomer(e.target.value), placeholder: 'Customer' },
    { label: 'Type', width: '11%', isSearchable: true, value: searchedValueType, onChange: (e) => setSearchedValueType(e.target.value), placeholder: 'Type' },
    { label: 'Area', width: '11%', isSearchable: true, value: searchedValueArea, onChange: (e) => setSearchedValueArea(e.target.value), placeholder: 'Area' },
  ];

  return (
    <PageContainer loading={loading} title='Engineering'>
      <CustomTabs
        selectedTab={selectedTab}
        handleTabChange={handleTabChange}
        tabLabels={[tbr, future, repeat, outsource, 'Active']}
      />

      {/* TBR JOBS */}

      <Box>
        {selectedTab === 0 && (
          <Box sx={{ padding: '12px' }}>
            <TableContainer component={Paper}>
              <Table>
                <TableHead>
                  <CustomHeader columns={tbrFutureColumnConfig} />
                </TableHead>
                <TableBody>
                  {searchedTBR
                    .filter(row => typeof row.JobNo !== 'undefined')
                    .filter((row) =>
                      !searchedValueJobNo || row.JobNo.toString().toLowerCase().includes(searchedValueJobNo.toString().toLowerCase())
                    )
                    .filter((row) =>
                      !searchedValuePartNo || row.PartNo.toString().toLowerCase().includes(searchedValuePartNo.toString().toLowerCase())
                    )
                    .filter((row) =>
                      !searchedValueCustomer || row.CustCode.toString().toLowerCase().includes(searchedValueCustomer.toString().toLowerCase())
                    )
                    .filter((row) =>
                      !searchedValueType || row.User_Text3.toString().toLowerCase().includes(searchedValueType.toString().toLowerCase())
                    )
                    .filter((row) => {
                      if (!searchedValueEngineer) { return true; }
                      if (!row || !row.dataValues || !row.dataValues.engineer) { return false; }

                      return row.dataValues.engineer.toString().toLowerCase().includes(searchedValueEngineer.toString().toLowerCase())
                    })
                    .filter((row) => {
                      if (!searchedValueQuote) { return true; }
                      if (!row || !row.QuoteNo) { return false; }

                      return row.QuoteNo.toString().toLowerCase().includes(searchedValueQuote.toString().toLowerCase())
                    })
                    .filter((row) => {
                      if (!searchedValueStatus) { return true; }
                      if (!row || !row.dataValues || !row.dataValues.jobStatus) { return false; }

                      return row.dataValues.jobStatus.toString().toLowerCase().includes(searchedValueStatus.toString().toLowerCase())
                    })
                    .map((job, index) => {
                      const rowClass = job.WorkCode == 'HOT' ? 'expedite-row' : '';
                      const qcClass = qcData.includes(job.CustCode) ? 'qc-row' : '';
                      const dropdownTBRTitle = dropdownTBRTitles[job.JobNo] || job.dataValues.engineer;
                      const dropdownTBRStatus = dropdownTBRStatuses[job.JobNo] || job.dataValues.jobStatus;
                      rowIndex++;
                      return (
                        <TableRow key={index} sx={{ backgroundColor: rowIndex % 2 === 0 ? '#f0f0f0' : '#fff' }} className={`${rowClass} ${qcClass}`}>
                          <DataTableCell bold>{job.JobNo}</DataTableCell>
                          <DataTableCell>{job.StepNo}</DataTableCell>
                          <DataTableCell>
                            <CopyToClipboard text={job.PartNo} onCopy={() => { setShowToast(true); setPartCopy(`${job.PartNo}`); }}>
                              <span>{job.PartNo}</span>
                            </CopyToClipboard>
                          </DataTableCell>
                          <DataTableCell>{job.Revision}</DataTableCell>
                          <DataTableCell>{job.EstimQty}</DataTableCell>
                          <DataTableCell>{job.DueDate.split('-')[1] + '/' + job.DueDate.split('-')[2].split('T')[0]}</DataTableCell>
                          <DataTableCell>{job.CustCode}</DataTableCell>
                          <DataTableCell>{job.User_Text3}</DataTableCell>

                          {cookieData.engineering ?
                            <DataTableCell>
                              <FormControl variant='standard' fullWidth>
                                <CustomSelect
                                  value={dropdownTBRTitle}
                                  onChange={(e) => handleTBREngineer(job, e.target.value)}
                                >
                                  {engineeringUsers.map((user, n) => (
                                    <MenuItem key={n} value={user}>
                                      {user}
                                    </MenuItem>
                                  ))}
                                  <Divider />
                                  <MenuItem value=''>None</MenuItem>
                                </CustomSelect>
                              </FormControl>
                            </DataTableCell>
                            :
                            <DataTableCell>{job.dataValues.engineer}</DataTableCell>
                          }

                          <DataTableCell>{job.QuoteNo}</DataTableCell>
                          <DataTableCell padding={0}>
                            <IconButton onClick={() => toggleModel(job)}>
                              {job.dataValues.model && <CheckIcon sx={{ fontSize: '20px', fontWeight: 'bold' }} />}
                            </IconButton>
                          </DataTableCell>

                          {cookieData.engineering ?
                            <DataTableCell>
                              <FormControl variant='standard' fullWidth>
                                <CustomSelect
                                  value={dropdownTBRStatus}
                                  onChange={(e) => handleTBRJobStatus(job, e.target.value)}
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
                                </CustomSelect>
                              </FormControl>
                            </DataTableCell>
                            :
                            <DataTableCell>{job.dataValues.jobStatus}</DataTableCell>
                          }
                        </TableRow>
                      )
                    })
                  }
                </TableBody>
              </Table>
            </TableContainer>

            <RefreshButton onClick={fetchTBRData} />
            <CopySnackbar
              show={showToast}
              onClose={() => setShowToast(false)}
              message={`${partCopy} Copied To Clipboard`}
            />
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
                  <CustomHeader columns={tbrFutureColumnConfig} />
                </TableHead>
                <TableBody>
                  {searchedFuture
                    .filter(row => typeof row.JobNo !== 'undefined')
                    .filter((row) =>
                      !searchedValueJobNo || row.JobNo.toString().toLowerCase().includes(searchedValueJobNo.toString().toLowerCase())
                    )
                    .filter((row) =>
                      !searchedValuePartNo || row.PartNo.toString().toLowerCase().includes(searchedValuePartNo.toString().toLowerCase())
                    )
                    .filter((row) =>
                      !searchedValueCustomer || row.CustCode.toString().toLowerCase().includes(searchedValueCustomer.toString().toLowerCase())
                    )
                    .filter((row) =>
                      !searchedValueType || row.User_Text3.toString().toLowerCase().includes(searchedValueType.toString().toLowerCase())
                    )
                    .filter((row) => {
                      if (!searchedValueEngineer) { return true; }
                      if (!row || !row.dataValues || !row.dataValues.engineer) { return false; }

                      return row.dataValues.engineer.toString().toLowerCase().includes(searchedValueEngineer.toString().toLowerCase())
                    })
                    .filter((row) => {
                      if (!searchedValueQuote) { return true; }
                      if (!row || !row.QuoteNo) { return false; }

                      return row.QuoteNo.toString().toLowerCase().includes(searchedValueQuote.toString().toLowerCase())
                    })
                    .filter((row) => {
                      if (!searchedValueStatus) { return true; }
                      if (!row || !row.dataValues || !row.dataValues.jobStatus) { return false; }

                      return row.dataValues.jobStatus.toString().toLowerCase().includes(searchedValueStatus.toString().toLowerCase())
                    })
                    .map((job, index) => {
                      if (job.User_Text3 != 'REPEAT' && job.User_Text2 != '6. OUTSOURCE') {
                        const rowClass = job.WorkCode == 'HOT' ? 'expedite-row' : '';
                        const qcClass = qcData.includes(job.CustCode) ? 'qc-row' : '';
                        const dropdownFutureTitle = dropdownFutureTitles[job.JobNo] || job.dataValues.engineer;
                        const dropdownFutureStatus = dropdownFutureStatuses[job.JobNo] || job.dataValues.jobStatus;
                        rowIndex++;
                        return (
                          <TableRow key={index} sx={{ backgroundColor: rowIndex % 2 === 0 ? '#f0f0f0' : '#fff' }} className={`${rowClass} ${qcClass}`}>
                            <DataTableCell bold>{job.JobNo}</DataTableCell>
                            <DataTableCell>{job.StepNo}</DataTableCell>
                            <DataTableCell>
                              <CopyToClipboard text={job.PartNo} onCopy={() => { setShowToast(true); setPartCopy(`${job.PartNo}`); }}>
                                <span>{job.PartNo}</span>
                              </CopyToClipboard>
                            </DataTableCell>
                            <DataTableCell>{job.Revision}</DataTableCell>
                            <DataTableCell>{job.EstimQty}</DataTableCell>
                            <DataTableCell>{job.DueDate.split('-')[1] + '/' + job.DueDate.split('-')[2].split('T')[0]}</DataTableCell>
                            <DataTableCell>{job.CustCode}</DataTableCell>
                            <DataTableCell>{job.User_Text3}</DataTableCell>

                            {cookieData.engineering ?
                              <DataTableCell>
                                <FormControl variant='standard' fullWidth>
                                  <CustomSelect
                                    value={dropdownFutureTitle}
                                    onChange={(e) => handleFutureEngineer(job, e.target.value)}
                                  >
                                    {engineeringUsers.map((user, n) => (
                                      <MenuItem key={n} value={user}>
                                        {user}
                                      </MenuItem>
                                    ))}
                                    <Divider />
                                    <MenuItem value=''>None</MenuItem>
                                  </CustomSelect>
                                </FormControl>
                              </DataTableCell>
                              :
                              <DataTableCell>{job.dataValues.engineer}</DataTableCell>
                            }

                            <DataTableCell>{job.QuoteNo}</DataTableCell>
                            <DataTableCell padding={0}>
                              <IconButton onClick={() => toggleModel(job)}>
                                {job.dataValues.model && <CheckIcon sx={{ fontSize: '20px', fontWeight: 'bold' }} />}
                              </IconButton>
                            </DataTableCell>

                            {cookieData.engineering ?
                              <DataTableCell>
                                <FormControl variant='standard' fullWidth>
                                  <CustomSelect
                                    value={dropdownFutureStatus}
                                    onChange={(e) => handleFutureJobStatus(job, e.target.value)}
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
                                  </CustomSelect>
                                </FormControl>
                              </DataTableCell>
                              :
                              <DataTableCell>{job.dataValues.jobStatus}</DataTableCell>
                            }
                          </TableRow>
                        )
                      }
                    })
                  }
                </TableBody>
              </Table>
            </TableContainer>

            <RefreshButton onClick={fetchFutureData} />
            <CopySnackbar
              show={showToast}
              onClose={() => setShowToast(false)}
              message={`${partCopy} Copied To Clipboard`}
            />
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
                  <CustomHeader columns={repeatColumnConfig} />
                </TableHead>
                <TableBody>
                  {fullRepeats
                    .filter(row => typeof row.JobNo !== 'undefined')
                    .filter((row) =>
                      !searchedValueJobNo || row.JobNo.toString().toLowerCase().includes(searchedValueJobNo.toString().toLowerCase())
                    )
                    .filter((row) =>
                      !searchedValuePartNo || row.PartNo.toString().toLowerCase().includes(searchedValuePartNo.toString().toLowerCase())
                    )
                    .filter((row) =>
                      !searchedValueCustomer || row.CustCode.toString().toLowerCase().includes(searchedValueCustomer.toString().toLowerCase())
                    )
                    .filter((row) =>
                      !searchedValueType || row.User_Text3.toString().toLowerCase().includes(searchedValueType.toString().toLowerCase())
                    )
                    .filter((row) => {
                      if (!searchedValueStep) { return true; }
                      if (!row || !row.WorkCntr) { return false; }

                      return row.WorkCntr.toString().toLowerCase().includes(searchedValueStep.toString().toLowerCase())
                    })
                    .map((job, index) => {
                      rowIndex++;
                      return (
                        <TableRow key={index} sx={{ backgroundColor: rowIndex % 2 === 0 ? '#f0f0f0' : '#fff' }}>
                          <DataTableCell bold>{job.JobNo}</DataTableCell>
                          <DataTableCell>{job.StepNo}</DataTableCell>
                          <DataTableCell>
                            <CopyToClipboard text={job.PartNo} onCopy={() => { setShowToast(true); setPartCopy(`${job.PartNo}`); }}>
                              <span>{job.PartNo}</span>
                            </CopyToClipboard>
                          </DataTableCell>
                          <DataTableCell>{job.Revision}</DataTableCell>
                          <DataTableCell>{job.EstimQty}</DataTableCell>
                          <DataTableCell>{job.DueDate.split('-')[1] + '/' + job.DueDate.split('-')[2].split('T')[0]}</DataTableCell>
                          <DataTableCell>{job.CustCode}</DataTableCell>
                          <DataTableCell>{job.User_Text3}</DataTableCell>
                          <DataTableCell>{job.WorkCntr}</DataTableCell>
                          <DataTableCell padding={0}>
                            <IconButton>
                              {job.DocNumber && <CheckIcon sx={{ fontSize: '20px', fontWeight: 'bold' }} />}
                            </IconButton>
                          </DataTableCell>
                        </TableRow>
                      )
                    })
                  }
                </TableBody>
              </Table>
            </TableContainer>

            <RefreshButton onClick={fetchRepeatData} />
            <CopySnackbar
              show={showToast}
              onClose={() => setShowToast(false)}
              message={`${partCopy} Copied To Clipboard`}
            />
          </Box>
        )}
      </Box>

      {/* OUTSOURCE JOBS */}

      <Box>
        {selectedTab === 3 && (
          <Box sx={{ padding: '12px' }}>
            <TableContainer component={Paper}>
              <Table>
                <TableHead>
                  <CustomHeader columns={outsourceColumnConfig} />
                </TableHead>
                <TableBody>
                  {fullOutsource
                    .filter(row => typeof row.JobNo !== 'undefined')
                    .filter((row) =>
                      !searchedValueJobNo || row.JobNo.toString().toLowerCase().includes(searchedValueJobNo.toString().toLowerCase())
                    )
                    .filter((row) =>
                      !searchedValuePartNo || row.PartNo.toString().toLowerCase().includes(searchedValuePartNo.toString().toLowerCase())
                    )
                    .filter((row) =>
                      !searchedValueCustomer || row.CustCode.toString().toLowerCase().includes(searchedValueCustomer.toString().toLowerCase())
                    )
                    .filter((row) => {
                      if (!searchedValueQuote) { return true; }
                      if (!row || !row.QuoteNo) { return false; }

                      return row.QuoteNo.toString().toLowerCase().includes(searchedValueQuote.toString().toLowerCase())
                    })
                    .filter((row) =>
                      !searchedValueType || row.User_Text3.toString().toLowerCase().includes(searchedValueType.toString().toLowerCase())
                    )
                    .map((job, index) => {
                      rowIndex++;
                      return (
                        <TableRow key={index} sx={{ backgroundColor: rowIndex % 2 === 0 ? '#f0f0f0' : '#fff' }}>
                          <DataTableCell bold>{job.JobNo}</DataTableCell>
                          <DataTableCell>{job.StepNo}</DataTableCell>
                          <DataTableCell>
                            <CopyToClipboard text={job.PartNo} onCopy={() => { setShowToast(true); setPartCopy(`${job.PartNo}`); }}>
                              <span>{job.PartNo}</span>
                            </CopyToClipboard>
                          </DataTableCell>
                          <DataTableCell>{job.Revision}</DataTableCell>
                          <DataTableCell>{job.EstimQty}</DataTableCell>
                          <DataTableCell>{job.DueDate.split('-')[1] + '/' + job.DueDate.split('-')[2].split('T')[0]}</DataTableCell>
                          <DataTableCell>{job.CustCode}</DataTableCell>
                          <DataTableCell>{job.QuoteNo}</DataTableCell>
                          <DataTableCell>{job.User_Text3}</DataTableCell>
                          <DataTableCell padding={0}>
                            <IconButton>
                              {job.DocNumber && <CheckIcon sx={{ fontSize: '20px', fontWeight: 'bold' }} />}
                            </IconButton>
                          </DataTableCell>
                        </TableRow>
                      )
                    })
                  }
                </TableBody>
              </Table>
            </TableContainer>

            <RefreshButton onClick={fetchOutsourceData} />
            <CopySnackbar
              show={showToast}
              onClose={() => setShowToast(false)}
              message={`${partCopy} Copied To Clipboard`}
            />
          </Box>
        )}
      </Box>

      {/* ACTIVE JOBS */}

      <Box>
        {selectedTab === 4 && (
          <Box sx={{ padding: '12px' }}>
            <TableContainer component={Paper}>
              <Table>
                <TableHead>
                  <CustomHeader columns={activeColumnConfig} />
                </TableHead>
                <TableBody>
                  {searchedEng
                    .filter(row => typeof row.JobNo !== 'undefined')
                    .filter((row) =>
                      !searchedValueJobNo || row.JobNo.toString().toLowerCase().includes(searchedValueJobNo.toString().toLowerCase())
                    )
                    .filter((row) =>
                      !searchedValuePartNo || row.PartNo.toString().toLowerCase().includes(searchedValuePartNo.toString().toLowerCase())
                    )
                    .filter((row) =>
                      !searchedValueCustomer || row.CustCode.toString().toLowerCase().includes(searchedValueCustomer.toString().toLowerCase())
                    )
                    .filter((row) =>
                      !searchedValueType || row.User_Text3.toString().toLowerCase().includes(searchedValueType.toString().toLowerCase())
                    )
                    .filter((row) =>
                      !searchedValueArea || row.User_Text2.toString().toLowerCase().includes(searchedValueArea.toString().toLowerCase())
                    )
                    .map((job, index) => {
                      const rowClass = job.WorkCode == 'HOT' ? 'expedite-row' : '';
                      rowIndex++;
                      return (
                        <TableRow key={index} sx={{ backgroundColor: rowIndex % 2 === 0 ? '#f0f0f0' : '#fff' }} className={rowClass}>
                          <DataTableCell bold>{job.JobNo}</DataTableCell>
                          <DataTableCell>
                            <CopyToClipboard text={job.PartNo} onCopy={() => { setShowToast(true); setPartCopy(`${job.PartNo}`); }}>
                              <span>{job.PartNo}</span>
                            </CopyToClipboard>
                          </DataTableCell>
                          <DataTableCell>{job.Revision}</DataTableCell>
                          <DataTableCell>{job.EstimQty}</DataTableCell>
                          <DataTableCell>{job.DueDate.split('-')[1] + '/' + job.DueDate.split('-')[2].split('T')[0]}</DataTableCell>
                          <DataTableCell>{job.CustCode}</DataTableCell>
                          <DataTableCell>{job.User_Text3}</DataTableCell>
                          <DataTableCell>{job.User_Text2}</DataTableCell>
                        </TableRow>
                      )
                    })
                  }
                </TableBody>
              </Table>
            </TableContainer>

            <RefreshButton onClick={fetchActiveData} />
            <CopySnackbar
              show={showToast}
              onClose={() => setShowToast(false)}
              message={`${partCopy} Copied To Clipboard`}
            />
          </Box>
        )}
      </Box>
    </PageContainer>
  );
}