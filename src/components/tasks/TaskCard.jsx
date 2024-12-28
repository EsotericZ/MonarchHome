import { Box, Card, CardContent, IconButton, Typography } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import SpeakerNotesIcon from '@mui/icons-material/SpeakerNotes';

const TaskCard = ({ task, handleUpdateTask, handleOpenNotesModal }) => {
  let backgroundColor;
  switch (task.priority) {
    case 'Low':
      backgroundColor = 'lightblue';
      break;
    case 'Medium':
      backgroundColor = 'lightgreen';
      break;
    case 'High':
      backgroundColor = 'orange';
      break;
    case 'Urgent':
      backgroundColor = '#E57373';
      break;
    default:
      backgroundColor = 'white';
      break;
  }

  let taskStatus;
  switch (task.status) {
    case 'Active':
      taskStatus = 'Currently Working';
      break;
    case 'Process':
      taskStatus = 'Future';
      break;
    case 'Hold':
      taskStatus = 'On Hold';
      break;
    case 'Complete':
      taskStatus = 'Completed';
      break;
    default:
      taskStatus = '';
      break;
  }

  return (
    <Card
      sx={{
        width: '400px',
        margin: '10px',
        padding: '5px',
        backgroundColor,
        cursor: 'pointer',
        position: 'relative',
      }}
      onClick={() => handleUpdateTask(task)}
    >
      <CardContent>
        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', width: '100%' }}>
          <Typography sx={{ fontWeight: 'bold', fontSize: '29px' }}>{task.taskName}</Typography>
        </Box>

        <Box sx={{ display: 'flex', marginTop: 1, marginLeft: 0 }}>
          <Box sx={{ display: 'flex', flexDirection: 'column' }}>
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <Typography sx={{ fontSize: '17px' }}>{task.description}</Typography>
            </Box>
            <Box sx={{ display: 'flex', alignItems: 'center', pt: 1 }}>
              <Typography sx={{ fontWeight: 'bold', fontSize: '17px', pr: 1 }}>Assigned By:</Typography>
              <Typography sx={{ fontSize: '17px' }}>{task.assigner.name}</Typography>
            </Box>
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <Typography sx={{ fontWeight: 'bold', fontSize: '17px', pr: 1 }}>Status:</Typography>
              <Typography sx={{ fontSize: '17px' }}>{taskStatus}</Typography>
            </Box>
          </Box>
        </Box>

        <Box
          sx={{
            position: 'absolute',
            bottom: 10,
            right: 10,
            display: 'flex',
          }}
        >
          <IconButton size='small' color='black' onClick={(e) => { e.stopPropagation(); handleUpdateTask(task); }}>
            <EditIcon />
          </IconButton>
          <IconButton size='small' color='black' onClick={(e) => { e.stopPropagation(); handleOpenNotesModal(task); }}>
            <SpeakerNotesIcon />
          </IconButton>
        </Box>
      </CardContent>
    </Card>
  );
};

export default TaskCard;