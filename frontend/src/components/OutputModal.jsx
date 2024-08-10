import React from 'react';
import { Modal, Box, Typography, IconButton, Button } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';

const OutputModal = ({ open, onClose, outputData }) => {
  if (!open || !outputData) return null;

  const { status, input, output, expectedOutput, message, passed, testCases } = outputData;

  return (
    <Modal
      open={open}
      onClose={onClose}
      aria-labelledby="output-modal-title"
      aria-describedby="output-modal-description"
    >
      <Box
        sx={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: '80%',
          maxWidth: '600px',
          bgcolor: 'background.paper',
          border: '2px solid #000',
          boxShadow: 24,
          p: 4,
          borderRadius: 2,
          overflow: 'auto',
        }}
      >
        <IconButton
          sx={{
            position: 'absolute',
            top: 8,
            right: 8,
          }}
          onClick={onClose}
        >
          <CloseIcon />
        </IconButton>
        <Typography id="output-modal-title" variant="h6" component="h2">
          Test Results
        </Typography>
        <Box sx={{ mt: 2 }}>
          <Typography variant="body1"><strong>Status:</strong> {status}</Typography>
          <Typography variant="body1"><strong>Input:</strong> {input}</Typography>
          <Typography variant="body1"><strong>Expected Output:</strong> {expectedOutput}</Typography>
          <Typography variant="body1"><strong>Output:</strong> {output}</Typography>
          <Typography variant="body1" color={message === "wrong" ? "error" : "textPrimary"}>
            <strong>Message:</strong> {message}
          </Typography>
          <Typography variant="body1"><strong>Passed:</strong> {passed}</Typography>
          <Typography variant="body1"><strong>Test Cases:</strong> {testCases}</Typography>
        </Box>
        <Box sx={{ mt: 2, textAlign: 'right' }}>
          <Button
            onClick={onClose}
            sx={{
              backgroundColor: 'black',
              color: 'white',
              '&:hover': {
                backgroundColor: 'gray',
              },
            }}
          >
            Close
          </Button>
        </Box>
      </Box>
    </Modal>
  );
};

export default OutputModal;
