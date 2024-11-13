import { useEffect, useState } from 'react';
import { Box, Typography } from '@mui/material';

import { useUserContext } from '../../context/UserContext';

import PageContainer from '../../components/shared/PageContainer';

export const VTiger = () => {
  const { cookieData } = useUserContext();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(false);
  }, [loading]);

  return (
    <PageContainer loading={loading} title='VTiger'>
      {cookieData.specialty ? (
        <Box sx={{ padding: '12px' }}>
          <Typography>Under Construction</Typography>
        </Box>
      ) : (
        <Box sx={{ width: '100%', textAlign: 'center', overflowY: 'auto', height: '100vh', paddingTop: '25vh' }}>
          <Typography variant='h4' sx={{ fontWeight: 'bold', margin: '16px' }}>You Don't Have Access To This Page</Typography>
        </Box>
      )}
    </PageContainer>
  );
};