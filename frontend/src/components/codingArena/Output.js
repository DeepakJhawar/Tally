import React, { useState } from "react";
import { Typography, Paper, IconButton, Tabs, Tab, Box } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";

const parseSubmissionResult = (result) => {
  return {
    input: result.input || "",
    output: result.output || "",
    expectedOutput: result.expectedOutput || "",
    message: result.message || "",
    passed: result.passed || "N/A",
  };
};

const parseRunResult = (result) => {
  return {
    input: result.input || "",
    output: result.output || "",
    expectedOutput: result.expectedOutput || "",
  };
};

const Output = ({ results = [], onClose, isSubmission }) => {
  const [currentTab, setCurrentTab] = useState(0);

  const handleTabChange = (event, newValue) => {
    setCurrentTab(newValue);
  };

  const currentResult = isSubmission
    ? parseSubmissionResult(results[currentTab] || {})
    : parseRunResult(results[currentTab] || {});

  return (
    <Paper
      elevation={0}
      sx={{
        height: "50%",
        overflowY: "auto",
        position: "relative",
        border: "none",
        boxShadow: "none",
        padding: 1,
      }}
    >
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          borderBottom: 1,
          borderColor: "divider",
        }}
      >
        <Tabs
          value={currentTab}
          onChange={handleTabChange}
          aria-label="test case tabs"
        >
          {results.map((_, index) => (
            <Tab sx={{bgcolor:"white"}} key={index} label={`Test Case ${index + 1}`} />
          ))}
        </Tabs>
        <IconButton sx={{ marginLeft: "auto" }} onClick={onClose}>
          <CloseIcon />
        </IconButton>
      </Box>
      <Box sx={{ padding: 2 }}>
        {results.length === 0 ? (
          <Typography variant="body2">No results available.</Typography>
        ) : (
          <>
            <Typography variant="body2">
              <strong>Input:</strong> {currentResult.input}
            </Typography>
            <Typography variant="body2">
              <strong>Output:</strong> {currentResult.output}
            </Typography>
            <Typography variant="body2">
              <strong>Expected Output:</strong> {currentResult.expectedOutput}
            </Typography>
            {isSubmission && (
              <>
                <Typography variant="body2">
                  <strong>Status:</strong> {currentResult.message}
                </Typography>
                <Typography variant="body2">
                  <strong>Passed:</strong> {currentResult.passed}
                </Typography>
              </>
            )}
          </>
        )}
      </Box>
    </Paper>
  );
};

export default Output;
