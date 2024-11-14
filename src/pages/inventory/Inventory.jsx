import { useEffect, useState } from 'react';
import { Box, Typography } from '@mui/material';
import { format, parseISO } from 'date-fns';
import { CopyToClipboard } from 'react-copy-to-clipboard';

// import { useUserContext } from '../../context/UserContext';

import PageContainer from '../../components/shared/PageContainer';

export const Inventory = () => {
  // const { cookieData } = useUserContext();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(false);
  }, [loading]);

  return (
    <PageContainer loading={loading} title='Inventory Home'>
      <Box sx={{ padding: '12px' }}>
        <Typography>Under Construction</Typography>
      </Box>
    </PageContainer>
  );
};