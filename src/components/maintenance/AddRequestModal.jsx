import { Box, Dialog, DialogActions, DialogContent, DialogTitle, FormControl, InputLabel, MenuItem, Select, TextField, Typography } from '@mui/material';

import CancelButton from '../shared/CancelButton';
import SaveButton from '../shared/SaveButton';

const AddRequestModal = ({
  open,
  onClose,
  onSave,
  handleChange,
  equipment,
  formData,
  cookieData,
}) => {
  return (
    <Dialog open={open} onClose={onClose} fullWidth>
      <DialogTitle>
        <Typography sx={{ fontWeight: 'bold', textAlign: 'center', fontSize: '30px' }}>
          Add Request
        </Typography>
      </DialogTitle>
      <DialogContent>
        <Box component="form" sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          <TextField
            label="Requested By"
            fullWidth
            value={formData.requestedBy || cookieData.name}
            onChange={handleChange}
            sx={{ mt: 1 }}
          />
          <TextField
            label="Area"
            name="area"
            fullWidth
            value={formData.area || ''}
            onChange={handleChange}
            sx={{ mt: 1 }}
          />
          <FormControl fullWidth>
            <InputLabel id="equipment-label">Equipment</InputLabel>
            <Select
              labelId="equipment-label"
              name="equipment"
              fullWidth
              value={formData.equipment || ''}
              onChange={handleChange}
              sx={{ mt: 1 }}
            >
              <MenuItem value="">
                <em>None</em>
              </MenuItem>
              {equipment.map((item, index) => (
                <MenuItem key={index} value={item.PartNo}>
                  {item.PartNo} - {item.dropDown}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <FormControl fullWidth>
            <InputLabel id="requestType-label">Request Type</InputLabel>
            <Select
              labelId="requestType-label"
              name="requestType"
              fullWidth
              value={formData.requestType || ''}
              onChange={handleChange}
              sx={{ mt: 1 }}
            >
              <MenuItem value="Routine">Routine</MenuItem>
              <MenuItem value="Emergency">Emergency</MenuItem>
              <MenuItem value="Safety">Safety</MenuItem>
              <MenuItem value="Planned">Planned</MenuItem>
            </Select>
          </FormControl>
          <TextField
            label="Description"
            name="description"
            fullWidth
            value={formData.description || ''}
            onChange={handleChange}
            sx={{ mt: 1 }}
          />
        </Box>
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

export default AddRequestModal;