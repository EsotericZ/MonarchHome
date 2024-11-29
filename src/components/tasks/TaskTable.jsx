
import { Box, Paper, Table, TableBody, TableContainer, TableHead, TableRow, Typography } from '@mui/material';
import { format, parseISO } from 'date-fns';

import DataTableCell from '../shared/DataTableCell';
import StandardTableCell from '../shared/StandardTableCell';

const TaskTable = ({ tasks, filterStatus, fallbackMessage, onRowClick }) => {
  const filteredTasks = tasks.filter((task) => task.status === filterStatus);

  return Array.isArray(tasks) && filteredTasks.length > 0 ? (
    <Box sx={{ padding: '12px' }}>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <StandardTableCell width='15%'>Task Name</StandardTableCell>
              <StandardTableCell width='55%'>Description</StandardTableCell>
              <StandardTableCell width='15%'>Completed By</StandardTableCell>
              <StandardTableCell width='15%'>Completion Date</StandardTableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredTasks.map((task, index) => (
              <TableRow 
                key={index} 
                onClick={() => onRowClick(task)}
                sx={{ cursor: 'pointer', backgroundColor: index % 2 === 0 ? '#f0f0f0' : '#fff' }}
              >
                <DataTableCell>{task.taskName}</DataTableCell>
                <DataTableCell>{task.description}</DataTableCell>
                <DataTableCell>{task.assigner?.name || 'Unknown'}</DataTableCell>
                <DataTableCell>{task.updatedAt && format(parseISO(task.updatedAt), 'MM/dd h:mmb')}</DataTableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  ) : (
    <Box
      sx={{
        width: '100%',
        textAlign: 'center',
        alignContent: 'center',
        overflowY: 'auto',
        height: '15vh',
      }}
    >
      <Typography variant="h4" sx={{ fontWeight: 'bold', margin: '16px' }}>
        {fallbackMessage}
      </Typography>
    </Box>
  );
};

export default TaskTable;