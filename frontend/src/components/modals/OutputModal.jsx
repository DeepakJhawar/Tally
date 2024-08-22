import React from "react";
import { Modal, Box, Typography, IconButton, Button } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";

const OutputModal = ({ open, onClose, outputData }) => {
  if (!open || !outputData) return null;

  const { status, input, output, expectedOutput, message, passed } = outputData;

  return (
    <Modal
      open={open}
      onClose={onClose}
      aria-labelledby="output-modal-title"
      aria-describedby="output-modal-description"
    >
      <Box
        sx={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          width: "90%",
          maxWidth: "500px",
          bgcolor: "background.paper",
          borderRadius: "10px",
          boxShadow: 24,
          p: 3,
          outline: "none",
        }}
      >
        <IconButton
          sx={{
            position: "absolute",
            top: 10,
            right: 10,
            color: "text.secondary",
          }}
          onClick={onClose}
        >
          <CloseIcon />
        </IconButton>
        <Typography
          id="output-modal-title"
          variant="h6"
          component="h2"
          textAlign="center"
          gutterBottom
          sx={{ color: 'white' }}
        >
          Test Results
        </Typography>
        <Box sx={{ mt: 2 }}>
          <Typography variant="body2" color="text.secondary" gutterBottom>
            <strong className="text-xl">Status: </strong>{" "}
            <span style={{ color: status === "Failed" ? "#d32f2f" : "#388e3c" }} className="text-xl">
              {status}
            </span>
          </Typography>
          <Typography variant="body2" gutterBottom color='primary'>
            <strong className="text-white">Input:</strong>
            <Box
              component="span"
              sx={{
                whiteSpace: "pre-wrap",
                bgcolor: "grey.100",
                p: 1,
                borderRadius: 1,
                display: "block",
                mt: 1,
                fontFamily: "monospace",
              }}
            >
              {input || "No input provided"}
            </Box>
          </Typography>
          <Typography variant="body2" gutterBottom color='primary'>
            <strong className="text-white">Expected Output:</strong>{" "}
            <Box
              component="span"
              sx={{
                whiteSpace: "pre-wrap",
                bgcolor: "grey.100",
                p: 1,
                borderRadius: 1,
                display: "block",
                mt: 1,
                fontFamily: "monospace",
              }}
            >
              {expectedOutput}
            </Box>
          </Typography>
          <Typography variant="body2" gutterBottom className="text-black">
            <strong className="text-white">Output:</strong>{" "}
            <Box
              component="span"
              sx={{
                whiteSpace: "pre-wrap",
                bgcolor: "grey.100",
                p: 1,
                borderRadius: 1,
                display: "block",
                mt: 1,
                fontFamily: "monospace",
              }}
            >
              {output}
            </Box>
          </Typography>
          <Typography variant="body1" className="text-white">
            <strong>Passed:</strong> {passed}
          </Typography>
        </Box>
        <Box sx={{ mt: 3, textAlign: "right" }}>
          <Button
            onClick={onClose}
            variant="contained"
            color="primary"
            sx={{
              color: "white",
              bgcolor: "#1976d2",
              "&:hover": {
                bgcolor: "#1565c0",
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
