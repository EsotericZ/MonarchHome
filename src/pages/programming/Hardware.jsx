import { useEffect, useState } from 'react';
import { Box, Typography } from '@mui/material';
import { useUserContext } from '../../context/UserContext';

import PuffLoader from 'react-spinners/PuffLoader';

export const Hardware = () => {
  const { cookieData } = useUserContext();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(false);
  }, [loading]);

  return (
    <Box sx={{ width: '100%', textAlign: 'center', overflowY: 'auto', height: '100vh' }}>
      {loading ? (
        <Box>
          <Typography variant='h4' sx={{ fontWeight: 'bold', margin: '16px' }}>Hardware</Typography>
          <Box sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', marginTop: '100px' }}>
            <PuffLoader color='red' />
          </Box>
        </Box>
      ) : (
        <Box sx={{ width: '100%' }}>
          <Typography variant='h4' sx={{ fontWeight: 'bold', margin: '16px' }}>Hardware</Typography>
          <Box sx={{ padding: '12px' }}>
            <Typography>Under Construction</Typography>
          </Box>  
        </Box>
      )}
    </Box>
  );
};