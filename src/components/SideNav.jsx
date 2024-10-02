import { useMemo, useState } from 'react';
import PropTypes from 'prop-types';

import { Box, Button, createTheme, Typography } from '@mui/material';
import { useLocation, useNavigate } from 'react-router-dom';
import { AppProvider } from '@toolpad/core/AppProvider';
import { DashboardLayout } from '@toolpad/core/DashboardLayout';

import DashboardIcon from '@mui/icons-material/Dashboard';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import BarChartIcon from '@mui/icons-material/BarChart';
import DescriptionIcon from '@mui/icons-material/Description';
import LayersIcon from '@mui/icons-material/Layers';


const navigation = [
  {
    kind: 'header',
    title: 'Main items',
  },
  {
    segment: 'dashboard',
    title: 'Dashboard',
    icon: <DashboardIcon />,
    link: '/',
  },
  {
    segment: 'engineering',
    title: 'Engineering',
    icon: <ShoppingCartIcon />,
    link: '/engineering',
  },
  {
    kind: 'divider',
  },
  {
    kind: 'header',
    title: 'Analytics',
  },
  {
    segment: 'reports',
    title: 'Reports',
    icon: <BarChartIcon />,
    children: [
      {
        segment: 'sales',
        title: 'Sales',
        icon: <DescriptionIcon />,
      },
      {
        segment: 'traffic',
        title: 'Traffic',
        icon: <DescriptionIcon />,
      },
    ],
  },
  {
    segment: 'integrations',
    title: 'Integrations',
    icon: <LayersIcon />,
  },
];

const CustomToolbarAccount = () => (
  <Box>
    <Button variant="outlined" color="secondary">
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
          toolbarAccount: CustomToolbarAccount,
        }}
      >
        {children}
      </DashboardLayout>
    </AppProvider>
  );
};

SideNav.propTypes = {
  window: PropTypes.func,
  children: PropTypes.node,
};