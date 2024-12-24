import { useEffect, useState } from 'react';
import { Box, Typography } from '@mui/material';

import { useUserContext } from '../../context/UserContext';

import AddButton from '../../components/shared/AddButton';
import AddTaskModal from '../../components/tasks/AddTaskModal';
import CompleteModal from '../../components/tasks/CompleteModal';
import CustomTabs from '../../components/shared/CustomTabs';
import EditTaskModal from '../../components/tasks/EditTaskModal'
import NotesModal from '../../components/tasks/NotesModal';
import PageContainer from '../../components/shared/PageContainer';
import RefreshButton from '../../components/shared/RefreshButton';
import TaskCard from '../../components/tasks/TaskCard';
import TaskTable from '../../components/tasks/TaskTable';

import MaintenanceCard from '../../components/maintenance/MaintenanceCard';

import approveRequest from '../../services/maintenance/approveRequest';
import createRequest from '../../services/maintenance/createRequest';
import deleteRequest from '../../services/maintenance/deleteRequest';
import denyRequest from '../../services/maintenance/denyRequest';
import doneRequest from '../../services/maintenance/doneRequest';
import getAllEquipment from '../../services/maintenance/getAllEquipment';
import getAllRequests from '../../services/maintenance/getAllRequests';
import holdRequest from '../../services/maintenance/holdRequest';
import updateRequest from '../../services/maintenance/updateRequest';


export const Maintenance = () => {
  const { cookieData } = useUserContext();
  const [selectedTab, setSelectedTab] = useState(0);
  const [show, setShow] = useState(false);
  const [showCompleteModal, setShowCompleteModal] = useState(false);
  const [showEdit, setShowEdit] = useState(false);
  const [showNotesModal, setShowNotesModal] = useState(false);
  const [loading, setLoading] = useState(false);

  const [allUsers, setAllUsers] = useState([]);
  const [userTasks, setUserTasks] = useState([]);
  const [assignedBy, setAssignedBy] = useState('');
  const [assignedTo, setAssignedTo] = useState([]);
  const [taskName, setTaskName] = useState('');
  const [description, setDescription] = useState('');
  const [priority, setPriority] = useState('');
  const [status, setStatus] = useState('');
  const [id, setId] = useState(0);
  const [selectedTask, setSelectedTask] = useState(null);
  const [selectedCompletedTask, setSelectedCompletedTask] = useState(null);
  const [notes, setNotes] = useState([]);

  const [equipment, setEquipment] = useState([]);
  const [allRequests, setAllRequests] = useState([]);

  const [active, setActive] = useState('A');
  const [request, setRequest] = useState('R');
  const [hold, setHold] = useState('H');

  const handleClose = () => {
    setShow(false);
    setShowEdit(false);
  }

  // const handleSave = async () => {
  //   try {
  //     const assignedById = allUsers.find((user) => user.name === assignedBy)?.id;
  //     const assignedToIds = assignedTo.map(
  //       (name) => allUsers.find((user) => user.name === name)?.id
  //     );

  //     if (!assignedById || assignedToIds.includes(undefined)) {
  //       console.error('Invalid user mapping');
  //       return;
  //     }

  //     await createTask(assignedById, assignedToIds, taskName, description, priority, status);

  //     handleClose();
  //     fetchData();
  //   } catch (err) {
  //     console.error(err);
  //   }
  // };

  const handleShow = () => {
    setAssignedBy(cookieData.name);
    setAssignedTo([]);
    setTaskName('');
    setDescription('');
    setPriority('');
    setStatus('');
    setShow(true);
  };

  // const handleUpdateTask = (task) => {
  //   setId(task.id);
  //   setAssignedBy(task.assigner?.name || '');
  //   setAssignedTo(task.assignments?.map((assignment) => assignment.user.name) || []);
  //   setTaskName(task.taskName || '');
  //   setDescription(task.description || '');
  //   setPriority(task.priority || '');
  //   setStatus(task.status || '');
  //   setShowEdit(true);
  // };

  // const handleUpdate = async () => {
  //   try {
  //     await updateTask(id, assignedTo, taskName, description, priority, status);
  //     handleClose();
  //     fetchData();
  //   } catch (err) {
  //     console.error(err);
  //   }
  // };

  // const handleOpenNotesModal = (task) => {
  //   if (task) {
  //     setSelectedTask(task);
  //     setNotes(task.notes || []);
  //     setShowNotesModal(true);
  //   }
  // };

  // const handleAddNote = async (taskId, note) => {
  //   await createTaskNote(taskId, note, cookieData.id, new Date().toISOString());
  //   const newNote = { note, name: cookieData.name, date: new Date().toISOString() };
  //   setNotes((prevNotes) => [...prevNotes, newNote]);
  //   fetchData();
  // };

  // const handleCompleteTask = async (taskId) => {
  //   await completeTask(taskId);
  //   setShowNotesModal(false);
  //   fetchData();
  // };

  // const handleRowClick = (task) => {
  //   setSelectedCompletedTask(task);
  //   setShowCompleteModal(true);
  // };

  const fetchData = async () => {
    try {
      const [equipmentData, requestData] = await Promise.all([
        getAllEquipment(),
        getAllRequests(),
      ]);

      setEquipment(equipmentData || []);
      setAllRequests(requestData.data || []);

      let activeCount = requestData.data.filter(row => !row.done && !row.hold && row.approvedBy).length;
      setActive(activeCount > 0 ? `Active (${activeCount})` : 'Active');
      let requestCount = requestData.data.filter(row => !row.done && !row.hold && !row.approvedBy).length;
      setRequest(requestCount > 0 ? `Request (${requestCount})` : 'Request');
      let holdCount = requestData.data.filter(row => !row.done && row.hold).length;
      setHold(holdCount > 0 ? `Hold (${holdCount})` : 'Hold');
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleTabChange = (event, newValue) => {
    setSelectedTab(newValue);
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <PageContainer loading={loading} title='Maintenance'>
      <CustomTabs
        selectedTab={selectedTab}
        handleTabChange={handleTabChange}
        tabLabels={[active, request, hold, 'Completed']}
      />

      {selectedTab == 0 && (
        <Box
          sx={{
            padding: '12px',
            display: 'flex',
            flexWrap: 'wrap',
            justifyContent: 'center',
            gap: 1,
          }}
        >
          {allRequests.map((request, index) => {
            if (!request.done && !request.hold && request.approvedBy) {
              return (
                <MaintenanceCard
                  key={index}
                  maintenance={{
                    area: request.area || 'N/A',
                    description: request.description || 'No description available',
                    requestType: request.requestType || 'N/A',
                    requestedBy: request.requestedBy || 'Unknown',
                    record: request.record || 'N/A',
                    equipment: request.equipment || 'Unknown',
                    priority: request.priority
                  }}
                  handleEdit={(maintenance) => console.log('Edit:', maintenance)}
                  handleViewNotes={(maintenance) => console.log('View Notes:', maintenance)}
                />
              )
            }
            return null;
          })}
          <AddButton onClick={handleShow} />
          <RefreshButton onClick={fetchData} />
        </Box>
      )}

      {selectedTab == 1 && (
        <Box
          sx={{
            padding: '12px',
            display: 'flex',
            flexWrap: 'wrap',
            justifyContent: 'center',
            gap: 1,
          }}
        >
          Requests
          {allRequests.map((request, index) => {
            if (!request.done && !request.hold && !request.approvedBy)
              return (
                <p key={index}>{request.record}</p>
              )
          })}
          <AddButton onClick={handleShow} />
          <RefreshButton onClick={fetchData} />
        </Box>
      )}

      {selectedTab == 2 && (
        <Box
          sx={{
            padding: '12px',
            display: 'flex',
            flexWrap: 'wrap',
            justifyContent: 'center',
            gap: 1,
          }}
        >
          On Hold
          {allRequests.map((request, index) => {
            if (!request.done && request.hold)
              return (
                <p key={index}>{request.record}</p>
              )
          })}
        </Box>
      )}

      {selectedTab == 3 && (
        <Box sx={{ padding: '12px' }}>
          Completed
          {allRequests.map((request, index) => {
            if (request.done)
              return (
                <p key={index}>{request.record}</p>
              )
          })}
        </Box>
      )}

    </PageContainer>
  );
}