import { useMemo, useState } from 'react';
import PropTypes from 'prop-types';

import { Box, Button, createTheme, Typography } from '@mui/material';
import { useLocation, useNavigate } from 'react-router-dom';
import { AppProvider } from '@toolpad/core/AppProvider';
import { DashboardLayout } from '@toolpad/core/DashboardLayout';

import HomeIcon from '@mui/icons-material/Home';
import DashboardIcon from '@mui/icons-material/Dashboard';
import LayersIcon from '@mui/icons-material/Layers';

const navigation = [
  {
    kind: 'header',
    title: 'Main items',
  },
  {
    segment: 'dashboard',
    title: 'Dashboard',
    icon: <HomeIcon />,
  },
  {
    segment: 'engineering',
    title: 'Engineering',
    icon: <LayersIcon />,
  },
  {
    kind: 'divider',
  },
  {
    kind: 'header',
    title: 'Analytics',
  },
  {
    segment: 'departments',
    title: 'Departments',
    icon: <DashboardIcon />,
    children: [
      {
        segment: 'fixture laser',
        title: 'Fixture Laser',
      },
      {
        segment: 'laser',
        title: 'Laser (Enterprise)',
      },
    ],
  },
];

const getPageTitle = (pathname) => {
  const allPages = navigation.flatMap((page) => {
    if (page.children) {
      return [page, ...page.children];
    }
    return page;
  });

  const currentPage = allPages.find((page) => `/${page.segment}` === pathname);
  return currentPage ? currentPage.title : 'Unknown Page';
};

const CustomToolbarActions = ({ pathname, onToggleSidebar }) => (
  <Box
    sx={{
      position: 'absolute',
      left: '50%',
      transform: 'translateX(-50%)',
      top: '50%',
      transform: 'translate(-50%, -50%)',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      width: '50%',
    }}
  >
    <Typography 
      sx={{ 
        fontWeight: 'bold', 
        fontSize: '2rem' 
      }}
    >
      {getPageTitle(pathname)}
    </Typography>
  </Box>
);

const CustomToolbarAccount = () => (
  <Box>
    <Button variant="outlined" color="error">
      Profile
    </Button>
  </Box>
);

const theme = createTheme({
  cssVariables: {
    colorSchemeSelector: 'data-toolpad-color-scheme',
  },
  colorSchemes: { light: true, dark: true },
  breakpoints: {
    values: {
      xs: 0,
      sm: 600,
      md: 600,
      lg: 1200,
      xl: 1536,
    },
  },
});

export const SideNav = (props) => {
  const { window, children } = props;
  const location = useLocation();
  const navigate = useNavigate();

  const [pathname, setPathname] = useState(location.pathname);

  const router = useMemo(() => {
    return {
      pathname,
      searchParams: new URLSearchParams(),
      navigate: (path) => {
        setPathname(String(path));
        navigate(path)
      },
    };
  }, [navigate, pathname]);

  const siteWindow = window !== undefined ? window() : undefined;

  return (
    <AppProvider
      navigation={navigation}
      branding={{
        // logo: <img src='' alt='Monarch Metal' />,
        logo: <img src='' />,
        title: 'Monarch Metal',
      }}
      router={router}
      theme={theme}
      window={siteWindow}
    >
      <DashboardLayout
        slots={{
          toolbarActions: () => <CustomToolbarActions pathname={pathname} />,
          toolbarAccount: CustomToolbarAccount,
        }}
      >
        <Box sx={{ height: '350%', width: '100vw', border: '2px solid blue'}}>
          {children}
        </Box>
      </DashboardLayout>
    </AppProvider>
  );
};

SideNav.propTypes = {
  window: PropTypes.func,
  children: PropTypes.node,
};