import { useEffect, useState } from 'react';
import { NavLink } from 'react-router-dom';

import PuffLoader from "react-spinners/PuffLoader";
import { Box, Button, Typography } from '@mui/material';

import DepartmentCard from '../../components/shared/DepartmentCard';
import MonarchButton from '../../components/shared/MonarchButton';
import { useUserContext } from '../../context/UserContext';

export const Profile = ({ handleLogout }) => {
  const { loggedIn, cookieData, setCookieData } = useUserContext();
  const [areas, setAreas] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const newAreas = [];

    {
      cookieData.engineering &&
      newAreas.push(
        {
          area: 'Engineering',
          link: '/engineering',
          image: 'engineering',
          areaType: 'programming',
        }
      )
    }
    {
      cookieData.machining &&
      newAreas.push(
        {
          area: 'Machining',
          link: '/machining',
          image: 'machining',
          areaType: 'programming',
        }
      )
    }
    {
      cookieData.quality &&
      newAreas.push(
        {
          area: 'Quality',
          link: '/quality',
          image: 'quality',
          areaType: 'programming',
        }
      )
    }
    {
      cookieData.tlaser &&
      newAreas.push(
        {
          area: 'Tube Laser',
          link: '/tubelaserprog',
          image: 'tlaser',
          areaType: 'programming',
        }
      )
    }
    {
      cookieData.forming &&
      newAreas.push(
        {
          area: 'Forming',
          link: '/formingprog',
          image: 'forming',
          areaType: 'programming',
        }
      )
    }
    {
      cookieData.laser &&
      newAreas.push(
        {
          area: 'Fixture Laser',
          link: '/fixturelaser',
          image: 'flaser',
          areaType: 'production',
        }
      )
    }
    {
      cookieData.forming &&
      newAreas.push(
        {
          area: 'Forming',
          link: '/forming',
          image: 'forming',
          areaType: 'production',
        }
      )
    }
    {
      cookieData.laser &&
      newAreas.push(
        {
          area: 'Laser',
          link: '/laser',
          image: 'laser',
          areaType: 'production',
        }
      )
    }
    {
      cookieData.punch &&
      newAreas.push(
        {
          area: 'Punch',
          link: '/punch',
          image: 'punch',
          areaType: 'production',
        }
      )
    }
    {
      cookieData.saw &&
      newAreas.push(
        {
          area: 'Saw',
          link: '/saw',
          image: 'saw',
          areaType: 'production',
        }
      )
    }
    {
      cookieData.shear &&
      newAreas.push(
        {
          area: 'Shear',
          link: '/shear',
          image: 'shear',
          areaType: 'production',
        }
      )
    }
    {
      cookieData.laser &&
      newAreas.push(
        {
          area: 'Static Laser',
          link: '/staticlaser',
          image: 'slaser',
          areaType: 'production',
        }
      )
    }
    {
      cookieData.tlaser &&
      newAreas.push(
        {
          area: 'Tube Laser',
          link: '/tubelaser',
          image: 'tlaser',
          areaType: 'production',
        }
      )
    }
    {
      (cookieData.engineering || cookieData.quality) &&
      newAreas.push(
        {
          area: 'QC Info',
          link: '/qualityinfo',
          image: 'qcInfo',
          areaType: 'tooling',
        }
      )
    }
    {
      (cookieData.engineering || cookieData.quality || cookieData.machining) &&
      newAreas.push(
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
        }
      )
    }
    {
      (cookieData.engineering || cookieData.forming) &&
      newAreas.push(
        {
          area: 'Bend Deduction',
          link: '/benddeduction',
          image: 'bd',
          areaType: 'tooling',
        }
      )
    }
    {
      (cookieData.purchasing) &&
      newAreas.push(
        {
          area: 'Purchasing',
          link: '/purchasing',
          image: 'bd',
          areaType: 'misc',
        }
      )
    }

    setAreas(newAreas);
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
                  <MonarchButton onClick={handleLogout}>
                    Logout
                  </MonarchButton>
                </Box>
              </NavLink>
            </Box>
          )}
        </>
      ) : (
        <NavLink to="/login" style={{ textDecoration: 'none' }}>
          <Box sx={{ textAlign: 'center', mt: 5 }}>
            <MonarchButton>
              Log In
            </MonarchButton>
          </Box>
        </NavLink>
      )}
    </Box>
  );
}