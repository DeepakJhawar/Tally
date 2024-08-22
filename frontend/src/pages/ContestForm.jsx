import React, { useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import {
  Box,
  TextField,
  Typography,
  Button,
  Container,
  Grid,
} from "@mui/material";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DateTimePicker } from "@mui/x-date-pickers/DateTimePicker";
import Navbar from "../components/Navbar";
import dayjs from "dayjs";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const schema = yup
  .object({
    contestName: yup.string().required("Contest Name is required"),
    contestDescription: yup
      .string()
      .required("Contest Description is required"),
    startTime: yup.date().required("Start Time is required"),
    endTime: yup
      .date()
      .required("End Time is required")
      .min(yup.ref("startTime"), "End Time cannot be before Start Time"),
  })
  .required();

const ContestForm = () => {
  const navigate = useNavigate();
  const {
    control,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm({
    resolver: yupResolver(schema),
    defaultValues: {
      contestName: "",
      contestDescription: "",
      startTime: dayjs(),
      endTime: dayjs().add(1, "hour"),
    },
  });

  const [loading, setLoading] = useState(false);

  const onSubmit = async (data) => {
    setLoading(true);
    try {
      const formattedData = {
        contestTitle: data.contestName,
        description: data.contestDescription,
        schedule: {
          start: data.startTime,
          end: data.endTime,
        },
      };
      const response = await axios.post(
        "http://localhost:6969/create-contest",
        formattedData,
        {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
          validateStatus: (status) => status >= 200 && status < 500,
        }
      );
      if(response.status === 201){
        console.log(response.data.data._id);
        reset();
        navigate(`/contest/${response.data.data._id}`);
      }
    } catch (err) {
      console.error(err);
      alert("An error occurred while submitting the contest details.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Navbar />
      <Container>
        <Box
          mt={4}
          sx={{
            backgroundColor: "background.paper",
            p: 4,
            borderRadius: 2,
            boxShadow: 3,
          }}
        >
          <Typography variant="h4" align="center" gutterBottom>
            Enter Contest Details
          </Typography>
          <form onSubmit={handleSubmit(onSubmit)}>
            <Grid container spacing={3}>
              <Grid item xs={12}>
                <Controller
                  name="contestName"
                  control={control}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      label="Contest Name"
                      variant="outlined"
                      fullWidth
                      error={!!errors.contestName}
                      helperText={errors.contestName?.message}
                      InputLabelProps={{
                        style: { color: "white" }, // Label color
                      }}
                      InputProps={{
                        sx: {
                          "& .MuiOutlinedInput-root": {
                            "&.Mui-focused fieldset": {
                              borderColor: "white", // Outline color when focused
                            },
                          },
                          "& .MuiInputBase-input": {
                            color: "white", // Text color
                          },
                        },
                      }}
                    />
                  )}
                />
              </Grid>

              <Grid item xs={12}>
                <Controller
                  name="contestDescription"
                  control={control}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      label="Contest Description"
                      variant="outlined"
                      multiline
                      rows={4}
                      fullWidth
                      error={!!errors.contestDescription}
                      helperText={errors.contestDescription?.message}
                      InputLabelProps={{
                        style: { color: "white" }, // Label color
                      }}
                      InputProps={{
                        sx: {
                          "& .MuiOutlinedInput-root": {
                            "&.Mui-focused fieldset": {
                              borderColor: "white", // Outline color when focused
                            },
                          },
                          "& .MuiInputBase-input": {
                            color: "white", // Text color
                          },
                        },
                      }}
                    />
                  )}
                />
              </Grid>

              <Grid item xs={12} md={6}>
                <LocalizationProvider dateAdapter={AdapterDayjs}>
                  <Controller
                    name="startTime"
                    control={control}
                    render={({ field }) => (
                      <DateTimePicker
                        {...field}
                        label="Start Time"
                        renderInput={(params) => (
                          <TextField
                            {...params}
                            fullWidth
                            error={!!errors.startTime}
                            helperText={errors.startTime?.message}
                            InputLabelProps={{
                              style: { color: "white" }, // Label color
                            }}
                            InputProps={{
                              sx: {
                                "& .MuiOutlinedInput-root": {
                                  "&.Mui-focused fieldset": {
                                    borderColor: "white", // Outline color when focused
                                  },
                                },
                                "& .MuiInputBase-input": {
                                  color: "white", // Text color
                                },
                              },
                            }}
                          />
                        )}
                      />
                    )}
                  />
                </LocalizationProvider>
              </Grid>

              <Grid item xs={12} md={6}>
                <LocalizationProvider dateAdapter={AdapterDayjs}>
                  <Controller
                    name="endTime"
                    control={control}
                    render={({ field }) => (
                      <DateTimePicker
                        {...field}
                        label="End Time"
                        renderInput={(params) => (
                          <TextField
                            {...params}
                            fullWidth
                            error={!!errors.endTime}
                            helperText={errors.endTime?.message}
                            InputLabelProps={{
                              style: { color: "white" }, // Label color
                            }}
                            InputProps={{
                              sx: {
                                "& .MuiOutlinedInput-root": {
                                  "&.Mui-focused fieldset": {
                                    borderColor: "white", // Outline color when focused
                                  },
                                },
                                "& .MuiInputBase-input": {
                                  color: "white", // Text color
                                },
                              },
                            }}
                          />
                        )}
                      />
                    )}
                  />
                </LocalizationProvider>
              </Grid>
            </Grid>

            <Box mt={3}>
              <Button
                type="submit"
                variant="contained"
                color="secondary"
                fullWidth
                disabled={loading}
              >
                {loading ? "Submitting..." : "Submit"}
              </Button>
            </Box>
          </form>
        </Box>
      </Container>
    </>
  );
};

export default ContestForm;
