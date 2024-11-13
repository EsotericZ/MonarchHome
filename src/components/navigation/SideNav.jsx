import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, createTheme, CssBaseline, Collapse, Divider, Drawer as MuiDrawer, IconButton, List, ListItem, ListItemButton, ListItemIcon, ListItemText, ThemeProvider, Tooltip } from '@mui/material';
import {
  AdminPanelSettings as AdminPanelSettingsIcon,
  ChevronLeft as ChevronLeftIcon,
  ChevronRight as ChevronRightIcon,
  ContentPaste as ContentPasteIcon,
  Dashboard as DashboardIcon,
  ExpandLess,
  ExpandMore,
  Home as HomeIcon,
  Key as KeyIcon,
  Login as LoginIcon,
  Person as PersonIcon,
  Stream as StreamIcon,
} from '@mui/icons-material';
// import ContentPasteIcon from '@mui/icons-material/ContentPaste';
import { styled, useTheme } from '@mui/material/styles';

import Cookies from 'universal-cookie';
import { jwtDecode } from 'jwt-decode';
import { useUserContext } from '../../context/UserContext';

const drawerWidth = 240;

const openedMixin = (theme) => ({
  width: drawerWidth,
  transition: theme.transitions.create('width', {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.enteringScreen,
  }),
  overflowX: 'hidden',
});

const closedMixin = (theme) => ({
  transition: theme.transitions.create('width', {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  overflowX: 'hidden',
  width: `calc(${theme.spacing(7)} + 1px)`,
  [theme.breakpoints.up('sm')]: {
    width: `calc(${theme.spacing(8)} + 1px)`,
  },
});

const DrawerHeader = styled('div')(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'flex-end',
  padding: theme.spacing(0, 1),
  ...theme.mixins.toolbar,
}));

const Drawer = styled(MuiDrawer, { shouldForwardProp: (prop) => prop !== 'open' })(
  ({ theme, open }) => ({
    width: drawerWidth,
    flexShrink: 0,
    whiteSpace: 'nowrap',
    boxSizing: 'border-box',
    ...(open && {
      ...openedMixin(theme),
      '& .MuiDrawer-paper': openedMixin(theme),
    }),
    ...(!open && {
      ...closedMixin(theme),
      '& .MuiDrawer-paper': closedMixin(theme),
    }),
  }),
);

const darkTheme = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: '#90caf9',
    },
    background: {
      default: '#121212',
      paper: '#1e1e1e',
    },
  },
});

export const SideNav = ({ children }) => {
  const { loggedIn, cookieData } = useUserContext();
  const cookies = new Cookies();
  const theme = useTheme();
  const navigate = useNavigate();

  const [admin, setAdmin] = useState(false);
  const [departmentOpen, setDepartmentOpen] = useState(false);
  const [homeOpen, setHomeOpen] = useState(false);
  const [inventoryOpen, setInventoryOpen] = useState(false);
  const [name, setName] = useState('');
  const [open, setOpen] = useState(false);
  const [programmingOpen, setProgrammingOpen] = useState(false);

  const handleDrawerToggle = () => {
    setOpen(!open);
    closeAllMenus();
  }

  const handleDepartmentClick = () => {
    closeAllMenus();
    setDepartmentOpen(!departmentOpen);
  }

  const handleHomeClick = () => {
    closeAllMenus();
    setHomeOpen(!homeOpen);
  }

  const handleInventoryClick = () => {
    closeAllMenus();
    setInventoryOpen(!inventoryOpen);
  }

  const handleProgrammingClick = () => {
    closeAllMenus();
    setProgrammingOpen(!programmingOpen);
  }

  const handleCloseAll = () => {
    setOpen(false);
    closeAllMenus();
  }

  const closeAllMenus = () => {
    setDepartmentOpen(false);
    setHomeOpen(false);
    setInventoryOpen(false);
    setProgrammingOpen(false);
  }

  useEffect(() => {
    if (loggedIn) {
      try {
        const cookieData = jwtDecode(cookies.get('jwt'));
        setName(cookieData.name.split(' ')[0]);
        cookieData.role === 'admin' && setAdmin(true);
      } catch {
        setName('');
        setAdmin(false);
      }
    } else {
      setName('');
      setAdmin(false);
    }
  }, [loggedIn, cookieData]);

  return (
    <Box sx={{ display: 'flex', height: '100vh', width: '100vw' }}>
      <CssBaseline />
      <ThemeProvider theme={darkTheme}>
        <Drawer variant='permanent' open={open} sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between', height: '100vh' }}>
          <Box>
            <DrawerHeader sx={{ justifyContent: 'flex-start', paddingLeft: '10px' }}>
              <IconButton onClick={handleDrawerToggle}>
                {open ? (theme.direction === 'rtl' ? <ChevronRightIcon /> : <ChevronLeftIcon />) : <ChevronRightIcon />}
              </IconButton>
            </DrawerHeader>

            <Divider />

            {/* HOME */}

            <List>
              <ListItem disablePadding>
                <Tooltip title='Dashboard' placement='right' arrow>
                  <ListItemButton
                    onClick={() => {
                      if (!open) {
                        navigate('/dashboard');
                        handleCloseAll();
                      }
                    }}
                  >
                    <ListItemIcon sx={{ cursor: 'pointer', py: 1 }}>
                      <HomeIcon />
                    </ListItemIcon>
                    {open && (
                      <>
                        <ListItemText
                          primary='Dashboard'
                          onClick={() => { navigate('/dashboard'); handleCloseAll(); }}
                          sx={{ cursor: 'pointer' }}
                        />
                        <IconButton onClick={handleHomeClick}>
                          {homeOpen ? <ExpandLess /> : <ExpandMore />}
                        </IconButton>
                      </>
                    )}
                  </ListItemButton>
                </Tooltip>
              </ListItem>
              <Collapse in={homeOpen} timeout='auto' unmountOnExit>
                <List component='div' disablePadding sx={{ paddingLeft: 7 }}>
                  <ListItem disablePadding>
                    <a href="http://10.0.1.78/monarch_jobdisplay" target="_blank" rel="noopener noreferrer" style={{ textDecoration: 'none', color: 'inherit' }}>
                      <ListItemButton onClick={handleCloseAll}>
                        <ListItemText primary='Display List' />
                      </ListItemButton>
                    </a>
                  </ListItem>
                </List>
                <List component='div' disablePadding sx={{ paddingLeft: 7 }}>
                  <ListItem disablePadding>
                    <ListItemButton onClick={() => { navigate('/directory'); handleCloseAll(); }}>
                      <ListItemText primary='Directory' />
                    </ListItemButton>
                  </ListItem>
                </List>
              </Collapse>

              {/* PROGRAMMING */}

              <ListItem disablePadding>
                <Tooltip title='Programming' placement='right' arrow>
                  <ListItemButton
                    onClick={() => {
                      if (!open) {
                        navigate('/programming');
                        handleCloseAll();
                      }
                    }}
                  >
                    <ListItemIcon sx={{ cursor: 'pointer', py: 1 }}>
                      <StreamIcon />
                    </ListItemIcon>
                    {open && (
                      <>
                        <ListItemText
                          primary='Programming'
                          onClick={() => { navigate('/programming'); handleCloseAll(); }}
                          sx={{ cursor: 'pointer' }}
                        />
                        <IconButton onClick={handleProgrammingClick}>
                          {programmingOpen ? <ExpandLess /> : <ExpandMore />}
                        </IconButton>
                      </>
                    )}
                  </ListItemButton>
                </Tooltip>
              </ListItem>
              <Collapse in={programmingOpen} timeout='auto' unmountOnExit>
                <List component='div' disablePadding sx={{ paddingLeft: 7 }}>
                  <ListItem disablePadding>
                    <ListItemButton onClick={() => { navigate('/engineering'); handleCloseAll(); }}>
                      <ListItemText primary='Engineering' />
                    </ListItemButton>
                  </ListItem>
                </List>
                <List component='div' disablePadding sx={{ paddingLeft: 7 }}>
                  <ListItem disablePadding>
                    <ListItemButton onClick={() => { navigate('/quality'); handleCloseAll(); }}>
                      <ListItemText primary='Quality' />
                    </ListItemButton>
                  </ListItem>
                </List>
                <List component='div' disablePadding sx={{ paddingLeft: 7 }}>
                  <ListItem disablePadding>
                    <ListItemButton onClick={() => { navigate('/formingProg'); handleCloseAll(); }}>
                      <ListItemText primary='Forming' />
                    </ListItemButton>
                  </ListItem>
                </List>
                <List component='div' disablePadding sx={{ paddingLeft: 7 }}>
                  <ListItem disablePadding>
                    <ListItemButton onClick={() => { navigate('/tubeLaserProg'); handleCloseAll(); }}>
                      <ListItemText primary='Tube Laser' />
                    </ListItemButton>
                  </ListItem>
                </List>
                <List component='div' disablePadding sx={{ paddingLeft: 7 }}>
                  <ListItem disablePadding>
                    <ListItemButton onClick={() => { navigate('/machining'); handleCloseAll(); }}>
                      <ListItemText primary='Machining' />
                    </ListItemButton>
                  </ListItem>
                </List>
                <List component='div' disablePadding sx={{ paddingLeft: 7 }}>
                  <ListItem disablePadding>
                    <ListItemButton onClick={() => { navigate('/qualityInfo'); handleCloseAll(); }}>
                      <ListItemText primary='Quality Info' />
                    </ListItemButton>
                  </ListItem>
                </List>
                <List component='div' disablePadding sx={{ paddingLeft: 7 }}>
                  <ListItem disablePadding>
                    <ListItemButton onClick={() => { navigate('/bendDeduction'); handleCloseAll(); }}>
                      <ListItemText primary='Bend Deduction' />
                    </ListItemButton>
                  </ListItem>
                </List>
                <List component='div' disablePadding sx={{ paddingLeft: 7 }}>
                  <ListItem disablePadding>
                    <ListItemButton onClick={() => { navigate('/hardware'); handleCloseAll(); }}>
                      <ListItemText primary='Hardware' />
                    </ListItemButton>
                  </ListItem>
                </List>
                <List component='div' disablePadding sx={{ paddingLeft: 7 }}>
                  <ListItem disablePadding>
                    <ListItemButton onClick={() => { navigate('/tapChart'); handleCloseAll(); }}>
                      <ListItemText primary='Tap Chart' />
                    </ListItemButton>
                  </ListItem>
                </List>
              </Collapse>

              {/* DEPARTMENTS */}

              <ListItem disablePadding>
                <Tooltip title='Departments' placement='right' arrow>
                  <ListItemButton
                    onClick={() => {
                      if (!open) {
                        navigate('/departments');
                        handleCloseAll();
                      }
                    }}
                  >
                    <ListItemIcon sx={{ cursor: 'pointer', py: 1 }}>
                      <DashboardIcon />
                    </ListItemIcon>
                    {open && (
                      <>
                        <ListItemText
                          primary='Departments'
                          onClick={() => { navigate('/departments'); handleCloseAll(); }}
                          sx={{ cursor: 'pointer' }}
                        />
                        <IconButton onClick={handleDepartmentClick}>
                          {departmentOpen ? <ExpandLess /> : <ExpandMore />}
                        </IconButton>
                      </>
                    )}
                  </ListItemButton>
                </Tooltip>
              </ListItem>
              <Collapse in={departmentOpen} timeout='auto' unmountOnExit>
                <List component='div' disablePadding sx={{ paddingLeft: 7 }}>
                  <ListItem disablePadding>
                    <ListItemButton onClick={() => { navigate('/fixtureLaser'); handleCloseAll(); }}>
                      <ListItemText primary='Fixture Laser' />
                    </ListItemButton>
                  </ListItem>
                </List>
                <List component='div' disablePadding sx={{ paddingLeft: 7 }}>
                  <ListItem disablePadding>
                    <ListItemButton onClick={() => { navigate('/forming'); handleCloseAll(); }}>
                      <ListItemText primary='Forming' />
                    </ListItemButton>
                  </ListItem>
                </List>
                <List component='div' disablePadding sx={{ paddingLeft: 7 }}>
                  <ListItem disablePadding>
                    <ListItemButton onClick={() => { navigate('/laser'); handleCloseAll(); }}>
                      <ListItemText primary='Laser (Enterprise)' />
                    </ListItemButton>
                  </ListItem>
                </List>
                <List component='div' disablePadding sx={{ paddingLeft: 7 }}>
                  <ListItem disablePadding>
                    <ListItemButton onClick={() => { navigate('/punch'); handleCloseAll(); }}>
                      <ListItemText primary='Punch' />
                    </ListItemButton>
                  </ListItem>
                </List>
                <List component='div' disablePadding sx={{ paddingLeft: 7 }}>
                  <ListItem disablePadding>
                    <ListItemButton onClick={() => { navigate('/saw'); handleCloseAll(); }}>
                      <ListItemText primary='Saw' />
                    </ListItemButton>
                  </ListItem>
                </List>
                <List component='div' disablePadding sx={{ paddingLeft: 7 }}>
                  <ListItem disablePadding>
                    <ListItemButton onClick={() => { navigate('/shear'); handleCloseAll(); }}>
                      <ListItemText primary='Shear' />
                    </ListItemButton>
                  </ListItem>
                </List>
                <List component='div' disablePadding sx={{ paddingLeft: 7 }}>
                  <ListItem disablePadding>
                    <ListItemButton onClick={() => { navigate('/staticLaser'); handleCloseAll(); }}>
                      <ListItemText primary='Static Laser' />
                    </ListItemButton>
                  </ListItem>
                </List>
                <List component='div' disablePadding sx={{ paddingLeft: 7 }}>
                  <ListItem disablePadding>
                    <ListItemButton onClick={() => { navigate('/tubeLaser'); handleCloseAll(); }}>
                      <ListItemText primary='Tube Laser' />
                    </ListItemButton>
                  </ListItem>
                </List>
              </Collapse>

              {/* INVENTORY */}

              <ListItem disablePadding>
                <Tooltip title='Inventory' placement='right' arrow>
                  <ListItemButton
                    onClick={() => {
                      if (!open) {
                        navigate('/inventoryHome');
                        handleCloseAll();
                      }
                    }}
                  >
                    <ListItemIcon sx={{ cursor: 'pointer', py: 1 }}>
                      <ContentPasteIcon />
                    </ListItemIcon>
                    {open && (
                      <>
                        <ListItemText
                          primary='Inventory'
                          onClick={() => { navigate('/inventoryHome'); handleCloseAll(); }}
                          sx={{ cursor: 'pointer' }}
                        />
                        <IconButton onClick={handleInventoryClick}>
                          {inventoryOpen ? <ExpandLess /> : <ExpandMore />}
                        </IconButton>
                      </>
                    )}
                  </ListItemButton>
                </Tooltip>
              </ListItem>
              <Collapse in={inventoryOpen} timeout='auto' unmountOnExit>
                <List component='div' disablePadding sx={{ paddingLeft: 7 }}>
                  <ListItem disablePadding>
                    <ListItemButton onClick={() => { navigate('/inventory'); handleCloseAll(); }}>
                      <ListItemText primary='Inventory' />
                    </ListItemButton>
                  </ListItem>
                </List>
                <List component='div' disablePadding sx={{ paddingLeft: 7 }}>
                  <ListItem disablePadding>
                    <ListItemButton onClick={() => { navigate('/purchasing'); handleCloseAll(); }}>
                      <ListItemText primary='Purchasing' />
                    </ListItemButton>
                  </ListItem>
                </List>
                <List component='div' disablePadding sx={{ paddingLeft: 7 }}>
                  <ListItem disablePadding>
                    <ListItemButton onClick={() => { navigate('/scales'); handleCloseAll(); }}>
                      <ListItemText primary='Scales' />
                    </ListItemButton>
                  </ListItem>
                </List>
                <List component='div' disablePadding sx={{ paddingLeft: 7 }}>
                  <ListItem disablePadding>
                    <ListItemButton onClick={() => { navigate('/supplies'); handleCloseAll(); }}>
                      <ListItemText primary='Supplies' />
                    </ListItemButton>
                  </ListItem>
                </List>
              </Collapse>
            </List>

            {/* DIVIDER */}

            <Divider />

            {/* LOGIN / PROFILE */}

            <List>
              {name ? (
                <ListItem disablePadding>
                  <Tooltip title='Profile' placement='right' arrow>
                    <ListItemButton onClick={() => { navigate('/profile'); handleCloseAll(); }}>
                      <ListItemIcon sx={{ cursor: 'pointer', py: 1 }}>
                        <PersonIcon />
                      </ListItemIcon>
                      <ListItemText primary='Profile' />
                    </ListItemButton>
                  </Tooltip>
                </ListItem>
              ) : (
                <ListItem disablePadding>
                  <Tooltip title='Login' placement='right' arrow>
                    <ListItemButton onClick={() => { navigate('/login'); handleCloseAll(); }}>
                      <ListItemIcon sx={{ cursor: 'pointer', py: 1 }}>
                        <LoginIcon />
                      </ListItemIcon>
                      <ListItemText primary='Login' />
                    </ListItemButton>
                  </Tooltip>
                </ListItem>
              )}
            </List>

            {/* ADMIN ONLY */}

            {admin && (
              <>
                <Divider />

                <List>
                  <ListItem disablePadding>
                    <Tooltip title='Admin' placement='right' arrow>
                      <ListItemButton onClick={() => { navigate('/admin'); handleCloseAll(); }}>
                        <ListItemIcon sx={{ cursor: 'pointer', py: 1 }}>
                          <AdminPanelSettingsIcon />
                        </ListItemIcon>
                        <ListItemText primary='Admin' />
                      </ListItemButton>
                    </Tooltip>
                  </ListItem>
                  <ListItem disablePadding>
                    <Tooltip title='RFID' placement='right' arrow>
                      <a href="http://10.0.1.45:3000/" target="_blank" rel="noopener noreferrer" style={{ textDecoration: 'none', color: 'inherit' }}>
                        <ListItemButton onClick={handleCloseAll}>
                          <ListItemIcon sx={{ cursor: 'pointer', py: 1 }}>
                            <KeyIcon />
                          </ListItemIcon>
                          <ListItemText primary='RFID Site' />
                        </ListItemButton>
                      </a>
                    </Tooltip>
                  </ListItem>
                </List>
              </>
            )}

          </Box>

          {/* USER INFO */}

          <Box sx={{ marginTop: 'auto', paddingBottom: 2 }}>
            <List>
              <ListItem disablePadding>
                <ListItemText
                  primary={name ? name : 'Guest'}
                  sx={{
                    textAlign: open ? 'center' : 'center',
                    transition: theme.transitions.create(['padding-left', 'text-align'], {
                      easing: theme.transitions.easing.sharp,
                      duration: theme.transitions.duration.enteringScreen,
                    }),
                  }}
                />
              </ListItem>
            </List>
          </Box>

        </Drawer>
      </ThemeProvider>
      <Box
        component='main'
        sx={{
          flexGrow: 1,
          width: open ? `calc(100vw - ${drawerWidth}px)` : '100vw',
          transition: theme.transitions.create(['width'], {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.leavingScreen,
          }),
          overflow: 'hidden',
        }}
      >
        {children}
      </Box>
    </Box>
  );
};