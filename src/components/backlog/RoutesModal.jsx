import { Box, Dialog, DialogContent, DialogTitle, Table, TableBody, TableHead, TableRow, Typography } from '@mui/material';
import DataTableCell from '../shared/DataTableCell';

const RoutesModal = ({ open, onClose, jobNo, jobType, partNo, partRev, custCode, routing }) => {
  return (
    <Dialog open={open} onClose={onClose} maxWidth='md' fullWidth>
      <DialogTitle>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Typography variant='h5' sx={{ fontWeight: 'bold' }}>
            JOB {jobNo}
          </Typography>
          <Typography variant='h5' sx={{ fontWeight: 'bold' }}>{jobType}</Typography>
        </Box>
      </DialogTitle>

      <DialogContent>
        <Box sx={{ textAlign: 'center', marginBottom: 2 }}>
          <Typography>Part Number: {partNo}</Typography>
          <Typography>Revision: {partRev}</Typography>
          <Typography>Customer: {custCode}</Typography>
        </Box>

        <Table>
          <TableHead>
            <TableRow>
              <DataTableCell bold>Step</DataTableCell>
              <DataTableCell bold>Operation</DataTableCell>
              <DataTableCell bold>Status</DataTableCell>
              <DataTableCell bold>Employee</DataTableCell>
              <DataTableCell bold>Date</DataTableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {routing.map((step, index) => (
              <TableRow key={index}>
                <DataTableCell>{step.StepNo}</DataTableCell>
                <DataTableCell>
                  {step.WorkCntr || step.VendCode}
                </DataTableCell>
                <DataTableCell>{step.Status}</DataTableCell>
                <DataTableCell>{step.EmplCode}</DataTableCell>
                <DataTableCell>
                  {step.ActualEndDate
                    ? `${step.ActualEndDate.split('-')[1]}/${step.ActualEndDate
                      .split('-')[2]
                      .split('T')[0]}/${step.ActualEndDate.split('-')[0].slice(-2)}`
                    : ''}
                </DataTableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </DialogContent>
    </Dialog>
  );
};

export default RoutesModal;
