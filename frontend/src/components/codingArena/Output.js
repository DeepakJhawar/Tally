import React, { useState } from "react";
import {
  Typography,
  Paper,
  IconButton,
  Divider,
  Tabs,
  Tab,
  Box,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";


const parseResult = (resultString) => {
    const resultLines = resultString.split('\n');
    const inputLine = resultLines.find(line => line.startsWith('Input:')) || '';
    const targetLine = resultLines.find(line => line.startsWith('Target:')) || '';
    const outputLine = resultLines.find(line => line.startsWith('Output:')) || '';
  
    return {
      input: inputLine.replace('Input:', '').trim(),
      target: targetLine.replace('Target:', '').trim(),
      output: outputLine.replace('Output:', '').trim()
    };
  };
  

const Output = ({ results = [], onClose }) => {
  const [currentTab, setCurrentTab] = useState(0);

  const handleTabChange = (event, newValue) => {
    setCurrentTab(newValue);
  };

  const currentResult = parseResult(results[currentTab] || '');

  return (
    <Paper
      elevation={0} // Remove shadow for a flatter look
      sx={{
        height: "50%", // Full height of the container
        overflowY: "auto", // Enable vertical scrollbar
        position: "relative",
        border: "none", // Remove border to eliminate the outline
        boxShadow: "none", // Remove box shadow to eliminate any additional outline effect
        padding: 1, // Minimal padding
      }}
    >
      <IconButton
        sx={{ position: "absolute", top: 8, right: 8 }}
        onClick={onClose} // Call the onClose function when clicked
      >
        <CloseIcon />
      </IconButton>
      <Tabs
        value={currentTab}
        onChange={handleTabChange}
        aria-label="test case tabs"
        sx={{ borderBottom: 1, borderColor: "divider" }}
      >
        {results.map((_, index) => (
          <Tab key={index} label={`Test Case ${index + 1}`} />
        ))}
      </Tabs>
      <Box sx={{ padding: 2 }}>
        {results.length === 0 ? (
          <Typography variant="body2">No results available.</Typography>
        ) : (
          //   <Typography variant="body2">
          //     <strong>Test Case {currentTab + 1}:</strong> {results[currentTab]}
          //   </Typography>
          <>
            <Typography variant="body2">
              <strong>Input:</strong> {currentResult.input}
            </Typography>
            <Typography variant="body2">
              <strong>Target:</strong> {currentResult.target}
            </Typography>
            <Typography variant="body2">
              <strong>Output:</strong> {currentResult.output}
            </Typography>
            <Typography variant="body2">
              <strong>Expected:</strong> {currentResult.expected}
            </Typography>
          </>
        )}
      </Box>
    </Paper>
  );
};

export default Output;
