import {
  Box,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
} from '@mui/material';
import { format, parseISO } from 'date-fns';

import CancelButton from '../shared/CancelButton';

const CompletedModal = ({ show, handleClose, record, notes }) => {
  if (!record) {
    return null;
  }

  const sortedNotes = notes.sort((a, b) => new Date(a.date) - new Date(b.date));

  return (
    <Dialog
      open={show}
      onClose={handleClose}
      fullWidth
      maxWidth='md'
      sx={{ '& .MuiDialog-paper': { width: '80%' } }}
    >
      <DialogTitle>
        <Box sx={{ fontWeight: 'bold', textAlign: 'center', fontSize: '24px' }}>
          Maintenance Notes for Record #{record.record}
        </Box>
      </DialogTitle>
      <DialogContent>
        <Box sx={{ textAlign: 'center', fontSize: '16px', mb: 2 }}>
          {record.description}
        </Box>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell sx={{ textAlign: 'center', fontWeight: 'bold' }}>Note</TableCell>
              <TableCell sx={{ textAlign: 'center', fontWeight: 'bold' }}>Added By</TableCell>
              <TableCell sx={{ textAlign: 'center', fontWeight: 'bold' }}>Date</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {sortedNotes.map((note, index) => (
              <TableRow key={index} sx={{ backgroundColor: index % 2 === 0 ? '#f9f9f9' : '#fff' }}>
                <TableCell>{note.note}</TableCell>
                <TableCell sx={{ textAlign: 'center' }}>{note.name || 'Unknown'}</TableCell>
                <TableCell sx={{ textAlign: 'center' }}>
                  {note.date ? format(parseISO(note.date), 'MM/dd/yyyy h:mm a') : 'N/A'}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </DialogContent>
      <DialogActions>
        <Box sx={{ width: '100%', display: 'flex', justifyContent: 'center' }}>
          <CancelButton onClick={handleClose}>
            Close
          </CancelButton>
        </Box>
      </DialogActions>
    </Dialog>
  );
};

export default CompletedModal;