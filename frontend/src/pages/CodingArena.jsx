import React, { useState, useEffect, useContext } from "react";
import { Grid, Box, IconButton, Tabs, Tab, Button } from "@mui/material";
import ProblemStatement from "../components/codingArena/ProblemStatement";
import Solutions from "../components/codingArena/Solutions";
import Submissions from "../components/codingArena/Submissions";
import Editor from "../components/CodeEditor/Editor";
import OutputModal from "../components/OutputModal"; 
import { useParams } from "react-router-dom";
import { customStyles } from "../constants/customStyles";
import axios from "axios";
import { AuthContext } from "../AuthContext";
import LoginModal from "../components/LoginModal";
import useLanguage from "../hooks/useLanguage"; // Import the custom hook

const CodingArena = () => {
  const [problemData, setProblemData] = useState({});
  const [editorData, setEditorData] = useState({ code: "" });
  const { problem_id } = useParams();
  const { isLoggedIn } = useContext(AuthContext);
  const [readyForRender, setReadyForRender] = useState(false);
  const [currentTab, setCurrentTab] = useState(0);
  const [solutions, setSolutions] = useState([]);
  const [submissions, setSubmissions] = useState([]);
  const [outputVisible, setOutputVisible] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [isSubmission, setIsSubmission] = useState(false);
  const [outputData, setOutputData] = useState([]); // State for output data
  const { language, changeLanguage } = useLanguage(); // Use the custom hook

  useEffect(() => {
    const fetchProblemData = async () => {
      try {
        const response = await axios.get(
          `http://localhost:6969/problem/${problem_id}`
        );

        if (response.data.status === "ok") {
          setProblemData(response.data.data);
        } else {
          setProblemData({
            Error: "Cannot Find Problem, Go back to home page.",
          });
        }
        setReadyForRender(true);
      } catch (error) {
        console.error("Error fetching problem data:", error);
        setProblemData({ Error: "An error occurred. Please try again later." });
      }
    };

    fetchProblemData();
  }, [problem_id]);

  const handleTabChange = (event, newValue) => {
    setCurrentTab(newValue);
  };

  const handleRunClick = () => {
    setIsSubmission(false);
    setOutputVisible(true);
  };

  const handleSubmitClick = async () => {
    if (isLoggedIn) {
      const data = {
        language: language,
        code: btoa(editorData.code),
        problemNumber: problem_id,
      };
      console.log(data);
      try {
        const response = await axios.post(
          "http://localhost:6969/submit-code",
          data,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );

        // Handling both success and failure cases
        const { status, input, output, expectedOutput, message, passed, testcases } = response.data;

        setIsSubmission(true);
        setOutputVisible(true);
        setOutputData({
          status: status || "",
          input: input || "",
          output: output || "",
          expectedOutput: expectedOutput || "",
          testcases: testcases || "",
          message: message || "",
          passed: passed || "",
        });

      } catch (error) {
        console.error("Error submitting code:", error);
        setOutputData({
          input: "",
          output: "",
          expectedOutput: "",
          message: "An error occurred while submitting the code.",
          passed: "0/0",
        });
        setOutputVisible(true);
      }
    } else {
      setShowModal(true);
    }
  };

  const handleOutputClose = () => {
    setOutputVisible(false);
  };

  const handleCodeChange = (code) => {
    setEditorData((prevData) => ({ ...prevData, code }));
  };

  const handleLanguageChange = (language) => {
    changeLanguage(language.value); // Update language using the custom hook
  };

  const renderContent = () => {
    switch (currentTab) {
      case 1:
        return <Solutions solutions={solutions} />;
      case 2:
        return <Submissions submissions={submissions} />;
      case 0:
      default:
        return readyForRender &&
          problemData &&
          Object.keys(problemData).length > 0 ? (
          <ProblemStatement
            title={problemData.title || ""}
            description={problemData.description || ""}
            constraints={problemData.constraints || []}
            examples={problemData.examples || []}
            tags={problemData.tags || []}
            outputVisible={outputVisible}
            difficulty={problemData.difficulty || ""}
          />
        ) : (
          <Box sx={{ padding: 2 }}>
            <p>Loading or Error occurred. Please try again later.</p>
          </Box>
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

            {/* Old output code commented out */}
            {/* {outputVisible && (
              <Box
                sx={{
                  height: "60vh",
                  overflowY: "auto",
                  position: "absolute",
                  top: "65%",
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
                  results={outputData} // Pass the dynamic output data
                  onClose={handleOutputClose}
                  isSubmission={isSubmission}
                />
              </Box>
            )} */}

            {/* New OutputModal */}
            {outputVisible && (
              <OutputModal
                open={outputVisible}
                onClose={handleOutputClose}
                data={outputData}
              />
            )}
          </Box>
        </Grid>
        <Grid item xs={12} md={6}>
          <Editor
            onCodeChange={handleCodeChange}
            onLanguageChange={handleLanguageChange}
          />
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
          onClick={handleSubmitClick}
        >
          Submit
        </Button>
      </Box>
      {!isLoggedIn && (
        <LoginModal open={showModal} onClose={() => setShowModal(false)} />
      )}
    </>
  );
};

export default CodingArena;
