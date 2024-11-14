import { useEffect, useState } from 'react';
import { Box } from '@mui/material';

import DepartmentCard from '../../components/shared/DepartmentCard';
import PageContainer from '../../components/shared/PageContainer';

export const Specialty = () => {
  const [areas, setAreas] = useState([]);

  useEffect(() => {
    setAreas([
      {
        area: 'Efficiency',
        link: '/efficiency',
        image: 'efficiency',
        areaType: 'specialty',
      },
      {
        area: 'Sheet Inventory',
        link: '/sheetInventory',
        image: 'sheetInventory',
        areaType: 'specialty',
      },
      {
        area: 'VTiger',
        link: '/vtiger',
        image: 'vtiger',
        areaType: 'specialty',
      },
    ]);
  }, []);

  return (
    <PageContainer title='Specialty'>
      <Box sx={{ display: 'flex', justifyContent: 'center', flexWrap: 'wrap', gap: 2 }}>
        {areas.map((area, index) => (
          <DepartmentCard key={index} area={area} />
        ))}
      </Box>
    </PageContainer>
  );
};