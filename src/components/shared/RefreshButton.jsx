import { IconButton } from '@mui/material';
import RefreshIcon from '@mui/icons-material/Refresh';

const RefreshButton = ({ onClick, sxProps }) => {
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
        bottom: '20px',
        right: '20px',
        '&:hover': { backgroundColor: '#374151' },
        ...sxProps, // Allows additional custom styles to be passed
      }}
    >
      <RefreshIcon fontSize="large" />
    </IconButton>
  );
};

export default RefreshButton;