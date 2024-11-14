import { Box, Dialog, DialogActions, DialogContent, DialogTitle, TextField, Typography } from '@mui/material';

import CancelButton from '../shared/CancelButton';
import SaveButton from '../shared/SaveButton';

const AddUserModal = ({ open, onClose, onChange, onSave }) => {
  return (
    <Dialog open={open} onClose={onClose} fullWidth>
      <DialogTitle>
        <Typography sx={{ fontWeight: 'bold', textAlign: 'center', fontSize: '30px' }}>
          Add User
        </Typography>
      </DialogTitle>
      <DialogContent>
        <TextField label="Employee Name" fullWidth name="name" onChange={onChange} sx={{ mb: 2, mt: 1 }} />
        <TextField label="Username" fullWidth name="username" onChange={onChange} sx={{ mb: 2, mt: 1 }} />
        <TextField label="Employee Number" fullWidth name="number" onChange={onChange} sx={{ mb: 2, mt: 1 }} />
        <TextField label="Password" fullWidth name="password" type="password" onChange={onChange} sx={{ mb: 2, mt: 1 }} />
      </DialogContent>
      <DialogActions>
        <Box sx={{ width: '100%', display: 'flex', justifyContent: 'center', gap: 2, paddingBottom: 2 }}>
          <CancelButton onClick={onClose}>
            Cancel
          </CancelButton>
          <SaveButton onClick={onSave}>
            Save
          </SaveButton>
        </Box>
      </DialogActions>
    </Dialog>
  );
};

export default AddUserModal;
