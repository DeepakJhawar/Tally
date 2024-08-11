import React from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
} from "@mui/material";
import TestCaseRowComponent from "./TestCaseRow";

const TestCaseTable = ({ testCases }) => {
  const handleApprove = (serialNumber) => {
    // Handle the approve action here
    console.log(`Approved test case with serial number: ${serialNumber}`);
  };

  const handleDecline = (serialNumber) => {
    // Handle the decline action here
    console.log(`Declined test case with serial number: ${serialNumber}`);
  };

  return (
    <div className="flex justify-center items-center min-h-screen">
      <TableContainer
        component={Paper}
        className="w-1/2" // Decrease width as needed
      >
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
                onApprove={() => handleApprove(testCase.serialNumber)}
                onDecline={() => handleDecline(testCase.serialNumber)}
              />
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </div>
  );
};

export default TestCaseTable;
