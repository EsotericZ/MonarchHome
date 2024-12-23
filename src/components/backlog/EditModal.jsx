import { Box, Button, Checkbox, Dialog, DialogActions, DialogContent, DialogTitle, FormControlLabel, TextField } from '@mui/material';

const EditModal = ({
  open,
  onClose,
  blNotes,
  setBlNotes,
  osvNotes,
  setOsvNotes,
  cdate,
  setCdate,
  email,
  setEmail,
  toggleEmail,
  hold,
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
          value={blNotes}
          onChange={(e) => setBlNotes(e.target.value)}
          fullWidth
          margin='normal'
          variant='outlined'
        />
        <TextField
          label='OSV Status'
          value={osvNotes}
          onChange={(e) => setOsvNotes(e.target.value)}
          fullWidth
          margin='normal'
          variant='outlined'
        />
        <TextField
          label='Commitment Date'
          type='date'
          value={cdate}
          onChange={(e) => setCdate(e.target.value)}
          fullWidth
          margin='normal'
          InputLabelProps={{ shrink: true }}
        />
        <Box sx={{ display: 'flex', justifyContent: 'center', gap: 4, mt: 2 }}>
          <FormControlLabel
            control={
              <Checkbox
                checked={email}
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
                checked={hold}
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
        <Button variant='outlined' color='secondary' onClick={handleCancel}>
          Cancel
        </Button>
        <Button variant='contained' color='primary' onClick={handleUpdate}>
          Save
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default EditModal;