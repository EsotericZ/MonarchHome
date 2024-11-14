import { Box, Dialog, DialogActions, DialogTitle, Typography } from '@mui/material';

import CancelButton from '../shared/CancelButton';
import SaveButton from '../shared/SaveButton';

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
          <CancelButton onClick={handleClose}>
            Cancel
          </CancelButton>
          <SaveButton onClick={toggleComplete}>
            Verify
          </SaveButton>
        </Box>
      </DialogActions>
    </Dialog>
  );
};

export default CompleteModal;
