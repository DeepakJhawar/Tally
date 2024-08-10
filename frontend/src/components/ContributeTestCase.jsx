import React from "react";
import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import {
  Box,
  TextField,
  Typography,
  Button,
  FormControl,
  Grid,
} from "@mui/material";
import axios from "axios";

const schema = yup
  .object({
    problemId: yup.string().required("Problem ID is required"),
    input: yup.string().required("Input is required"),
    output: yup.string().required("Output is required"),
  })
  .required();

const ContributeTestCase = () => {
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
    defaultValues: {
      problemId: "",
      input: "",
      output: "",
    },
  });

  const onSubmit = async (data) => {
    try {
      const response = await axios.post(
        "http://localhost:6969/add-test-case",
        data,
        {
          validateStatus: (status) => status >= 200 && status < 500,
        }
      );

      if (response.data.status === "ok") {
        alert("Test cases added successfully");
      } else {
        alert(response.data.message);
      }
    } catch (err) {
      console.log(err);
      alert("An error occurred while adding the test cases");
    }
  };

  return (
    <Box
      sx={{
        backgroundColor: "background.default",
        color: "text.primary",
        padding: 2,
        borderRadius: 1,
        boxShadow: 3,
      }}
    >
      <Typography variant="h6" gutterBottom>
        Contribute Test Case
      </Typography>
      <form onSubmit={handleSubmit(onSubmit)}>
        <Box mb={2}>
          <Controller
            name="problemId"
            control={control}
            render={({ field }) => (
              <TextField
                {...field}
                label="Problem ID"
                variant="outlined"
                fullWidth
                error={!!errors.problemId}
                helperText={errors.problemId?.message}
              />
            )}
          />
        </Box>

        <Box mb={2}>
          <Controller
            name="input"
            control={control}
            render={({ field }) => (
              <TextField
                {...field}
                label="Input"
                variant="outlined"
                multiline
                rows={4}
                fullWidth
                error={!!errors.input}
                helperText={errors.input?.message}
                placeholder={`Sample Input:\n4\n2 3 4\n4 5 6\n7 8 9\n15 12 46`}
              />
            )}
          />
        </Box>

        <Box mb={2}>
          <Controller
            name="output"
            control={control}
            render={({ field }) => (
              <TextField
                {...field}
                label="Output"
                variant="outlined"
                multiline
                rows={4}
                fullWidth
                error={!!errors.output}
                helperText={errors.output?.message}
                placeholder={`Sample Output:\n10\n20\n30\n40`}
              />
            )}
          />
        </Box>

        <Box mt={2}>
          <Button type="submit" variant="contained" color="secondary">
            Submit
          </Button>
        </Box>
      </form>
    </Box>
  );
};

export default ContributeTestCase;
