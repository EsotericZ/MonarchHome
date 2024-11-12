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
import updateFormStatus from '../../services/forming/updateFormStatus';
import updateFormProgrammer from '../../services/forming/updateFormProgrammer';

export const FormingProg = () => {
  const { cookieData } = useUserContext();
  const [searchedValueJobNo, setSearchedValueJobNo] = useState('');
  const [searchedValuePartNo, setSearchedValuePartNo] = useState('');
  const [searchedValueCustomer, setSearchedValueCustomer] = useState('');
  const [searchedValueType, setSearchedValueType] = useState('');
  const [searchedValueEngineer, setSearchedValueEngineer] = useState('');
  const [searchedValueProgrammer, setSearchedValueProgrammer] = useState('');
  const [searchedValueStatus, setSearchedValueStatus] = useState('');
  const [searchedValueArea, setSearchedValueArea] = useState('');
  const [showToast, setShowToast] = useState(false);
  const [partCopy, setPartCopy] = useState('None');

  const [searchedEng, setSearchedEng] = useState([]);
  const [searchedTBR, setSearchedTBR] = useState([]);
  const [searchedFuture, setSearchedFuture] = useState([]);
  const [formingUsers, setFormingUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedTab, setSelectedTab] = useState(0);

  const [dropdownTBRTitles, setDropdownTBRTitles] = useState({});
  const [dropdownFutureTitles, setDropdownFutureTitles] = useState({});
  const [dropdownTBRStatuses, setDropdownTBRStatuses] = useState({});
  const [dropdownFutureStatuses, setDropdownFutureStatuses] = useState({});

  const [tbr, setTbr] = useState('');
  const [future, setFuture] = useState('');
  const [BDTest, setBDTest] = useState('');

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

      let bdCount = ((allRes.filter(row => (typeof row.JobNo !== 'undefined' && row.dataValues.formStatus == 'BD TEST'))).length);
      (bdCount > 0) ? setBDTest(`BD Test (${bdCount})`) : setBDTest('BD Test');

      let tbrCount = ((tbrRes.filter(row => (typeof row.JobNo !== 'undefined' && row.dataValues.jobStatus == 'FORMING'))).length);
      (tbrCount > 0) ? setTbr(`TBR (${tbrCount})`) : setTbr('TBR');

      let futureCount = ((futureRes.filter(row => (typeof row.JobNo !== 'undefined' && row.dataValues.jobStatus == 'FORMING'))).length);
      (futureCount > 0) ? setFuture(`Future (${futureCount})`) : setFuture('Future');

      setFormingUsers(userRes.data.filter(user => user.forming).map(user => user.name.split(' ')[0]));
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  const handleTBRFormProgrammer = async (job, formProgrammer) => {
    setDropdownTBRTitles(prevState => ({
      ...prevState,
      [job.JobNo]: formProgrammer
    }));
    try {
      await updateFormProgrammer(job.dataValues.jobNo, formProgrammer);
      const res = await getTBRJobs();
      setSearchedTBR(res);
    } catch (err) {
      console.log(err);
    }
  }

  const handleTBRJobStatus = async (job, formStatus) => {
    setDropdownTBRStatuses(prevState => ({
      ...prevState,
      [job.JobNo]: formStatus
    }));
    try {
      await updateFormStatus(job.dataValues.jobNo, formStatus);
      const res = await getTBRJobs();
      setSearchedTBR(res);
    } catch (err) {
      console.log(err);
    }
  }

  const handleFutureFormProgrammer = async (job, formProgrammer) => {
    setDropdownFutureTitles(prevState => ({
      ...prevState,
      [job.JobNo]: formProgrammer
    }));
    try {
      await updateFormProgrammer(job.dataValues.jobNo, formProgrammer);
      const res = await getFutureJobs();
      setSearchedFuture(res);
    } catch (err) {
      console.log(err);
    }
  }

  const handleFutureJobStatus = async (job, formStatus) => {
    setDropdownFutureStatuses(prevState => ({
      ...prevState,
      [job.JobNo]: formStatus
    }));
    try {
      await updateFormStatus(job.dataValues.jobNo, formStatus);
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

  const bdTestColumnConfig = [
    { label: 'Job No', width: '8%', isSearchable: true, value: searchedValueJobNo, onChange: (e) => setSearchedValueJobNo(e.target.value), placeholder: 'Job No' },
    { label: 'Part No', width: '20%', isSearchable: true, value: searchedValuePartNo, onChange: (e) => setSearchedValuePartNo(e.target.value), placeholder: 'Part No' },
    { label: 'Revision', width: '8%', isSearchable: false },
    { label: 'Qty', width: '8%', isSearchable: false },
    { label: 'Due Date', width: '8%', isSearchable: false },
    { label: 'Customer', width: '10%', isSearchable: true, value: searchedValueCustomer, onChange: (e) => setSearchedValueCustomer(e.target.value), placeholder: 'Customer' },
    { label: 'Type', width: '8%', isSearchable: true, value: searchedValueType, onChange: (e) => setSearchedValueType(e.target.value), placeholder: 'Type' },
    { label: 'Area', width: '10%', isSearchable: true, value: searchedValueArea, onChange: (e) => setSearchedValueArea(e.target.value), placeholder: 'Area' },
    { label: 'Notes', width: '20%', isSearchable: false },
  ];

  return (
    <PageContainer loading={loading} title='Forming'>
      <CustomTabs
        selectedTab={selectedTab}
        handleTabChange={handleTabChange}
        tabLabels={[tbr, future, BDTest]}
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
                      if (!row || !row.dataValues || !row.dataValues.formProgrammer) { return false; }

                      return row.dataValues.formProgrammer.toString().toLowerCase().includes(searchedValueProgrammer.toString().toLowerCase())
                    })
                    .filter((row) => {
                      if (!searchedValueStatus) { return true; }
                      if (!row || !row.dataValues || !row.dataValues.formStatus) { return false; }

                      return row.dataValues.formStatus.toString().toLowerCase().includes(searchedValueStatus.toString().toLowerCase())
                    })
                    .map((job, index) => {
                      if (job.dataValues.jobStatus == 'FORMING') {
                        const rowClass = job.WorkCode == 'HOT' ? 'expedite-row' : '';
                        const dropdownTBRTitle = dropdownTBRTitles[job.JobNo] || job.dataValues.formProgrammer;
                        const dropdownTBRStatus = dropdownTBRStatuses[job.JobNo] || job.dataValues.formStatus;
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

                            {cookieData.forming ?
                              <DataTableCell>
                                <FormControl variant='standard' fullWidth>
                                  <CustomSelect
                                    value={dropdownTBRTitle}
                                    onChange={(e) => handleTBRFormProgrammer(job, e.target.value)}
                                  >
                                    {formingUsers.map((user, n) => (
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
                              <DataTableCell>{job.dataValues.formProgrammer}</DataTableCell>
                            }

                            {cookieData.forming ?
                              <DataTableCell>
                                <FormControl variant='standard' fullWidth>
                                  <CustomSelect
                                    value={dropdownTBRStatus}
                                    onChange={(e) => handleTBRJobStatus(job, e.target.value)}
                                  >
                                    <MenuItem value='WIP'>WIP</MenuItem>
                                    <MenuItem value='BD TEST'>BD TEST</MenuItem>
                                    <Divider />
                                    <MenuItem value='DONE'>DONE</MenuItem>
                                  </CustomSelect>
                                </FormControl>
                              </DataTableCell>
                              :
                              <DataTableCell>{job.dataValues.formStatus}</DataTableCell>
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
                      if (!row || !row.dataValues || !row.dataValues.formProgrammer) { return false; }

                      return row.dataValues.formProgrammer.toString().toLowerCase().includes(searchedValueProgrammer.toString().toLowerCase())
                    })
                    .filter((row) => {
                      if (!searchedValueStatus) { return true; }
                      if (!row || !row.dataValues || !row.dataValues.formStatus) { return false; }

                      return row.dataValues.formStatus.toString().toLowerCase().includes(searchedValueStatus.toString().toLowerCase())
                    })
                    .map((job, index) => {
                      if (job.User_Text3 != 'REPEAT' && job.User_Text2 != '6. OUTSOURCE' && job.dataValues.jobStatus == 'FORMING') {
                        const rowClass = job.WorkCode == 'HOT' ? 'expedite-row' : '';
                        const dropdownFutureTitle = dropdownFutureTitles[job.JobNo] || job.dataValues.formProgrammer;
                        const dropdownFutureStatus = dropdownFutureStatuses[job.JobNo] || job.dataValues.formStatus;
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

                            {cookieData.forming ?
                              <DataTableCell>
                                <FormControl variant='standard' fullWidth>
                                  <CustomSelect
                                    value={dropdownFutureTitle}
                                    onChange={(e) => handleFutureFormProgrammer(job, e.target.value)}
                                  >
                                    {formingUsers.map((user, n) => (
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
                              <DataTableCell>{job.dataValues.formProgrammer}</DataTableCell>
                            }

                            {cookieData.forming ?
                              <DataTableCell>
                                <FormControl variant='standard' fullWidth>
                                  <CustomSelect
                                    value={dropdownFutureStatus}
                                    onChange={(e) => handleFutureJobStatus(job, e.target.value)}
                                  >
                                    <MenuItem value='WIP'>WIP</MenuItem>
                                    <MenuItem value='BD TEST'>BD TEST</MenuItem>
                                    <Divider />
                                    <MenuItem value='DONE'>DONE</MenuItem>
                                  </CustomSelect>
                                </FormControl>
                              </DataTableCell>
                              :
                              <DataTableCell>{job.dataValues.formStatus}</DataTableCell>
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

      {/* BD TEST */}

      <Box>
        {selectedTab === 2 && (
          <Box sx={{ padding: '12px' }}>
            <TableContainer component={Paper}>
              <Table>
                <TableHead>
                  <CustomHeader columns={bdTestColumnConfig} />
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
                      if (job.dataValues.jobStatus == 'FORMING' && job.dataValues.formStatus == 'BD TEST') {
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
                            <DataTableCell>{job.dataValues.notes}</DataTableCell>
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