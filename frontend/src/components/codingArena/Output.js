import React, { useState } from "react";
import {
  Typography,
  Paper,
  IconButton,
  Tabs,
  Tab,
  Box,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";

const parseResult = (resultString) => {
  const resultLines = resultString.split("\n");
  const inputLine = resultLines.find((line) => line.startsWith("Input:")) || "";
  const outputLine =
    resultLines.find((line) => line.startsWith("Output:")) || "";

  return {
    input: inputLine.replace("Input:", "").trim(),
    output: outputLine.replace("Output:", "").trim(),
  };
};

const Output = ({ results = [], onClose }) => {
  const [currentTab, setCurrentTab] = useState(0);

  const handleTabChange = (event, newValue) => {
    setCurrentTab(newValue);
  };

  const currentResult = parseResult(results[currentTab] || "");

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
            <Tab key={index} label={`Test Case ${index + 1}`} />
          ))}
        </Tabs>
        <IconButton
          sx={{ marginLeft: "auto" }}
          onClick={onClose}
        >
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
          </>
        )}
      </Box>
    </Paper>
  );
};

export default Output;
