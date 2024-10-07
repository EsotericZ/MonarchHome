import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, createTheme, CssBaseline, Collapse, Divider, Drawer as MuiDrawer, IconButton, List, ListItem, ListItemButton, ListItemIcon, ListItemText, ThemeProvider, Tooltip } from '@mui/material';
import { 
  ChevronLeft as ChevronLeftIcon, 
  ChevronRight as ChevronRightIcon, 
  Dashboard as DashboardIcon,
  ExpandLess, 
  ExpandMore, 
  Home as HomeIcon,
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

export const SideNav = ({ children }) => {
  const cookies = new Cookies();
  const theme = useTheme();
  const [name, setName] = useState('');
  const [admin, setAdmin] = useState(false);
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);
  const [programmingOpen, setProgrammingOpen] = useState(false);
  const navigate = useNavigate();
  let userData

  const handleDrawerToggle = () => {
    setOpen(!open);
  };

  const handleProgrammingClick = () => {
    setProgrammingOpen(!programmingOpen);
  };

  const setData = () => {
    try {
      userData = (jwtDecode(cookies.get('jwt')))
      setName(userData.name.split(' ')[0]);
      userData.role == 'admin' && setAdmin(true);
      setLoading(false)
    } catch {
      setLoading(false)
    }
  }

  useEffect(() => {
    setData();
  }, [])

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
                  <ListItemButton onClick={() => { navigate('/dashboard'); setOpen(false); }}>
                    <ListItemIcon><HomeIcon /></ListItemIcon>
                    <ListItemText primary='Dashboard' />
                  </ListItemButton>
                </Tooltip>
              </ListItem>
          
{/* PROGRAMMING */}
              <ListItem disablePadding>
                <Tooltip title="Programming" placement="right" arrow>
                  <ListItemButton>
                    <ListItemIcon onClick={() => { navigate('/programming'); setOpen(false) }} sx={{ cursor: 'pointer' }}>
                      <DashboardIcon />
                    </ListItemIcon>
                    <ListItemText
                      primary="Programming"
                      onClick={() => { navigate('/programming'); setOpen(false); }}
                      sx={{ cursor: 'pointer' }}
                    />
                    <IconButton onClick={handleProgrammingClick}>
                      {programmingOpen ? <ExpandLess /> : <ExpandMore />}
                    </IconButton>
                  </ListItemButton>
                </Tooltip>
              </ListItem>
              <Collapse in={programmingOpen} timeout="auto" unmountOnExit>
                <List component="div" disablePadding sx={{ paddingLeft: 7 }}>
                  <ListItem disablePadding>
                    <ListItemButton onClick={() => { navigate('/engineering'); setOpen(false); }}>
                      <ListItemText primary="Engineering" />
                    </ListItemButton>
                  </ListItem>
                </List>
                <List component="div" disablePadding sx={{ paddingLeft: 7 }}>
                  <ListItem disablePadding>
                    <ListItemButton onClick={() => { navigate('/quality'); setOpen(false); }}>
                      <ListItemText primary="Quality" />
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
                    <ListItemButton onClick={() => { navigate('/profile'); setOpen(false); }}>
                      <ListItemIcon><PersonIcon /></ListItemIcon>
                      <ListItemText primary='Profile' />
                    </ListItemButton>
                  </Tooltip>
                </ListItem>
              ) : (
                <ListItem disablePadding>
                  <Tooltip title='Login' placement='right' arrow>
                    <ListItemButton onClick={() => { navigate('/login'); setOpen(false); }}>
                      <ListItemIcon><LoginIcon /></ListItemIcon>
                      <ListItemText primary='Login' />
                    </ListItemButton>
                  </Tooltip>
                </ListItem>
              )}
            </List>
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