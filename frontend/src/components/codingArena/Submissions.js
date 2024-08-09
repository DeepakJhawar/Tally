import React, { useState } from "react";
import { Box, Typography, Paper, Divider, Modal, Button, IconButton } from "@mui/material";
import { customStyles } from "../../constants/customStyles";
import ContentCopyIcon from '@mui/icons-material/ContentCopy'; // Import Material-UI clipboard icon

const sampleCode = `// Sample code snippet
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
}`;

const Submissions = ({ submissions = [] }) => {
  const [open, setOpen] = useState(false);
  const [currentCode, setCurrentCode] = useState("");

  const parseSubmission = (submissionString) => {
    const parts = submissionString.split(", ");
    const submission = {};
    parts.forEach((part) => {
      const [key, value] = part.split(": ");
      submission[key.trim()] = value.trim();
    });
    return submission;
  };

  const handleOpen = (code) => {
    setCurrentCode(code || sampleCode); // Use sampleCode if code is not provided
    setOpen(true);
  };

  const handleClose = () => setOpen(false);

  const copyToClipboard = () => {
    navigator.clipboard.writeText(currentCode);
  };

  return (
    <Box sx={{ padding: 2 }}>
      {submissions.length ? (
        submissions.map((submissionString, index) => {
          const submission = parseSubmission(submissionString);
          return (
            <Paper
              key={index}
              elevation={3}
              sx={{
                padding: 2,
                marginBottom: 2,
                display: "flex",
                justifyContent: "space-between",
              }}
            >
              <Box>
                <Typography variant="h6" component="h2" gutterBottom>
                  {submission.questionName}
                </Typography>
                <Divider sx={{ marginBottom: 1 }} />
                <Typography
                  variant="body2"
                  sx={{ cursor: "pointer", color: "blue" }}
                  onClick={() => handleOpen(submission.code)}
                >
                  {submission.isCorrect === "true" ? "Correct" : "Incorrect"}
                </Typography>
              </Box>
              <Box
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "center",
                  alignItems: "flex-end",
                  paddingLeft: 1.5,
                  borderLeft: "1px solid #ddd",
                }}
              >
                <Typography variant="body2">
                  Memory Used: {submission.Memory || "N/A"}
                </Typography>
                <Typography variant="body2">
                  Time Taken: {submission.Time || "N/A"}
                </Typography>
              </Box>
            </Paper>
          );
        })
      ) : (
        <Typography variant="body1">No submissions available.</Typography>
      )}

      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="code-modal-title"
        aria-describedby="code-modal-description"
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
            <Typography id="code-modal-title" variant="h6" component="h2" sx={{ flexGrow: 1 }}>
              Submission Code
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
          <Typography id="code-modal-description" variant="body1">
            <pre style={{ whiteSpace: "pre-wrap", wordWrap: "break-word" }}>
              {currentCode}
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

export default Submissions;
