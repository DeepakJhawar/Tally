import React, { useState, useEffect, useContext } from "react";
import {
  Grid,
  Box,
  IconButton,
  Tabs,
  Tab,
  Button,
  Typography,
} from "@mui/material";
import ProblemStatement from "../components/codingArena/ProblemStatement";
import Solutions from "../components/codingArena/Solutions";
import Submissions from "../components/codingArena/Submissions";
import OutputModal from "../components/modals/OutputModal";
import { useLocation, useParams } from "react-router-dom";
import { customStyles } from "../constants/customStyles";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import axios from "axios";
import { AuthContext } from "../AuthContext";
import LoginModal from "../components/modals/LoginModal";
import useLanguage from "../hooks/useLanguage";
import Output from "../components/codingArena/Output";
import CloseIcon from "@mui/icons-material/Close";
import LanguagesDropdown from "../components/Editor/LanguagesDropdown";
import CodeEditorWindow from "../components/Editor/CodeEditorWindow";
import { languageOptions } from "../constants/languageOptions";
import Input from "../components/codingArena/Input";
import CountdownTimer from "../components/contest/Timer";
import { useNavigate } from "react-router-dom";

const ContestArena = () => {
  const [problemData, setProblemData] = useState({});
  const navigate = useNavigate();
  const { "contest-id": contestId, problemNumber } = useParams();
  const location = useLocation();
  const { startTime, endTime } = location.state || {};
  const { isLoggedIn } = useContext(AuthContext);
  const [readyForRender, setReadyForRender] = useState(false);
  const [currentTab, setCurrentTab] = useState(0);
  const [solutions, setSolutions] = useState([]);
  const [submissions, setSubmissions] = useState([]);
  const [outputVisible, setOutputVisible] = useState(false);
  const [submitVisible, setSubmitVisible] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [isSubmission, setIsSubmission] = useState(false);
  const [outputData, setOutputData] = useState({});
  const [examples, setExamples] = useState([]);
  const [code, setCode] = useState("");
  const [language, setLanguage] = useState(languageOptions[0]);
  const [dataFetched, setDataFetched] = useState(false);
  const [loading, setLoading] = useState({
    save: false,
    run: false,
    submit: false,
  });
  const [customInputVisible, setCustomInputVisible] = useState(false);
  const [customInputValue, setCustomInputValue] = useState("");

  const { changeLanguage } = useLanguage(languageOptions[0]);

  useEffect(() => {
    const fetchProblemData = async () => {
      try {
        const response = await axios.get(
          "http://localhost:6969/get-contest-question-by-id",
          {
            params: { questionId: problemNumber },
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );

        if (response.data.status === "ok") {
          setProblemData(response.data.data);
          setExamples(response.data.data.examples);
          setReadyForRender(true);
        } else {
          setProblemData({
            Error: "Cannot Find Problem, Go back to home page.",
          });
        }
        setDataFetched(true);
      } catch (error) {
        console.error("Error fetching problem data:", error);
        setProblemData({ Error: "An error occurred. Please try again later." });
        setDataFetched(true);
      }
    };

    fetchProblemData();
  }, [problemNumber]);

  useEffect(() => {
    if (dataFetched) {
      changeLanguage(language);
    }
  }, [dataFetched, language, changeLanguage]);

  const onSelectChange = (selectedLanguage) => {
    setLanguage(selectedLanguage);
  };

  const handleTabChange = (event, newValue) => {
    setCurrentTab(newValue);
  };

  const handleRunClick = async () => {
    if (isLoggedIn) {
      const inputData = examples.map((example) => example.givenInput);

      let results = [];

      try {
        for (let i = 0; i < inputData[0].length; i++) {
          const data = {
            language: language.value,
            code: btoa(code),
            input: btoa(examples[0].givenInput[i]),
            expectedOutput: examples[0].correctOutput[i],
            contestId: contestId,
          };
          setLoading({
            run: true,
            submit: false,
            save: false,
          });
          const response = await axios.post(
            "http://localhost:6969/run-arena-code",
            data,
            {
              validateStatus: (status) => status >= 200 && status < 500,
              headers: {
                Authorization: `Bearer ${localStorage.getItem("token")}`,
              },
            }
          );
          results.push({
            input: examples[0].givenInput[i],
            output: response.data.output,
            expectedOutput: examples[0].correctOutput[i],
            passed: response.data.passed,
          });
        }

        setOutputData(results);
        setOutputVisible(true);
      } catch (error) {
        console.error("Error running code:", error);
        setOutputData({
          input: [],
          output: [],
          expectedOutput: [],
          message: "An error occurred while running the code.",
          passed: "0/0",
        });
        setOutputVisible(true);
      } finally {
        setLoading({
          run: false,
          submit: false,
          save: false,
        });
      }
    } else {
      setShowModal(true);
    }
  };

  const handleCustomInputClick = () => {
    setCustomInputVisible(true);
  };

  const handleCustomInputClose = () => {
    setCustomInputVisible(false);
  };

  const handleInputChange = (event) => {
    setCustomInputValue(event.target.value);
  };

  const handleCustomInputTest = async () => {
    if (isLoggedIn) {
      const customInput = customInputValue;

      const data = {
        language: language.value,
        code: btoa(code),
        input: btoa(customInput),
        expectedOutput: "",
      };

      setLoading({ run: true, submit: false, save: false });

      try {
        const response = await axios.post(
          "http://localhost:6969/run-arena-code",
          data,
          {
            validateStatus: (status) => status >= 200 && status < 500,
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );

        const result = {
          input: customInput,
          output: response.data.output,
          expectedOutput: "",
          passed: response.data.passed,
        };

        setOutputData([result]);
        setOutputVisible(true);
      } catch (error) {
        console.error("Error running custom input:", error);
        setOutputData({
          input: [customInput],
          output: ["Error occurred"],
          expectedOutput: [""],
          message: "An error occurred while running the custom input.",
          passed: "0/1",
        });
        setOutputVisible(true);
      } finally {
        setLoading({
          run: false,
          submit: false,
          save: false,
        });
      }
    } else {
      setShowModal(true);
    }
  };

  const handleSubmitClick = async () => {
    console.log(contestId);
    if (isLoggedIn) {
      const data = {
        language: language.value,
        code: btoa(code),
        problemNumber: problemNumber,
        contestId: contestId,
      };

      try {
        setLoading({
          run: false,
          submit: true,
          save: false,
        });
        const response = await axios.post(
          "http://localhost:6969/submit-contest-code",
          data,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
            validateStatus: (status) => status >= 200 && status < 500,
          }
        );

        const {
          status,
          input,
          output,
          expectedOutput,
          message,
          passed,
          testcases,
        } = response.data;

        setIsSubmission(true);
        setSubmitVisible(true);
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
        setSubmitVisible(true);
      } finally {
        setLoading({
          run: false,
          submit: false,
          save: false,
        });
      }
    } else {
      setShowModal(true);
    }
  };

  const handleSubmitClose = () => {
    setSubmitVisible(false);
  };

  const handleOutputClose = () => {
    setOutputVisible(false);
  };

  const onChange = (action, data) => {
    if (action === "code") {
      setCode(data);
    }
  };

  const handleSubmissions = async () => {
    try {
      const response = await axios.get(
        "http://localhost:6969/get-submissions",
        {
          params: { problemNumber: problemNumber, contestId: contestId },
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
          validateStatus: (status) => status >= 200 && status < 500,
        }
      );

      if (response.data.status === "ok") {
        setSubmissions(response.data.data);
      } else {
        console.error("Unexpected response status:", response.data);
      }
    } catch (err) {
      console.error("Error fetching data:", err);
    }
  };

  useEffect(() => {
    if (currentTab === 2) handleSubmissions();
  }, [currentTab]);

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
              position: "relative",
            }}
          >
            {/* Back Button and Tabs */}
            <Box
              sx={{
                display: "flex",
                flexDirection: "row",
                alignItems: "center",
                padding: 1,
                borderBottom: 1,
                borderColor: "divider",
              }}
            >
              <IconButton
                onClick={() => navigate(`/contest/${contestId}`)}
                sx={{
                  color: "#ffffff",
                  flexShrink: 0, // Prevent the back button from shrinking
                }}
              >
                <ArrowBackIcon />
              </IconButton>

              <Box
                sx={{
                  flexGrow: 1,
                  display: "flex",
                  justifyContent: "center",
                }}
              >
                <Tabs
                  value={currentTab}
                  onChange={handleTabChange}
                  aria-label="Tabs for Problem, Solutions, and Submissions"
                  sx={{
                    marginBottom: 0, // Remove bottom margin
                    minHeight: "auto", // Remove any default min-height
                    padding: 0, // Remove any padding
                  }}
                >
                  <Tab
                    label="Problem"
                    sx={{
                      bgcolor: "transparent",
                      color: "#888888",
                      "&:hover": {
                        color: "#ffffff",
                      },
                      "&.Mui-selected": {
                        color: "#ffffff",
                      },
                    }}
                  />
                  <Tab
                    label="Solutions"
                    sx={{
                      bgcolor: "transparent",
                      color: "#888888",
                      "&:hover": {
                        color: "#ffffff",
                      },
                      "&.Mui-selected": {
                        color: "#ffffff",
                      },
                    }}
                  />
                  <Tab
                    label="Submissions"
                    sx={{
                      bgcolor: "transparent",
                      color: "#888888",
                      "&:hover": {
                        color: "#ffffff",
                      },
                      "&.Mui-selected": {
                        color: "#ffffff",
                      },
                    }}
                  />
                </Tabs>
              </Box>
            </Box>

            {/* Content */}
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
                  display: "flex",
                  flexDirection: "column",
                  height: "100%",
                  overflowY: "auto",
                }}
              >
                {renderContent()}
              </Box>

              {outputVisible && (
                <Box
                  sx={{
                    height: "30vh",
                    overflowY: "auto",
                    position: "absolute",
                    top: "65%",
                    width: "100%",
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
                    results={outputData}
                    onClose={handleOutputClose}
                    isSubmission={isSubmission}
                  />
                </Box>
              )}

              {customInputVisible && (
                <Input
                  open={customInputVisible}
                  onChange={handleInputChange}
                  onClose={handleCustomInputClose}
                  onTest={handleCustomInputTest}
                />
              )}

              {submitVisible && (
                <OutputModal
                  open={submitVisible}
                  onClose={handleSubmitClose}
                  outputData={outputData}
                />
              )}
            </Box>
          </Box>
        </Grid>

        <Grid item xs={12} md={6}>
          <Box
            sx={{ display: "flex", flexDirection: "column", height: "100%" }}
          >
            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                mb: 2,
              }}
            >
              <Box sx={{ display: "flex", alignItems: "center" }}>
                <CountdownTimer startTime={startTime} endTime={endTime} />
              </Box>
              <LanguagesDropdown onSelectChange={onSelectChange} />
            </Box>
            <Box sx={{ flex: 1, overflow: "auto" }}>
              <CodeEditorWindow
                code={code}
                onChange={onChange}
                language={language?.value}
              />
            </Box>
          </Box>
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
              color: "black",
            },
          }}
          variant="text"
          onClick={handleCustomInputClick}
        >
          Custom Input
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
              color: "black",
            },
            position: "relative",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
          variant="text"
          onClick={handleRunClick}
          disabled={loading.run || loading.save || loading.submit}
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
              color: "black",
            },
            position: "relative",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
          variant="text"
          onClick={() => {
            handleSubmitClick();
            handleSubmissions();
          }}
          disabled={loading.run || loading.save || loading.submit}
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

export default ContestArena;
