import { Box, Dialog, DialogActions, DialogContent, DialogTitle, Table, TableBody, TableCell, TableHead, TableRow, Button } from '@mui/material';
import { format, parseISO } from 'date-fns';

import CancelButton from '../shared/CancelButton';
import DataTableCell from '../shared/DataTableCell';
import StandardTableCell from '../shared/StandardTableCell';

const CompleteModal = ({ show, handleClose, task, notes, allUsers }) => {
  if (!task) {
    return null;
  }

  const resolvedNotes = notes
    .map((note) => ({
      ...note,
      name: allUsers.find((user) => user.id === note.name)?.name || note.name,
    }))
    .sort((a, b) => new Date(a.date) - new Date(b.date));

  return (
    <Dialog
      open={show}
      onClose={handleClose}
      fullWidth
      maxWidth={false}
      sx={{ '& .MuiDialog-paper': { width: '80%' } }}
    >
      <DialogTitle sx={{ textAlign: 'center', fontWeight: 'bold' }}>
        {task.taskName}
      </DialogTitle>
      <DialogContent>
        <Table>
          <TableHead>
            <TableRow>
              <StandardTableCell width='50%'>Note</StandardTableCell>
              <StandardTableCell width='25%'>Updated By</StandardTableCell>
              <StandardTableCell width='25%'>Date</StandardTableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {resolvedNotes.map((note, index) => (
              <TableRow key={index} sx={{ backgroundColor: index % 2 === 0 ? '#f0f0f0' : '#fff' }}>
                <DataTableCell>{note.note}</DataTableCell>
                <DataTableCell>{note.name}</DataTableCell>
                <DataTableCell>{note.date && format(parseISO(note.date), 'MM/dd h:mmb')}</DataTableCell>
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

export default CompleteModal;
