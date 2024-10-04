import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, createTheme, CssBaseline, Collapse, Divider, Drawer as MuiDrawer, IconButton, List, ListItem, ListItemButton, ListItemIcon, ListItemText, ThemeProvider, Tooltip } from '@mui/material';
import { 
  ChevronLeft as ChevronLeftIcon, 
  ChevronRight as ChevronRightIcon, 
  Dashboard as DashboardIcon,
  Home as HomeIcon,
  ExpandLess, 
  ExpandMore, 
  LabelImportant as LabelImportantIcon,
} from '@mui/icons-material';
import { styled, useTheme } from '@mui/material/styles';

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
  const theme = useTheme();
  const [open, setOpen] = useState(false);
  const [programmingOpen, setProgrammingOpen] = useState(false);
  const navigate = useNavigate();

  const handleDrawerToggle = () => {
    setOpen(!open);
  };

  const handleProgrammingClick = () => {
    setProgrammingOpen(!programmingOpen);
  };

  return (
    <Box sx={{ display: 'flex', height: '100vh', width: '100vw' }}>
      <CssBaseline />
      <ThemeProvider theme={darkTheme}>
        <Drawer variant='permanent' open={open}>
          <DrawerHeader sx={{ justifyContent: 'flex-start', paddingLeft: '16px' }}>
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
                    {/* <ListItemIcon><LabelImportantIcon /></ListItemIcon> */}
                    <ListItemText primary="Engineering" />
                  </ListItemButton>
                </ListItem>
              </List>
            </Collapse>
          </List>

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