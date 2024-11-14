import { Box, Dialog, DialogActions, DialogContent, DialogTitle, List, ListItem, Typography } from '@mui/material';
import { CopyToClipboard } from 'react-copy-to-clipboard';

import CancelButton from '../shared/CancelButton';

const AllMaterialsModal = ({
  show,
  handleClose,
  selectedJob,
  setShowToast,
  setPartCopy
}) => {
  return (
    <Dialog open={show} onClose={handleClose} fullWidth>
      <DialogTitle>
        <Box sx={{ textAlign: 'center' }}>
          <Typography sx={{ fontWeight: 'bold', fontSize: '28px' }}>
            Job {selectedJob ? selectedJob.JobNo : ''}
          </Typography>
          <Typography sx={{ fontWeight: 'bold', fontSize: '28px' }}>
            All Materials
          </Typography>
        </Box>
      </DialogTitle>
      <DialogContent>
        {selectedJob && (
          <List sx={{ textAlign: 'center', alignItems: 'center' }}>
            {selectedJob.SubPartNo.map((subPart, index) => (
              <ListItem key={index} sx={{ justifyContent: 'center' }}>
                <CopyToClipboard
                  text={subPart}
                  onCopy={() => {
                    setShowToast(true);
                    setPartCopy(`${subPart}`);
                  }}
                >
                  <Typography sx={{ textAlign: 'center' }}>{subPart}</Typography>
                </CopyToClipboard>
              </ListItem>
            ))}
          </List>
        )}
      </DialogContent>
      <DialogActions>
        <Box sx={{ width: '100%', display: 'flex', justifyContent: 'center', gap: 2, paddingBottom: 2 }}>
          <CancelButton onClick={handleClose}>
            Close
          </CancelButton>
        </Box>
      </DialogActions>
    </Dialog>
  );
};

export default AllMaterialsModal;
