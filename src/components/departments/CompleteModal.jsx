import { Box, Button, Dialog, DialogActions, DialogTitle, Typography } from '@mui/material';

const CompleteModal = ({
  show,
  handleClose,
  toggleComplete,
  jobProgramNo
}) => {
  return (
    <Dialog open={show} onClose={handleClose} fullWidth>
      <DialogTitle>
        <Typography sx={{ fontWeight: 'bold', textAlign: 'center', fontSize: '30px' }}>
          Complete Program {jobProgramNo}
        </Typography>
      </DialogTitle>
      <DialogActions>
        <Box sx={{ width: '100%', display: 'flex', justifyContent: 'center', gap: 2, paddingBottom: 2 }}>
          <Button onClick={handleClose} variant="contained" color="error">
            Cancel
          </Button>
          <Button onClick={toggleComplete} variant="contained" color="success">
            Verify
          </Button>
        </Box>
      </DialogActions>
    </Dialog>
  );
};

export default CompleteModal;
