import React, { useState } from "react";
import { Grid, Button, Box, IconButton } from "@mui/material";
import ProblemStatement from "../components/codingArena/ProblemStatement";
import Solutions from "../components/codingArena/Solutions";
import Submissions from "../components/codingArena/Submissions";
import Editor from "../components/CodeEditor/Editor";
import Output from "../components/codingArena/Output"; // Adjust the path as necessary
import CloseIcon from "@mui/icons-material/Close";
import { customStyles } from "../constants/customStyles";

const problemData = {
  title: "Binary Search",
  description: `Given a sorted array of integers, write a function that returns the index of a given target value. 
                If the target is not found in the array, return -1.`,
  constraints: `1. The array is sorted in ascending order.
                2. The function should have a time complexity of O(log n).`,
  examples: [
    "Input: arr = [1, 2, 3, 4, 5, 6, 7], target = 5\nOutput: 4",
    "Input: arr = [1, 2, 3, 4, 5, 6, 7], target = 9\nOutput: -1",
  ],
};

const CodingArena = () => {
  const [currentView, setCurrentView] = useState("Problem");
  const [solutions, setSolutions] = useState([
    { heading: "Solution 1", sol: "Binary search solution" },
  ]); // Example solution data
  const [submissions, setSubmissions] = useState([
    "questionName: Two Sum, Memory: 15MB, Time: 0.02s, isCorrect: true",
  ]); // Example submission data
  const [outputVisible, setOutputVisible] = useState(false);

  const handleRunClick = () => {
    setOutputVisible(true);
  };

  const handleOutputClose = () => {
    setOutputVisible(false);
  };

  const renderContent = () => {
    switch (currentView) {
      case "Solutions":
        return <Solutions solutions={solutions} />;
      case "Submissions":
        return <Submissions submissions={submissions} />;
      case "Problem":
      default:
        return (
          <ProblemStatement
            title={problemData.title}
            description={problemData.description}
            constraints={problemData.constraints}
            examples={problemData.examples}
            solutions={solutions}
            submissions={submissions}
          />
        );
    }
  };

  return (
    <>
      <Grid container spacing={2} sx={{ height: "100vh", padding: 2 }}>
        <Grid item xs={12} md={6}>
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              height: "90%", // Ensure full height usage
            }}
          >
            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                flex: 1, // Take up the remaining space
                overflow: "hidden", // Enable scrolling if content overflows
              }}
            >
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  marginBottom: 2,
                }}
              >
                <Button
                  sx={{
                    width: "auto",
                    maxWidth: "none",
                    marginRight: 1,
                    backgroundColor:
                      currentView === "Problem" ? "#000" : "#444",
                  }}
                  onClick={() => setCurrentView("Problem")}
                  variant="contained"
                >
                  Problem
                </Button>
                <Button
                  sx={{
                    width: "auto",
                    maxWidth: "none",
                    marginRight: 1,
                    backgroundColor:
                      currentView === "Solutions" ? "#000" : "#444",
                  }}
                  onClick={() => setCurrentView("Solutions")}
                  variant="contained"
                >
                  Solutions
                </Button>
                <Button
                  sx={{
                    width: "auto",
                    maxWidth: "none",
                    backgroundColor:
                      currentView === "Submissions" ? "#000" : "#444",
                  }}
                  onClick={() => setCurrentView("Submissions")}
                  variant="contained"
                >
                  Submissions
                </Button>
              </Box>
              <Box
                sx={{
                  flex: 1, // Take up remaining space
                  overflowY: "auto", // Enable vertical scrollbar
                }}
              >
                {renderContent()}
              </Box>
            </Box>

            {outputVisible && (
              <Box
                sx={{
                  height: "30%", // Fixed height of 30%
                  overflowY: "auto",
                  position: "relative",
                  border: "none", // Remove border to eliminate outline
                  boxShadow: "none", // Remove shadow to eliminate any outline effect
                  padding: 1, // Minimal padding
                  marginTop: 2,
                }}
              >
                <IconButton
                  sx={{
                    position: "absolute",
                    top: 8,
                    right: 8,
                  }}
                  onClick={handleOutputClose} // Ensure this function is called
                >
                  <CloseIcon />
                </IconButton>
                <Output
                  results={[
                    "Input: [1, 2, 3, 4, 5]\nTarget: 3\nOutput: 2",
                    "Input: [10, 20, 30, 40, 50]\nTarget: 25\nOutput: -1",
                    "Input: [1, 3, 5, 7, 9]\nTarget: 7\nOutput: 3",
                    "Input: [2, 4, 6, 8, 10]\nTarget: 4\nOutput: 1",
                    "Input: [0, 2, 4, 6, 8, 10]\nTarget: 0\nOutput: 0",
                  ]}
                  onClose={handleOutputClose}
                />
              </Box>
            )}
          </Box>
        </Grid>
        <Grid item xs={12} md={6}>
          <Editor />
        </Grid>
      </Grid>
      <Box
        sx={{
          display: "flex",
          justifyContent: "flex-end",
          padding: 2,
          border: 0,
          marginRight: 2,
          position: "absolute",
          bottom: 0,
          right: 0,
          backgroundColor: "transparent", // Transparent background
          zIndex: 1,
        }}
      >
        <Button
          sx={{
            ...customStyles.control,
            width: "auto",
            maxWidth: "none",
            padding: "6px 12px",
            marginRight: 1,
            border: "none", // Remove border
            backgroundColor: "black", // Transparent background
            color: "white", // Black font color
            "&:hover": {
              cursor: "pointer",
              color: "blue", // Change color on hover if desired
            },
          }}
          variant="text" // Ensures no background is applied
          onClick={handleRunClick}
        >
          Run
        </Button>
        <Button
          sx={{
            ...customStyles.control,
            width: "auto",
            maxWidth: "none",
            padding: "6px 12px",
            border: "none", // Remove border
            backgroundColor: "black", // Transparent background
            color: "white", // Black font color
            "&:hover": {
              cursor: "pointer",
              color: "blue", // Change color on hover if desired
            },
          }}
          variant="text" // Ensures no background is applied
          onClick={() => console.log("Submit clicked")}
        >
          Submit
        </Button>
      </Box>
    </>
  );
};

export default CodingArena;
