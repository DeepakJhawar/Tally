import React, { useEffect, useState } from "react";
import DataTable from "../components/Table/DataTable";
import axios from "axios";
import { Typography } from "@mui/material";
import TestCaseTable from "../components/Table/TestCaseTable";

const AdminPage = () => {
  const [problemsData, setProblemsData] = useState(null);
  const [testCasesData, setTestCasesData] = useState(null);

  useEffect(() => {
    const fetchProblems = async () => {
      try {
        const response = await axios.get(
          "http://localhost:6969/get-pending-problem",
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );
        console.log("Problems:", response.data.response);
        setProblemsData(response.data.response);
      } catch (error) {
        console.error("Error fetching problems:", error);
      }
    };

    const fetchTestCases = async () => {
      try {
        const response = await axios.get(
          "http://localhost:6969/get-pending-testcases",
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
            validateStatus: (status) => status >= 200 && status < 500, // Ensures that status codes from 200 to 499 are considered valid
          }
        );

        // Check for successful response
        if (response.status === 200) {
          console.log("Test Cases:", response.data.response);
          setTestCasesData(response.data.response);
        } else {
          console.error(
            "Failed to fetch test cases:",
            response.status,
            response.statusText
          );
        }
      } catch (error) {
        console.error("Error fetching test cases:", error.message || error);
      }
    };
    console.log(localStorage.getItem("token"));
    fetchProblems();
    fetchTestCases();
  }, []);

  return (
    <>
      <div
        style={{
          marginTop: "40px",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <h1 style={{ fontSize: "24px", marginBottom: "20px" }}>
          Problems Table
        </h1>
        {problemsData ? (
          <DataTable rows={problemsData} />
        ) : (
          <Typography>No Problems Data To Display</Typography>
        )}
      </div>
      <div
        style={{
          marginTop: "40px",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <h1 style={{ fontSize: "24px", marginBottom: "20px" }}>
          Test Cases Table
        </h1>
        {testCasesData ? (
          <TestCaseTable testCases={testCasesData} />
        ) : (
          <Typography>No Test Cases Data To Display</Typography>
        )}
      </div>
    </>
  );
};

export default AdminPage;
