import { Box, Card, CardContent, IconButton, Typography } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import CheckIcon from '@mui/icons-material/Check';
import CloseIcon from '@mui/icons-material/Close';

import getFolder from '../../services/maintenance/getFolder';

const RequestCard = ({ request, handleEdit, handleApprove, handleDeny }) => {
  let backgroundColor;
  switch (request.priority?.toLowerCase()) {
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
      backgroundColor = 'red';
      break;
    default:
      backgroundColor = 'white';
      break;
  }

  const handleOpenFolder = async () => {
    try {
      await getFolder(request.record);
    } catch (error) {
      console.error('There was an error opening the folder:', error);
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
            {request.area}
          </Typography>
        </Box>

        <Box sx={{ display: 'flex', flexDirection: 'column', mt: 2 }}>
          <Typography sx={{ fontSize: '17px' }}>{request.description}</Typography>
          <Typography sx={{ fontSize: '17px', mt: 1 }}>
            <strong>Request Type:</strong> {request.requestType}
          </Typography>
          <Typography sx={{ fontSize: '17px', mt: 1 }}>
            <strong>Requested By:</strong> {request.requestedBy}
          </Typography>
          <Typography 
            sx={{ fontSize: '17px', mt: 1, cursor: 'pointer' }}
            onClick={handleOpenFolder}
          >
            <strong>Record:</strong> {request.record}
          </Typography>
          <Typography sx={{ fontSize: '17px', mt: 1, mb: 1 }}>
            <strong>Equipment:</strong> {request.equipment}
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
            size="small"
            color="black"
            onClick={(e) => {
              e.stopPropagation();
              handleEdit(request);
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
            gap: 1,
          }}
        >
          <IconButton
            size="small"
            color="error"
            onClick={(e) => {
              e.stopPropagation();
              handleDeny(request);
            }}
          >
            <CloseIcon />
          </IconButton>
          <IconButton
            size="small"
            color="success"
            onClick={(e) => {
              e.stopPropagation();
              handleApprove(request);
            }}
          >
            <CheckIcon />
          </IconButton>
        </Box>
      </CardContent>
    </Card>
  );
};

export default RequestCard;