import React from 'react';
import { Box, Button, IconButton, TextField, Typography } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';

const Input = ({ open, onClose, onTest, value, onChange }) => {
  if (!open) return null;

  return (
    <Box
      sx={{
        position: 'fixed',
        bottom: 0,
        right: 0,
        width: '400px',
        maxWidth: '90%',
        backgroundColor: '#060606',
        boxShadow: '0px 4px 10px rgba(0, 0, 0, 0.1)',
        borderRadius: '8px',
        padding: 2,
        zIndex: 1300,
      }}
    >
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Typography variant="h6" sx={{ color: 'white' }}>Custom Input</Typography>
        <IconButton onClick={onClose}>
          <CloseIcon sx={{ color: 'black' }} />
        </IconButton>
      </Box>
      <TextField
        multiline
        rows={4}
        fullWidth
        variant="outlined"
        margin="normal"
        placeholder="Enter custom input here"
        value={value}
        onChange={onChange}
        sx={{ backgroundColor: 'black', color: "white" }} 
      />
      <Box sx={{ display: 'flex', justifyContent: 'flex-end', marginTop: 2 }}>
        <Button
          sx={{
            marginRight: 1,
            backgroundColor: '#333',
            color: 'white',
            '&:hover': {
              backgroundColor: '#555',
            },
          }}
          onClick={onTest}
        >
          Test
        </Button>
        <Button
          sx={{
            backgroundColor: '#333',
            color: 'white',
            '&:hover': {
              backgroundColor: '#555',
            },
          }}
          onClick={onClose}
        >
          Close
        </Button>
      </Box>
    </Box>
  );
};

export default Input;
