import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, createTheme, CssBaseline, Collapse, Divider, Drawer as MuiDrawer, IconButton, List, ListItem, ListItemButton, ListItemIcon, ListItemText, ThemeProvider, Tooltip } from '@mui/material';
import { 
  AdminPanelSettings as AdminPanelSettingsIcon,
  ChevronLeft as ChevronLeftIcon, 
  ChevronRight as ChevronRightIcon, 
  Dashboard as DashboardIcon,
  ExpandLess, 
  ExpandMore, 
  Home as HomeIcon,
  Key as KeyIcon,
  Login as LoginIcon,
  Person as PersonIcon,
} from '@mui/icons-material';
import { styled, useTheme } from '@mui/material/styles';

import Cookies from 'universal-cookie';
import { jwtDecode } from 'jwt-decode';

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

export const SideNav = ({ children, loggedIn }) => {
  const cookies = new Cookies();
  const theme = useTheme();
  const navigate = useNavigate();

  const [name, setName] = useState('');
  const [admin, setAdmin] = useState(false);
  const [open, setOpen] = useState(false);
  const [programmingOpen, setProgrammingOpen] = useState(false);

  const handleDrawerToggle = () => {
    setOpen(!open);
  };

  const handleProgrammingClick = () => {
    setProgrammingOpen(!programmingOpen);
  };

  const handleCloseAll = () => {
    setOpen(false); 
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
  }, [loggedIn]);

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

{/* DASHBOARD */}

            <List>
              <ListItem disablePadding>
                <Tooltip title='Dashboard' placement='right' arrow>
                  <ListItemButton onClick={() => { navigate('/dashboard'); handleCloseAll(); }}>
                    <ListItemIcon><HomeIcon /></ListItemIcon>
                    <ListItemText primary='Dashboard' />
                  </ListItemButton>
                </Tooltip>
              </ListItem>
          
{/* PROGRAMMING */}

              <ListItem disablePadding>
                <Tooltip title='Programming' placement='right' arrow>
                  <ListItemButton>
                    <ListItemIcon onClick={() => { navigate('/programming'); setOpen(false) }} sx={{ cursor: 'pointer' }}>
                      <DashboardIcon />
                    </ListItemIcon>
                    <ListItemText
                      primary='Programming'
                      onClick={() => { navigate('/programming'); handleCloseAll(); }}
                      sx={{ cursor: 'pointer' }}
                    />
                    <IconButton onClick={handleProgrammingClick}>
                      {programmingOpen ? <ExpandLess /> : <ExpandMore />}
                    </IconButton>
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
            </List>

            <Divider />

{/* LOGIN / PROFILE */}

            <List>
              {name ? (
                <ListItem disablePadding>
                  <Tooltip title='Profile' placement='right' arrow>
                    <ListItemButton onClick={() => { navigate('/profile'); handleCloseAll(); }}>
                      <ListItemIcon><PersonIcon /></ListItemIcon>
                      <ListItemText primary='Profile' />
                    </ListItemButton>
                  </Tooltip>
                </ListItem>
              ) : (
                <ListItem disablePadding>
                  <Tooltip title='Login' placement='right' arrow>
                    <ListItemButton onClick={() => { navigate('/login'); handleCloseAll(); }}>
                      <ListItemIcon><LoginIcon /></ListItemIcon>
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
                        <ListItemIcon><AdminPanelSettingsIcon /></ListItemIcon>
                        <ListItemText primary='Admin' />
                      </ListItemButton>
                    </Tooltip>
                  </ListItem>
                  <ListItem disablePadding>
                    <Tooltip title='RFID' placement='right' arrow>
                      <ListItemButton onClick={() => { navigate('/http://10.0.1.45:3000/'); handleCloseAll(); }}>
                        <ListItemIcon><KeyIcon /></ListItemIcon>
                        <ListItemText primary='RFID Site' />
                      </ListItemButton>
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