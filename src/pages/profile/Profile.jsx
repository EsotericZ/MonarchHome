import { useEffect, useState } from 'react';
import Cookies from 'universal-cookie';
import { jwtDecode } from 'jwt-decode';
import { NavLink } from 'react-router-dom';

import PuffLoader from "react-spinners/PuffLoader";
import { Box, Button, Typography } from '@mui/material';

import DepartmentCard from '../../components/shared/DepartmentCard';

export const Profile = ({ loggedIn, handleLogout }) => {
  const cookies = new Cookies();
  const [cookieData, setCookieData] = useState('');
  const [areas, setAreas] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (loggedIn) {
      try {
        setCookieData(jwtDecode(cookies.get('jwt')));
      } catch {
        setCookieData('');
      }
    }
  }, [loggedIn]);

  useEffect(() => {
    {
      cookieData.engineering &&
      setAreas(prevAreas => [
        ...prevAreas,
        {
          area: 'Engineering',
          link: '/engineering',
          image: 'engineering',
          areaType: 'programming',
        },
      ])
    }
    {
      cookieData.machining &&
      setAreas(prevAreas => [
        ...prevAreas,
        {
          area: 'Machining',
          link: '/machining',
          image: 'machining',
          areaType: 'programming',
        },
      ])
    }
    {
      cookieData.quality &&
      setAreas(prevAreas => [
        ...prevAreas,
        {
          area: 'Quality',
          link: '/quality',
          image: 'quality',
          areaType: 'programming',
        },
      ])
    }
    {
      cookieData.tlaser &&
      setAreas(prevAreas => [
        ...prevAreas,
        {
          area: 'Tube Laser',
          link: '/tubelaserprog',
          image: 'tlaser',
          areaType: 'programming',
        },
      ])
    }
    {
      cookieData.forming &&
      setAreas(prevAreas => [
        ...prevAreas,
        {
          area: 'Forming',
          link: '/formingprog',
          image: 'forming',
          areaType: 'programming',
        },
      ])
    }
    {
      cookieData.laser &&
      setAreas(prevAreas => [
        ...prevAreas,
        {
          area: 'Fixture Laser',
          link: '/fixturelaser',
          image: 'flaser',
          areaType: 'production',
        },
      ])
    }
    {
      cookieData.forming &&
      setAreas(prevAreas => [
        ...prevAreas,
        {
          area: 'Forming',
          link: '/forming',
          image: 'forming',
          areaType: 'production',
        },
      ])
    }
    {
      cookieData.laser &&
      setAreas(prevAreas => [
        ...prevAreas,
        {
          area: 'Laser',
          link: '/laser',
          image: 'laser',
          areaType: 'production',
        },
      ])
    }
    {
      cookieData.punch &&
      setAreas(prevAreas => [
        ...prevAreas,
        {
          area: 'Punch',
          link: '/punch',
          image: 'punch',
          areaType: 'production',
        },
      ])
    }
    {
      cookieData.forming &&
      setAreas(prevAreas => [
        ...prevAreas,
        {
          area: 'Saw',
          link: '/saw',
          image: 'saw',
          areaType: 'production',
        },
      ])
    }
    {
      cookieData.shear &&
      setAreas(prevAreas => [
        ...prevAreas,
        {
          area: 'Shear',
          link: '/shear',
          image: 'shear',
          areaType: 'production',
        },
      ])
    }
    {
      cookieData.laser &&
      setAreas(prevAreas => [
        ...prevAreas,
        {
          area: 'Static Laser',
          link: '/staticlaser',
          image: 'slaser',
          areaType: 'production',
        },
      ])
    }
    {
      cookieData.tlaser &&
      setAreas(prevAreas => [
        ...prevAreas,
        {
          area: 'Tube Laser',
          link: '/tubelaser',
          image: 'tlaser',
          areaType: 'production',
        },
      ])
    }
    {
      (cookieData.engineering || cookieData.quality) &&
      setAreas(prevAreas => [
        ...prevAreas,
        {
          area: 'QC Info',
          link: '/qualityinfo',
          image: 'qcInfo',
          areaType: 'tooling',
        },
      ])
    }
    {
      (cookieData.engineering || cookieData.quality || cookieData.machining) &&
      setAreas(prevAreas => [
        ...prevAreas,
        {
          area: 'Tap Chart',
          link: '/tapchart',
          image: 'tap',
          areaType: 'tooling',
        },
        {
          area: 'Hardware',
          link: '/hardware',
          image: 'hardware',
          areaType: 'tooling',
        },
      ])
    }
    {
      (cookieData.engineering || cookieData.forming) &&
      setAreas(prevAreas => [
        ...prevAreas,
        {
          area: 'Bend Deduction',
          link: '/benddeduction',
          image: 'bd',
          areaType: 'tooling',
        },
      ]);
    }
    {
      (cookieData.purchasing) &&
      setAreas(prevAreas => [
        ...prevAreas,
        {
          area: 'Purchasing',
          link: '/purchasing',
          image: 'bd',
          areaType: 'misc',
        },
      ]);
    }
    setLoading(false);
  }, [cookieData]);

  return (
    <Box sx={{ width: '100%', textAlign: 'center', overflowY: 'auto', height: '100vh' }}>
      {loggedIn ? (
        <>
          {loading ? (
            <Box sx={{ width: '100%' }}>
              <Typography variant="h4" sx={{ fontWeight: 'bold', margin: '16px' }}>
                Monarch Metal
              </Typography>
              <Box sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', marginTop: '100px' }}>
                <PuffLoader color='red' />
              </Box>
            </Box>
          ) : (
            <Box sx={{ width: '100%' }}>
              <Typography variant="h4" sx={{ fontWeight: 'bold', margin: '16px' }}>
                {cookieData.name}
              </Typography>
              <Box sx={{ display: 'flex', justifyContent: 'center', flexWrap: 'wrap', gap: 2 }}>
                {areas.map((area, index) => (
                  <DepartmentCard key={index} area={area} />
                ))}
              </Box>
              <NavLink to="/" style={{ textDecoration: 'none' }}>
                <Box sx={{ textAlign: 'center', m: 3 }}>
                  <Button variant="contained" color="error" onClick={handleLogout}>
                    Logout
                  </Button>
                </Box>
              </NavLink>
            </Box>
          )}
        </>
      ) : (
        <NavLink to="/login" style={{ textDecoration: 'none' }}>
          <Box sx={{ textAlign: 'center', mt: 5 }}>
            <Button variant="contained" color="error" sx={{ m: 5 }}>
              Log In
            </Button>
          </Box>
        </NavLink>
      )}
    </Box>
  );
}