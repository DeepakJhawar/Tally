import React, { useState } from 'react';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Snackbar, Alert } from '@mui/material';
import TableRowComponent from './TableRow';
import axios from 'axios';

const DataTable = ({ rows, onRefresh }) => {
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState("success");

  const handleSnackbarClose = () => {
    setSnackbarOpen(false);
  };

  const Approve = async (problemId) => {
    try {
      const response = await axios.post(
        "http://localhost:6969/create-problem",
        { problemId },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      setSnackbarMessage(response.data.message);
      setSnackbarSeverity("success");
    } catch (error) {
      setSnackbarMessage("An error occurred while approving the problem.");
      setSnackbarSeverity("error");
    }finally{
      setSnackbarOpen(true);
      onRefresh();
    }
  };
  
  const Decline = async (problemId) => {
    try {
      const response = await axios.post(
        "http://localhost:6969/decline-pending-problem",
        { problemId },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      setSnackbarMessage(response.data.message);
      onRefresh();
      setSnackbarSeverity("success");
    } catch (error) {
      setSnackbarMessage("An error occurred while declining the problem.");
      setSnackbarSeverity("error");
    }
    setSnackbarOpen(true);
  };

  return (
    <div style={{ display: 'flex', justifyContent: 'center', width: '100%' }}>
      <TableContainer component={Paper} style={{ width: '80%' }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Serial Number</TableCell>
              <TableCell>Problem Heading</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {rows.map((row, index) => (
              <TableRowComponent
                key={index}
                serialNumber={index + 1}
                problemHeading={row.title}
                details={{
                  title: row.title,
                  description: row.description,
                  constraints: row.constraints,
                  difficulty: row.difficulty,
                  examples: row.examples,
                  tags: row.tags
                }}
                onApprove={() => Approve(row._id)}
                onDecline={() => Decline(row._id)}
              />
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Snackbar
        open={snackbarOpen}
        autoHideDuration={6000}
        onClose={handleSnackbarClose}
        anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
        sx={{ marginTop: 8 }} 
      >
        <Alert
          onClose={handleSnackbarClose}
          severity={snackbarSeverity}
          sx={{ width: '100%' }}
        >
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </div>
  );
};

export default DataTable;
