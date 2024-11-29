import { useState } from 'react';
import { Box, Button, Dialog, DialogActions, DialogContent, DialogTitle, IconButton, Table, TableBody, TableCell, TableHead, TableRow, TextField } from '@mui/material';
import { format, parseISO } from 'date-fns';
import AddIcon from '@mui/icons-material/Add';
import CheckIcon from '@mui/icons-material/Check';

import CancelButton from '../shared/CancelButton';
import DataTableCell from '../shared/DataTableCell';
import StandardTableCell from '../shared/StandardTableCell';

const NotesModal = ({ show, handleClose, task, notes, allUsers, handleAddNote, handleCompleteTask }) => {
  const [newNote, setNewNote] = useState('');

  if (!task) {
    return null;
  }

  const resolvedNotes = notes.map(note => ({
    ...note,
    name: allUsers.find(user => user.id === note.name)?.name || note.name,
  }))
  .sort((a, b) => new Date(a.date) - new Date(b.date));;

  const onAddNote = () => {
    if (newNote.trim()) {
      handleAddNote(task.id, newNote);
      setNewNote('');
    }
  };

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
              <StandardTableCell width='60%'>Note</StandardTableCell>
              <StandardTableCell width='20%'>Updated By</StandardTableCell>
              <StandardTableCell width='20%'>Date</StandardTableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {resolvedNotes.map((note, index) => (
              <TableRow key={index}>
                <DataTableCell>{note.note}</DataTableCell>
                <DataTableCell>{note.name}</DataTableCell>
                <DataTableCell>{note.date && format(parseISO(note.date), 'MM/dd h:mmb')}</DataTableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        <Box sx={{ display: 'flex', alignItems: 'center', mt: 2 }}>
          <TextField
            label="Add Note"
            fullWidth
            value={newNote}
            onChange={(e) => setNewNote(e.target.value)}
          />
          <IconButton color="primary" onClick={onAddNote}>
            <AddIcon />
          </IconButton>
        </Box>
      </DialogContent>
      <DialogActions>
        <Box sx={{ width: '100%', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Button
            color="success"
            variant="contained"
            startIcon={<CheckIcon />}
            onClick={() => handleCompleteTask(task.id)}
          >
            Complete Task
          </Button>
          <CancelButton onClick={handleClose}>
            Close
          </CancelButton>
        </Box>
      </DialogActions>
    </Dialog>
  );
};

export default NotesModal;