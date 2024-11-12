import { Box, Button, Dialog, DialogActions, DialogContent, DialogTitle, TextField, Typography } from '@mui/material';

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
          <Button onClick={onClose} color="error" variant="contained">Cancel</Button>
          <Button onClick={onSave} color="success" variant="contained">Save</Button>
        </Box>
      </DialogActions>
    </Dialog>
  );
};

export default AddUserModal;
