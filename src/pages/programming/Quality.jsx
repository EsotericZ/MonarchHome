import { useEffect, useState } from 'react';
import { Box, Divider, FormControl, IconButton, MenuItem, Paper, Table, TableBody, TableContainer, TableHead, TableRow } from '@mui/material';
import CheckIcon from '@mui/icons-material/Check';

import { CopyToClipboard } from 'react-copy-to-clipboard';
import { useUserContext } from '../../context/UserContext';

import CopySnackbar from '../../components/shared/CopySnackbar';
import CustomHeader from '../../components/programming/CustomHeader';
import CustomSelect from '../../components/programming/CustomSelect';
import DataTableCell from '../../components/shared/DataTableCell';
import CustomTabs from '../../components/shared/CustomTabs';
import PageContainer from '../../components/shared/PageContainer';
import RefreshButton from '../../components/shared/RefreshButton';

import getAllJobs from '../../services/engineering/getAllJobs';
import getTBRJobs from '../../services/engineering/getTBRJobs';
import getFutureJobs from '../../services/engineering/getFutureJobs';
import getAllUsers from '../../services/users/getAllUsers';
import getAllQCNotes from '../../services/qcinfo/getAllQCNotes';
import updateInspector from '../../services/quality/updateInspector';
import updateStatus from '../../services/quality/updateStatus';

export const Quality = () => {
  const { cookieData } = useUserContext();
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
  const [qcData, setQCData] = useState([]);
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
      const [allRes, tbrRes, futureRes, userRes, qcRes] = await Promise.all([
        getAllJobs(),
        getTBRJobs(),
        getFutureJobs(),
        getAllUsers(),
        getAllQCNotes(),
      ]);

      setSearchedEng(allRes);
      setSearchedTBR(tbrRes);
      setSearchedFuture(futureRes);

      let protoCount = ((allRes.filter(row => (typeof row.JobNo !== 'undefined' && row?.dataValues?.jobStatus == 'PROTO'))).length);
      (protoCount > 0) ? setProto(`Prototype (${protoCount})`) : setProto('Prototype');

      let tbrCount = ((tbrRes.filter(row => (typeof row.JobNo !== 'undefined' && (row?.dataValues?.jobStatus == 'QC' || row?.dataValues?.jobStatus == 'CHECKING')))).length);
      (tbrCount > 0) ? setTbr(`TBR (${tbrCount})`) : setTbr('TBR');

      let futureCount = ((futureRes.filter(row => (typeof row.JobNo !== 'undefined' && (row?.dataValues?.jobStatus == 'QC' || row?.dataValues?.jobStatus == 'CHECKING')))).length);
      (futureCount > 0) ? setFuture(`Future (${futureCount})`) : setFuture('Future');

      setQualityUsers(userRes.data.filter(user => user.quality).map(user => user.name.split(' ')[0]));

      const custCodes = qcRes.data.map(item => item.custCode);
      setQCData(custCodes);

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

  let rowIndex = 1;

  const tbrFutureColumnConfig = [
    { label: 'Job No', width: '7%', isSearchable: true, value: searchedValueJobNo, onChange: (e) => setSearchedValueJobNo(e.target.value), placeholder: 'Job No' },
    { label: 'Part No', width: '20%', isSearchable: true, value: searchedValuePartNo, onChange: (e) => setSearchedValuePartNo(e.target.value), placeholder: 'Part No' },
    { label: 'Revision', width: '7%', isSearchable: false },
    { label: 'Qty', width: '7%', isSearchable: false },
    { label: 'Due Date', width: '8%', isSearchable: false },
    { label: 'Customer', width: '10%', isSearchable: true, value: searchedValueCustomer, onChange: (e) => setSearchedValueCustomer(e.target.value), placeholder: 'Customer' },
    { label: 'Type', width: '5%', isSearchable: true, value: searchedValueType, onChange: (e) => setSearchedValueType(e.target.value), placeholder: 'Type' },
    { label: 'Engineer', width: '10%', isSearchable: true, value: searchedValueEngineer, onChange: (e) => setSearchedValueEngineer(e.target.value), placeholder: 'Engineer' },
    { label: 'Inspector', width: '10%', isSearchable: true, value: searchedValueInspector, onChange: (e) => setSearchedValueInspector(e.target.value), placeholder: 'Inspector' },
    { label: 'Model', width: '6%', isSearchable: false },
    { label: 'Status', width: '10%', isSearchable: true, value: searchedValueStatus, onChange: (e) => setSearchedValueStatus(e.target.value), placeholder: 'Status' },
  ];

  const prototypeColumnConfig = [
    { label: 'Job No', width: '10%', isSearchable: true, value: searchedValueJobNo, onChange: (e) => setSearchedValueJobNo(e.target.value), placeholder: 'Job No' },
    { label: 'Part No', width: '20%', isSearchable: true, value: searchedValuePartNo, onChange: (e) => setSearchedValuePartNo(e.target.value), placeholder: 'Part No' },
    { label: 'Revision', width: '10%', isSearchable: false },
    { label: 'Qty', width: '10%', isSearchable: false },
    { label: 'Due Date', width: '10%', isSearchable: false },
    { label: 'Customer', width: '10%', isSearchable: true, value: searchedValueCustomer, onChange: (e) => setSearchedValueCustomer(e.target.value), placeholder: 'Customer' },
    { label: 'Type', width: '10%', isSearchable: true, value: searchedValueType, onChange: (e) => setSearchedValueType(e.target.value), placeholder: 'Type' },
    { label: 'Area', width: '10%', isSearchable: true, value: searchedValueArea, onChange: (e) => setSearchedValueArea(e.target.value), placeholder: 'Area' },
    { label: 'Status', width: '10%', isSearchable: true, value: searchedValueStatus, onChange: (e) => setSearchedValueStatus(e.target.value), placeholder: 'Status' },
  ];

  return (
    <PageContainer loading={loading} title='Quality'>
      <CustomTabs
        selectedTab={selectedTab}
        handleTabChange={handleTabChange}
        tabLabels={[tbr, future, proto]}
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
                      if (!searchedValueInspector) { return true; }
                      if (!row || !row.dataValues || !row.dataValues.inspector) { return false; }

                      return row.dataValues.inspector.toString().toLowerCase().includes(searchedValueInspector.toString().toLowerCase())
                    })
                    .filter((row) => {
                      if (!searchedValueStatus) { return true; }
                      if (!row || !row.dataValues || !row.dataValues.jobStatus) { return false; }

                      return row.dataValues.jobStatus.toString().toLowerCase().includes(searchedValueStatus.toString().toLowerCase())
                    })
                    .map((job, index) => {
                      if (job.dataValues.jobStatus == 'QC' || job.dataValues.jobStatus == 'CHECKING') {
                        const rowClass = job.WorkCode == 'HOT' ? 'expedite-row' : '';
                        const qcClass = qcData.includes(job.CustCode) ? 'qc-row' : '';
                        const dropdownTBRTitle = dropdownTBRTitles[job.JobNo] || job.dataValues.inspector;
                        const dropdownTBRStatus = dropdownTBRStatuses[job.JobNo] || job.dataValues.jobStatus;
                        rowIndex++;
                        return (
                          <TableRow key={index} sx={{ backgroundColor: rowIndex % 2 === 0 ? '#f0f0f0' : '#fff' }} className={`${rowClass} ${qcClass}`}>
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
                            <DataTableCell>{job.dataValues.engineer}</DataTableCell>

                            {cookieData.quality ?
                              <DataTableCell>
                                <FormControl variant='standard' fullWidth>
                                  <CustomSelect
                                    value={dropdownTBRTitle}
                                    onChange={(e) => handleTBRInspector(job, e.target.value)}
                                  >
                                    {qualityUsers.map((user, n) => (
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
                              <DataTableCell>{job.dataValues.inspector}</DataTableCell>
                            }

                            <DataTableCell padding={0}>
                              <IconButton onClick={() => toggleModel(job)}>
                                {job.dataValues.model && <CheckIcon sx={{ fontSize: '20px', fontWeight: 'bold' }} />}
                              </IconButton>
                            </DataTableCell>

                            {cookieData.quality ?
                              <DataTableCell>
                                <FormControl variant='standard' fullWidth>
                                  <CustomSelect
                                    value={dropdownTBRStatus}
                                    onChange={(e) => handleTBRStatus(job, e.target.value)}
                                  >
                                    <MenuItem value='CHECKING'>CHECKING</MenuItem>
                                    <MenuItem value='REWORK'>REWORK</MenuItem>
                                    <MenuItem value='DONE'>DONE</MenuItem>
                                    <Divider />
                                    <MenuItem value='QC'>QC</MenuItem>
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

            <RefreshButton onClick={fetchData} />
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
                      if (!searchedValueInspector) { return true; }
                      if (!row || !row.dataValues || !row.dataValues.inspector) { return false; }

                      return row.dataValues.inspector.toString().toLowerCase().includes(searchedValueInspector.toString().toLowerCase())
                    })
                    .filter((row) => {
                      if (!searchedValueStatus) { return true; }
                      if (!row || !row.dataValues || !row.dataValues.jobStatus) { return false; }

                      return row.dataValues.jobStatus.toString().toLowerCase().includes(searchedValueStatus.toString().toLowerCase())
                    })
                    .map((job, index) => {
                      if (job.User_Text3 != 'REPEAT' && job.User_Text2 != '6. OUTSOURCE' && job.dataValues.jobStatus == 'QC' || job.dataValues.jobStatus == 'CHECKING') {
                        const rowClass = job.WorkCode == 'HOT' ? 'expedite-row' : '';
                        const qcClass = qcData.includes(job.CustCode) ? 'qc-row' : '';
                        const dropdownFutureTitle = dropdownFutureTitles[job.JobNo] || job.dataValues.inspector;
                        const dropdownFutureStatus = dropdownFutureStatuses[job.JobNo] || job.dataValues.jobStatus;
                        rowIndex++;
                        return (
                          <TableRow key={index} sx={{ backgroundColor: rowIndex % 2 === 0 ? '#f0f0f0' : '#fff' }} className={`${rowClass} ${qcClass}`}>
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
                            <DataTableCell>{job.dataValues.engineer}</DataTableCell>

                            {cookieData.quality ?
                              <DataTableCell>
                                <FormControl variant='standard' fullWidth>
                                  <CustomSelect
                                    value={dropdownFutureTitle}
                                    onChange={(e) => handleFutureInspector(job, e.target.value)}
                                  >
                                    {qualityUsers.map((user, n) => (
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
                              <DataTableCell>{job.dataValues.inspector}</DataTableCell>
                            }

                            <DataTableCell padding={0}>
                              <IconButton onClick={() => toggleModel(job)}>
                                {job.dataValues.model && <CheckIcon sx={{ fontSize: '20px', fontWeight: 'bold' }} />}
                              </IconButton>
                            </DataTableCell>

                            {cookieData.quality ?
                              <DataTableCell>
                                <FormControl variant='standard' fullWidth>
                                  <CustomSelect
                                    value={dropdownFutureStatus}
                                    onChange={(e) => handleFutureStatus(job, e.target.value)}
                                  >
                                    <MenuItem value='CHECKING'>CHECKING</MenuItem>
                                    <MenuItem value='REWORK'>REWORK</MenuItem>
                                    <MenuItem value='DONE'>DONE</MenuItem>
                                    <Divider />
                                    <MenuItem value='QC'>QC</MenuItem>
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

            <RefreshButton onClick={fetchData} />
            <CopySnackbar
              show={showToast}
              onClose={() => setShowToast(false)}
              message={`${partCopy} Copied To Clipboard`}
            />
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
                  <CustomHeader columns={prototypeColumnConfig} />
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
                      !searchedValueType || row.User_Text2.toString().toLowerCase().includes(searchedValueArea.toString().toLowerCase())
                    )
                    .filter((row) => {
                      if (!searchedValueStatus) { return true; }
                      if (!row || !row.dataValues || !row.dataValues.jobStatus) { return false; }

                      return row.dataValues.jobStatus.toString().toLowerCase().includes(searchedValueStatus.toString().toLowerCase())
                    })
                    .map((job, index) => {
                      if (job.dataValues.jobStatus == 'PROTO') {
                        rowIndex++;
                        return (
                          <TableRow key={index} sx={{ backgroundColor: rowIndex % 2 === 0 ? '#f0f0f0' : '#fff' }}>
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
                      }
                    })
                  }
                </TableBody>
              </Table>
            </TableContainer>

            <RefreshButton onClick={fetchData} />
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