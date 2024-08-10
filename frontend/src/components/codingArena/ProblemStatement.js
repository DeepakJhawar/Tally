import React from "react";
import { Box, Typography, Paper, Divider, Chip } from "@mui/material";

const ProblemStatement = ({ title, description, constraints, examples, outputVisible }) => {
  // Static list of tags
  const tags = ["arrays", "strings", "dynamic programming"];
  // Difficulty level (for example, "Easy", "Medium", "Hard")
  const difficulty = "Easy";

  const getDifficultyColor = (difficulty) => {
    switch (difficulty) {
      case "Easy":
        return "success"; // Green
      case "Medium":
        return "warning"; // Yellow
      case "Hard":
        return "error";   // Red
      default:
        return "default"; 
    }
  };

  return (
    <Box
      sx={{
        height: outputVisible ? "60%" : "100%", // Adjust height based on output visibility
        overflowY: "auto", // Enable vertical scrollbar
        padding: 2,
      }}
    >
      <Paper elevation={3} sx={{ padding: 3, marginBottom: 3 }}>
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <Typography variant="h4" component="h1" gutterBottom sx={{ flexGrow: 1 }}>
            {title}
          </Typography>
          <Chip 
            label={difficulty} 
            color={getDifficultyColor(difficulty)} 
            sx={{ marginLeft: 2 }}
          />
        </Box>
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

      <Paper elevation={3} sx={{ padding: 3, marginBottom: 3 }}>
        <Typography variant="h5" component="h2" gutterBottom>
          Tags
        </Typography>
        <Divider sx={{ marginBottom: 2 }} />
        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, marginBottom: 2 }}>
          {tags.map((tag, index) => (
            <Chip key={index} label={tag} sx={{ margin: '2px' }} />
          ))}
        </Box>
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
    </Box>
  );
};

export default ProblemStatement;
