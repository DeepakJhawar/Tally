import React, { useState } from "react";
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
} from "@mui/material";
import { Link } from "react-router-dom";
import { PieChart, Pie, Cell, Legend, Tooltip } from "recharts";

const filters = {
  status: ["All", "Solved", "Unsolved", "Attempted"],
  difficulty: ["All", "Easy", "Medium", "Hard"],
  tags: ["All", "Array", "Hashing", "Trees", "Dynamic Programming"],
};

const ProblemsPage = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [difficultyFilter, setDifficultyFilter] = useState("All");
  const [tagFilter, setTagFilter] = useState("All");

  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down("md"));

  const problems = [
    {
      id: 1,
      title: "Two Sum",
      difficulty: "Easy",
      tags: ["Array"],
      status: "Solved",
    },
    {
      id: 2,
      title: "Add Two Numbers",
      difficulty: "Medium",
      tags: ["LinkedList"],
      status: "Solved",
    },
    {
      id: 3,
      title: "Longest Substring Without Repeating Characters",
      difficulty: "Hard",
      tags: ["String"],
      status: "Solved",
    },
  ];

  const filteredProblems = problems.filter((problem) => {
    return (
      (statusFilter === "All" || problem.status === statusFilter) &&
      (difficultyFilter === "All" || problem.difficulty === difficultyFilter) &&
      (tagFilter === "All" || problem.tags.includes(tagFilter)) &&
      problem.title.toLowerCase().includes(searchQuery.toLowerCase())
    );
  });

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

  const solvedProblems = problems.filter(
    (problem) => problem.status === "Solved"
  ).length;

  const easyProblems = problems.filter(
    (problem) => problem.difficulty === "Easy" && problem.status === "Solved"
  ).length;
  const mediumProblems = problems.filter(
    (problem) => problem.difficulty === "Medium" && problem.status === "Solved"
  ).length;
  const hardProblems = problems.filter(
    (problem) => problem.difficulty === "Hard" && problem.status === "Solved"
  ).length;

  const totalProblems = problems.length;

  const pieData = [
    { name: "Easy", value: easyProblems, color: difficultyColors.easy },
    { name: "Medium", value: mediumProblems, color: difficultyColors.medium },
    { name: "Hard", value: hardProblems, color: difficultyColors.hard },
  ];

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
            {/* Filters and Problem List */}
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
                  {filteredProblems.map((problem, index) => (
                    <TableRow
                      key={problem.id}
                      sx={{
                        backgroundColor:
                          index % 2 === 0 ? "primary.main" : "secondary.main",
                        "&:hover": {
                          backgroundColor:
                            index % 2 === 0 ? "primary.dark" : "secondary.dark",
                        },
                      }}
                    >
                      <TableCell>{problem.id}</TableCell>
                      <TableCell>
                        <Link
                          className="text-white hover:text-blue-500 transition-all duration-300"
                          to={`/problems/${problem?._id}`}
                        >
                          {problem.title}
                        </Link>
                      </TableCell>
                      <TableCell
                        sx={{
                          color:
                            difficultyColors[
                              problem.difficulty.toLowerCase()
                            ] || "inherit",
                        }}
                      >
                        {problem.difficulty}
                      </TableCell>
                      <TableCell
                        sx={{
                          color:
                            statusColors[problem.status.toLowerCase()] ||
                            "inherit",
                        }}
                      >
                        {problem.status}
                      </TableCell>
                      <TableCell>{problem.tags.join(", ")}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Grid>
          
          <Grid item xs={12} md={3}>
            {/* Card with Pie Chart */}
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Progress Overview
                </Typography>
                <Typography variant="body1" gutterBottom>
                  {`You have completed ${solvedProblems} out of ${totalProblems} problems.`}
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
                      <Cell
                        key={`cell-${index}`}
                        fill={entry.color}
                      />
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
