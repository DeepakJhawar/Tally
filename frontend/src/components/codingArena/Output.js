import React, { useState } from "react";
import { Typography, Paper, IconButton, Tabs, Tab, Box } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";

const Output = ({ results = [], onClose }) => {
  const [currentTab, setCurrentTab] = useState(0);

  const handleTabChange = (event, newValue) => {
    setCurrentTab(newValue);
  };

  const validResults = Array.isArray(results) ? results : [];

  const currentResult = validResults[currentTab] || {};

  return (
    <Paper
      elevation={0}
      sx={{
        height: "60vh",
        overflowY: "auto",
        position: "relative",
        padding: 2,
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
          {validResults.map((_, index) => (
            <Tab
              key={index}
              label={`Test Case ${index + 1}`}
            />
          ))}
        </Tabs>
        <IconButton sx={{ marginLeft: "auto" }} onClick={onClose}>
          <CloseIcon />
        </IconButton>
      </Box>
      <Box sx={{ padding: 2 }}>
        {validResults.length === 0 ? (
          <Typography variant="body2">No results available.</Typography>
        ) : (
          <>
            <Typography variant="body2">
              <strong>Input:</strong>
              <Box
                sx={{
                  whiteSpace: "pre-line",
                  mt: 1,
                }}
              >
                {currentResult.input || "No input provided"}
              </Box>
            </Typography>
            <Typography variant="body2">
              <strong>Output:</strong> {currentResult.output || "No output available"}
            </Typography>
            <Typography variant="body2">
              <strong>Expected Output:</strong> {currentResult.expectedOutput || "No expected output provided"}
            </Typography>
          </>
        )}
      </Box>
    </Paper>
  );
};

export default Output;
