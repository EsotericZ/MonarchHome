import { useEffect, useState } from 'react';
import { Box, Typography } from '@mui/material';

import { useUserContext } from '../../context/UserContext';

import AddButton from '../../components/shared/AddButton';
import CustomTabs from '../../components/shared/CustomTabs';
import PageContainer from '../../components/shared/PageContainer';
import RefreshButton from '../../components/shared/RefreshButton';
import AddTaskModal from '../../components/tasks/AddTaskModal';

import createTask from '../../services/tasks/createTask';
import getAllTasks from '../../services/tasks/getAllTasks';
import getAllUsers from '../../services/users/getAllUsers';
import getUserTasks from '../../services/tasks/getUserTasks';

export const Tasks = () => {
  const { cookieData } = useUserContext();
  const [selectedTab, setSelectedTab] = useState(0);
  const [show, setShow] = useState(false);
  const [loading, setLoading] = useState(true);

  const [allUsers, setAllUsers] = useState([]);
  const [allTasks, setAllTasks] = useState([]);
  const [assignedBy, setAssignedBy] = useState('');
  const [assignedTo, setAssignedTo] = useState([]);
  const [description, setDescription] = useState('');
  const [priority, setPriority] = useState('');
  const [status, setStatus] = useState('');
  const [id, setId] = useState(0);

  const [active, setActive] = useState('Active');
  
  const handleClose = () => setShow(false);

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

      await createTask(assignedById, assignedToIds, description, priority, status);

      handleClose();
      fetchData();
    } catch (err) {
      console.error(err);
    }
  };

  const handleShow = () => {
    setAssignedBy(cookieData.name);
    setAssignedTo([]);
    setDescription('');
    setPriority('');
    setStatus('');
    setShow(true);
  };

  const handleUpdateTask = (task) => {
    setId(task.id);
    setAssignedBy(task.assignedBy);
    setAssignedTo(task.assignedTo);
    setDescription(task.description);
    setPriority(task.priority);
    setStatus(task.status);
    setShow(true)
  };

  const handleUpdate = async () => {
    try {
      handleClose();
      fetchData();
    } catch (err) {
      console.error(err);
    }
  }

  const fetchData = async () => {
    try {
      const allTasks = await getAllTasks();
      const allUsersData = await getAllUsers();
      const userTaskData = await getUserTasks(cookieData.id);
      console.log(userTaskData);
      setAllTasks(allTasks);
      setAllUsers(allUsersData.data || []);
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
        tabLabels={[active, 'On Hold', 'Completed']}
      />

      {selectedTab == 0 &&
        <Box sx={{ padding: '12px' }}>
          <Typography>Active</Typography>
          <Typography>Under Construction</Typography>
          {cookieData.name &&
            <AddButton onClick={handleShow} />
          }
          <RefreshButton onClick={fetchData} />
        </Box>
      }

      {selectedTab == 1 &&
        <Box sx={{ padding: '12px' }}>
          <Typography>On Hold</Typography>
          <Typography>Under Construction</Typography>
        </Box>
      }

      {selectedTab == 2 &&
        <Box sx={{ padding: '12px' }}>
          <Typography>Completed</Typography>
          <Typography>Under Construction</Typography>
        </Box>
      }
    </PageContainer>
  );
};