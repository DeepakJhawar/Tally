import React, { useEffect, useState } from "react";
import DataTable from "../components/Table/DataTable";
import axios from "axios";
import { Typography } from "@mui/material";

const AdminPage = () => {
  const [data, setData] = useState(null);
  useEffect(() => {
    const fetch = async () => {
      const response = await axios.get(
        "http://localhost:6969/get-pending-problem",
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      console.log(response.data.response);
      setData(response.data.response);
    };
    fetch();
  }, []);
  return (
    <div
      style={{
        marginTop: "40px",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
      }}
    >
      <h1 style={{ fontSize: "24px", marginBottom: "20px" }}>Problems Table</h1>
      {data ? <DataTable rows={data} /> : <Typography>No Data To display</Typography>}
    </div>
  );
};

export default AdminPage;
