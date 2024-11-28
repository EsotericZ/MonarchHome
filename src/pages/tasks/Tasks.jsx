// NEED TO ADD NOTES
// CAN USE THIS SAME THING ON MAINTNENANCE

import { useEffect, useState } from 'react';
import { Box, Typography } from '@mui/material';

import { useUserContext } from '../../context/UserContext';

import AddButton from '../../components/shared/AddButton';
import AddTaskModal from '../../components/tasks/AddTaskModal';
import CustomTabs from '../../components/shared/CustomTabs';
import PageContainer from '../../components/shared/PageContainer';
import RefreshButton from '../../components/shared/RefreshButton';
import TaskCard from '../../components/tasks/TaskCard';
import EditTaskModal from '../../components/tasks/EditTaskModal'

import createTask from '../../services/tasks/createTask';
import getAllUsers from '../../services/users/getAllUsers';
import getUserTasks from '../../services/tasks/getUserTasks';
import updateTask from '../../services/tasks/updateTask';

export const Tasks = () => {
  const { cookieData } = useUserContext();
  const [selectedTab, setSelectedTab] = useState(0);
  const [show, setShow] = useState(false);
  const [showEdit, setShowEdit] = useState(false);
  const [loading, setLoading] = useState(true);

  const [allUsers, setAllUsers] = useState([]);
  const [userTasks, setUserTasks] = useState([]);
  const [assignedBy, setAssignedBy] = useState('');
  const [assignedTo, setAssignedTo] = useState([]);
  const [taskName, setTaskName] = useState('');
  const [description, setDescription] = useState('');
  const [priority, setPriority] = useState('');
  const [status, setStatus] = useState('');
  const [id, setId] = useState(0);

  const handleClose = () => {
    setShow(false);
    setShowEdit(false);
  }

  const handleSave = async () => {
    try {
      const assignedById = allUsers.find((user) => user.name === assignedBy)?.id;
      const assignedToIds = assignedTo.map(
        (name) => allUsers.find((user) => user.name === name)?.id
      );

      if (!assignedById || assignedToIds.includes(undefined)) {
        console.error('Invalid user mapping');
        return;
      }

      await createTask(assignedById, assignedToIds, taskName, description, priority, status);

      handleClose();
      fetchData();
    } catch (err) {
      console.error(err);
    }
  };

  const handleShow = () => {
    setAssignedBy(cookieData.name);
    setAssignedTo([]);
    setTaskName('');
    setDescription('');
    setPriority('');
    setStatus('');
    setShow(true);
  };

  const handleUpdateTask = (task) => {
    setId(task.id);
    setAssignedBy(task.assigner?.name || '');
    setAssignedTo(task.assignments?.map((assignment) => assignment.user.name) || []);
    setTaskName(task.taskName || '');
    setDescription(task.description || '');
    setPriority(task.priority || '');
    setStatus(task.status || '');
    setShowEdit(true);
  };

  const handleUpdate = async () => {
    try {
      await updateTask(id, assignedTo, taskName, description, priority, status);
      handleClose();
      fetchData();
    } catch (err) {
      console.error(err);
    }
  }

  const fetchData = async () => {
    try {
      const [allUsersData, userTaskData] = await Promise.all([
        getAllUsers(),
        getUserTasks(cookieData.id),
      ]);

      setAllUsers(allUsersData.data || []);
      setUserTasks(userTaskData.data);
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
    <PageContainer loading={loading} title='Tasks'>
      <AddTaskModal
        show={show}
        handleClose={handleClose}
        handleSave={handleSave}
        assignedBy={assignedBy}
        assignedTo={assignedTo}
        setAssignedTo={setAssignedTo}
        taskName={taskName}
        setTaskName={setTaskName}
        description={description}
        setDescription={setDescription}
        priority={priority}
        setPriority={setPriority}
        status={status}
        setStatus={setStatus}
        allUsers={allUsers}
      />

      <EditTaskModal
        showEdit={showEdit}
        handleClose={handleClose}
        handleUpdate={handleUpdate}
        assignedBy={assignedBy}
        assignedTo={assignedTo}
        setAssignedTo={setAssignedTo}
        taskName={taskName}
        setTaskName={setTaskName}
        description={description}
        setDescription={setDescription}
        priority={priority}
        setPriority={setPriority}
        status={status}
        setStatus={setStatus}
        allUsers={allUsers}
      />

      <CustomTabs
        selectedTab={selectedTab}
        handleTabChange={handleTabChange}
        tabLabels={['Active', 'On Hold', 'Completed']}
      />

      {selectedTab == 0 && (
        <Box sx={{ padding: '12px' }}>
          <Box sx={{ display: 'flex', justifyContent: 'center', flexWrap: 'wrap', gap: 1 }}>
            {Array.isArray(userTasks) ? (
              userTasks
                .filter((task) => task.status === 'Active' || task.status === 'Process')
                .map((task, index) => (
                  <TaskCard key={index} task={task} handleUpdateTask={handleUpdateTask} />
                )).length > 0 ? (
                userTasks
                  .filter((task) => task.status === 'Active' || task.status === 'Process')
                  .map((task, index) => (
                    <TaskCard key={index} task={task} handleUpdateTask={handleUpdateTask} />
                  ))
              ) : (
                <Box
                  sx={{
                    width: '100%',
                    textAlign: 'center',
                    alignContent: 'center',
                    overflowY: 'auto',
                    height: '15vh',
                  }}
                >
                  <Typography variant="h4" sx={{ fontWeight: 'bold', margin: '16px' }}>
                    No Active Tasks
                  </Typography>
                </Box>
              )
            ) : null}
          </Box>

          {cookieData.name && <AddButton onClick={handleShow} />}
          <RefreshButton onClick={fetchData} />
        </Box>
      )}


      {selectedTab == 1 && (
        <Box sx={{ padding: '12px' }}>
          <Box sx={{ display: 'flex', justifyContent: 'center', flexWrap: 'wrap', gap: 1 }}>
            {Array.isArray(userTasks) ? (
              userTasks
                .filter((task) => task.status === 'Hold')
                .map((task, index) => (
                  <TaskCard key={index} task={task} handleUpdateTask={handleUpdateTask} />
                )).length > 0 ? (
                userTasks
                  .filter((task) => task.status === 'Hold')
                  .map((task, index) => (
                    <TaskCard key={index} task={task} handleUpdateTask={handleUpdateTask} />
                  ))
              ) : (
                <Box
                  sx={{
                    width: '100%',
                    textAlign: 'center',
                    alignContent: 'center',
                    overflowY: 'auto',
                    height: '15vh',
                  }}
                >
                  <Typography variant="h4" sx={{ fontWeight: 'bold', margin: '16px' }}>
                    No Tasks on Hold
                  </Typography>
                </Box>
              )
            ) : null}
          </Box>

          {cookieData.name && <AddButton onClick={handleShow} />}
          <RefreshButton onClick={fetchData} />
        </Box>
      )}


      {selectedTab == 2 &&
        <Box sx={{ padding: '12px' }}>
          <Typography>Completed</Typography>
          <Typography>Under Construction</Typography>
        </Box>
      }
    </PageContainer>
  );
};