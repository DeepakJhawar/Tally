import React, { useState, useEffect } from "react";
import {
  MenuItem,
  InputLabel,
  FormControl,
  Select,
  PaginationItem,
  Pagination,
  Box,
} from "@mui/material";
import { useNavigate, useParams } from "react-router-dom";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import axios from "axios";

const Standings = () => {
  const [totStandings, setTotStandings] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [page, setPage] = useState(0);
  const [leaderboardData, setLeaderboardData] = useState([]);
  const navigate = useNavigate();
  const { "contest-id": contestId } = useParams();

  useEffect(() => {
    const fetchLeaderboard = async () => {
      try {
        const response = await axios.get(
          "http://localhost:6969/get-standings",
          {
            params: {
              contestId,
              page: page + 1, // page number (1-indexed)
              limit: rowsPerPage,
            },
          }
        );

        const { data } = response.data;
        setLeaderboardData(data);
        setTotStandings(response.data.totalCount);
      } catch (error) {
        console.error("Error fetching leaderboard data:", error);
      }
    };

    fetchLeaderboard();
  }, [contestId, page, rowsPerPage]);

  const handleOpenContest = (contestNumber) => {
    navigate(`/contest/${contestNumber}`);
  };

  return (
    <div
      className="min-h-screen bg-gray-100 text-gray-900 flex justify-center"
      style={{
        backgroundImage: "url('/images/loginbg.jpg')",
      }}
    >
      <div className="max-w-screen-md m-0 sm:m-10 bg-black/55 shadow sm:rounded-lg flex justify-center flex-1">
        <div className="lg:w-2/3 xl:w-10/12 p-6 sm:p-12">
          <div className="mt-12 flex flex-col items-center">
            <div className="w-full flex-1 mt-8">
              <div className="flex flex-col items-center">
                <button
                  className="text-2xl xl:text-3xl font-extrabold text-white"
                  onClick={() => handleOpenContest(contestId)}
                >
                  Go to Contest
                </button>
                <div className="w-full flex-1 mt-8">
                  <table className="min-w-full bg-gray-900 text-white border border-gray-700">
                    <thead className="bg-gray-800">
                      <tr>
                        <th className="text-left py-3 px-4 uppercase font-semibold text-sm">
                          Name
                        </th>
                        <th className="text-left py-3 px-4 uppercase font-semibold text-sm">
                          Score
                        </th>
                        <th className="text-left py-3 px-4 uppercase font-semibold text-sm">
                          Finish Time
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {leaderboardData.map((row, index) => (
                        <tr
                          key={index}
                          className="bg-gray-800 hover:bg-gray-700"
                        >
                          <td className="text-left py-3 px-4">
                            {row.participants.username}
                          </td>
                          <td className="text-left py-3 px-4">
                            {row.participants.score}
                          </td>
                          <td className="text-left py-3 px-4">
                            {(() => {
                              const startTime = new Date(row.schedule.start);
                              const endTime = new Date(row.participants.lastSubmission);
                              const duration = endTime - startTime; // Difference in milliseconds

                              // Format the duration as needed
                              const hours = Math.floor(
                                duration / (1000 * 60 * 60)
                              );
                              const minutes = Math.floor(
                                (duration % (1000 * 60 * 60)) / (1000 * 60)
                              );
                              const seconds = Math.floor(
                                (duration % (1000 * 60)) / 1000
                              );

                              return `${hours}h ${minutes}m ${seconds}s`;
                            })()}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
          <Box className="flex items-center justify-between mt-4">
            <Pagination
              count={Math.ceil(totStandings / rowsPerPage)}
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
        </div>
      </div>
    </div>
  );
};

export default Standings;
