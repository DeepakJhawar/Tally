import React, { useState } from 'react';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper } from '@mui/material';
import TestCaseRowComponent from './TestCaseRow';
import TestCaseModal from './TestCaseModal';

const TestCaseTable = ({ testCases }) => {
  const [open, setOpen] = useState(false);
  const [selectedTestCase, setSelectedTestCase] = useState(null);

  const handleOpenModal = (testCase) => {
    setSelectedTestCase(testCase);
    setOpen(true);
  };

  const handleCloseModal = () => {
    setOpen(false);
    setSelectedTestCase(null);
  };

  const handleApprove = () => {
    // Handle the approve action here
    console.log(`Approved test case with serial number: ${selectedTestCase.serialNumber}`);
    handleCloseModal();
  };

  const handleDecline = () => {
    // Handle the decline action here
    console.log(`Declined test case with serial number: ${selectedTestCase.serialNumber}`);
    handleCloseModal();
  };

  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
      <TableContainer component={Paper} style={{ width: '80vw', margin: '0 auto' }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Serial Number</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {testCases.map((testCase, index) => (
              <TestCaseRowComponent
                key={index}
                serialNumber={testCase.serialNumber}
                onApprove={() => handleOpenModal(testCase)}
                onDecline={() => handleOpenModal(testCase)}
              />
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      {selectedTestCase && (
        <TestCaseModal
          open={open}
          handleClose={handleCloseModal}
          details={selectedTestCase}
          onApprove={handleApprove}
          onDecline={handleDecline}
        />
      )}
    </div>
  );
};

export default TestCaseTable;
