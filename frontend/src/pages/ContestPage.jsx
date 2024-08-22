import React, { useState, useEffect } from "react";
import {
  Box,
  Typography,
  Container,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Pagination,
  PaginationItem,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from "@mui/material";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import LoginModal from "../components/modals/LoginModal";
import { io } from "socket.io-client";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";

const theme = createTheme({
  palette: {
    mode: "dark",
  },
});

const Page = () => {
  const { "contest-id": contestId } = useParams();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [contestData, setContestData] = useState({});
  const [loading, setLoading] = useState(true);
  const [timeLeft, setTimeLeft] = useState(null);
  const [contestState, setContestState] = useState(null);
  const [startTime, setStartTime] = useState(null);
  const [endTime, setEndTime] = useState(null);
  const [scoreboardRows, setScoreboardRows] = useState([]);
  const [scoreboardPage, setScoreboardPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const navigate = useNavigate();
  const SOCKET_SERVER_URL = "http://localhost:6969";

  useEffect(() => {
    const socket = io(SOCKET_SERVER_URL);
    socket.emit('joinRoom', { contestId });

    socket.on("updateLeaderboard", async () => {
      const response = await axios.get("http://localhost:6969/get-standings", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        params: {
          contestId: contestId,
          page: scoreboardPage,
          limit: rowsPerPage,
        },
      });
      setScoreboardRows(response.data.data);
    });

    return () => {
      socket.disconnect();
    };
  }, [scoreboardPage, rowsPerPage]);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      setIsLoggedIn(true);
    } else {
      setIsLoggedIn(false);
      setModalOpen(true);
    }
  }, []);

  useEffect(() => {
    const fetchContestData = async () => {
      if (contestId) {
        try {
          setLoading(true);
          const response = await axios.get(
            `http://localhost:6969/get-contest-question/${contestId}`,
            {
              headers: {
                Authorization: `Bearer ${localStorage.getItem("token")}`,
              },
            }
          );
          const contestData = response.data.data;
          setContestData(contestData);
          setStartTime(contestData.schedule.start);
          setEndTime(contestData.schedule.end);
          const res = await axios.get("http://localhost:6969/get-standings", {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
            params: {
              contestId: contestId,
              page: scoreboardPage,
              limit: rowsPerPage,
            },
          });
          setScoreboardRows(res.data.data);
        } catch (error) {
          console.error("Error fetching contest data:", error);
        } finally {
          setLoading(false);
        }
      }
    };

    fetchContestData();
  }, [contestId]);

  useEffect(() => {
    if (startTime && endTime) {
      const calculateTimeLeft = () => {
        const now = new Date().getTime();
        const start = new Date(startTime).getTime();
        const end = new Date(endTime).getTime();

        if (now < start) {
          const timeDifference = start - now;
          setContestState("before");
          setTimeLeft(formatTime(timeDifference));
        } else if (now >= start && now <= end) {
          const timeDifference = end - now;
          setContestState("during");
          setTimeLeft(formatTime(timeDifference));
        } else {
          setContestState("after");
          setTimeLeft("Contest is over");
        }
      };

      // Initial calculation
      calculateTimeLeft();
      // Update time left every second
      const intervalId = setInterval(calculateTimeLeft, 1000);

      return () => clearInterval(intervalId);
    }
  }, [startTime, endTime]);

  const formatTime = (timeDifference) => {
    const days = Math.floor(timeDifference / (1000 * 60 * 60 * 24));
    const hours = Math.floor(
      (timeDifference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
    );
    const minutes = Math.floor(
      (timeDifference % (1000 * 60 * 60)) / (1000 * 60)
    );
    const seconds = Math.floor((timeDifference % (1000 * 60)) / 1000);

    return `${days}d ${hours}h ${minutes}m ${seconds}s`;
  };

  const handleModalClose = () => {
    setModalOpen(false);
  };

  const problemColumns = [
    { id: "id", label: "ID" },
    { id: "title", label: "Title", align: "left" },
    { id: "positive", label: "Positive Points", align: "right" },
    { id: "negative", label: "Negative Points", align: "right" },
  ];

  const scoreboardColumns = [
    { id: "name", label: "Name" },
    { id: "score", label: "Score" },
    { id: "finishTime", label: "Finish Time" },
  ];

  const problemRows =
    contestData?.questions?.map((question, index) => ({
      id: index + 1,
      title: (
        <Button
          onClick={() =>
            navigate(`/contest/${contestId}/${question.id}`, {
              state: {
                startTime: startTime,
                endTime: endTime,
              },
            })
          }
        >
          {question.title}
        </Button>
      ),
      positive: question?.points?.positive,
      negative: question?.points?.negative,
    })) || [];

    const formattedScoreboardRows =
    Array.isArray(scoreboardRows) &&
    scoreboardRows.map((row) => {
      // Extract relevant dates
      const startTime = new Date(row.schedule.start);
      const lastSubmission = new Date(row.participants.lastSubmission);
  
      // Calculate duration
      const duration = lastSubmission - startTime;
  
      // Format the duration
      const hours = Math.floor(duration / (1000 * 60 * 60));
      const minutes = Math.floor((duration % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((duration % (1000 * 60)) / 1000);
      
      // Return the formatted row
      return {
        name: row.participants.username,
        score: row.participants.score,
        finishTime: (row.participants.lastSubmission)? `${hours}h ${minutes}m ${seconds}s` : "No submissions",
      };
    }) || [];
  

    const getNestedValue = (obj, path) => {
      return path.split('.').reduce((acc, part) => acc && acc[part], obj);
    };
    

  const renderTable = (columns, rows) => (
    <TableContainer
      component={Paper}
      sx={{
        border: "1px solid rgba(255, 255, 255, 0.2)",
        borderRadius: "8px",
        overflow: "hidden",
      }}
    >
      <Table aria-label="customized table">
        <TableHead>
          <TableRow>
            {columns.map((column) => (
              <TableCell
                key={column.id}
                align={column.align || "left"}
                sx={{ width: column.width || "auto" }}
              >
                {column.label}
              </TableCell>
            ))}
          </TableRow>
        </TableHead>
        <TableBody>
          {rows.map((row, rowIndex) => (
            <TableRow key={rowIndex}>
              {columns.map((column) => (
                <TableCell key={column.id} align={column.align || "left"}>
                  {/* {row[column.id]} */}
                  {getNestedValue(row, column.id)}
                </TableCell>
              ))}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );

  if (loading) {
    return (
      <ThemeProvider theme={theme}>
        <Navbar />
        <Container>
          <Typography variant="h6" textAlign="center">
            Loading...
          </Typography>
        </Container>
      </ThemeProvider>
    );
  }

  if (!isLoggedIn) {
    return <LoginModal open={modalOpen} onClose={handleModalClose} />;
  }

  return (
    <ThemeProvider theme={theme}>
      <Navbar />
      <Container>
        {contestData && (
          <>
            <Box p={3}>
              <Box display="flex" justifyContent="space-between">
                <Typography
                  variant="h4"
                  display={"block"}
                  textAlign={"center"}
                  gutterBottom
                >
                  {contestData?.contestTitle}
                </Typography>
                {contestData.isHost && contestState !== "after" && (
                  <Button
                    variant="outlined"
                    onClick={() => navigate(`/contest/${contestId}/add`)}
                    sx={{
                      backgroundColor: "white",
                      color: "black",
                      "&:hover": { color: "white" },
                      maxHeight: "40px",
                      textTransform: "none",
                    }}
                  >
                    Add Problem
                  </Button>
                )}
              </Box>

              <Typography variant="body1" color="textSecondary">
                {contestData?.description}
              </Typography>

              {timeLeft && (
                <Box
                  mt={2}
                  p={2}
                  border="1px solid rgba(255, 255, 255, 0.2)"
                  borderRadius="8px"
                  bgcolor="rgba(255, 255, 255, 0.1)"
                  textAlign="center"
                >
                  <Typography variant="h6" color="textSecondary">
                    {contestState === "before"
                      ? `Starts in: ${timeLeft}`
                      : contestState === "during"
                      ? `Time Left: ${timeLeft}`
                      : `Contest Ended`}
                  </Typography>
                </Box>
              )}

              <Box mt={4}>
                <Typography variant="h6" gutterBottom>
                  Problems
                </Typography>
                {renderTable(problemColumns, problemRows)}
              </Box>

              <Box mt={4}>
                <Typography variant="h6" gutterBottom>
                  Scoreboard
                </Typography>
                {renderTable(scoreboardColumns, formattedScoreboardRows)}
                <Box display="flex" justifyContent="center" mt={2}>
                  <Pagination
                    count={Math.ceil(scoreboardRows.total / rowsPerPage)}
                    page={scoreboardPage}
                    onChange={(event, value) => setScoreboardPage(value)}
                    renderItem={(item) => (
                      <PaginationItem
                        components={{ previous: ArrowBackIcon, next: ArrowForwardIcon }}
                        {...item}
                      />
                    )}
                    sx={{ "& .MuiPaginationItem-root": { color: "white" } }}
                  />
                </Box>
              </Box>
            </Box>
          </>
        )}
      </Container>
    </ThemeProvider>
  );
};

export default Page;
