import { Box, Button } from "@mui/material";
import React from "react";
import { useNavigate } from "react-router-dom";

const Home = () => {
  const navigate = useNavigate();

  return (
    <Box
      display="flex"
      height="100vh"
      width="100vw"
      justifyContent="center"
      alignItems="center"
      gap={2}
    >
      <Button variant="outlined" onClick={() => navigate("/login")}>
        Login page
      </Button>
      <Button variant="outlined" onClick={() => navigate("/signup")}>
        Signup page
      </Button>
    </Box>
  );
};

export default Home;
