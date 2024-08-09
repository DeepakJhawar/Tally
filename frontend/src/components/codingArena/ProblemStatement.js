import React from "react";
import { Box, Typography, Paper, Divider, Button } from "@mui/material";
import { customStyles } from "../../constants/customStyles";

const ProblemStatement = ({ title, description, constraints, examples }) => {
  return (
    <Box sx={{ padding: 3 }}>
      <Paper elevation={3} sx={{ padding: 3, marginBottom: 3 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          {title}
        </Typography>
        <Divider sx={{ marginBottom: 2 }} />
        <Typography variant="body1" gutterBottom>
          {description}
        </Typography>
      </Paper>

      <Paper elevation={3} sx={{ padding: 3, marginBottom: 3 }}>
        <Typography variant="h5" component="h2" gutterBottom>
          Constraints
        </Typography>
        <Divider sx={{ marginBottom: 2 }} />
        <Typography variant="body1" gutterBottom>
          {constraints}
        </Typography>
      </Paper>

      <Paper elevation={3} sx={{ padding: 3 }}>
        <Typography variant="h5" component="h2" gutterBottom>
          Examples
        </Typography>
        <Divider sx={{ marginBottom: 2 }} />
        {examples.map((example, index) => (
          <Box key={index} sx={{ marginBottom: 2 }}>
            <Typography variant="subtitle1">Example {index + 1}:</Typography>
            <Typography variant="body2">{example}</Typography>
          </Box>
        ))}
      </Paper>

      <Box sx={{ display: "flex", justifyContent: "flex-end", marginTop: 2 }}>
        <Button
          sx={{
            ...customStyles.control,
            width: "auto", // Remove fixed width for buttons
            maxWidth: "none",
            padding: "6px 12px",
            marginRight: 1,
          }}
          variant="contained"
        >
          Run
        </Button>
        <Button styles={customStyles} variant="contained">
          Submit
        </Button>
      </Box>
    </Box>
  );
};

export default ProblemStatement;
