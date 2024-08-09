import React from "react";
import { Grid } from "@mui/material";

import "react-toastify/dist/ReactToastify.css";

import ProblemStatement from "../components/codingArena/ProblemStatement";
import Editor from "../components/CodeEditor/Editor";


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
  return (
    <Grid container spacing={2} sx={{ height: "100vh", padding: 2 }}>
      <Grid item xs={12} md={6}>
        <ProblemStatement
          title={problemData.title}
          description={problemData.description}
          constraints={problemData.constraints}
          examples={problemData.examples}
        />
      </Grid>
      <Grid item xs={12} md={6}>
        <Editor />
      </Grid>
    </Grid>
  );
};

export default CodingArena;

// src/pages/CodingArena.js
// import React from 'react';
// import { Grid } from '@mui/material';
// import ProblemStatement from '../components/codingArena/ProblemStatement';
// import CodeEditorWindow from '../components/codingPlayground/CodeEditorWindow';

// const CodingArena = () => {
//   return (
//     <Grid container spacing={2} sx={{ height: '100vh', padding: 2 }}>
//       <Grid item xs={12} md={6}>
//         <ProblemStatement />
//       </Grid>
//       <Grid item xs={12} md={6}>
//         <CodeEditorWindow />
//       </Grid>
//     </Grid>
//   );
// };

// export default CodingArena;
