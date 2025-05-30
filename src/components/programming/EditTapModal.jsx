import { Dialog, DialogTitle, DialogContent, DialogActions, Box, TextField, FormControl, InputLabel, Select, MenuItem, Typography } from '@mui/material';

import CancelButton from '../shared/CancelButton';
import SaveButton from '../shared/SaveButton';

const EditTapModal = ({
  open,
  onClose,
  tapName,
  setTapName,
  holeSize,
  setHoleSize,
  type,
  setType,
  notes,
  setNotes,
  onUpdate,
}) => {
  return (
    <Dialog open={open} onClose={onClose} fullWidth>
      <DialogTitle>
        <Typography sx={{ fontWeight: 'bold', textAlign: 'center', fontSize: '30px' }}>
          Update Tap
        </Typography>
      </DialogTitle>
      <DialogContent>
        <TextField
          label='Tap Name'
          fullWidth
          value={tapName}
          onChange={(e) => setTapName(e.target.value)}
          sx={{ mb: 2, mt: 1 }}
        />
        <TextField
          label='Hole Size'
          fullWidth
          value={holeSize}
          onChange={(e) => setHoleSize(e.target.value)}
          sx={{ mb: 2, mt: 1 }}
        />
        <FormControl fullWidth sx={{ mb: 2, mt: 1 }}>
          <InputLabel>Type</InputLabel>
          <Select
            value={type}
            onChange={(e) => setType(e.target.value)}
            label='Type'
          >
            <MenuItem value='Standard'>Standard</MenuItem>
            <MenuItem value='Metric'>Metric</MenuItem>
          </Select>
        </FormControl>
        <TextField
          label='Notes'
          fullWidth
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          sx={{ mb: 2, mt: 1 }}
        />
      </DialogContent>
      <DialogActions>
        <Box sx={{ width: '100%', display: 'flex', justifyContent: 'center', gap: 2, paddingBottom: 2 }}>
          <CancelButton onClick={onClose}>Cancel</CancelButton>
          <SaveButton onClick={onUpdate}>Save</SaveButton>
        </Box>
      </DialogActions>
    </Dialog>
  );
};

export default EditTapModal;