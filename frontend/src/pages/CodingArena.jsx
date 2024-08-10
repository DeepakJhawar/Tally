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
import { useContext } from "react";
import { AuthContext } from "../AuthContext";
import LoginModal from "../components/LoginModal";

const CodingArena = () => {
  const [problemData, setProblemData] = useState({});
  const { problem_id } = useParams();
  const { isLoggedIn } = useContext(AuthContext);
  const [readyForRender, setReadyForRender] = useState(false);
  useEffect(() => {
    const fetchProblemData = async () => {
      try {
        const response = await axios.get(
          `http://localhost:6969/problem/${problem_id}`
        );
  
        console.log(response.data.data);
        if (response.data.status == "ok") {
          setProblemData(response.data.data);
        } else {
          setProblemData({ Error: "Cannot Find Problem, Go back to home page." });
        }
        setReadyForRender(true);
      } catch (error) {
        console.error("Error fetching problem data:", error);
        setProblemData({ Error: "An error occurred. Please try again later." });
      }
    };
  
    fetchProblemData();
  }, [problem_id]); 
  const [currentTab, setCurrentTab] = useState(0);
  const [solutions, setSolutions] = useState([]);
  const [submissions, setSubmissions] = useState([]);
  const [outputVisible, setOutputVisible] = useState(false);
  const [showModal, setShowModal] = useState(false);

  const handleTabChange = (event, newValue) => {
    setCurrentTab(newValue);
  };

  const handleRunClick = () => {
    setOutputVisible(true);
  }

  const handleSubmitClick = () => {
    if(isLoggedIn) setOutputVisible(true);
    else setShowModal(true);
  };

  const handleOutputClose = () => {
    setOutputVisible(false);
  };

  const renderContent = () => {
    switch (currentTab) {
      case 1:
        return <Solutions solutions={solutions} />;
      case 2:
        return <Submissions submissions={submissions} />;
      case 0:
      default:
        return (
          readyForRender && problemData && Object.keys(problemData).length > 0 ? (
            <ProblemStatement
              title={problemData.title || ""}
              description={problemData.description || ""}
              constraints={problemData.constraints || []} // Default to empty array
              examples={problemData.examples || []}       // Default to empty array
              tags={problemData.tags || []}               // Default to empty array
              outputVisible={outputVisible}
              difficulty={problemData.difficulty || ""}
            />
          ) : (
            <Box sx={{ padding: 2 }}>
              <p>Loading or Error occurred. Please try again later.</p>
            </Box>
          )
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
              height: "100%", 
            }}
          >
            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                flex: 1, 
                overflow: "hidden", 
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
                  flex: 1,
                  overflowY: "auto",
                }}
              >
                {renderContent()}
              </Box>
            </Box>

            {outputVisible && (
              <Box
                sx={{
                  height: "40%",
                  overflowY: "auto",
                  position: "absolute",
                  top: "75%",
                  width: "50%",
                  border: "none", 
                  boxShadow: "none",
                  padding: 1,
                  marginTop: 2,
                }}
              >
                <IconButton
                  sx={{
                    position: "absolute",
                    top: 8,
                    right: 8,
                  }}
                  onClick={handleOutputClose}
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
          backgroundColor: "transparent", 
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
            border: "none", 
            backgroundColor: "black",
            color: "white", 
            "&:hover": {
              cursor: "pointer",
              color: "blue", 
            },
          }}
          variant="text" 
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
            border: "none", 
            backgroundColor: "black", 
            color: "white",
            "&:hover": {
              cursor: "pointer",
              color: "blue", 
            },
          }}
          variant="text"
          onClick={handleSubmitClick}
        >
          Submit
        </Button>
      </Box>

      {showModal && (
        <LoginModal />
      )}
    </>
  );
};

export default CodingArena;
