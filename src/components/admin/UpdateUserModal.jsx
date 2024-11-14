import { Box, Checkbox, Dialog, DialogActions, DialogContent, DialogTitle, FormControlLabel, TextField, Typography } from '@mui/material';

import CancelButton from '../shared/CancelButton';
import SaveButton from '../shared/SaveButton';

const UpdateUserModal = ({
  open,
  onClose,
  onChange,
  onUpdate,
  employeeData,
  roleCheckboxes,
  toggleRoleHandler
}) => {
  return (
    <Dialog open={open} onClose={onClose} fullWidth>
      <DialogTitle>
        <Typography sx={{ fontWeight: 'bold', textAlign: 'center', fontSize: '30px' }}>
          Update Employee {employeeData.name}
        </Typography>
      </DialogTitle>
      <DialogContent>
        <TextField
          label="Employee Name"
          fullWidth
          defaultValue={employeeData.name}
          name="name"
          onChange={onChange}
          sx={{ mb: 2, mt: 1 }}
        />
        <TextField
          label="Username"
          fullWidth
          defaultValue={employeeData.username}
          name="username"
          onChange={onChange}
          sx={{ mb: 2, mt: 1 }}
        />
        <TextField
          label="Employee Number"
          fullWidth
          defaultValue={employeeData.number}
          name="number"
          onChange={onChange}
          sx={{ mb: 2, mt: 1 }}
        />
        <TextField
          label="Password"
          fullWidth
          defaultValue={employeeData.password}
          name="password"
          type="password"
          onChange={onChange}
          sx={{ mb: 2, mt: 1 }}
        />

        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2, mt: 3 }}>
          {roleCheckboxes.map((role) => (
            <FormControlLabel
              key={role.label}
              control={
                <Checkbox
                  checked={role.checked}
                  onChange={(e) => toggleRoleHandler(role.name, e.target.checked)}
                />
              }
              label={role.label}
            />
          ))}
        </Box>
      </DialogContent>
      <DialogActions>
        <Box sx={{ width: '100%', display: 'flex', justifyContent: 'center', gap: 2, paddingBottom: 2 }}>
          <CancelButton onClick={onClose}>
            Cancel
          </CancelButton>
          <SaveButton onClick={onUpdate}>
            Save
          </SaveButton>
        </Box>
      </DialogActions>
    </Dialog>
  );
};

export default UpdateUserModal;