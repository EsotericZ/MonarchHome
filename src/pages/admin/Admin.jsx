import { useEffect, useState } from 'react';
import { Box, IconButton, FormControl, TextField, Typography } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';

import { useUserContext } from '../../context/UserContext';

import getAllUsers from '../../services/users/getAllUsers';
import getAllRFID from '../../services/rfid/getAllRFID';
import getUserPassword from '../../services/users/getUserPassword';
import createUser from '../../services/users/createUser';
import deleteUser from '../../services/users/deleteUser';
import updateUser from '../../services/users/updateUser';
import updateEngineering from '../../services/users/updateEngineering';
import updateForming from '../../services/users/updateForming';
import updateLaser from '../../services/users/updateLaser';
import updateMachining from '../../services/users/updateMachining';
import updateMaintenance from '../../services/users/updateMaintenance';
import updatePunch from '../../services/users/updatePunch';
import updateQuality from '../../services/users/updateQuality';
import updateSaw from '../../services/users/updateSaw';
import updateShear from '../../services/users/updateShear';
import updateShipping from '../../services/users/updateShipping';
import updateTLaser from '../../services/users/updateTLaser';
import updatePurchasing from '../../services/users/updatePurchasing';
import updateBacklog from '../../services/users/updateBacklog';

import AddUserModal from '../../components/admin/AddUserModal';
import EmployeeCard from '../../components/admin/EmployeeCard';
import PageContainer from '../../components/shared/PageContainer';
import UpdateUserModal from '../../components/admin/UpdateUserModal';

export const Admin = () => {
  const { cookieData } = useUserContext();
  const [allUsers, setAllUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [update, setUpdate] = useState('');
  const [showAdd, setShowAdd] = useState(false);
  const [showUpdate, setShowUpdate] = useState(false);
  const [newUser, setNewUser] = useState({
    name: '',
    username: '',
    number: '',
    password: '',
    role: 'employee',
    backlog: 0,
    engineering: 0,
    forming: 0,
    laser: 0,
    machining: 0,
    maintenance: 0,
    punch: 0,
    quality: 0,
    saw: 0,
    shear: 0,
    shipping: 0,
    tlaser: 0,
  });
  const [updateSingleUser, setUpdateSingleUser] = useState({
    id: '',
    name: '',
    username: '',
    number: '',
    password: '',
  });

  const [employeeData, setEmployeeData] = useState({
    name: '',
    username: '',
    number: '',
    password: '',
  });
  const [roles, setRoles] = useState([
    { name: 'backlog', label: 'Backlog', checked: false },
    { name: 'engineering', label: 'Engineering', checked: false },
    { name: 'forming', label: 'Forming', checked: false },
    { name: 'laser', label: 'Laser', checked: false },
    { name: 'machining', label: 'Machining', checked: false },
    { name: 'maintenance', label: 'Maintenance', checked: false },
    { name: 'punch', label: 'Punch', checked: false },
    { name: 'purchasing', label: 'Purchasing', checked: false },
    { name: 'quality', label: 'Quality', checked: false },
    { name: 'saw', label: 'Saw', checked: false },
    { name: 'shear', label: 'Shear', checked: false },
    { name: 'shipping', label: 'Shipping', checked: false },
    { name: 'tlaser', label: 'TLaser', checked: false },
  ]);

  const [userID, setUserID] = useState('');
  const [searchName, setSearchName] = useState('');
  const [searchDepartment, setSearchDepartment] = useState('');

  async function fetchData() {
    try {
      const rfidData = await getAllRFID();
      const usersData = await getAllUsers();
      const userDataWithRFID = usersData.data.map(user => {
        const rfid = rfidData.data.find(r => r.empNo === user.number);
        return { ...user, etch: rfid ? rfid.etch : '-' };
      });
      setAllUsers(userDataWithRFID);
      setLoading(false);
    } catch (err) {
      console.log(err);
    }
  }

  const toggleRoleHandler = (roleName, isChecked) => {
    setRoles((prev) =>
      prev.map((role) =>
        role.name === roleName ? { ...role, checked: isChecked } : role
      )
    );
    const updateRoleFunctionMap = {
      maintenance: updateMaintenance,
      shipping: updateShipping,
      purchasing: updatePurchasing,
      backlog: updateBacklog,
      engineering: updateEngineering,
      tlaser: updateTLaser,
      quality: updateQuality,
      forming: updateForming,
      machining: updateMachining,
      laser: updateLaser,
      saw: updateSaw,
      punch: updatePunch,
      shear: updateShear,
    };
    if (updateRoleFunctionMap[roleName]) {
      updateRoleFunctionMap[roleName](userID);
      setUpdate(roleName.charAt(0).toUpperCase() + roleName.slice(1));
    }
  };

  const handleChangeAdd = (e) => {
    const { name, value } = e.target;
    setNewUser((prev) => {
      return { ...prev, [name]: value }
    });
  };

  const handleOpenAdd = () => setShowAdd(true);
  const handleCloseAdd = () => setShowAdd(false);
  const handleSave = () => {
    createUser(newUser)
      .then(fetchData())
      .then(setShowAdd(false))
  };

  const handleChangeUpdate = (e) => {
    const { name, value } = e.target;
    setUpdateSingleUser((prev) => {
      return { ...prev, [name]: value }
    });
  };

  const handleOpenUpdate = (user) => {
    getUserPassword(user.id)
      .then((res) => {
        setUpdateSingleUser({
          ...user,
          password: res.data,
        });

        setEmployeeData({
          name: user.name,
          username: user.username,
          number: user.number,
          password: res.data,
        });

        setRoles((prev) =>
          prev.map((role) => ({
            ...role,
            checked: Boolean(user[role.name]),
          }))
        );

        setUserID(user.id);
        setShowUpdate(true);
      })
      .catch((err) => {
        console.error('Error fetching user password:', err);
      });
  };

  const handleCloseUpdate = () => setShowUpdate(false);
  const handleUpdate = () => {
    updateUser(updateSingleUser)
      .then(fetchData())
      .then(setShowUpdate(false))
  };

  const handleDelete = () => {
    deleteUser(updateSingleUser)
      .then(fetchData())
      .then(setShowUpdate(false))
  };

  useEffect(() => {
    fetchData();
    setUpdate('');
  }, [showAdd, update, showUpdate]);

  const filteredUsersByName = allUsers.filter(user => user.name.toLowerCase().includes(searchName.toLowerCase()));

  const departmentKeywords = [
    'engineering',
    'machining',
    'quality',
    'laser',
    'forming',
    'tlaser',
    'saw',
    'punch',
    'shear',
    'maintenance',
    'shipping',
    'purchasing',
    'backlog',
  ];

  const filteredUsersByDepartment = allUsers.filter(user => {
    return !searchDepartment || departmentKeywords.some(keyword =>
      keyword.includes(searchDepartment.toLowerCase()) && user[keyword]
    );
  });

  return (
    <PageContainer loading={loading} title='Employee Database'>
      {cookieData.role == 'admin' ? (
        <Box sx={{ width: '100%' }}>
          <Box sx={{ display: 'flex', justifyContent: 'center', flexWrap: 'wrap', gap: 2, pb: 2 }}>
            <FormControl sx={{ width: '35%' }}>
              <TextField
                placeholder="Search by Name"
                onChange={(e) => setSearchName(e.target.value)}
              />
            </FormControl>
            <FormControl sx={{ width: '35%' }}>
              <TextField
                placeholder="Search by Department"
                onChange={(e) => setSearchDepartment(e.target.value)}
              />
            </FormControl>
          </Box>

          {/* Add Employee Modal */}

          <AddUserModal
            open={showAdd}
            onClose={handleCloseAdd}
            onChange={handleChangeAdd}
            onSave={handleSave}
          />

          {/* Update Employee Modal */}

          <UpdateUserModal
            open={showUpdate}
            onClose={handleCloseUpdate}
            onChange={handleChangeUpdate}
            onUpdate={handleUpdate}
            employeeData={employeeData}
            roleCheckboxes={roles}
            toggleRoleHandler={toggleRoleHandler}
          />

          <Box sx={{ display: 'flex', justifyContent: 'center', flexWrap: 'wrap', gap: 1 }}>
            {(searchName ? filteredUsersByName : filteredUsersByDepartment).map((user, index) => (
              <EmployeeCard key={index} user={user} handleOpenUpdate={handleOpenUpdate} />
            ))}
          </Box>

          <IconButton onClick={handleOpenAdd} sx={{ backgroundColor: '#111827', color: 'white', height: '52.5px', width: '52.5px', zIndex: 1000, position: 'fixed', bottom: '20px', right: '35px', '&:hover': { backgroundColor: '#374151', }, }}>
            <AddIcon />
          </IconButton>
        </Box>
      ) : (
        <Box sx={{ width: '100%', textAlign: 'center', alignContent: 'center', overflowY: 'auto', height: '100vh' }}>
          <Typography variant='h4' sx={{ fontWeight: 'bold', margin: '16px' }}>You Don't Have Access To This Page</Typography>
        </Box>
      )
      }
    </PageContainer>
  );
}