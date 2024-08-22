import React from 'react';
import { Modal, Box, Typography, Button, IconButton } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';

const modalStyle = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: '80%',
  minWidth: '70vw',
  minHeight: '70vh',
  bgcolor: 'background.paper',
  border: '2px solid #000',
  boxShadow: 24,
  p: 4,
  display: 'flex',
  flexDirection: 'column',
  overflow: 'auto',
};

const headerStyle = {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
};

const contentStyle = {
  flex: '1 1 auto',
};

const buttonContainerStyle = {
  display: 'flex',
  justifyContent: 'flex-end',
  marginTop: '16px',
};

const QuestionDetailsModal = ({
  open,
  handleClose,
  details, 
  onApprove,
  onDecline
}) => {
  const {
    title = 'No Title',
    description = 'No Description',
    constraints = 'No Constraints',
    difficulty = 'No Difficulty',
    examples = [],
    tags = []
  } = details;

  const handleApprove = async () => {
    try {
      await onApprove(); 
      handleClose(); 
    } catch (error) {
      console.error('Approval failed:', error);
    }
  };

  const handleDecline = async () => {
    try {
      await onDecline(); 
      handleClose(); 
    } catch (error) {
      console.error('Decline failed:', error);
    }
  };

  return (
    <Modal
      open={open}
      onClose={handleClose}
      aria-labelledby="modal-title"
      aria-describedby="modal-description"
    >
      <Box sx={modalStyle}>
        <div style={headerStyle}>
          <Typography id="modal-title" variant="h6" component="h2">
            {title}
          </Typography>
          <IconButton onClick={handleClose}>
            <CloseIcon />
          </IconButton>
        </div>
        <Box sx={contentStyle}>
          <Typography variant="body1" sx={{ mt: 2 }}>
            <strong>Description:</strong> {description}
          </Typography>
          <Typography variant="body1" sx={{ mt: 2 }}>
            <strong>Constraints:</strong> {constraints}
          </Typography>
          <Typography variant="body1" sx={{ mt: 2 }}>
            <strong>Difficulty:</strong> {difficulty}
          </Typography>
          <Typography variant="body1" sx={{ mt: 2 }}>
            <strong>Tags:</strong> {tags.join(', ')}
          </Typography>
          <Typography variant="body1" sx={{ mt: 2 }}>
            <strong>Examples:</strong> {examples.length > 0 ? examples.join(', ') : 'No examples available'}
          </Typography>
        </Box>
        <Box sx={buttonContainerStyle}>
          <Button variant="contained" color="success" onClick={handleApprove} sx={{ mr: 1 }}>
            Approve
          </Button>
          <Button variant="contained" color="error" onClick={handleDecline}>
            Decline
          </Button>
        </Box>
      </Box>
    </Modal>
  );
};

export default QuestionDetailsModal;
