import { useEffect, useState } from 'react';
import { Box, Typography } from '@mui/material';

import { useUserContext } from '../../context/UserContext';

import AddButton from '../../components/shared/AddButton';
import CustomTabs from '../../components/shared/CustomTabs';
import PageContainer from '../../components/shared/PageContainer';
import RefreshButton from '../../components/shared/RefreshButton';

import getAllTasks from '../../services/tasks/getAllTasks';

export const Tasks = () => {
  const { cookieData } = useUserContext();
  const [selectedTab, setSelectedTab] = useState(0);
  const [show, setShow] = useState(false);
  const [loading, setLoading] = useState(true);
  
  const [active, setActive] = useState('Active');
  
  const handleClose = () => setShow(false);

  const handleShow = () => {
    setSupplies('');
    setDepartment('');
    setRequestedBy('');
    setNotes('');
    setProductLink('');
    setJobNo('');
    setShow(true);
  };

  const fetchData = async () => {
    try {
      const allTasks = await getAllTasks();
      console.log(allTasks)
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleShow = () => {
    console.log('hit')
  };

  const handleTabChange = (event, newValue) => {
    setSelectedTab(newValue);
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <PageContainer loading={loading} title='Tasks'>
      <CustomTabs
        selectedTab={selectedTab}
        handleTabChange={handleTabChange}
        tabLabels={[active, 'On Hold', 'Completed']}
      />

      {selectedTab == 0 &&
        <Box sx={{ padding: '12px' }}>
          <Typography>Active</Typography>
          <Typography>Under Construction</Typography>
          <AddButton onClick={handleShow} />
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