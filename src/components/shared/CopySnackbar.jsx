import { Alert, Snackbar } from '@mui/material';

const CopySnackbar = ({ show, onClose, message, severity = 'success', autoHideDuration = 3000, anchorOrigin = { vertical: 'bottom', horizontal: 'right' }, sxProps = { marginRight: '100px' } }) => {
  return (
    <Snackbar
      open={show}
      autoHideDuration={autoHideDuration}
      onClose={onClose}
      anchorOrigin={anchorOrigin}
      sx={sxProps}
    >
      <Alert onClose={onClose} severity={severity} sx={{ width: '100%' }}>
        <strong>{message}</strong>
      </Alert>
    </Snackbar>
  );
};

export default CopySnackbar;
