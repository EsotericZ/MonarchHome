import React from 'react';
import { Box, Button, Dialog, DialogActions, DialogContent, DialogTitle, List, ListItem, Typography } from '@mui/material';
import { CopyToClipboard } from 'react-copy-to-clipboard';

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
          <Button onClick={handleClose} variant="contained" color="error">
            Close
          </Button>
        </Box>
      </DialogActions>
    </Dialog>
  );
};

export default AllMaterialsModal;
