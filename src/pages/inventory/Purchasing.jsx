import { useEffect, useState } from 'react';
import { Box, IconButton, Paper, Table, TableBody, TableContainer, TableHead, TableRow } from '@mui/material';
import { format, parseISO } from 'date-fns';
import CheckIcon from '@mui/icons-material/Check';
import DatePicker from 'react-datepicker';
import UpdateIcon from '@mui/icons-material/Update';

import { useUserContext } from '../../context/UserContext';

import CustomTabs from '../../components/shared/CustomTabs';
import DataTableCell from '../../components/shared/DataTableCell';
import PageContainer from '../../components/shared/PageContainer';
import PurchasingTable from '../../components/inventory/PurchasingTable';
import SearchTableCell from '../../components/shared/SearchTableCell';
import StandardTableCell from '../../components/shared/StandardTableCell';
import RefreshButton from '../../components/shared/RefreshButton';

import getAllMaterials from '../../services/material/getAllMaterials';
import getAllSupplies from '../../services/supplies/getAllSupplies';
import updateNeed from '../../services/material/updateNeed';
import updateOnOrder from '../../services/material/updateOnOrder';
import updateVerified from '../../services/material/updateVerified';
import updateOnOrderSupplies from '../../services/supplies/updateOnOrderSupplies';
import updateRecieved from '../../services/supplies/updateRecieved';
import updateSuppliesDate from '../../services/supplies/updateSuppliesDate';
import updateMaterialsDate from '../../services/material/updateMaterialsDate';

export const Purchasing = () => {
  const { cookieData } = useUserContext();
  const [loading, setLoading] = useState(true);
  const [selectedTab, setSelectedTab] = useState(0);

  const [searchedValueArea, setSearchedValueArea] = useState('');
  const [searchedValueEmployee, setSearchedValueEmployee] = useState('');
  const [searchedValueJobNo, setSearchedValueJobNo] = useState('');
  const [searchedValueMaterial, setSearchedValueMaterial] = useState('');
  const [searchedValueProgramNo, setSearchedValueProgramNo] = useState('');
  const [searchedValueSupplies, setSearchedValueSupplies] = useState('');
  const [update, setUpdate] = useState('');

  const [searchedPrograms, setSearchedPrograms] = useState([]);
  const [searchedSupplies, setSearchedSupplies] = useState([]);

  const [lasers, setLasers] = useState('');
  const [saws, setSaws] = useState('');
  const [punch, setPunch] = useState('');
  const [supplies, setSupplies] = useState('');
  const [selectedDates, setSelectedDates] = useState({});
  const [selectedDatesMaterial, setSelectedDatesMaterial] = useState({});

  const fetchData = async () => {
    try {
      const [allMaterials, allSupplies] = await Promise.all([
        getAllMaterials(),
        getAllSupplies()
      ]);

      setSearchedPrograms(allMaterials.data);
      setSearchedSupplies(allSupplies.data);

      let laserCount = allMaterials.data.filter(row => ['laser', 'flaser', 'slaser'].includes(row.area)).length;
      setLasers(laserCount > 0 ? `Lasers (${laserCount})` : 'Lasers');

      let sawCount = allMaterials.data.filter(row => ['saw', 'tlaser'].includes(row.area)).length;
      setSaws(sawCount > 0 ? `Saw / Tube Laser (${sawCount})` : 'Saw / Tube Laser');

      let punchCount = allMaterials.data.filter(row => ['punch', 'shear'].includes(row.area)).length;
      setPunch(punchCount > 0 ? `Shear / Punch (${punchCount})` : 'Shear / Punch');

      let suppliesCount = allSupplies.data.length;
      setSupplies(suppliesCount > 0 ? `Supplies (${suppliesCount})` : 'Supplies');

    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleDateChangeMaterial = async (id, date) => {
    setSelectedDatesMaterial(prevState => ({
      ...prevState,
      [id]: date,
    }));
    try {
      await updateMaterialsDate(id, date);
    } catch (err) {
      console.error(err);
    }
  };

  const handleDateChange = async (id, date) => {
    setSelectedDates(prevState => ({
      ...prevState,
      [id]: date,
    }));
    try {
      await updateSuppliesDate(id, date);
    } catch (err) {
      console.error(err);
    }
  };

  const toggleNeed = async (job) => {
    try {
      await updateNeed(job.id);
      setUpdate(`Need Matl ${job.id}`);
    } catch (err) {
      console.log(err);
    }
  };

  const toggleOnOrder = async (job) => {
    try {
      await updateOnOrder(job.id);
      setUpdate(`On Order ${job.id}`);
    } catch (err) {
      console.log(err);
    }
  };

  const toggleVerified = async (job) => {
    try {
      await updateVerified(job.id);
      setUpdate(`Verified ${job.id}`);
    } catch (err) {
      console.log(err);
    }
  };

  const toggleOnOrderSupplies = async (item) => {
    try {
      await updateOnOrderSupplies(item.id);
      setUpdate(`On Order ${item.id}`);
    } catch (err) {
      console.log(err);
    }
  };

  const toggleCompleteSupplies = async (item) => {
    try {
      await updateRecieved(item.id);
      setUpdate(`Recieved ${item.id}`);
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
    const interval = setInterval(() => {
      fetchData();
    }, 30000);
    return () => clearInterval(interval);
  }, []);

  return (
    <PageContainer loading={loading} title='Purchasing'>
      <CustomTabs
        selectedTab={selectedTab}
        handleTabChange={handleTabChange}
        tabLabels={[lasers, saws, punch, supplies]}
      />

      {selectedTab == 0 && (
        <PurchasingTable 
          data={searchedPrograms}
          areaFilters={['laser', 'slaser', 'flaser']}
          areaName={['Laser', 'Static Laser', 'Fixture Laser']}
          searchedValueProgramNo={searchedValueProgramNo}
          setSearchedValueProgramNo={setSearchedValueProgramNo}
          searchedValueMaterial={searchedValueMaterial}
          setSearchedValueMaterial={setSearchedValueMaterial}
          searchedValueJobNo={searchedValueJobNo}
          setSearchedValueJobNo={setSearchedValueJobNo}
          handleDateChange={handleDateChangeMaterial}
          selectedDatesMaterial={selectedDatesMaterial}
          toggleNeed={toggleNeed}
          toggleOnOrder={toggleOnOrder}
          toggleVerified={toggleVerified}
          cookieData={cookieData}
        />
      )}

      {selectedTab == 1 && (
        <PurchasingTable 
          data={searchedPrograms}
          areaFilters={['tlaser', 'saw']}
          areaName={['Tube Laser', 'Saw']}
          searchedValueProgramNo={searchedValueProgramNo}
          setSearchedValueProgramNo={setSearchedValueProgramNo}
          searchedValueMaterial={searchedValueMaterial}
          setSearchedValueMaterial={setSearchedValueMaterial}
          searchedValueJobNo={searchedValueJobNo}
          setSearchedValueJobNo={setSearchedValueJobNo}
          handleDateChange={handleDateChangeMaterial}
          selectedDatesMaterial={selectedDatesMaterial}
          toggleNeed={toggleNeed}
          toggleOnOrder={toggleOnOrder}
          toggleVerified={toggleVerified}
          cookieData={cookieData}
        />
      )}

      {selectedTab == 2 && (
        <PurchasingTable 
          data={searchedPrograms}
          areaFilters={['shear', 'punch']}
          areaName={['Shear', 'Punch']}
          searchedValueProgramNo={searchedValueProgramNo}
          setSearchedValueProgramNo={setSearchedValueProgramNo}
          searchedValueMaterial={searchedValueMaterial}
          setSearchedValueMaterial={setSearchedValueMaterial}
          searchedValueJobNo={searchedValueJobNo}
          setSearchedValueJobNo={setSearchedValueJobNo}
          handleDateChange={handleDateChangeMaterial}
          selectedDatesMaterial={selectedDatesMaterial}
          toggleNeed={toggleNeed}
          toggleOnOrder={toggleOnOrder}
          toggleVerified={toggleVerified}
          cookieData={cookieData}
        />
      )}

      <Box>
        {selectedTab == 3 && (
          <Box sx={{ padding: '12px' }}>
            <TableContainer component={Paper}>
              <Table>
                <TableHead>
                  <TableRow>
                    <SearchTableCell 
                      width='15%'
                      placeholder='Supplies'
                      value={searchedValueSupplies}
                      onChange={(e) => setSearchedValueSupplies(e.target.value)}
                    />
                    <SearchTableCell 
                      width='8%'
                      placeholder='Area'
                      value={searchedValueArea}
                      onChange={(e) => setSearchedValueArea(e.target.value)}
                    />
                    <SearchTableCell 
                      width='8%'
                      placeholder='Requested By'
                      value={searchedValueEmployee}
                      onChange={(e) => setSearchedValueEmployee(e.target.value)}
                    />
                    <StandardTableCell width='8%'>Created</StandardTableCell>
                    <StandardTableCell width='15%'>Description</StandardTableCell>
                    <StandardTableCell width='14%'>Link</StandardTableCell>
                    <SearchTableCell 
                      width='8%'
                      placeholder='Job No'
                      value={searchedValueJobNo}
                      onChange={(e) => setSearchedValueJobNo(e.target.value)}
                    />
                    {cookieData.purchasing &&
                      <>
                        <StandardTableCell width='8%'>On Order</StandardTableCell>
                        <StandardTableCell width='8%'>Expected</StandardTableCell>
                        <StandardTableCell width='8%'>Verified</StandardTableCell>
                      </>
                    }
                  </TableRow>
                </TableHead>
                <TableBody>
                  {searchedSupplies
                    .filter((row) => 
                      !searchedValueSupplies || 
                      row.supplies.toString().toLowerCase().includes(searchedValueSupplies.toString().toLowerCase())
                    )
                    .filter((row) => 
                      !searchedValueArea || 
                      row.department.toString().toLowerCase().includes(searchedValueArea.toString().toLowerCase())
                    )
                    .filter((row) => 
                      !searchedValueEmployee || 
                      row.requestedBy.toString().toLowerCase().includes(searchedValueEmployee.toString().toLowerCase())
                    )
                    .filter((row) => 
                      !searchedValueJobNo || 
                      row.jobNo.toString().toLowerCase().includes(searchedValueJobNo.toString().toLowerCase())
                    )
                    .map((item, index) => {
                      return (
                        <TableRow key={index} sx={{ backgroundColor: index % 2 === 0 ? '#f0f0f0' : '#fff' }}>
                          <DataTableCell>{item.supplies}</DataTableCell>
                          <DataTableCell>{item.department}</DataTableCell>
                          <DataTableCell>{item.requestedBy}</DataTableCell>
                          <DataTableCell>{item.createdAt && format(parseISO(item.createdAt), 'MM/dd h:mmb')}</DataTableCell>
                          <DataTableCell>{item.notes}</DataTableCell>
                          <DataTableCell>{item.productLink}</DataTableCell>
                          <DataTableCell>{item.jobNo}</DataTableCell>
                          {cookieData.purchasing &&
                            <>
                              <DataTableCell padding={0}>
                                <IconButton onClick={() => toggleOnOrderSupplies(item)}>
                                  {item.onOrder && <CheckIcon sx={{ fontSize: '20px', fontWeight: 'bold' }} />}
                                </IconButton>
                              </DataTableCell>
                              <DataTableCell>
                                <DatePicker
                                  selected={selectedDates[item.id] || (item.expected ? new Date(item.expected + 'T00:00:00') : null)}
                                  onChange={(date) => {
                                    handleDateChange(item.id, date)
                                  }}
                                  dateFormat='MM/dd'
                                  className='custom-date-picker'
                                />
                              </DataTableCell>
                              <DataTableCell padding={0}>
                                <IconButton onClick={() => toggleCompleteSupplies(item)}>
                                  <UpdateIcon sx={{ fontSize: '20px', fontWeight: 'bold' }} />
                                </IconButton>
                              </DataTableCell>
                            </>
                          }
                        </TableRow>
                      )
                    })
                  }
                </TableBody>
              </Table>
            </TableContainer>
            <RefreshButton onClick={fetchData} />
          </Box>
        )}
      </Box>
    </PageContainer >
  );
};