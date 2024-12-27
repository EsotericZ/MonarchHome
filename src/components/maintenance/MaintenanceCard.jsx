import { Box, Card, CardContent, IconButton, Typography } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import SpeakerNotesIcon from '@mui/icons-material/SpeakerNotes';

import getFolder from '../../services/maintenance/getFolder';

const MaintenanceCard = ({ maintenance, handleEdit, handleViewNotes }) => {
  let backgroundColor;
  switch (maintenance.priority.toLowerCase()) {
    case 'low':
      backgroundColor = 'lightblue';
      break;
    case 'medium':
      backgroundColor = 'lightgreen';
      break;
    case 'high':
      backgroundColor = 'orange';
      break;
    case 'urgent':
      backgroundColor = '#E57373';
      break;
    default:
      backgroundColor = 'white';
      break;
  }

  const handleOpenFolder = async () => {
    try {
      await getFolder(maintenance.record);
    } catch (error) {
      'There was an errror'
    }
  };

  return (
    <Card
      sx={{
        width: '400px',
        margin: '10px',
        padding: '5px',
        backgroundColor,
        position: 'relative',
      }}
    >
      <CardContent>
        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', width: '100%' }}>
          <Typography sx={{ fontWeight: 'bold', fontSize: '24px' }}>
            {maintenance.area}
          </Typography>
        </Box>

        <Box sx={{ display: 'flex', flexDirection: 'column', mt: 2, mb: 1 }}>
          <Typography sx={{ fontSize: '17px' }}>{maintenance.description}</Typography>
          <Typography sx={{ fontSize: '17px', mt: 1 }}>
            <strong>Request Type:</strong> {maintenance.requestType}
          </Typography>
          <Typography sx={{ fontSize: '17px', mt: 1 }}>
            <strong>Requested By:</strong> {maintenance.requestedBy}
          </Typography>
          <Typography 
            sx={{ fontSize: '17px', mt: 1, cursor: 'pointer' }}
            onClick={handleOpenFolder}
          >
            <strong>Record:</strong> {maintenance.record}
          </Typography>
          <Typography sx={{ fontSize: '17px', mt: 1, mb: 1 }}>
            <strong>Equipment:</strong> {maintenance.equipment}
          </Typography>
        </Box>

        <Box
          sx={{
            position: 'absolute',
            bottom: 10,
            left: 10,
            display: 'flex',
          }}
        >
          <IconButton
            size='small'
            color='black'
            onClick={(e) => {
              e.stopPropagation();
              handleEdit(maintenance);
            }}
          >
            <EditIcon />
          </IconButton>
          </Box>
          <Box
          sx={{
            position: 'absolute',
            bottom: 10,
            right: 10,
            display: 'flex',
          }}
        >
          <IconButton
            size='small'
            color='black'
            onClick={(e) => {
              e.stopPropagation();
              handleViewNotes(maintenance);
            }}
          >
            <SpeakerNotesIcon />
          </IconButton>
        </Box>
      </CardContent>
    </Card>
  );
};

export default MaintenanceCard;