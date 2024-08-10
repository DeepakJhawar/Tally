import React, { useState } from "react";
import { Modal, Box, Typography, Button } from "@mui/material";
import { useNavigate } from "react-router-dom";

const LoginModal = () => {
  const [open, setOpen] = useState(true); 
  const navigate = useNavigate();

  const handleLogin = () => {
    navigate('/login');
  };

  return (
    <Modal
      open={open}
      onClose={() => {}} 
      sx={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <Box
        sx={{
          width: 300,
          bgcolor: 'background.paper',
          padding: 3,
          boxShadow: 24,
          borderRadius: 2,
          textAlign: 'center',
        }}
      >
        <Typography variant="h6" component="h2" gutterBottom>
          Please log in to continue
        </Typography>
        <Button
          variant="contained"
          color="primary"
          onClick={handleLogin}
          sx={{ marginTop: 2 }}
        >
          Log In
        </Button>
      </Box>
    </Modal>
  );
};

export default LoginModal;
