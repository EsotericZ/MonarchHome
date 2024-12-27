import { Box, Dialog, DialogActions, DialogContent, DialogTitle, FormControl, InputLabel, MenuItem, Select, TextField, Typography } from '@mui/material';

import CancelButton from '../shared/CancelButton';
import SaveButton from '../shared/SaveButton';

const EditRequestModal = ({
  open,
  onClose,
  onSave,
  handleChange,
  formData,
  record,
}) => {
  const capitalizeFirstLetter = (string) =>
    string.charAt(0).toUpperCase() + string.slice(1);

  return (
    <Dialog open={open} onClose={onClose} fullWidth>
      <DialogTitle>
        <Typography
          sx={{ fontWeight: 'bold', textAlign: 'center', fontSize: '30px' }}
        >
          Update: Record #{record}
        </Typography>
      </DialogTitle>
      <DialogContent>
        <Box component='form' sx={{ display: 'flex', flexDirection: 'column', gap: 2, pt: 1 }}>
          <TextField
            label='Requested By'
            name='requestedBy'
            fullWidth
            value={formData.requestedBy || ''}
            onChange={handleChange}
            disabled
          />
          <TextField
            label='Area'
            name='area'
            fullWidth
            value={formData.area || ''}
            onChange={handleChange}
          />
          <TextField
            label='Equipment'
            name='equipment'
            fullWidth
            value={formData.equipment || ''}
            onChange={handleChange}
            disabled
          />
          <TextField
            label='Request Type'
            name='requestType'
            fullWidth
            value={formData.requestType || ''}
            onChange={handleChange}
          />
          <TextField
            label='Description'
            name='description'
            fullWidth
            value={formData.description || ''}
            onChange={handleChange}
          />
                    <FormControl fullWidth>
            <InputLabel id="priority-label">Priority</InputLabel>
            <Select
              labelId="priority-label"
              name="priority"
              value={formData.priority || ''}
              onChange={handleChange}
            >
              <MenuItem value="low">Low</MenuItem>
              <MenuItem value="medium">Medium</MenuItem>
              <MenuItem value="high">High</MenuItem>
              <MenuItem value="urgent">Urgent</MenuItem>
            </Select>
          </FormControl>
          {/* <TextField
            label='Comments'
            name='comments'
            fullWidth
            multiline
            rows={3}
            value={formData.comments || ''}
            onChange={handleChange}
          /> */}
        </Box>
      </DialogContent>
      <DialogActions>
        <Box sx={{ width: '100%', display: 'flex', justifyContent: 'center', gap: 2, paddingBottom: 2 }}>
          <CancelButton onClick={onClose}>Cancel</CancelButton>
          <SaveButton onClick={onSave}>Save</SaveButton>
        </Box>
      </DialogActions>
    </Dialog>
  );
};

export default EditRequestModal;