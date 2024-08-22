import React, { useState, useEffect, useCallback } from "react";
import axios from "axios";
import {
  Box,
  Typography,
  Container,
  Button,
  TextField,
  Pagination,
  PaginationItem,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Link,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
} from "@mui/material";
import { styled } from "@mui/material/styles";
import { tableCellClasses } from "@mui/material/TableCell";
import { useNavigate } from "react-router-dom";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import debounce from "lodash.debounce";

const StyledTableCell = styled(TableCell)(({ theme }) => ({
  [`&.${tableCellClasses.head}`]: {
    backgroundColor: theme.palette.common.black,
    color: theme.palette.common.white,
  },
  [`&.${tableCellClasses.body}`]: {
    fontSize: 14,
  },
}));

const StyledTableRow = styled(TableRow)(({ theme }) => ({
  "&:nth-of-type(odd)": {
    backgroundColor: theme.palette.action.hover,
  },
  "&:last-child td, &:last-child th": {
    border: 0,
  },
}));

const Contest = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [contests, setContests] = useState({ current: [], past: [] });
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const [totContests, setTotContests] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [page, setPage] = useState(0);

  const fetchContests = async () => {
    try {
      setLoading(true);

      const [upcomingResponse, ongoingResponse, pastResponse] =
        await Promise.all([
          axios.get("http://localhost:6969/all-contest", {
            params: { type: "upcoming" },
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }),
          axios.get("http://localhost:6969/all-contest", {
            params: { type: "ongoing" },
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }),
          axios.get("http://localhost:6969/all-contest", {
            params: { type: "previous", limit: rowsPerPage, page: page + 1 },
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }),
        ]);

      const allContests = [
        ...upcomingResponse.data.data,
        ...ongoingResponse.data.data,
      ];

      setContests({
        current: allContests,
        past: pastResponse.data.data,
      });
      setTotContests(pastResponse.data.data.length);
    } catch (error) {
      console.error("Error fetching contests:", error);
    } finally {
      setLoading(false);
    }
  };

  const debouncedFetchContests = useCallback(
    debounce(() => {
      fetchContests();
    }, 500),
    [rowsPerPage, page]
  );

  useEffect(() => {
    debouncedFetchContests();
    return () => {
      debouncedFetchContests.cancel();
    };
  }, [debouncedFetchContests]);

  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
  };

  const handleContestClick = (contest) => {
    const url = `/contest/${contest._id}`;
    console.log("Navigating to:", url); // Log the URL to check if it's correct
    navigate(url, {
      state: {
        startTime: contest.schedule.start,
        endTime: contest.schedule.end,
      },
    });
  };
  

  const handleRegisterClick = async (contestId) => {
    try {
      await axios.post(
        "http://localhost:6969/register-contest",
        { contestId: contestId },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
            "Content-Type": "application/json" 
          },
        }
      );
      fetchContests();
      console.log(`Registering for contest with ID: ${contestId}`);
    } catch (error) {
      console.error("Error registering for contest:", error);
    }
  };
  

  const filteredCurrentContests = contests.current.filter((contest) =>
    contest.contestTitle.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredPastContests = contests.past.filter((contest) =>
    contest.contestTitle.toLowerCase().includes(searchTerm.toLowerCase())
  );

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
            {columns.map((column, index) => (
              <StyledTableCell
                key={index}
                align={column.align || "left"}
                sx={{ width: column.width || "auto" }}
              >
                {column.label}
              </StyledTableCell>
            ))}
          </TableRow>
        </TableHead>
        <TableBody>
          {rows.map((row, index) => (
            <StyledTableRow key={index}>
              {columns.map((column, colIndex) => (
                <StyledTableCell
                  key={colIndex}
                  align={column.align || "left"}
                  sx={{ width: column.width || "auto" }}
                >
                  {column.id === "contestTitle" ? (
                    <Link
                      color="inherit"
                      underline="none"
                      className="hover:cursor-pointer hover:underline hover:text-blue-500"
                      onClick={() => handleContestClick(row)}
                    >
                      {row[column.id]}
                    </Link>
                  ) : column.id === "register" ? (
                    <Button
                      variant="contained"
                      disabled={row.isRegistered}
                      sx={{
                        backgroundColor: row.isRegistered
                          ? "gray"
                          : "lightgreen",
                        color: "#000",
                        "&:hover": {
                          cursor: "pointer",
                          backgroundColor: "green",
                          color: "white",
                        },
                        textTransform: "none",
                      }}
                      onClick={() => handleRegisterClick(row._id)}
                    >
                      {row.isRegistered ? "Registered" : "Register"}
                    </Button>
                  ) : (
                    row[column.id]
                  )}
                </StyledTableCell>
              ))}
            </StyledTableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );

  const currentContestColumns = [
    { id: "contestNumber", label: "Contest Number" },
    { id: "contestTitle", label: "Contest Title" },
    { id: "start", label: "Start Time", align: "right" },
    { id: "end", label: "End Time", align: "right" },
    { id: "register", label: "Register", align: "right" },
  ];

  const pastContestColumns = [
    { id: "contestNumber", label: "Contest Number" },
    { id: "contestTitle", label: "Contest Title" },
    { id: "hostedDate", label: "Hosted Date", align: "right" },
    { id: "standings", label: "Standings", align: "right" },
  ];

  const currentContestRows = filteredCurrentContests.map((contest) => ({
    ...contest,
    start: new Date(contest.schedule.start).toLocaleString(),
    end: new Date(contest.schedule.end).toLocaleString(),
  }));

  const pastContestRows = filteredPastContests.map((contest) => ({
    ...contest,
    hostedDate: new Date(contest.schedule.start).toLocaleDateString(),
    standings: (
      <Link
        href={`/contest/${contest._id}/standings`} 
        color="inherit"
        underline="hover"
      >
        View Standings
      </Link>
    ),
  }));

  return (
    <Container>
      <Box p={2}>
        <Typography variant="h4" display={"block"} textAlign={"center"}>
          Contests
        </Typography>
      </Box>
      <Box
        display="flex"
        justifyContent="space-between"
        alignItems="center"
        mb={2}
      >
        <TextField
          variant="outlined"
          placeholder="Search contests..."
          value={searchTerm}
          onChange={handleSearchChange}
          sx={{ width: "70%" }}
        />
        <Button
          variant="contained"
          sx={{
            backgroundColor: "#f5f5f5", // Light gray background
            color: "#000", // Black text
            marginLeft: 2,
            "&:hover": {
              backgroundColor: "#a1a1a1", // Custom zinc color on hover
              color: "#000", // White text on hover
            },
            textTransform: "none",
          }}
          onClick={() => navigate("/create-contest")}
        >
          Add Contest
        </Button>
      </Box>
      <Box display="flex" justifyContent="space-between" alignItems="center">
        <Typography
          variant="h6"
          display={"block"}
          textAlign={"left"}
          gutterBottom
        >
          Current or Upcoming Contests
        </Typography>
      </Box>
      {renderTable(currentContestColumns, currentContestRows)}
      <Box mt={4} />
      <Typography
        variant="h6"
        display={"block"}
        textAlign={"left"}
        gutterBottom
      >
        Past Contests
      </Typography>
      {renderTable(pastContestColumns, pastContestRows)}
      <Box className="flex items-center justify-between mt-4">
        <Pagination
          count={Math.ceil(totContests / rowsPerPage)}
          page={page + 1}
          onChange={(event, value) => setPage(value - 1)}
          renderItem={(item) => (
            <PaginationItem
              slots={{ previous: ArrowBackIcon, next: ArrowForwardIcon }}
              {...item}
            />
          )}
        />
        <FormControl variant="outlined" size="small" className="ml-4 w-28">
          <InputLabel id="rows-per-page-label">Rows per page</InputLabel>
          <Select
            labelId="rows-per-page-label"
            value={rowsPerPage}
            onChange={(e) => setRowsPerPage(Number(e.target.value))}
            label="Rows per page"
          >
            <MenuItem value={10}>10</MenuItem>
            <MenuItem value={50}>50</MenuItem>
            <MenuItem value={100}>100</MenuItem>
            <MenuItem value={200}>200</MenuItem>
          </Select>
        </FormControl>
      </Box>
    </Container>
  );
};

export default Contest;
