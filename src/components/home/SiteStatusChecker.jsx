import { useEffect, useState } from 'react';
import { Box, Typography, CircularProgress } from '@mui/material';

import apiRFID from '../../api/apiRFID';
import apiScales from '../../api/apiScales';

const sitesToCheck = [
  { name: 'RFID API', api: apiRFID, endpoint: '/' },
  { name: 'Scale API', api: apiScales, endpoint: '/scale_api/Scale/GetScales' },
];

const SiteStatusChecker = () => {
  const [siteStatuses, setSiteStatuses] = useState([]);

  const checkSites = async () => {
    const statuses = await Promise.all(
      sitesToCheck.map(async (site) => {
        try {
          const response = await site.api.get(site.endpoint);
          return { name: site.name, status: response.status === 200 ? 'Online' : 'Offline' };
        } catch (error) {
          return { name: site.name, status: 'Offline' };
        }
      })
    );
    setSiteStatuses(statuses);
  };

  useEffect(() => {
    checkSites();
    const interval = setInterval(checkSites, 10000);
    return () => clearInterval(interval);
  }, []);

  return (
    <Box sx={{ padding: '16px', textAlign: 'center' }}>
      <Typography variant='h5' sx={{ fontWeight: 'bold', mb: 2 }}>Site Status</Typography>
      {siteStatuses.length === 0 ? (
        <CircularProgress />
      ) : (
        <Box sx={{ display: 'flex', justifyContent: 'center', gap: 6 }}>
          {siteStatuses.map((site, index) => (
            <Box key={index} sx={{ textAlign: 'center' }}>
              <Typography variant='body1' sx={{ fontWeight: 'bold' }}>
                {site.name}
              </Typography>
              <Typography
                variant='body2'
                sx={{
                  color: site.status === 'Online' ? 'green' : 'red',
                }}
              >
                {site.status === 'Online' ? '🟢 Online' : '🔴 Offline'}
              </Typography>
            </Box>
          ))}
        </Box>
      )}
    </Box>
  );
};

export default SiteStatusChecker;