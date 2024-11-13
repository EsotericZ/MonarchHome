import { useEffect, useState } from 'react';
import { Box, Typography } from '@mui/material';

import { useUserContext } from '../../context/UserContext';

import PageContainer from '../../components/shared/PageContainer';;

export const BendDeduction = () => {
  const { cookieData } = useUserContext();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(false);
  }, [loading]);

  return (
    <PageContainer loading={loading} title='Bend Deduction'>
      <Box sx={{ padding: '12px' }}>
        <Typography>New Site in Progress</Typography>
      </Box>
    </PageContainer>
  );
}