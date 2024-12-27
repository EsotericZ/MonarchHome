import { useState } from 'react';
import { Box, Button, Dialog, DialogActions, DialogContent, DialogTitle, IconButton, Table, TableBody, TableCell, TableHead, TableRow, TextField, Tooltip } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';

import CancelButton from '../shared/CancelButton';
import HoldButton from '../shared/HoldButton';
import SaveButton from '../shared/SaveButton';

const NotesModal = ({ show, handleClose, record, notes, handleAddNote, handleComplete, handleHold }) => {
  const [newNote, setNewNote] = useState('');

  if (!record) {
    return null;
  }

  const sortedNotes = notes
    .filter((note) => note.maintenanceId === record.record)
    .sort((a, b) => new Date(b.date) - new Date(a.date));

  const onAddNote = () => {
    if (newNote.trim()) {
      handleAddNote(record.record, newNote);
      setNewNote('');
    }
  };

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
        <Box sx={{ textAlign: 'center', fontSize: '16px' }}>
          {record.description}
        </Box>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Note</TableCell>
              <TableCell>Added By</TableCell>
              <TableCell>Date</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {sortedNotes.map((note, index) => (
              <TableRow key={index}>
                <TableCell>{note.note}</TableCell>
                <TableCell>{note.name || 'Unknown'}</TableCell>
                <TableCell>{new Date(note.date).toLocaleString()}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        <Box sx={{ display: 'flex', alignItems: 'center', mt: 2 }}>
          <TextField
            label='Add Note'
            fullWidth
            value={newNote}
            onChange={(e) => setNewNote(e.target.value)}
          />
          <Tooltip title='Add Note'>
            <IconButton color='primary' onClick={onAddNote}>
              <AddIcon />
            </IconButton>
          </Tooltip>
        </Box>
      </DialogContent>

      <DialogActions>
        <Box sx={{ width: '100%', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Box sx={{ display: 'flex', gap: 2 }}>
            <SaveButton onClick={() => handleComplete(record.record)}>
              Complete
            </SaveButton>
            <HoldButton onClick={() => handleHold(record.record)}>
              Hold
            </HoldButton>
          </Box>
          <CancelButton onClick={handleClose}>
            Close
          </CancelButton>
        </Box>
      </DialogActions>
    </Dialog>
  );
};

export default NotesModal;