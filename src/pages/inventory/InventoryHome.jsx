import { useEffect, useState } from 'react';
import { Box } from '@mui/material';

import DepartmentCard from '../../components/shared/DepartmentCard';
import PageContainer from '../../components/shared/PageContainer';

export const InventoryHome = () => {
  const [areas, setAreas] = useState([]);

  useEffect(() => {
    setAreas([
      {
        area: 'Inventory',
        link: '/inventory',
        image: 'inventory',
        areaType: 'inventory',
      },
      {
        area: 'Purchasing',
        link: '/purchasing',
        image: 'purchasing',
        areaType: 'inventory',
      },
      {
        area: 'Supplies',
        link: '/supplies',
        image: 'supplies',
        areaType: 'inventory',
      },
      {
        area: 'Scales',
        link: '/scales',
        image: 'scales',
        areaType: 'inventory',
      },
    ]);
  }, []);

  return (
    <PageContainer title='Inventory'>
      <Box sx={{ display: 'flex', justifyContent: 'center', flexWrap: 'wrap', gap: 2 }}>
        {areas.map((area, index) => (
          <DepartmentCard key={index} area={area} />
        ))}
      </Box>
    </PageContainer>
  );
};