import React from 'react';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper } from '@mui/material';
import TableRowComponent from './TableRow';
import axios from 'axios';

const DataTable = ({ rows }) => {
  const Approve = async () => {
    const response = await axios.post(
      "http://localhost:6969/create-problem",
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      }
    );
  };

  const Decline = async() =>{

  }

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
                onApprove={Approve}
                onDecline={Decline}
              />
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </div>
  );
};

export default DataTable;
