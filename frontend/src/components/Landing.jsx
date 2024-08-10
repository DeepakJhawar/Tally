import * as React from "react";
import {
  Container,
  Grid,
  Card,
  CardContent,
  CardMedia,
  Typography,
  CardActionArea,
  Divider,
} from "@mui/material";
import { useState, useEffect } from "react";
import { PieChart, Pie, Cell, Legend, Tooltip } from "recharts";
import axios from "axios";
import { Link } from "react-router-dom"; // Import Link for navigation

const Landing = () => {
  const [problems, setProblems] = useState([]);

  const getAllProblems = async () => {
    try {
      const response = await axios.get("http://localhost:6969/all-problems");
      setProblems(response.data.data);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    getAllProblems();
  }, []);

  const difficultyColors = {
    easy: "lightgreen",
    medium: "yellow",
    hard: "red",
  };

  const solvedProblems = problems.filter(
    (problem) => problem.status?.toLowerCase() === "solved"
  ).length;

  const easyProblems = problems.filter(
    (problem) => problem.difficulty?.toLowerCase() === "easy" && problem.status?.toLowerCase() === "solved"
  ).length;
  const mediumProblems = problems.filter(
    (problem) => problem.difficulty?.toLowerCase() === "medium" && problem.status?.toLowerCase() === "solved"
  ).length;
  const hardProblems = problems.filter(
    (problem) => problem.difficulty?.toLowerCase() === "hard" && problem.status?.toLowerCase() === "solved"
  ).length;

  const totalProblems = problems.length;

  const pieData = [
    { name: "Easy", value: easyProblems, color: difficultyColors.easy },
    { name: "Medium", value: mediumProblems, color: difficultyColors.medium },
    { name: "Hard", value: hardProblems, color: difficultyColors.hard },
  ];

  return (
    <Container sx={{ mt: 4 }}>
      <Grid container spacing={4}>
        {/* First Row */}
        <Grid item xs={12} sm={6} md={4} lg={6}>
          <Link to="/playground" style={{ textDecoration: 'none' }}>
            <Card sx={{ height: '100%' }}>
              <CardActionArea>
                <CardMedia
                  component="img"
                  height="200"
                  image="/images/playground.png"
                  alt="playground"
                />
                <CardContent>
                  <Typography gutterBottom variant="h6" component="div">
                    PlayGround
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    This is the place where you can compile and execute your code in 4 different languages.
                  </Typography>
                </CardContent>
              </CardActionArea>
            </Card>
          </Link>
        </Grid>

        <Grid item xs={12} sm={6} md={4} lg={6}>
          <Link to="/problems" style={{ textDecoration: 'none' }}>
            <Card sx={{ height: '100%' }}>
              <CardActionArea>
                <CardMedia
                  component="img"
                  height="200"
                  image="/images/problems.png"
                  alt="problems"
                />
                <CardContent>
                  <Typography gutterBottom variant="h6" component="div">
                    Start Solving
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Here are some handpicked problems on our platform which will help you prepare for anything.
                  </Typography>
                </CardContent>
              </CardActionArea>
            </Card>
          </Link>
        </Grid>

        {/* Second Row */}
        <Grid item xs={12} sm={6} md={4} lg={6}>
          <Link to="/contest" style={{ textDecoration: 'none' }}>
            <Card sx={{ height: '100%' }}>
              <CardActionArea>
                <CardMedia
                  component="img"
                  height="200"
                  image="/images/problems.png"
                  alt="contest"
                />
                <CardContent>
                  <Typography gutterBottom variant="h6" component="div">
                    Contests
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Test your skills against other users to know where you are standing. Participate in our curated contests.
                  </Typography>
                </CardContent>
              </CardActionArea>
            </Card>
          </Link>
        </Grid>

        <Grid item xs={12} sm={6} md={4} lg={6}>
          {/* Card with Pie Chart */}
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Progress Overview
              </Typography>
              <Divider sx={{ mb: 2 }} />
              <Typography variant="body1" gutterBottom>
                {`You have completed ${solvedProblems} out of ${totalProblems} problems.`}
              </Typography>
              <PieChart width={300} height={300}>
                <Pie
                  data={pieData}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  outerRadius={100}
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
    </Container>
  );
};

export default Landing;