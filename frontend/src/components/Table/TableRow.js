import React, { useState } from 'react';
import { Button, TableRow, TableCell } from '@mui/material';
import QuestionDetailsModal from './QuestionDetailsModal';

const TableRowComponent = ({ serialNumber, problemHeading, details, onApprove, onDecline }) => {
  const [open, setOpen] = useState(false);

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  return (
    <>
      <TableRow>
        <TableCell>{serialNumber}</TableCell>
        <TableCell>
          <Button onClick={handleOpen} variant="text-white">{problemHeading}</Button>
        </TableCell>
        <TableCell>
          <Button
            variant="contained"
            color="success"
            onClick={onApprove}
            style={{ marginRight: '8px' }}
          >
            Approve
          </Button>
          <Button
            variant="contained"
            color="error"
            onClick={onDecline}
          >
            Decline
          </Button>
        </TableCell>
      </TableRow>
      <QuestionDetailsModal
        open={open}
        handleClose={handleClose}
        problemHeading={problemHeading}
        details={details}
        onApprove={onApprove}
        onDecline={onDecline}
      />
    </>
  );
};

export default TableRowComponent;
