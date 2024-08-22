import React, { useState } from "react";
import { TableRow, TableCell, Button, Typography } from "@mui/material";
import TestCaseModal from "./TestCaseModal";

const TestCaseRow = ({
  problemNumber,
  problemTitle,
  testcase,
  onApprove,
  onDecline,
  onOpenModal,
}) => {
  const [open, setOpen] = useState(false);

  const handleClick = async () => {
    onOpenModal();
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <>
      <TableRow>
        <TableCell>
          <Typography style={{ color: "white", marginLeft: "2rem" }}>
            {problemNumber}
          </Typography>
        </TableCell>
        <TableCell>
          <Button onClick={handleClick} style={{ color: "white" }}>
            {problemTitle}
          </Button>
        </TableCell>
        <TableCell>
          <Button
            variant="contained"
            color="success"
            onClick={onApprove}
            style={{ marginRight: "8px" }}
          >
            Approve
          </Button>
          <Button variant="contained" color="error" onClick={onDecline}>
            Decline
          </Button>
        </TableCell>
      </TableRow>

      {open && (
        <TestCaseModal
          open={open}
          handleClose={handleClose}
          details={testcase}
          onApprove={onApprove}
          onDecline={onDecline}
        />
      )}
    </>
  );
};

export default TestCaseRow;
