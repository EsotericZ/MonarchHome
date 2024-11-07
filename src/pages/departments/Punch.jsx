import { useEffect, useState } from 'react';
import { Box, Typography } from '@mui/material';

import Cookies from 'universal-cookie';
import { jwtDecode } from 'jwt-decode';

import PuffLoader from 'react-spinners/PuffLoader';

import AddModal from '../../components/departments/AddModal';
import AllJobsTable from '../../components/departments/AllJobsTable';
import AllMaterialsModal from '../../components/departments/AllMaterialsModal';
import CompleteModal from '../../components/departments/CompleteModal';
import DepartmentTabs from '../../components/departments/DepartmentTabs';
import EditModal from '../../components/departments/EditModal';
import MaterialTable from '../../components/departments/MaterialTable';
import NestTable from '../../components/departments/NestTable';
import ProgramTable from '../../components/departments/ProgramTable';

import getTBRJobs from '../../services/punch/getTBRJobs';
import getFRJobs from '../../services/punch/getFRJobs';
import createMaterial from '../../services/material/createMaterial';
import getAllPunchMaterials from '../../services/material/getAllPunchMaterials';
import updateMaterial from '../../services/material/updateMaterial';
import updateCheck from '../../services/material/updateCheck';
import updateComplete from '../../services/material/updateComplete';
import updateNeed from '../../services/material/updateNeed';
import updateVerified from '../../services/material/updateVerified';

export const Punch = () => {
  const cookies = new Cookies();
  let cookieData
  try {
    cookieData = jwtDecode(cookies.get('jwt'));
  } catch {
    cookieData = {
      'name': '',
      'role': 'employee',
      'punch': false,
    };
  }

  const [jobId, setJobId] = useState(0);
  const [selectedJob, setSelectedJob] = useState(null);
  const [update, setUpdate] = useState('');
  const [showToast, setShowToast] = useState(false);
  const [partCopy, setPartCopy] = useState('None');

  const [searchedTBR, setSearchedTBR] = useState([]);
  const [searchedFR, setSearchedFR] = useState([]);
  const [searchedPunchPrograms, setSearchedPunchPrograms] = useState([]);
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
  const [machine, setMachine] = useState('punch');
  const [id, setId] = useState(0);
  
  const [searchedValues, setSearchedValues] = useState({
    jobNo: '',
    partNo: '',
    customer: '',
    type: '',
    material: '',
    programNo: '',
  });

  const fetchData = async () => {
    try {
      const [tbrJobs, frJobs, punchMaterials] = await Promise.all([
        getTBRJobs(),
        getFRJobs(),
        getAllPunchMaterials()
      ]);

      setSearchedTBR(tbrJobs);
      setSearchedFR(frJobs);
      setSearchedPunchPrograms(punchMaterials.data);

      const uniq = [...new Set(punchMaterials.data.flatMap(job => job.jobNo.length > 6 ? job.jobNo.split(' ') : job.jobNo))];

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
      await createMaterial(programNo, material, jobNo, 'punch', 'punch')
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
          <Typography variant='h4' sx={{ fontWeight: 'bold', margin: '16px' }}>Punch</Typography>
          <Box sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', marginTop: '100px' }}>
            <PuffLoader color='red' />
          </Box>
        </Box>
      ) : (
        <Box sx={{ width: '100%' }}>
          <Typography variant='h4' sx={{ fontWeight: 'bold', margin: '16px' }}>Punch</Typography>

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
            areaName='Punch'
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
            areaName='Punch'
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
          
          <NestTable
            cookieData={cookieData}
            cookieDataKey='punch'
            handleMaterialsOpen={handleMaterialsOpen}
            needsNestingFuture={needsNestingFuture}
            needsNestingTBR={needsNestingTBR}
            onAddClick={handleShow}
            onCloseSnackbar={() => setShowToast(false)}
            onRefresh={fetchData}
            partCopy={partCopy}
            searchedValues={searchedValues}
            selectedTab={selectedTab}
            setPartCopy={setPartCopy}
            setSearchedValues={setSearchedValues}
            setShowToast={setShowToast}
            showToast={showToast}
          />

          <MaterialTable
            cookieData={cookieData}
            cookieDataKey='punch'
            handleUpdateJob={handleUpdateJob}
            onAddClick={handleShow}
            onRefresh={fetchData}
            searchedPrograms={searchedPunchPrograms}
            searchedValues={searchedValues}
            selectedTab={selectedTab}
            setSearchedValues={setSearchedValues}
            toggleCheck={toggleCheck}
            toggleNeed={toggleNeed}
            toggleVerified={toggleVerified}
          />

          <ProgramTable
            cookieData={cookieData}
            cookieDataKey='punch'
            handleUpdateJob={handleUpdateJob}
            handleShowComplete={handleShowComplete}
            onAddClick={handleShow}
            onRefresh={fetchData}
            searchedPrograms={searchedPunchPrograms}
            searchedValues={searchedValues}
            selectedTab={selectedTab}
            setSearchedValues={setSearchedValues}
          />

          <AllJobsTable
            cookieData={cookieData}
            cookieDataKey='punch'
            handleMaterialsOpen={handleMaterialsOpen}
            onAddClick={handleShow}
            onCloseSnackbar={() => setShowToast(false)}
            onRefresh={fetchData}
            partCopy={partCopy}
            searchedFR={searchedFR}
            searchedTBR={searchedTBR}
            searchedValues={searchedValues}
            selectedTab={selectedTab}
            setPartCopy={setPartCopy}
            setSearchedValues={setSearchedValues}
            setShowToast={setShowToast}
            showToast={showToast}
          />
        </Box>
      )}
    </Box>
  );
}