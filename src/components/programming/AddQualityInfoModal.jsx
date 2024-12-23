import { Box, Checkbox, Dialog, DialogActions, DialogContent, DialogTitle, FormControlLabel, TextField, Typography } from '@mui/material';

import CancelButton from '../shared/CancelButton';
import SaveButton from '../shared/SaveButton';

const AddQualityInfoModal = ({
  open,
  onClose,
  custCode,
  setCustCode,
  coc,
  setCOC,
  matlCert,
  setMatlCert,
  platCert,
  setPlatCert,
  addInfo,
  setAddInfo,
  notes,
  setNotes,
  onSave,
}) => {
  return (
    <Dialog open={open} onClose={onClose} fullWidth>
      <DialogTitle>
        <Typography sx={{ fontWeight: 'bold', textAlign: 'center', fontSize: '30px' }}>
          Add New
        </Typography>
      </DialogTitle>
      <DialogContent>
        <TextField
          label='Customer Code'
          fullWidth
          value={custCode}
          onChange={(e) => setCustCode(e.target.value)}
          sx={{ mb: 2, mt: 1 }}
        />
        <Box sx={{ display: 'flex', flexDirection: 'column' }}>
          <FormControlLabel
            control={<Checkbox checked={coc} onChange={(e) => setCOC(e.target.checked)} />}
            label='Certificate of Conformance Required'
          />
          <FormControlLabel
            control={<Checkbox checked={matlCert} onChange={(e) => setMatlCert(e.target.checked)} />}
            label='Material Certs Required'
          />
          <FormControlLabel
            control={<Checkbox checked={platCert} onChange={(e) => setPlatCert(e.target.checked)} />}
            label='Plating Certs Required'
          />
          <FormControlLabel
            control={<Checkbox checked={addInfo} onChange={(e) => setAddInfo(e.target.checked)} />}
            label='First Article'
          />
        </Box>
        <TextField
          label='Notes'
          multiline
          rows={4}
          fullWidth
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          sx={{ mt: 2 }}
        />
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

export default AddQualityInfoModal;