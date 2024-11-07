import { IconButton } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';

const AddButton = ({ onClick, sxProps }) => {
  return (
    <IconButton
      onClick={onClick}
      sx={{
        backgroundColor: '#111827',
        color: 'white',
        height: '52.5px',
        width: '52.5px',
        zIndex: 1000,
        position: 'fixed',
        bottom: '85px',
        right: '20px',
        '&:hover': { backgroundColor: '#374151' },
        ...sxProps,
      }}
    >
      <AddIcon fontSize="large" />
    </IconButton>
  );
};

export default AddButton;