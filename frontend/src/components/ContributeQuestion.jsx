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

// Define validation schema
const schema = yup
  .object({
    title: yup.string().required("Title is required"),
    description: yup
      .string()
      .max(5000, "Description must be less than 5000 characters"),
    constraints: yup.string().required("Constraints are required"),
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
    tags: yup.array().of(yup.string()).min(1, "At least one tag is required"),
    difficulty: yup
      .string()
      .oneOf(["easy", "medium", "hard"], "Difficulty is required"),
  })
  .required();

const ContributeQuestion = () => {
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
    defaultValues: {
      title: "",
      description: "",
      constraints: "",
      input: [{ value: "" }],
      output: [{ value: "" }],
      tags: [], // Default to an empty array
      difficulty: "easy", // Default value for difficulty
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

  const onSubmit = (data) => {
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
      title: data.title,
      description: data.description,
      givenInput: JSON.stringify(input.map((i) => parseJson(i))),
      correctOutput: JSON.stringify(output.map((o) => parseJson(o))),
      constraints: data.constraints,
      difficulty: data.difficulty,
      tags: data.tags,
    };
    console.log(formattedData);
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
        Contribute a Question
      </Typography>
      <form onSubmit={handleSubmit(onSubmit)}>
        <Box mb={2}>
          <Controller
            name="title"
            control={control}
            render={({ field }) => (
              <TextField
                {...field}
                label="Question Title"
                variant="outlined"
                fullWidth
                error={!!errors.title}
                helperText={errors.title?.message}
              />
            )}
          />
        </Box>
        <Box mb={2}>
          <Controller
            name="description"
            control={control}
            render={({ field }) => (
              <TextField
                {...field}
                label="Question Description"
                variant="outlined"
                multiline
                rows={4}
                fullWidth
                error={!!errors.description}
                helperText={errors.description?.message}
              />
            )}
          />
        </Box>
        <Box mb={2}>
          <Controller
            name="constraints"
            control={control}
            render={({ field }) => (
              <TextField
                {...field}
                label="Constraints"
                variant="outlined"
                fullWidth
                error={!!errors.constraints}
                helperText={errors.constraints?.message}
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

        {/* Tags Selection */}
        <Box mb={2}>
          <Controller
            name="tags"
            control={control}
            render={({ field: { onChange, value, onBlur } }) => (
              <FormControl fullWidth error={!!errors.tags}>
                <InputLabel>Tags</InputLabel>
                <Select
                  multiple
                  value={value || []} // Ensure value is an array
                  onChange={onChange}
                  onBlur={onBlur}
                  label="Tags"
                  renderValue={(selected) => selected.join(", ")}
                >
                  {["Algorithm", "Data Structure", "Mathematics"].map((tag) => (
                    <MenuItem key={tag} value={tag}>
                      {tag}
                    </MenuItem>
                  ))}
                </Select>
                {errors.tags && (
                  <Typography color="error">{errors.tags.message}</Typography>
                )}
              </FormControl>
            )}
          />
        </Box>

        {/* Difficulty Selection */}
        <Box mb={2}>
          <Controller
            name="difficulty"
            control={control}
            render={({ field }) => (
              <FormControl fullWidth error={!!errors.difficulty}>
                <InputLabel>Difficulty</InputLabel>
                <Select {...field} label="Difficulty">
                  <MenuItem value="easy">Easy</MenuItem>
                  <MenuItem value="medium">Medium</MenuItem>
                  <MenuItem value="hard">Hard</MenuItem>
                </Select>
                {errors.difficulty && (
                  <Typography color="error">
                    {errors.difficulty.message}
                  </Typography>
                )}
              </FormControl>
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

export default ContributeQuestion;
