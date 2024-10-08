import { useEffect, useState } from 'react';
import { Box, Button, Checkbox, Dialog, DialogTitle, DialogContent, DialogActions, FormControl, InputLabel, TextField, Select, MenuItem, Typography, CircularProgress, IconButton, FormControlLabel, InputAdornment } from '@mui/material';

import Cookies from 'universal-cookie';
import { jwtDecode } from 'jwt-decode';

import PuffLoader from 'react-spinners/PuffLoader';
import AddIcon from '@mui/icons-material/Add';

import getAllUsers from '../../services/users/getAllUsers';
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

import getAllRFID from '../../services/rfid/getAllRFID';
import { EmployeeCard } from '../../components/EmployeeCard';

export const Admin = () => {
  const cookies = new Cookies();
  let cookieData
  try {
    cookieData = jwtDecode(cookies.get('jwt'));
  } catch {
    cookieData = {
      'name': '',
      'role': 'employee',
    };
  }

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
    maintenance: 0,
    shipping: 0,
    engineering: 0,
    tlaser: 0,
    quality: 0,
    forming: 0,
    machining: 0,
    laser: 0,
    saw: 0,
    punch: 0,
    shear: 0,
    backlog: 0,
  });
  const [updateSingleUser, setUpdateSingleUser] = useState({
    id: '',
    name: '',
    username: '',
    number: '',
    password: '',
  });

  const [userID, setUserID] = useState('');
  const [name, setName] = useState('');
  const [username, setUsername] = useState('');
  const [number, setNumber] = useState('');
  const [password, setPassword] = useState('');

  const [engineering, setEngineering] = useState(false);
  const [machining, setMachining] = useState(false);
  const [quality, setQuality] = useState(false);
  const [laser, setLaser] = useState(false);
  const [forming, setForming] = useState(false);
  const [tlaser, setTLaser] = useState(false);
  const [saw, setSaw] = useState(false);
  const [punch, setPunch] = useState(false);
  const [shear, setShear] = useState(false);
  const [maintenance, setMaintenance] = useState(false);
  const [shipping, setShipping] = useState(false);
  const [purchasing, setPurchasing] = useState(false);
  const [backlog, setBacklog] = useState(false);

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

  async function toggleMaintenance(user) {
    updateMaintenance(user);
    setUpdate('Maintenace');
  }

  async function toggleShipping(user) {
    updateShipping(user);
    setUpdate('Shipping');
  }

  async function togglePurchasing(user) {
    updatePurchasing(user);
    setUpdate('Purchasing');
  }

  async function toggleBacklog(user) {
    updateBacklog(user);
    setUpdate('Backlog');
  }

  async function toggleEngineering(user) {
    updateEngineering(user)
    setUpdate('Engineering')
  }

  async function toggleTLaser(user) {
    updateTLaser(user)
    setUpdate('Tube Laser')
  }

  async function toggleQuality(user) {
    updateQuality(user)
    setUpdate('Quality')
  }

  async function toggleForming(user) {
    updateForming(user)
    setUpdate('Forming')
  }

  async function toggleMachining(user) {
    updateMachining(user)
    setUpdate('Machining')
  }

  async function toggleLaser(user) {
    updateLaser(user)
    setUpdate('Laser')
  }

  async function toggleSaw(user) {
    updateSaw(user)
    setUpdate('Saw')
  }

  async function togglePunch(user) {
    updatePunch(user)
    setUpdate('Punch')
  }

  async function toggleShear(user) {
    updateShear(user)
    setUpdate('Shear')
  }

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
          ...updateSingleUser,
          id: user.id,
          name: user.name,
          username: user.username,
          number: user.number,
          password: res.data
        })
        setPassword(res.data)
      }).then(() => {
        setUserID(user.id);
        setName(user.name);
        setUsername(user.username);
        setNumber(user.number);
        setEngineering(user.engineering);
        setMachining(user.machining);
        setQuality(user.quality);
        setLaser(user.laser);
        setForming(user.forming);
        setTLaser(user.tlaser);
        setSaw(user.saw);
        setPunch(user.punch);
        setShear(user.shear);
        setMaintenance(user.maintenance);
        setShipping(user.shipping);
        setPurchasing(user.purchasing);
        setBacklog(user.backlog);
        setShowUpdate(true);
      })
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
    <Box sx={{ width: '100%', textAlign: 'center', overflowY: 'auto', height: '100vh' }}>
      {loading ? (
        <Box>
          <Typography variant='h4' sx={{ fontWeight: 'bold', margin: '16px' }}>Employee Database</Typography>
          <Box sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', marginTop: '100px' }}>
            <PuffLoader color='red' />
          </Box>
        </Box>
      ) : ( 
        cookieData.role == 'admin' ? (
          <Box sx={{ width: '100%' }}>
            <Typography variant='h4' sx={{ fontWeight: 'bold', margin: '16px' }}>Employee Database</Typography>
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

            <Dialog open={showAdd} onClose={handleCloseAdd} fullWidth>
              <DialogTitle>
                <Typography sx={{ fontWeight: 'bold', textAlign: 'center', fontSize: '30px' }}>
                  Add User
                </Typography>
              </DialogTitle>
              <DialogContent>
                <TextField label="Employee Name" fullWidth name="name" onChange={handleChangeAdd} sx={{ mb: 2, mt: 1 }} />
                <TextField label="Username" fullWidth name="username" onChange={handleChangeAdd} sx={{ mb: 2, mt: 1 }} />
                <TextField label="Employee Number" fullWidth name="number" onChange={handleChangeAdd} sx={{ mb: 2, mt: 1 }} />
                <TextField label="Password" fullWidth name="password" type="password" onChange={handleChangeAdd} sx={{ mb: 2, mt: 1 }} />
              </DialogContent>
              <DialogActions>
                <Box sx={{ width: '100%', display: 'flex', justifyContent: 'center', gap: 2, paddingBottom: 2 }}>
                  <Button onClick={handleCloseAdd} color="error" variant="contained">Cancel</Button>
                  <Button onClick={handleSave} color="success" variant="contained">Save</Button>
                </Box>
              </DialogActions>
            </Dialog>

{/* Update Employee Modal */}

            <Dialog open={showUpdate} onClose={handleCloseUpdate} fullWidth>
              <DialogTitle>
                <Typography sx={{ fontWeight: 'bold', textAlign: 'center', fontSize: '30px' }}>
                  Update Employee {name}
                </Typography>
              </DialogTitle>
              <DialogContent>
                <TextField label="Employee Name" fullWidth defaultValue={name} name="name" onChange={handleChangeUpdate} sx={{ mb: 2, mt: 1 }} />
                <TextField label="Username" fullWidth defaultValue={username} name="username" onChange={handleChangeUpdate} sx={{ mb: 2, mt: 1 }} />
                <TextField label="Employee Number" fullWidth defaultValue={number} name="number" onChange={handleChangeUpdate} sx={{ mb: 2, mt: 1 }} />
                <TextField label="Password" fullWidth defaultValue={password} name="password" type="password" onChange={handleChangeUpdate} sx={{ mb: 2, mt: 1 }} />

                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2, mt: 3 }}>
                  <FormControlLabel control={<Checkbox checked={engineering} onChange={(e) => { setEngineering(e.target.checked); toggleEngineering(userID); }} />} label="Engineering" />
                  <FormControlLabel control={<Checkbox checked={machining} onChange={(e) => { setMachining(e.target.checked); toggleMachining(userID); }} />} label="Machining" />
                  <FormControlLabel control={<Checkbox checked={quality} onChange={(e) => { setQuality(e.target.checked); toggleQuality(userID); }} />} label="Quality" />
                  <FormControlLabel control={<Checkbox checked={laser} onChange={(e) => { setLaser(e.target.checked); toggleLaser(userID); }} />} label="Laser" />
                  <FormControlLabel control={<Checkbox checked={forming} onChange={(e) => { setForming(e.target.checked); toggleForming(userID); }} />} label="Forming" />
                  <FormControlLabel control={<Checkbox checked={tlaser} onChange={(e) => { setTLaser(e.target.checked); toggleTLaser(userID); }} />} label="TLaser" />
                  <FormControlLabel control={<Checkbox checked={saw} onChange={(e) => { setSaw(e.target.checked); toggleSaw(userID); }} />} label="Saw" />
                  <FormControlLabel control={<Checkbox checked={punch} onChange={(e) => { setPunch(e.target.checked); togglePunch(userID); }} />} label="Punch" />
                  <FormControlLabel control={<Checkbox checked={shear} onChange={(e) => { setShear(e.target.checked); toggleShear(userID); }} />} label="Shear" />
                  <FormControlLabel control={<Checkbox checked={maintenance} onChange={(e) => { setMaintenance(e.target.checked); toggleMaintenance(userID); }} />} label="Maintenance" />
                  <FormControlLabel control={<Checkbox checked={shipping} onChange={(e) => { setShipping(e.target.checked); toggleShipping(userID); }} />} label="Shipping" />
                  <FormControlLabel control={<Checkbox checked={purchasing} onChange={(e) => { setPurchasing(e.target.checked); togglePurchasing(userID); }} />} label="Purchasing" />
                  <FormControlLabel control={<Checkbox checked={backlog} onChange={(e) => { setBacklog(e.target.checked); toggleBacklog(userID); }} />} label="Backlog" />
                </Box>
              </DialogContent>
              <DialogActions>
                <Box sx={{ width: '100%', display: 'flex', justifyContent: 'center', gap: 2, paddingBottom: 2 }}>
                  <Button onClick={handleCloseUpdate} color="error" variant="contained">Cancel</Button>
                  <Button onClick={handleUpdate} color="success" variant="contained">Save</Button>
                </Box>
              </DialogActions>
            </Dialog>

            <Box sx={{ display: 'flex', justifyContent: 'center', flexWrap: 'wrap', gap: 1 }}>
              {(searchName ? filteredUsersByName : filteredUsersByDepartment).map((user, index) => (
                <EmployeeCard key={index} user={user} handleOpenUpdate={handleOpenUpdate} />
              ))}
            </Box>

            <IconButton onClick={handleOpenAdd} sx={{ backgroundColor: '#111827', color: 'white', height: '52.5px', width: '52.5px', zIndex: 1000, position: 'fixed', bottom: '20px', right: '35px','&:hover': { backgroundColor: '#374151', }, }}>
              <AddIcon />
            </IconButton>
          </Box>
        ) : (
          <Box sx={{ width: '100%', textAlign: 'center', alignContent: 'center', overflowY: 'auto', height: '100vh' }}>
            <Typography variant='h4' sx={{ fontWeight: 'bold', margin: '16px' }}>You Don't Have Access To This Page</Typography>
          </Box>
        )
      )}
    </Box>
  );
}