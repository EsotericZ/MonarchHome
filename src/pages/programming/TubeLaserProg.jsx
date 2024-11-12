import { useEffect, useState } from 'react';
import { Box, Divider, FormControl, MenuItem, Paper, Table, TableBody, TableContainer, TableHead, TableRow } from '@mui/material';

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
import updateTLStatus from '../../services/tlaser/updateTLStatus';
import updateTLProgrammer from '../../services/tlaser/updateTLProgrammer';

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

  let rowIndex = 0;

  const tbrFutureColumnConfig = [
    { label: 'Job No', width: '7%', isSearchable: true, value: searchedValueJobNo, onChange: (e) => setSearchedValueJobNo(e.target.value), placeholder: 'Job No' },
    { label: 'Part No', width: '20%', isSearchable: true, value: searchedValuePartNo, onChange: (e) => setSearchedValuePartNo(e.target.value), placeholder: 'Part No' },
    { label: 'Revision', width: '6%', isSearchable: false },
    { label: 'Qty', width: '6%', isSearchable: false },
    { label: 'Due Date', width: '7%', isSearchable: false },
    { label: 'Customer', width: '10%', isSearchable: true, value: searchedValueCustomer, onChange: (e) => setSearchedValueCustomer(e.target.value), placeholder: 'Customer' },
    { label: 'Type', width: '7%', isSearchable: true, value: searchedValueType, onChange: (e) => setSearchedValueType(e.target.value), placeholder: 'Type' },
    { label: 'Engineer', width: '10%', isSearchable: true, value: searchedValueEngineer, onChange: (e) => setSearchedValueEngineer(e.target.value), placeholder: 'Engineer' },
    { label: 'Programmer', width: '10%', isSearchable: true, value: searchedValueProgrammer, onChange: (e) => setSearchedValueProgrammer(e.target.value), placeholder: 'Programmer' },
    { label: 'Status', width: '10%', isSearchable: true, value: searchedValueStatus, onChange: (e) => setSearchedValueStatus(e.target.value), placeholder: 'Status' },
  ];

  return (
    <PageContainer loading={loading} title='Tube Laser'>
      <CustomTabs
        selectedTab={selectedTab}
        handleTabChange={handleTabChange}
        tabLabels={[tbr, future]}
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
                      if (!searchedValueProgrammer) { return true; }
                      if (!row || !row.dataValues || !row.dataValues.tlProgrammer) { return false; }

                      return row.dataValues.tlProgrammer.toString().toLowerCase().includes(searchedValueProgrammer.toString().toLowerCase())
                    })
                    .filter((row) => {
                      if (!searchedValueStatus) { return true; }
                      if (!row || !row.dataValues || !row.dataValues.tlStatus) { return false; }

                      return row.dataValues.tlStatus.toString().toLowerCase().includes(searchedValueStatus.toString().toLowerCase())
                    })
                    .map((job, index) => {
                      if (job.dataValues.jobStatus == 'TLASER') {
                        const rowClass = job.WorkCode == 'HOT' ? 'expedite-row' : '';
                        const dropdownTBRTitle = dropdownTBRTitles[job.JobNo] || job.dataValues.tlProgrammer;
                        const dropdownTBRStatus = dropdownTBRStatuses[job.JobNo] || job.dataValues.tlStatus;
                        rowIndex++;
                        return (
                          <TableRow key={index} sx={{ backgroundColor: rowIndex % 2 === 0 ? '#f0f0f0' : '#fff' }} className={`${rowClass}`}>
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

                            {cookieData.tlaser ?
                              <DataTableCell>
                                <FormControl variant='standard' fullWidth>
                                  <CustomSelect
                                    value={dropdownTBRTitle}
                                    onChange={(e) => handleTBRTLProgrammer(job, e.target.value)}
                                  >
                                    {tlaserUsers.map((user, n) => (
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
                              <DataTableCell>{job.dataValues.tlProgrammer}</DataTableCell>
                            }

                            {cookieData.tlaser ?
                              <DataTableCell>
                                <FormControl variant='standard' fullWidth>
                                  <CustomSelect
                                    value={dropdownTBRStatus}
                                    onChange={(e) => handleTBRJobStatus(job, e.target.value)}
                                  >
                                    <MenuItem value='WIP'>WIP</MenuItem>
                                    <MenuItem value=''>NONE</MenuItem>
                                    <Divider />
                                    <MenuItem value='DONE'>DONE</MenuItem>
                                  </CustomSelect>
                                </FormControl>
                              </DataTableCell>
                              :
                              <DataTableCell>{job.dataValues.tlStatus}</DataTableCell>
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
                      if (!searchedValueProgrammer) { return true; }
                      if (!row || !row.dataValues || !row.dataValues.tlProgrammer) { return false; }

                      return row.dataValues.tlProgrammer.toString().toLowerCase().includes(searchedValueProgrammer.toString().toLowerCase())
                    })
                    .filter((row) => {
                      if (!searchedValueStatus) { return true; }
                      if (!row || !row.dataValues || !row.dataValues.tlStatus) { return false; }

                      return row.dataValues.tlStatus.toString().toLowerCase().includes(searchedValueStatus.toString().toLowerCase())
                    })
                    .map((job, index) => {
                      if (job.User_Text3 != 'REPEAT' && job.User_Text2 != '6. OUTSOURCE' && job.dataValues.jobStatus == 'TLASER') {
                        const rowClass = job.WorkCode == 'HOT' ? 'expedite-row' : '';
                        const dropdownFutureTitle = dropdownFutureTitles[job.JobNo] || job.dataValues.tlProgrammer;
                        const dropdownFutureStatus = dropdownFutureStatuses[job.JobNo] || job.dataValues.tlStatus;
                        rowIndex++;
                        return (
                          <TableRow key={index} sx={{ backgroundColor: rowIndex % 2 === 0 ? '#f0f0f0' : '#fff' }} className={`${rowClass}`}>
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

                            {cookieData.tlaser ?
                              <DataTableCell>
                                <FormControl variant='standard' fullWidth>
                                  <CustomSelect
                                    value={dropdownFutureTitle}
                                    onChange={(e) => handleFutureTLProgrammer(job, e.target.value)}
                                  >
                                    {tlaserUsers.map((user, n) => (
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
                              <DataTableCell>{job.dataValues.tlProgrammer}</DataTableCell>
                            }

                            {cookieData.tlaser ?
                              <DataTableCell>
                                <FormControl variant='standard' fullWidth>
                                  <CustomSelect
                                    value={dropdownFutureStatus}
                                    onChange={(e) => handleFutureJobStatus(job, e.target.value)}
                                  >
                                    <MenuItem value='WIP'>WIP</MenuItem>
                                    <MenuItem value=''>NONE</MenuItem>
                                    <Divider />
                                    <MenuItem value='DONE'>DONE</MenuItem>
                                  </CustomSelect>
                                </FormControl>
                              </DataTableCell>
                              :
                              <DataTableCell>{job.dataValues.tlStatus}</DataTableCell>
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
    </PageContainer>
  );
}