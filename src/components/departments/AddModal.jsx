import { Box, Dialog, DialogActions, DialogContent, DialogTitle, TextField, Typography } from '@mui/material';

import CancelButton from '../shared/CancelButton';
import SaveButton from '../shared/SaveButton';

const AddModal = ({
  show,
  handleClose,
  handleCancel,
  handleSave,
  programNo,
  setProgramNo,
  material,
  setMaterial,
  jobNo,
  setJobNo,
  areaName = '',
}) => {
  return (
    <Dialog open={show} onClose={handleClose} fullWidth>
      <DialogTitle>
        <Typography sx={{ fontWeight: 'bold', textAlign: 'center', fontSize: '30px' }}>
          Add Program
        </Typography>
      </DialogTitle>
      <DialogContent>
        <TextField
          label='Program No'
          fullWidth
          value={programNo}
          onChange={(e) => setProgramNo(e.target.value)}
          sx={{ mb: 2, mt: 1 }}
        />
        <TextField
          label='Material'
          fullWidth
          value={material}
          onChange={(e) => setMaterial(e.target.value)}
          sx={{ mb: 2, mt: 1 }}
        />
        <TextField
          label='Jobs'
          fullWidth
          value={jobNo}
          onChange={(e) => setJobNo(e.target.value)}
          sx={{ mb: 2, mt: 1 }}
        />
        <TextField
          label='Area'
          fullWidth
          defaultValue={areaName}
          sx={{ mb: 2, mt: 1 }}
          disabled
        />
      </DialogContent>
      <DialogActions>
        <Box sx={{ width: '100%', display: 'flex', justifyContent: 'center', gap: 2, paddingBottom: 2 }}>
          <CancelButton onClick={handleCancel}>
            Cancel
          </CancelButton>
          <SaveButton onClick={handleSave}>
            Save
          </SaveButton>
        </Box>
      </DialogActions>
    </Dialog>
  );
};

export default AddModal;