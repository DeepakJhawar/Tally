import React from "react";
import { Box, Typography, Paper, Divider, Chip } from "@mui/material";

const ProblemStatement = ({
  title = "Untitled Problem",
  description = "No description available.",
  constraints = [],
  examples = [],
  outputVisible,
  tags = [],
  difficulty = "Unknown",
  solved = "Unsolved"
}) => {
  const getDifficultyColor = (difficulty) => {
    switch (difficulty) {
      case "Easy":
        return "success";
      case "Medium":
        return "warning";
      case "Hard":
        return "error";
      default:
        return "default";
    }
  };

  const combinedExamples = examples.flatMap((example) =>
    example.givenInput.map((input, index) => ({
      input,
      output: example.correctOutput[index] || "",
    }))
  );

  return (
    <Box
      sx={{
        height: outputVisible ? "55vh" : "85vh",
        overflowY: "auto",
        padding: 2,
      }}
    >
      <Paper elevation={3} sx={{ padding: 3, marginBottom: 3 }}>
        <Box sx={{ display: "flex", alignItems: "center" }}>
          <Typography
            variant="h4"
            component="h1"
            gutterBottom
            sx={{ flexGrow: 1 }}
          >
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
        {constraints.length > 0 ? (
          <Typography variant="body1" gutterBottom>
            {constraints}
          </Typography>
        ) : (
          <Typography variant="body1" gutterBottom>
            No constraints provided.
          </Typography>
        )}
      </Paper>

      {tags.length === 0 ? (
        <></>
      ) : (
        <Paper elevation={3} sx={{ padding: 3, marginBottom: 3 }}>
          <Typography variant="h5" component="h2" gutterBottom>
            Tags
          </Typography>
          <Divider sx={{ marginBottom: 2 }} />
          <Box
            sx={{ display: "flex", flexWrap: "wrap", gap: 1, marginBottom: 2 }}
          >
            {tags.length > 0 ? (
              tags.map((tag, index) => (
                <Chip key={index} label={tag} sx={{ margin: "2px" }} />
              ))
            ) : (
              <Typography variant="body1">No tags provided.</Typography>
            )}
          </Box>
        </Paper>
      )}

      <Paper elevation={3} sx={{ padding: 3 }}>
        <Typography variant="h5" component="h2" gutterBottom>
          Examples
        </Typography>
        <Divider sx={{ marginBottom: 2 }} />
        {combinedExamples.length > 0 ? (
          combinedExamples.map((example, index) => (
            <Box key={index} sx={{ marginBottom: 2 }}>
              <Typography variant="subtitle1">Example {index + 1}:</Typography>
              <Typography variant="body2">
                Input:
                <Box sx={{ whiteSpace: "pre-line" }}>{example.input}</Box>
              </Typography>
              <Typography variant="body2">
                Output:
                <Box sx={{ whiteSpace: "pre-line" }}>{example.output}</Box>
              </Typography>
            </Box>
          ))
        ) : (
          <Typography variant="body1">No examples provided.</Typography>
        )}
      </Paper>
    </Box>
  );
};

export default ProblemStatement;
