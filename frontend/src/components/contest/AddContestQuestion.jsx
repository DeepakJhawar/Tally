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
  Input,
  MenuItem,
  Tooltip,
  IconButton,
  FormControl,
  FormHelperText,
} from "@mui/material";
import Navbar from "../Navbar";
import InfoIcon from "@mui/icons-material/Info";
import { useParams } from "react-router-dom";
import axios from "axios";

// Validation schema
const schema = yup
  .object({
    problemName: yup.string().trim().required("Problem Name is required"),
    description: yup.string().trim().required("Description is required"),
    difficulty: yup.string().required("Difficulty is required"),
    points: yup
      .number()
      .required("Points are required")
      .positive("Points must be positive")
      .integer("Points must be an integer"),
    negativePoints: yup
      .number()
      .integer("Negative Points must be an integer"),
    constraints: yup.string().trim().required("Constraints are required"),
    testCaseFile: yup.mixed().required("Test case file is required"),
  })
  .required();

const AddContestQuestion = () => {
  const [fileContent, setFileContent] = useState("");
  const { "contest-id": contestId } = useParams();
  console.log(contestId)

  const {
    control,
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
  } = useForm({
    resolver: yupResolver(schema),
    defaultValues: {
      problemName: "",
      description: "",
      difficulty: "",
      points: 0,
      negativePoints: 0,
      constraints: "",
      testCaseFile: null,
    },
  });

  const onSubmit = async (data) => {
    try {
      const formData = new FormData();
      formData.append("contestId", contestId);
      formData.append("title", data.problemName);
      formData.append("positivePoints", data.points);
      formData.append("negativePoints", data.negativePoints);
      formData.append("description", data.description);
      formData.append("difficulty", data.difficulty);
      formData.append("constraints", data.constraints);
      formData.append("file", data.testCaseFile);

      const response = await axios.post("http://localhost:6969/create-contest-problem", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        validateStatus: (status) => status >= 200 && status < 500,
      });

      alert(response.data.data);
    } catch (err) {
      console.error(err);
      alert("An error occurred while submitting the form.");
    } finally {
      reset();
    }
  };

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file && file.type === "application/json") {
      const reader = new FileReader();
      reader.onload = () => {
        try {
          const json = JSON.parse(reader.result);
          setFileContent(JSON.stringify(json, null, 2));
          setValue("testCaseFile", file, { shouldValidate: true });
        } catch (error) {
          setFileContent("Invalid JSON file.");
        }
      };
      reader.readAsText(file);
    } else {
      setFileContent("Please select a valid JSON file.");
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
            Add Contest Question
          </Typography>
          <form onSubmit={handleSubmit(onSubmit)}>
            <Grid container spacing={3}>
              <Grid item xs={12}>
                <Controller
                  name="problemName"
                  control={control}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      label="Problem Name"
                      variant="outlined"
                      fullWidth
                      error={!!errors.problemName}
                      helperText={errors.problemName?.message}
                      InputLabelProps={{ style: { color: "white" } }}
                      InputProps={{
                        sx: {
                          "& .MuiOutlinedInput-root": {
                            "&.Mui-focused fieldset": { borderColor: "white" },
                          },
                          "& .MuiInputBase-input": { color: "white" },
                        },
                      }}
                    />
                  )}
                />
              </Grid>

              <Grid item xs={12}>
                <Controller
                  name="description"
                  control={control}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      label="Description"
                      variant="outlined"
                      multiline
                      rows={4}
                      fullWidth
                      error={!!errors.description}
                      helperText={errors.description?.message}
                      InputLabelProps={{ style: { color: "white" } }}
                      InputProps={{
                        sx: {
                          "& .MuiOutlinedInput-root": {
                            "&.Mui-focused fieldset": { borderColor: "white" },
                          },
                          "& .MuiInputBase-input": { color: "white" },
                        },
                      }}
                    />
                  )}
                />
              </Grid>

              <Grid item xs={12} md={6}>
                <Controller
                  name="difficulty"
                  control={control}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      label="Difficulty"
                      variant="outlined"
                      select
                      fullWidth
                      error={!!errors.difficulty}
                      helperText={errors.difficulty?.message}
                      InputLabelProps={{ style: { color: "white" } }}
                      InputProps={{
                        sx: {
                          "& .MuiOutlinedInput-root": {
                            "&.Mui-focused fieldset": { borderColor: "white" },
                          },
                          "& .MuiInputBase-input": { color: "white" },
                        },
                      }}
                    >
                      <MenuItem value="easy">Easy</MenuItem>
                      <MenuItem value="medium">Medium</MenuItem>
                      <MenuItem value="hard">Hard</MenuItem>
                    </TextField>
                  )}
                />
              </Grid>

              <Grid item xs={12} md={6}>
                <Controller
                  name="points"
                  control={control}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      label="Points"
                      variant="outlined"
                      fullWidth
                      error={!!errors.points}
                      helperText={errors.points?.message}
                      InputLabelProps={{ style: { color: "white" } }}
                      InputProps={{
                        sx: {
                          "& .MuiOutlinedInput-root": {
                            "&.Mui-focused fieldset": { borderColor: "white" },
                          },
                          "& .MuiInputBase-input": { color: "white" },
                        },
                        type: "number",
                      }}
                    />
                  )}
                />
              </Grid>

              <Grid item xs={12} md={6}>
                <Controller
                  name="negativePoints"
                  control={control}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      label="Negative Points"
                      variant="outlined"
                      fullWidth
                      error={!!errors.negativePoints}
                      helperText={errors.negativePoints?.message}
                      InputLabelProps={{ style: { color: "white" } }}
                      InputProps={{
                        sx: {
                          "& .MuiOutlinedInput-root": {
                            "&.Mui-focused fieldset": { borderColor: "white" },
                          },
                          "& .MuiInputBase-input": { color: "white" },
                        },
                        type: "number",
                      }}
                    />
                  )}
                />
              </Grid>

              <Grid item xs={12}>
                <Controller
                  name="constraints"
                  control={control}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      label="Constraints"
                      variant="outlined"
                      multiline
                      rows={4}
                      fullWidth
                      error={!!errors.constraints}
                      helperText={errors.constraints?.message}
                      InputLabelProps={{ style: { color: "white" } }}
                      InputProps={{
                        sx: {
                          "& .MuiOutlinedInput-root": {
                            "&.Mui-focused fieldset": { borderColor: "white" },
                          },
                          "& .MuiInputBase-input": { color: "white" },
                        },
                      }}
                    />
                  )}
                />
              </Grid>

              <Grid item xs={12}>
                <Box display="flex" flexDirection="column">
                  <Box display={"flex"}>
                    <Grid item xs={4}>
                      <FormControl
                        fullWidth
                        error={!!errors.testCaseFile}
                        sx={{ marginTop: "10px" }}
                      >
                        <Input
                          id="testCaseFile"
                          type="file"
                          accept=".json"
                          onChange={handleFileChange}
                          inputProps={{ "aria-label": "Test Case File" }}
                        />
                        {errors.testCaseFile && (
                          <FormHelperText>
                            {errors.testCaseFile.message}
                          </FormHelperText>
                        )}
                      </FormControl>
                    </Grid>
                    <Tooltip
                      title={
                        <>
                          <Typography>
                            File should only be in JSON format. Syntax:
                          </Typography>
                          <pre
                            style={{
                              fontFamily: "monospace",
                              whiteSpace: "pre-wrap",
                              marginTop: "10px",
                            }}
                          >
                            {`
[
  {
    "input": "1 2 3",
    "output": "6"
  },
  {
    "input": "4 5 6",
    "output": "15"
  }
]
`}
                          </pre>
                        </>
                      }
                      placement="right"
                      arrow
                    >
                      <IconButton sx={{ mt: 1, color: "white" }}>
                        <InfoIcon />
                      </IconButton>
                    </Tooltip>
                  </Box>
                  {fileContent && (
                    <Box
                      mt={2}
                      p={2}
                      sx={{
                        border: "1px solid #ddd",
                        borderRadius: 1,
                        backgroundColor: "secondary",
                        maxHeight: "200px",
                        overflowY: "auto",
                      }}
                    >
                      <Typography variant="body2">File Content:</Typography>
                      <pre
                        style={{
                          fontFamily: "monospace",
                          whiteSpace: "pre-wrap",
                        }}
                      >
                        {fileContent}
                      </pre>
                    </Box>
                  )}
                </Box>
              </Grid>

              <Grid item xs={12} textAlign="center">
                <Button type="submit" variant="contained" color="primary">
                  Submit
                </Button>
              </Grid>
            </Grid>
          </form>
        </Box>
      </Container>
    </>
  );
};

export default AddContestQuestion;
