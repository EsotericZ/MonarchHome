import { Box, Checkbox, Dialog, DialogActions, DialogContent, DialogTitle, FormControlLabel, TextField } from '@mui/material';

import CancelButton from '../shared/CancelButton';
import SaveButton from '../shared/SaveButton';

const EditModal = ({
  open,
  onClose,
  blNotes = '',
  setBlNotes,
  osvNotes = '',
  setOsvNotes,
  cdate = '',
  setCdate,
  email = false,
  setEmail,
  toggleEmail,
  hold = false,
  setHold,
  toggleHold,
  id,
  handleCancel,
  handleUpdate,
}) => {
  return (
    <Dialog open={open} onClose={onClose} maxWidth='sm' fullWidth>
      <DialogTitle>Backlog Status</DialogTitle>
      <DialogContent>
        <TextField
          label='Backlog Notes'
          multiline
          rows={4}
          value={blNotes || ''}
          onChange={(e) => setBlNotes(e.target.value)}
          fullWidth
          margin='normal'
          variant='outlined'
        />
        <TextField
          label='OSV Status'
          value={osvNotes || ''}
          onChange={(e) => setOsvNotes(e.target.value)}
          fullWidth
          margin='normal'
          variant='outlined'
        />
        <TextField
          label='Commitment Date'
          type='date'
          value={cdate || ''}
          onChange={(e) => setCdate(e.target.value)}
          fullWidth
          margin='normal'
          InputLabelProps={{ shrink: true }}
        />
        <Box sx={{ display: 'flex', justifyContent: 'center', gap: 4, mt: 2 }}>
          <FormControlLabel
            control={
              <Checkbox
                checked={Boolean(email)}
                onChange={(e) => {
                  setEmail(e.target.checked);
                  toggleEmail(id);
                }}
              />
            }
            label='Email/Expedite'
          />
          <FormControlLabel
            control={
              <Checkbox
                checked={Boolean(hold)}
                onChange={(e) => {
                  setHold(e.target.checked);
                  toggleHold(id);
                }}
              />
            }
            label='Hold'
          />
        </Box>
      </DialogContent>
      <DialogActions sx={{ justifyContent: 'center' }}>
        <CancelButton onClick={handleCancel}>
          Cancel
        </CancelButton>
        <SaveButton onClick={handleUpdate}>
          Save
        </SaveButton>
      </DialogActions>
    </Dialog>
  );
};

export default EditModal;