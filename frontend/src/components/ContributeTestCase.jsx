import React from "react";
import { useForm, Controller, useFieldArray } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import {
  Box,
  TextField,
  Typography,
  Button,
  IconButton,
  MenuItem,
  Select,
  InputLabel,
  FormControl,
} from "@mui/material";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import RemoveCircleOutlineIcon from "@mui/icons-material/RemoveCircleOutline";
import axios from "axios";

// Define validation schema
const schema = yup
  .object({
    problemId: yup.string().required("Problem ID is required"),
    input: yup
      .array()
      .of(
        yup.object({
          value: yup.string().required("Input is required"),
        })
      )
      .min(1, "At least one input is required"),
    output: yup
      .array()
      .of(
        yup.object({
          value: yup.string().required("Output is required"),
        })
      )
      .min(1, "At least one output is required"),
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
      input: [{ value: "" }],
      output: [{ value: "" }],
    },
  });

  const {
    fields: inputFields,
    append: appendInput,
    remove: removeInput,
  } = useFieldArray({
    control,
    name: "input",
  });

  const {
    fields: outputFields,
    append: appendOutput,
    remove: removeOutput,
  } = useFieldArray({
    control,
    name: "output",
  });

  const onSubmit = async (data) => {
    // Function to parse JSON with validation
    const parseJson = (value) => {
      try {
        // Try to parse and then re-stringify to ensure correct format
        return JSON.parse(value);
      } catch (e) {
        console.error("Invalid JSON format:", e);
        return 'Invalid JSON'; // or handle the error as needed
      }
    };

    // Extract input and output values
    const input = data.input.map((i) => i.value);
    const output = data.output.map((o) => o.value);

    // Format data for submission
    const formattedData = {
      problemId: data.problemId,
      givenInput: input.map((i) => parseJson(i)),
      correctOutput: output.map((o) => parseJson(o)),
    };
    console.log(formattedData)
    try {
      // const response = await axios.post("http://localhost:6969/add-test-case", formattedData, {
      //   validateStatus: (status) => {
      //     return status >= 200 && status < 500; // Accept all statuses from 200 to 499
      //   },
      // });

      // if (response.data.status === 'ok') {
      //   alert("Test cases added successfully");
      // } else {
      //   alert(response.data.message);
      // }
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

        {/* Input Fields */}
        <Box mb={2}>
          <Typography variant="subtitle1">Input</Typography>
          {inputFields.map((item, index) => (
            <Box key={item.id} display="flex" alignItems="center" mb={2}>
              <Controller
                name={`input[${index}].value`}
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    label="Input"
                    variant="outlined"
                    fullWidth
                    placeholder='e.g., {"arr": [1,2,1,2,1], "k" : 9}'
                    error={!!errors.input?.[index]?.value}
                    helperText={errors.input?.[index]?.value?.message}
                  />
                )}
              />
              <IconButton
                color="error"
                onClick={() => removeInput(index)}
                aria-label="remove"
                sx={{ ml: 1 }}
              >
                <RemoveCircleOutlineIcon />
              </IconButton>
            </Box>
          ))}
          <Box display="flex" alignItems="center">
            <Button
              type="button"
              variant="contained"
              color="success"
              startIcon={<AddCircleOutlineIcon />}
              onClick={() => appendInput({ value: "" })}
              sx={{ mr: 1 }}
            >
              Add Input
            </Button>
          </Box>
        </Box>

        {/* Output Fields */}
        <Box mb={2}>
          <Typography variant="subtitle1">Output</Typography>
          {outputFields.map((item, index) => (
            <Box key={item.id} display="flex" alignItems="center" mb={2}>
              <Controller
                name={`output[${index}].value`}
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    label="Output"
                    variant="outlined"
                    fullWidth
                    placeholder="e.g., [0,1]"
                    error={!!errors.output?.[index]?.value}
                    helperText={errors.output?.[index]?.value?.message}
                  />
                )}
              />
              <IconButton
                color="error"
                onClick={() => removeOutput(index)}
                aria-label="remove"
                sx={{ ml: 1 }}
              >
                <RemoveCircleOutlineIcon />
              </IconButton>
            </Box>
          ))}
          <Box display="flex" alignItems="center">
            <Button
              type="button"
              variant="contained"
              color="success"
              startIcon={<AddCircleOutlineIcon />}
              onClick={() => appendOutput({ value: "" })}
              sx={{ mr: 1 }}
            >
              Add Output
            </Button>
          </Box>
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
