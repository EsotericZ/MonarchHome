import { useEffect, useState } from 'react';
import { useUserContext } from '../../context/UserContext';
import { Box, Typography } from '@mui/material';

import DepartmentCard from '../../components/shared/DepartmentCard';

export const Programming = () => {
  const { cookieData } = useUserContext();
  const [areas, setAreas] = useState([]);
  const [tools, setTools] = useState([]);

  useEffect(() => {
    setAreas([
      {
        area: 'Engineering',
        link: '/engineering',
        image: 'engineering',
        areaType: 'programming',
      },
      {
        area: 'Machining',
        link: '/machining',
        image: 'machining',
        areaType: 'programming',
      },
      {
        area: 'Quality',
        link: '/quality',
        image: 'quality',
        areaType: 'programming',
      },
      {
        area: 'Tube Laser',
        link: '/tubelaserprog',
        image: 'tlaser',
        areaType: 'programming',
      },
      {
        area: 'Forming',
        link: '/formingprog',
        image: 'forming',
        areaType: 'programming',
      },
    ]);
  }, []);

  useEffect(() => {
    setTools([
      {
        area: 'QC Info',
        link: '/qualityinfo',
        image: 'qcInfo',
        areaType: 'tooling',
      },
      {
        area: 'Bend Deduction',
        link: '/benddeduction',
        image: 'bd',
        areaType: 'tooling',
      },
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
    ]);
  }, []);

  return (
    <Box sx={{ width: '100%', textAlign: 'center', overflowY: 'auto', height: '100vh' }}>
      <Box sx={{ display: 'block', width: '100%', padding: 2 }}>
        <Typography variant='h4' sx={{ fontWeight: 'bold', margin: '16px' }}>
          Programming
        </Typography>
        <Box sx={{ display: 'flex', justifyContent: 'center', flexWrap: 'wrap', gap: 2 }}>
          {areas.map((area, index) => (
            <DepartmentCard key={index} area={area} />
          ))}
        </Box>
        <Box sx={{ display: 'flex', justifyContent: 'center', flexWrap: 'wrap', gap: 2, marginTop: 3 }}>
          {tools.map((area, index) => (
            <DepartmentCard key={index} area={area} />
          ))}
        </Box>
      </Box>
    </Box>
  );
};