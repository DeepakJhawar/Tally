import React from 'react';
import { Modal, Box, Typography, Button, IconButton } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';

const modalStyle = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: '80%',
  minWidth: '70vw', // Minimum width
  minHeight: '70vh', // Minimum height
  bgcolor: 'background.paper',
  border: '2px solid #000',
  boxShadow: 24,
  p: 4,
  display: 'flex',
  flexDirection: 'column',
  overflow: 'auto', // Enable scrolling if content exceeds the modal dimensions
};

const headerStyle = {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
};

const contentStyle = {
  flex: '1 1 auto', // Allows the content area to grow and shrink as needed
};

const buttonContainerStyle = {
  display: 'flex',
  justifyContent: 'flex-end',
  marginTop: '16px',
};

const QuestionDetailsModal = ({ open, handleClose, problemHeading, details, onApprove, onDecline }) => (
  <Modal
    open={open}
    onClose={handleClose}
    aria-labelledby="modal-title"
    aria-describedby="modal-description"
  >
    <Box sx={modalStyle}>
      <div style={headerStyle}>
        <Typography id="modal-title" variant="h6" component="h2">
          {problemHeading}
        </Typography>
        <IconButton onClick={handleClose}>
          <CloseIcon />
        </IconButton>
      </div>
      <Box sx={contentStyle}>
        <Typography id="modal-description" sx={{ mt: 2 }}>
          {details}
        </Typography>
      </Box>
      <Box sx={buttonContainerStyle}>
        <Button variant="contained" color="success" onClick={onApprove} sx={{ mr: 1 }}>
          Approve
        </Button>
        <Button variant="contained" color="error" onClick={onDecline}>
          Decline
        </Button>
      </Box>
    </Box>
  </Modal>
);

export default QuestionDetailsModal;