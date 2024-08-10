// src/components/DataTable.js
import React from 'react';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper } from '@mui/material';
import TableRowComponent from './TableRow';

const DataTable = ({ rows }) => (
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
              problemHeading={row.problemHeading}
              details={row.details}
              onApprove={() => console.log(`Approved: ${row.problemHeading}`)}
              onDecline={() => console.log(`Declined: ${row.problemHeading}`)}
            />
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  </div>
);

export default DataTable;
