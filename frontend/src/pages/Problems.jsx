import React, { useEffect, useState, useCallback } from "react";
import {
  Container,
  Box,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  TextField,
  Select,
  MenuItem,
  InputLabel,
  FormControl,
  Card,
  CardContent,
  Grid,
  useMediaQuery,
  useTheme,
  Pagination,
  PaginationItem,
} from "@mui/material";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { PieChart, Pie, Cell, Legend, Tooltip } from "recharts";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import axios from "axios";
import debounce from "lodash.debounce";

const filters = {
  status: ["All", "Solved", "Unsolved"],
  difficulty: ["All", "easy", "medium", "hard"],
  tags: [
    "All",
    "Array",
    "Hash Table",
    "Linked List",
    "Math",
    "Two Pointers",
    "String",
    "Dynamic Programming",
    "Backtracking",
    "Divide and Conquer",
    "Binary Search",
    "Stack",
    "Heap",
    "Greedy",
    "Sort",
    "Graph",
    "Depth First Search",
    "Breadth First Search",
    "Bit Manipulation",
    "Tree",
    "Union Find",
    "Design",
    "Topological Sort",
    "Trie",
    "Binary Search Tree",
    "Brainteaser",
    "Segment Tree",
    "Binary Index Tree",
    "Memoization",
    "Binary Indexed Tree",
  ],
};

const ProblemsPage = () => {
  const location = useLocation();
  const params = new URLSearchParams(location.search);
  const navigate = useNavigate();
  const token = params.get("token");
  const role = params.get("role");

  if (token) {
    localStorage.setItem("token", token);
    localStorage.setItem("role", role);
    navigate("/problems", { replace: true });
  }

  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [difficultyFilter, setDifficultyFilter] = useState("All");
  const [tagFilter, setTagFilter] = useState("All");
  const [page, setPage] = useState(0);
  const [totProblems, setTotProblems] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [easyProblems, setEasyProblems] = useState(0);
  const [medProblems, setMedProblems] = useState(0);
  const [hardProblems, setHardProblems] = useState(0);
  const [solvedProblems, setSolvedProblems] = useState(0);

  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down("md"));

  const [problems, setProblems] = useState([]);

  const getAllProblems = async () => {
    const token = localStorage.getItem("token");
    try {
      const response = await axios.get("http://localhost:6969/problems", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        params: {
          page: page + 1,
          limit: rowsPerPage,
          difficulty: difficultyFilter === "All" ? "" : difficultyFilter,
          tag: tagFilter === "All" ? "" : tagFilter,
          title: searchQuery,
          status: statusFilter === "All" ? "" : statusFilter,
        },
      });
      console.log(response.data);
      setEasyProblems(response.data.easySolved);
      setMedProblems(response.data.mediumSolved);
      setHardProblems(response.data.hardSolved);
      setProblems(response.data.data);
      setTotProblems(response.data.totalDocuments);
      setSolvedProblems(response.data.solved);
    } catch (err) {
      console.log(err);
    }
  };

  const debouncedFetchProblems = useCallback(
    debounce(() => {
      getAllProblems();
    }, 500),
    [difficultyFilter, tagFilter, searchQuery, statusFilter, page, rowsPerPage]
  );
  useEffect(() => {
    debouncedFetchProblems();
    return () => {
      debouncedFetchProblems.cancel();
    };
  }, [debouncedFetchProblems]);

  const difficultyColors = {
    easy: "lightgreen",
    medium: "yellow",
    hard: "red",
  };

  const statusColors = {
    solved: "lightgreen",
    unsolved: "white",
    attempted: "yellow",
  };

  const pieData = [
    { name: "Easy", value: easyProblems, color: difficultyColors.easy },
    { name: "Medium", value: medProblems, color: difficultyColors.medium },
    { name: "Hard", value: hardProblems, color: difficultyColors.hard },
  ];

  const truncateString = (str, maxLength) => {
    if (str.length > maxLength) {
      return str.substring(0, maxLength) + "...";
    }
    return str;
  };

  const getCombinedTags = (tags) => {
    const combinedTags = tags.join(", ");
    return truncateString(combinedTags, 20);
  };

  return (
    <Container>
      <Box my={4}>
        <Typography variant="h4" gutterBottom>
          Problems
        </Typography>

        <Grid
          container
          spacing={2}
          direction={isSmallScreen ? "column-reverse" : "row"}
        >
          <Grid item xs={12} md={9}>
            <Box
              display="flex"
              justifyContent="space-between"
              alignItems="center"
              mb={2}
            >
              <TextField
                label="Search Problems"
                variant="outlined"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                style={{ marginRight: "16px", width: "30%" }}
              />
              <FormControl
                variant="outlined"
                style={{ marginRight: "16px", width: "20%" }}
              >
                <InputLabel>Status</InputLabel>
                <Select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  label="Status"
                >
                  {filters.status.map((status) => (
                    <MenuItem key={status} value={status}>
                      {status}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
              <FormControl
                variant="outlined"
                style={{ marginRight: "16px", width: "20%" }}
              >
                <InputLabel>Difficulty</InputLabel>
                <Select
                  value={difficultyFilter}
                  onChange={(e) => setDifficultyFilter(e.target.value)}
                  label="Difficulty"
                >
                  {filters.difficulty.map((difficulty) => (
                    <MenuItem key={difficulty} value={difficulty}>
                      {difficulty}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
              <FormControl variant="outlined" style={{ width: "20%" }}>
                <InputLabel>Tags</InputLabel>
                <Select
                  value={tagFilter}
                  onChange={(e) => setTagFilter(e.target.value)}
                  label="Tags"
                >
                  {filters.tags.map((tag) => (
                    <MenuItem key={tag} value={tag}>
                      {tag}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Box>
            <TableContainer component={Paper}>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>ID</TableCell>
                    <TableCell>Title</TableCell>
                    <TableCell>Difficulty</TableCell>
                    <TableCell>Status</TableCell>
                    <TableCell>Tags</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {problems.map((problem, index) => (
                    <TableRow
                      key={problem.problem_id}
                      sx={{
                        backgroundColor:
                          index % 2 === 0 ? "primary.main" : "secondary.main",
                        "&:hover": {
                          backgroundColor:
                            index % 2 === 0 ? "primary.dark" : "secondary.dark",
                        },
                      }}
                    >
                      <TableCell>{problem.problem_id}</TableCell>
                      <TableCell>
                        <Link
                          className="text-white hover:text-blue-500 transition-all duration-300"
                          to={`/problem/${problem?.problem_id}`}
                          state={{ status: problem.status.toLowerCase() }}
                        >
                          {problem.title}
                        </Link>
                      </TableCell>
                      <TableCell
                        sx={{
                          color:
                            difficultyColors[
                              problem.difficulty?.toLowerCase() || ""
                            ] || "inherit",
                        }}
                      >
                        {problem.difficulty}
                      </TableCell>
                      <TableCell
                        sx={{
                          color:
                            statusColors[problem.status?.toLowerCase() || ""] ||
                            "inherit",
                        }}
                      >
                        {problem.status}
                      </TableCell>
                      <TableCell>{getCombinedTags(problem.tags)}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
            <Box className="flex  items-center justify-between mt-4">
              <Pagination
                count={Math.ceil(totProblems / rowsPerPage)} // Total number of pages
                page={page + 1} // Pages are 1-based for the Pagination component
                onChange={(event, value) => setPage(value - 1)} // Update page (convert back to 0-based index)
                renderItem={(item) => (
                  <PaginationItem
                    slots={{ previous: ArrowBackIcon, next: ArrowForwardIcon }}
                    {...item}
                  />
                )}
              />
              <FormControl
                variant="outlined"
                size="small"
                className="ml-4 w-28"
              >
                <InputLabel id="rows-per-page-label">Rows per page</InputLabel>
                <Select
                  labelId="rows-per-page-label"
                  value={rowsPerPage} // Default value from state
                  onChange={(e) => setRowsPerPage(Number(e.target.value))} // Update state with the selected value
                  label="Rows per page"
                >
                  <MenuItem value={10}>10</MenuItem>
                  <MenuItem value={50}>50</MenuItem>
                  <MenuItem value={100}>100</MenuItem>
                  <MenuItem value={200}>200</MenuItem>
                </Select>
              </FormControl>
            </Box>
          </Grid>

          <Grid item xs={12} md={3}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Progress Overview
                </Typography>
                <Typography variant="body1" gutterBottom>
                  {`You have completed ${
                    solvedProblems
                  } out of ${totProblems} problems.`}
                </Typography>
                <PieChart width={240} height={240}>
                  <Pie
                    data={pieData}
                    dataKey="value"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    outerRadius={70}
                    label
                  >
                    {pieData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend />
                </PieChart>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Box>
    </Container>
  );
};

export default ProblemsPage;
