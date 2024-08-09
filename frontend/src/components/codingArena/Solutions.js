// import React from "react";
// import { Box, Typography, Paper, Divider } from "@mui/material";

// const Solutions = ({ solutions = [] }) => {
//   return (
//     <Box sx={{ padding: 3 }}>
//       {solutions.length ? (
//         solutions.map((solution, index) => (
//           <Paper key={index} elevation={3} sx={{ padding: 3, marginBottom: 3 }}>
//             <Typography variant="h5" component="h2" gutterBottom>
//               Solution {index + 1}
//             </Typography>
//             <Divider sx={{ marginBottom: 2 }} />
//             <Typography variant="body1">{solution}</Typography>
//           </Paper>
//         ))
//       ) : (
//         <Typography variant="body1">No solutions available.</Typography>
//       )}
//     </Box>
//   );
// };

// export default Solutions;
import React, { useState } from "react";
import { Box, Typography, Paper, Divider, Modal, Button, IconButton } from "@mui/material";
import ContentCopyIcon from '@mui/icons-material/ContentCopy'; // Import Material-UI clipboard icon
import { customStyles } from "../../constants/customStyles";

// Dummy solutions data
const dummySolutions = [
  {
    name: "Binary Search",
    code: `// Sample solution code snippet 1
function binarySearch(arr, target) {
  let left = 0;
  let right = arr.length - 1;
  
  while (left <= right) {
    const mid = Math.floor((left + right) / 2);
    if (arr[mid] === target) {
      return mid;
    }
    if (arr[mid] < target) {
      left = mid + 1;
    } else {
      right = mid - 1;
    }
  }
  
  return -1;
}`
  },
  {
    name: "Linear Search",
    code: `// Sample solution code snippet 2
function linearSearch(arr, target) {
  for (let i = 0; i < arr.length; i++) {
    if (arr[i] === target) {
      return i;
    }
  }
  return -1;
}`
  }
];

const Solutions = ({ solutions = dummySolutions }) => {
  const [open, setOpen] = useState(false);
  const [currentSolution, setCurrentSolution] = useState({ name: "", code: "" });

  const handleOpen = (solution) => {
    setCurrentSolution(solution);
    setOpen(true);
  };

  const handleClose = () => setOpen(false);

  const copyToClipboard = () => {
    navigator.clipboard.writeText(currentSolution.code);
  };

  return (
    <Box sx={{ padding: 2 }}>
      {solutions.length > 0 ? (
        solutions.map((solution, index) => (
          <Paper
            key={index}
            elevation={3}
            sx={{
              padding: 2,
              marginBottom: 2,
              display: "flex",
              flexDirection: "column",
              cursor: "pointer",
            }}
            onClick={() => handleOpen(solution)}
          >
            <Typography variant="h6" component="h2" gutterBottom>
              {solution.name}
            </Typography>
            <Divider sx={{ marginBottom: 1 }} />
            <Typography variant="body2" color="textSecondary">
              {solution.code.substring(0, 50)}... {/* Display a truncated preview */}
            </Typography>
          </Paper>
        ))
      ) : (
        <Typography variant="body1">No solutions available.</Typography>
      )}

      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="solution-modal-title"
        aria-describedby="solution-modal-description"
      >
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: "80%",
            bgcolor: "background.paper",
            boxShadow: 24,
            p: 4,
            borderRadius: "8px",
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center', marginBottom: 2 }}>
            <Typography id="solution-modal-title" variant="h6" component="h2" sx={{ flexGrow: 1 }}>
              {currentSolution.name}
            </Typography>
            <IconButton 
              onClick={copyToClipboard} 
              sx={{ color: "blue" }}
              aria-label="copy to clipboard"
            >
              <ContentCopyIcon />
            </IconButton>
          </Box>
          <Divider sx={{ marginBottom: 2 }} />
          <Typography id="solution-modal-description" variant="body1">
            <pre style={{ whiteSpace: "pre-wrap", wordWrap: "break-word" }}>
              {currentSolution.code}
            </pre>
          </Typography>
          <Button
            sx={{ ...customStyles.control, marginTop: 2 }}
            onClick={handleClose}
            variant="contained"
          >
            Close
          </Button>
        </Box>
      </Modal>
    </Box>
  );
};

export default Solutions;
