import React from "react";
import { Box, Typography, Paper, Divider } from "@mui/material";

const Solutions = ({ solutions }) => {
  return (
    <Box sx={{ padding: 3, flex: 1, overflowY: "auto" }}>
      <Divider sx={{ marginBottom: 2 }} />
      {solutions.length > 0 ? (
        solutions.map((solution, index) => (
          <Paper key={index} elevation={3} sx={{ padding: 2, marginBottom: 2 }}>
            <Typography variant="subtitle1">
              {solution.heading ? solution.heading : "No Heading Available"}
            </Typography>
            <Typography variant="body2">
              {solution.sol ? solution.sol : "No Solution Available"}
            </Typography>
          </Paper>
        ))
      ) : (
        <Typography>No solutions available.</Typography>
      )}
    </Box>
  );
};

export default Solutions;