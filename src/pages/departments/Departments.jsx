import { useEffect, useState } from 'react';
import { Box, Typography } from '@mui/material';
import { DepartmentCard } from '../../components/DepartmentCard';

export const Departments = () => {
  const [areas, setAreas] = useState([]);

  useEffect(() => {
    setAreas([
      {
        area: 'Fixture Laser',
        link: '/fixturelaser',
        image: 'flaser',
        areaType: 'production',
      },
      {
        area: 'Forming',
        link: '/forming',
        image: 'forming',
        areaType: 'production',
      },
      {
        area: 'Laser',
        link: '/laser',
        image: 'laser',
        areaType: 'production',
      },
      {
        area: 'Punch',
        link: '/punch',
        image: 'punch',
        areaType: 'production',
      },
      {
        area: 'Saw',
        link: '/saw',
        image: 'saw',
        areaType: 'production',
      },
      {
        area: 'Shear',
        link: '/shear',
        image: 'shear',
        areaType: 'production',
      },
      {
        area: 'Static Laser',
        link: '/staticlaser',
        image: 'slaser',
        areaType: 'production',
      },
      {
        area: 'Tube Laser',
        link: '/tubelaser',
        image: 'tlaser',
        areaType: 'production',
      },
    ]);
  }, []);

  return (
    <Box sx={{ width: '100%', textAlign: 'center', overflowY: 'auto', height: '100vh' }}>
      <Box sx={{ display: 'block', width: '100%', padding: 2 }}>
        <Typography variant='h4' sx={{ fontWeight: 'bold', margin: '16px' }}>
          Departments
        </Typography>
        <Box sx={{ display: 'flex', justifyContent: 'center', flexWrap: 'wrap', gap: 2 }}>
          {areas.map((area, index) => (
            <DepartmentCard key={index} area={area} />
          ))}
        </Box>
      </Box>
    </Box>
  );
};