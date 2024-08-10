// import React, { useState } from "react";
// import { Box, Typography, Paper, Divider, Button } from "@mui/material";
// import { customStyles } from "../../constants/customStyles";
// import Solutions from "./Solutions"; // Adjust the path as necessary
// import Submissions from "./Submissions"; // Adjust the path as necessary

// const ProblemStatement = ({
//   title,
//   description,
//   constraints,
//   examples,
//   solutions = [], // Default to empty array if not provided
//   submissions = [] // Default to empty array if not provided
// }) => {
//   const [currentView, setCurrentView] = useState("Problem");

//   const renderContent = () => {
//     switch (currentView) {
//       case "Solutions":
//         return <Solutions solutions={solutions} />;
//       case "Submissions":
//         return <Submissions submissions={submissions} />;
//       case "Problem":
//       default:
//         return (
//           <Box sx={{ padding: 3, flex: 1, overflowY: "auto" }}>
//             <Paper elevation={3} sx={{ padding: 3, marginBottom: 3 }}>
//               <Typography variant="h4" component="h1" gutterBottom>
//                 {title}
//               </Typography>
//               <Divider sx={{ marginBottom: 2 }} />
//               <Typography variant="body1" gutterBottom>
//                 {description}
//               </Typography>
//             </Paper>

//             <Paper elevation={3} sx={{ padding: 3, marginBottom: 3 }}>
//               <Typography variant="h5" component="h2" gutterBottom>
//                 Constraints
//               </Typography>
//               <Divider sx={{ marginBottom: 2 }} />
//               <Typography variant="body1" gutterBottom>
//                 {constraints}
//               </Typography>
//             </Paper>

//             <Paper elevation={3} sx={{ padding: 3 }}>
//               <Typography variant="h5" component="h2" gutterBottom>
//                 Examples
//               </Typography>
//               <Divider sx={{ marginBottom: 2 }} />
//               {examples.map((example, index) => (
//                 <Box key={index} sx={{ marginBottom: 2 }}>
//                   <Typography variant="subtitle1">
//                     Example {index + 1}:
//                   </Typography>
//                   <Typography variant="body2">{example}</Typography>
//                 </Box>
//               ))}
//             </Paper>
//           </Box>
//         );
//     }
//   };

//   return (
//     <Box
//       sx={{
//         display: "flex",
//         flexDirection: "column",
//         height: "100%",
//         overflow: "hidden",
//         position: "relative", // Added for button positioning
//       }}
//     >
//       <Box
//         sx={{
//           flex: 1,
//           overflow: "auto",
//           "&::-webkit-scrollbar": {
//             height: "4px",
//           },
//           "&::-webkit-scrollbar-thumb": {
//             backgroundColor: "#888",
//             borderRadius: "10px",
//           },
//           "&::-webkit-scrollbar-track": {
//             backgroundColor: "#f1f1f1",
//           },
//           scrollbarWidth: "thin",
//           scrollbarColor: "#888 #f1f1f1",
//         }}
//       >
//         {renderContent()}
//       </Box>
//     </Box>
//   );
// };

// export default ProblemStatement;
import React from "react";
import { Box, Typography, Paper, Divider } from "@mui/material";

const ProblemStatement = ({ title, description, constraints, examples, outputVisible }) => {
  return (
    <Box
      sx={{
        height: outputVisible ? "60%" : "100%", // Adjust height based on output visibility
        overflowY: "auto", // Enable vertical scrollbar
        padding: 2,
      }}
    >
      <Paper elevation={3} sx={{ padding: 3, marginBottom: 3 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          {title}
        </Typography>
        <Divider sx={{ marginBottom: 2 }} />
        <Typography variant="body1" gutterBottom>
          {description}
        </Typography>
      </Paper>

      <Paper elevation={3} sx={{ padding: 3, marginBottom: 3 }}>
        <Typography variant="h5" component="h2" gutterBottom>
          Constraints
        </Typography>
        <Divider sx={{ marginBottom: 2 }} />
        <Typography variant="body1" gutterBottom>
          {constraints}
        </Typography>
      </Paper>

      <Paper elevation={3} sx={{ padding: 3 }}>
        <Typography variant="h5" component="h2" gutterBottom>
          Examples
        </Typography>
        <Divider sx={{ marginBottom: 2 }} />
        {examples.map((example, index) => (
          <Box key={index} sx={{ marginBottom: 2 }}>
            <Typography variant="subtitle1">Example {index + 1}:</Typography>
            <Typography variant="body2">{example}</Typography>
          </Box>
        ))}
      </Paper>
    </Box>
  );
};

export default ProblemStatement;
