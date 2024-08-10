import React, { useState, useEffect } from "react";
import { Grid, Box, IconButton, Tabs, Tab, Button } from "@mui/material";
import ProblemStatement from "../components/codingArena/ProblemStatement";
import Solutions from "../components/codingArena/Solutions";
import Submissions from "../components/codingArena/Submissions";
import Editor from "../components/CodeEditor/Editor";
import Output from "../components/codingArena/Output";
import CloseIcon from "@mui/icons-material/Close";
import { useParams } from "react-router-dom";
import { customStyles } from "../constants/customStyles";
import axios from "axios";

const CodingArena = () => {
  const [currentTab, setCurrentTab] = useState(0);
  const [solutions, setSolutions] = useState([]);
  const [submissions, setSubmissions] = useState([]);
  const [outputVisible, setOutputVisible] = useState(false);

  const { problem_id } = useParams();
  const [problemData, setProblemData] = useState({});

  useEffect(() => {
    const fetch = async () => {
      const response = await axios.get(
        `http://localhost:6969/problem/${problem_id}`
      );
      if (response.data.status === "ok") setProblemData(response.data.data);
      else
        setProblemData({ Error: "Cannot Find Problem, Go back to home page." });
    };
    fetch();
  }, []);

  const handleTabChange = (event, newValue) => {
    setCurrentTab(newValue);
  };

  const handleRunClick = () => {
    setOutputVisible(true);
  };

  const handleOutputClose = () => {
    setOutputVisible(false);
  };

  const renderContent = () => {
    console.log(problemData);
    switch (currentTab) {
      case 1:
        return <Solutions solutions={solutions} />;
      case 2:
        return <Submissions submissions={submissions} />;
      case 0:
      default:
        return (
          <ProblemStatement
            title={problemData.data.title}
            description={problemData.data.description}
            constraints={problemData.data.constraints}
            examples={problemData.data.examples}
            tags={problemData.data.tags}
            outputVisible={outputVisible} // Pass outputVisible to adjust height
            difficulty={problemData.data.difficulty}
          />
        );
    }
  };

  return (
    <>
      <Grid container spacing={2} sx={{ maxHeight: "100vh", padding: 2 }}>
        <Grid item xs={12} md={6}>
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              height: "100%", // Ensure full height usage
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
                  borderBottom: 1,
                  borderColor: "divider",
                }}
              >
                <Tabs
                  value={currentTab}
                  onChange={handleTabChange}
                  aria-label="Tabs for Problem, Solutions, and Submissions"
                  sx={{ marginBottom: 2 }}
                >
                  <Tab
                    label="Problem"
                    sx={{
                      bgcolor: currentTab === 0 ? "#8888" : "gray",
                      color: currentTab === 0 ? "white" : "white",
                      "&:hover": {
                        bgcolor: currentTab === 0 ? "#8899" : "darkgray",
                      },
                    }}
                  />
                  <Tab
                    label="Solutions"
                    sx={{
                      bgcolor: currentTab === 1 ? "#8888" : "gray",
                      color: currentTab === 1 ? "white" : "white",
                      "&:hover": {
                        bgcolor: currentTab === 1 ? "#8899" : "darkgray",
                      },
                    }}
                  />
                  <Tab
                    label="Submissions"
                    sx={{
                      bgcolor: currentTab === 2 ? "#8888" : "gray",
                      color: currentTab === 2 ? "white" : "white",
                      "&:hover": {
                        bgcolor: currentTab === 2 ? "#8899" : "darkgray",
                      },
                    }}
                  />
                </Tabs>
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
                  height: "40%", // Reduced height of 40% for the output component
                  overflowY: "auto",
                  position: "absolute",
                  top: "75%",
                  width: "50%",
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
          onClick={handleRunClick} // Ensure handleRunClick is called
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
          onClick={handleRunClick} // Trigger output visibility on Submit as well
        >
          Submit
        </Button>
      </Box>
    </>
  );
};

export default CodingArena;
