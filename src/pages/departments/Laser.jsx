import { useEffect, useState } from 'react';
import { useUserContext } from '../../context/UserContext';

import AddModal from '../../components/departments/AddModal';
import AllJobsTable from '../../components/departments/AllJobsTable';
import AllMaterialsModal from '../../components/departments/AllMaterialsModal';
import CompleteModal from '../../components/departments/CompleteModal';
import CustomTabs from '../../components/shared/CustomTabs';
import EditModal from '../../components/departments/EditModal';
import MaterialTable from '../../components/departments/MaterialTable';
import NestTable from '../../components/departments/NestTable';
import PageContainer from '../../components/shared/PageContainer';
import ProgramTable from '../../components/departments/ProgramTable';

import getTBRJobs from '../../services/laser/getTBRJobs';
import getFRJobs from '../../services/laser/getFRJobs';
import createMaterial from '../../services/material/createMaterial';
import getAllLaserMaterials from '../../services/material/getAllLaserMaterials';
import getCompletedLaserMaterials from '../../services/material/getCompletedLaserMaterials';
import updateMaterial from '../../services/material/updateMaterial';
import updateCheck from '../../services/material/updateCheck';
import updateComplete from '../../services/material/updateComplete';
import updateNeed from '../../services/material/updateNeed';
import updateVerified from '../../services/material/updateVerified';

export const Laser = () => {
  const { cookieData } = useUserContext();
  const [jobId, setJobId] = useState(0);
  const [selectedJob, setSelectedJob] = useState(null);
  const [update, setUpdate] = useState('');
  const [showToast, setShowToast] = useState(false);
  const [partCopy, setPartCopy] = useState('None');

  const [searchedTBR, setSearchedTBR] = useState([]);
  const [searchedFR, setSearchedFR] = useState([]);
  const [searchedLaserPrograms, setSearchedLaserPrograms] = useState([]);
  const [searchedCompletedLaserPrograms, setSearchedCompletedLaserPrograms] = useState([]);
  const [needsNestingTBR, setNeedsNestingTBR] = useState([]);
  const [needsNestingFuture, setNeedsNestingFuture] = useState([]);
  const [tbrLaserOnly, setTbrLaserOnly] = useState([]);
  const [tbrLaserCompleted, setTbrLaserCompleted] = useState([]);
  const [futureLaserCompleted, setFutureLaserCompleted] = useState([]);
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
  const [machine, setMachine] = useState('laser');
  const [id, setId] = useState(0);

  const [searchedValues, setSearchedValues] = useState({
    jobNo: '',
    partNo: '',
    customer: '',
    type: '',
    material: '',
    programNo: '',
  });

  // const fetchData = async () => {
  //   try {
  //     const [tbrJobs, frJobs, laserMaterials, completedLaser] = await Promise.all([
  //       getTBRJobs(),
  //       getFRJobs(),
  //       getAllLaserMaterials(),
  //       getCompletedLaserMaterials()
  //     ]);

  //     setSearchedTBR(tbrJobs);
  //     setSearchedFR(frJobs);
  //     setSearchedLaserPrograms(laserMaterials.data);
  //     console.log(laserMaterials.data)
  //     console.log(completedLaser.data)

  //     const uniq = [...new Set(laserMaterials.data.flatMap(job => job.jobNo.length > 6 ? job.jobNo.split(' ') : job.jobNo))];

  //     if (uniq.length > 0) {
  //       let tbrJobsNeeded = tbrJobs.filter(job => !uniq.includes(job.JobNo))
  //       setNeedsNestingTBR(tbrJobsNeeded);

  //       let futureJobsNeeded = frJobs.filter(job => !uniq.includes(job.JobNo))
  //       setNeedsNestingFuture(futureJobsNeeded);
  //     } else {
  //       setNeedsNestingTBR(tbrJobs);
  //       setNeedsNestingFuture(frJobs);
  //     }

  //     setLoading(false);
  //   } catch (err) {
  //     console.error(err);
  //   } finally {
  //     setLoading(false);
  //   }
  // }
const fetchData = async () => {
  try {
    const [tbrJobs, frJobs, laserMaterials, completedLaser] = await Promise.all([
      getTBRJobs(),
      getFRJobs(),
      getAllLaserMaterials(),
      getCompletedLaserMaterials()
    ]);

    setSearchedTBR(tbrJobs);
    setSearchedFR(frJobs);
    setSearchedLaserPrograms(laserMaterials.data);

    // --- Normalize helpers ---
    const splitNos = (s) => {
      if (!s) return [];
      const str = String(s);
      const parts = str.length > 6 ? str.split(' ') : [str];
      return parts.map(v => String(v).trim()).filter(Boolean);
    };

    const toJobNoSet = (arr) =>
      new Set(arr.flatMap(job => splitNos(job.jobNo)));

    const laserSet = toJobNoSet(laserMaterials.data);
    const completedSet = toJobNoSet(completedLaser.data);

    const hasLaser = (job) => laserSet.has(String(job.JobNo).trim());
    const hasCompleted = (job) => completedSet.has(String(job.JobNo).trim());

    // ✅ KEEP THESE EXACTLY AS THEY ARE
    const needsNestingTBR = tbrJobs.filter(job => !hasLaser(job) && !hasCompleted(job));
    const needsNestingFuture = frJobs.filter(job => !hasLaser(job) && !hasCompleted(job));
    const tbrLaserOnly = tbrJobs.filter(job => hasLaser(job) && !hasCompleted(job));

    // ✅ CLOCK JOBS UPDATED: all completed or flagged complete
    const isJobComplete = (job) => hasCompleted(job) || !!job.User_Date1;

    const tbrLaserCompleted = tbrJobs.filter(isJobComplete);
    const futureLaserCompleted = frJobs.filter(isJobComplete);

    // set states
    setNeedsNestingTBR(needsNestingTBR);
    setNeedsNestingFuture(needsNestingFuture);
    setTbrLaserOnly(tbrLaserOnly);
    setTbrLaserCompleted(tbrLaserCompleted);
    setFutureLaserCompleted(futureLaserCompleted);

    setLoading(false);
  } catch (err) {
    console.error(err);
  } finally {
    setLoading(false);
  }
};







  const handleClose = () => {
    setShow(false);
    setShowEdit(false);
  }

  const handleSave = async () => {
    try {
      await createMaterial(programNo, material, jobNo, 'laser', 'laser')
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
    setShowEdit(true);
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
    <PageContainer loading={loading} title='Laser'>
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
        areaName='Laser'
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
        areaName='Laser'
        onClose={handleClose}
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

      <CustomTabs
        selectedTab={selectedTab}
        handleTabChange={handleTabChange}
        tabLabels={['Run TBR', 'Ready to Nest', 'Material', 'Programs', 'Clock Jobs', 'All Jobs']}
      />

      {selectedTab === 0 && (
      <NestTable
        cookieData={cookieData}
        cookieDataKey='laser'
        handleMaterialsOpen={handleMaterialsOpen}
        needsNestingTBR={tbrLaserOnly}
        needsNestingFuture={[]}
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
      )}

{selectedTab === 1 && (
      <NestTable
        cookieData={cookieData}
        cookieDataKey='laser'
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
      )}

      {selectedTab === 2 && (
      <MaterialTable
        cookieData={cookieData}
        cookieDataKey='laser'
        handleUpdateJob={handleUpdateJob}
        onAddClick={handleShow}
        onRefresh={fetchData}
        searchedPrograms={searchedLaserPrograms}
        searchedValues={searchedValues}
        selectedTab={selectedTab}
        setSearchedValues={setSearchedValues}
        toggleCheck={toggleCheck}
        toggleNeed={toggleNeed}
        toggleVerified={toggleVerified}
      />
)}

      {selectedTab === 3 && (
      <ProgramTable
        cookieData={cookieData}
        cookieDataKey='laser'
        handleUpdateJob={handleUpdateJob}
        handleShowComplete={handleShowComplete}
        onAddClick={handleShow}
        onRefresh={fetchData}
        searchedPrograms={searchedLaserPrograms}
        searchedValues={searchedValues}
        selectedTab={selectedTab}
        setSearchedValues={setSearchedValues}
      />
      )}

      {selectedTab === 4 && (
      <NestTable
        cookieData={cookieData}
        cookieDataKey='laser'
        handleMaterialsOpen={handleMaterialsOpen}
        needsNestingTBR={tbrLaserCompleted}
        needsNestingFuture={futureLaserCompleted}
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
      )}

      {selectedTab === 5 && (
      <AllJobsTable
        cookieData={cookieData}
        cookieDataKey='laser'
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
      )}
    </PageContainer>
  );
}