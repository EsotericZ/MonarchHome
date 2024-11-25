import { Box, Dialog, DialogActions, DialogContent, DialogTitle, FormControl, InputLabel, MenuItem, Select, TextField, Typography } from '@mui/material';

import CancelButton from '../shared/CancelButton';
import SaveButton from '../shared/SaveButton';

const EditTaskModal = ({
  showEdit,
  handleClose,
  handleUpdate,
  assignedBy,
  assignedTo,
  setAssignedTo,
  taskName,
  setTaskName,
  description,
  setDescription,
  priority,
  setPriority,
  status,
  setStatus,
  allUsers,
}) => {
  return (
    <Dialog open={showEdit} onClose={handleClose} fullWidth>
      <DialogTitle sx={{ textAlign: 'center', fontWeight: 'bold' }}>
        Create Task
      </DialogTitle>
      <DialogContent>
        <TextField
          label="Assigned By"
          fullWidth
          value={assignedBy}
          disabled
          sx={{
            mb: 2,
            mt: 1,
            '& .MuiInputBase-input.Mui-disabled': {
              WebkitTextFillColor: 'black',
            },
            '& .MuiInputLabel-root.Mui-disabled': {
              color: 'rgba(0, 0, 0, 0.6)',
            },
          }}
        />
        <FormControl fullWidth sx={{ mb: 2 }}>
          <InputLabel
            id="assigned-to-label"
            sx={{
              backgroundColor: 'white',
              px: 0.5, 
              transform: 'translate(14px, -6px) scale(0.75)',
            }}
          >
            Assigned To
          </InputLabel>
          <Select
            labelId="assigned-to-label"
            multiple
            value={assignedTo}
            onChange={(event) => setAssignedTo(event.target.value)}
            renderValue={(selected) => selected.join(', ')}
            sx={{
              '& .MuiSelect-outlined': {
                paddingTop: 1.5,
                paddingBottom: 1.5,
              },
            }}
            MenuProps={{
              PaperProps: {
                style: {
                  maxHeight: 224,
                  width: 250,
                },
              },
            }}
          >
            {Array.isArray(allUsers) &&
              allUsers.map((user) => (
                <MenuItem key={user.id} value={user.name}>
                  {user.name}
                </MenuItem>
              ))}
          </Select>
        </FormControl>
        <TextField
          label="Task Name"
          fullWidth
          value={taskName}
          onChange={(e) => setTaskName(e.target.value)}
          sx={{ mb: 2 }}
        />
        <TextField
          label="Description"
          fullWidth
          multiline
          rows={3}
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          sx={{ mb: 2 }}
        />
        <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
          <FormControl fullWidth>
            <InputLabel id="priority-label">Priority</InputLabel>
            <Select
              labelId="priority-label"
              value={priority}
              onChange={(e) => setPriority(e.target.value)}
              label="Priority"
            >
              <MenuItem value="Low">Low</MenuItem>
              <MenuItem value="Medium">Medium</MenuItem>
              <MenuItem value="High">High</MenuItem>
              <MenuItem value="Urgent">Urgent</MenuItem>
            </Select>
          </FormControl>

          <FormControl fullWidth>
            <InputLabel id="status-label">Status</InputLabel>
            <Select
              labelId="status-label"
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              label="Status"
            >
              <MenuItem value="Active">Active</MenuItem>
              <MenuItem value="Process">Future</MenuItem>
              <MenuItem value="Hold">On Hold</MenuItem>
              <MenuItem value="Complete">Complete</MenuItem>
            </Select>
          </FormControl>
        </Box>
      </DialogContent>

      <DialogActions>
        <Box sx={{ width: '100%', display: 'flex', justifyContent: 'center', gap: 2, pb: 2 }}>
          <CancelButton onClick={handleClose}>Cancel</CancelButton>
          <SaveButton onClick={handleUpdate}>Update</SaveButton>
        </Box>
      </DialogActions>
    </Dialog>
  );
};

export default EditTaskModal;