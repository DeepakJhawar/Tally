// import React from 'react';
// import { Button, TableRow, TableCell } from '@mui/material';

// const TestCaseRowComponent = ({ serialNumber, onApprove, onDecline, onClick }) => {
//   return (
//     <TableRow>
//       <TableCell>
//         <Button 
//           onClick={onClick} 
//           style={{ color: 'white' }}
//         >
//           {serialNumber}
//         </Button>
//       </TableCell>
//       <TableCell>
//         <Button
//           variant="contained"
//           color="success"
//           onClick={onApprove}
//           style={{ marginRight: '8px' }}
//         >
//           Approve
//         </Button>
//         <Button
//           variant="contained"
//           color="error"
//           onClick={onDecline}
//         >
//           Decline
//         </Button>
//       </TableCell>
//     </TableRow>
//   );
// };

// export default TestCaseRowComponent;
import React from 'react';
import { TableRow, TableCell, Button } from '@mui/material';

const TestCaseRowComponent = ({ serialNumber, onApprove, onDecline }) => {
  return (
    <TableRow>
      <TableCell>
        <Button onClick={onApprove} style={{ color: 'white' }}>
          {serialNumber}
        </Button>
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
  );
};

export default TestCaseRowComponent;
