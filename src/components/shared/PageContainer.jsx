import { Box, Typography } from '@mui/material';
import PuffLoader from 'react-spinners/PuffLoader';

const PageContainer = ({ loading, title, children }) => {
  return (
    <Box sx={{ width: '100%', textAlign: 'center', overflowY: 'auto', height: '100vh' }}>
      {loading ? (
        <Box>
          <Typography variant='h4' sx={{ fontWeight: 'bold', margin: '16px' }}>{title}</Typography>
          <Box sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', marginTop: '100px' }}>
            <PuffLoader color='red' />
          </Box>
        </Box>
      ) : (
        <Box sx={{ width: '100%' }}>
          <Typography variant='h4' sx={{ fontWeight: 'bold', margin: '16px' }}>{title}</Typography>
          {children}
        </Box>
      )}
    </Box>
  );
};

export default PageContainer;