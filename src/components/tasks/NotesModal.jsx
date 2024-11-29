import { useState } from 'react';
import { Box, Button, Dialog, DialogActions, DialogContent, DialogTitle, IconButton, Table, TableBody, TableCell, TableHead, TableRow, TextField } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import CheckIcon from '@mui/icons-material/Check';

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
              <TableCell sx={{ fontWeight: 'bold' }}>Note</TableCell>
              <TableCell sx={{ fontWeight: 'bold' }}>Updated By</TableCell>
              <TableCell sx={{ fontWeight: 'bold' }}>Date</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {resolvedNotes.map((note, index) => (
              <TableRow key={index}>
                <TableCell>{note.note}</TableCell>
                <TableCell>{note.name}</TableCell>
                <TableCell>{new Date(note.date).toLocaleString()}</TableCell>
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
          <Button variant="outlined" onClick={handleClose}>
            Close
          </Button>
        </Box>
      </DialogActions>
    </Dialog>
  );
};

export default NotesModal;