import { Box, Dialog, DialogActions, DialogContent, DialogTitle, FormControl, InputLabel, MenuItem, Select, TextField } from '@mui/material';

import CancelButton from '../shared/CancelButton';
import SaveButton from '../shared/SaveButton';

const SuppliesModal = ({
  show,
  handleClose,
  handleSave,
  supplies,
  setSupplies,
  requestedBy,
  setRequestedBy,
  department,
  setDepartment,
  notes,
  setNotes,
  productLink,
  setProductLink,
  jobNo,
  setJobNo,
  isEdit = false,
}) => {
  return (
    <Dialog open={show} onClose={handleClose} fullWidth>
      <DialogTitle sx={{ textAlign: 'center', fontWeight: 'bold' }}>
        {isEdit ? 'Edit Request' : 'Add Request'}
      </DialogTitle>
      <DialogContent>
        <TextField
          label='Supplies Requested'
          fullWidth
          value={supplies}
          onChange={(e) => setSupplies(e.target.value)}
          sx={{ mb: 2, mt: 1 }}
        />
        <TextField
          label='Requested By'
          fullWidth
          value={requestedBy}
          onChange={(e) => setRequestedBy(e.target.value)}
          sx={{ mb: 2 }}
        />
        <FormControl fullWidth sx={{ mb: 2 }}>
          <InputLabel id='department-label'>Department</InputLabel>
          <Select
            labelId='department-label'
            value={department}
            onChange={(e) => {
              setDepartment(e.target.value);
              document.activeElement.blur();
            }}
            label='Department'
            onClose={() => document.activeElement.blur()}
            inputProps={{
              'aria-label': 'Department',
            }}
          >
            <MenuItem value=''>
              <em>None</em>
            </MenuItem>
            <MenuItem value='Welding'>Welding</MenuItem>
            <MenuItem value='Paint'>Paint</MenuItem>
            <MenuItem value='Shop'>Shop</MenuItem>
            <MenuItem value='Other'>Other</MenuItem>
          </Select>
        </FormControl>
        <TextField
          label='Description / Notes'
          fullWidth
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          sx={{ mb: 2 }}
        />
        <TextField
          label='Product Link'
          fullWidth
          value={productLink}
          onChange={(e) => setProductLink(e.target.value)}
          sx={{ mb: 2 }}
        />
        <TextField
          label='Job No'
          fullWidth
          value={jobNo}
          onChange={(e) => setJobNo(e.target.value)}
        />
      </DialogContent>
      <DialogActions>
        <Box sx={{ width: '100%', display: 'flex', justifyContent: 'center', gap: 2, pb: 2 }}>
          <CancelButton onClick={handleClose}>
            Cancel
          </CancelButton>
          <SaveButton onClick={handleSave}>
            {isEdit ? 'Update' : 'Save'}
          </SaveButton>
        </Box>
      </DialogActions>
    </Dialog>
  );
};

export default SuppliesModal;