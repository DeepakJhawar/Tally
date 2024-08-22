import React, { useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import {
  Box,
  TextField,
  Typography,
  Button,
  MenuItem,
  Select,
  InputLabel,
  FormControl,
  Grid,
} from "@mui/material";
import axios from "axios";

const schema = yup
  .object({
    title: yup.string().trim().required("Title is required"),
    description: yup
      .string().trim()
      .max(5000, "Description must be less than 5000 characters")
      .required("Description is required"),
    constraints: yup.string().trim(),
    input: yup.string().trim().required("Input is required"),
    output: yup.string().trim().required("Output is required"),
    tags: yup.array().of(yup.string()).min(1, "At least one tag is required"),
    difficulty: yup
      .string()
      .oneOf(["easy", "medium", "hard"], "Difficulty is required"),
  })
  .required();

const ContributeQuestion = () => {
  const [loading, setLoading] = useState(false); 
  const {
    control,
    handleSubmit,
    reset, 
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
    defaultValues: {
      title: "",
      description: "",
      constraints: "",
      input: "",
      output: "",
      tags: [],
      difficulty: "easy",
    },
  });

  const onSubmit = async (data) => {
    setLoading(true); 
    const format = {
      constraints: data.constraints,
      description: data.description,
      difficulty: data.difficulty,
      givenInput: data.input,
      correctOutput: data.output,
      title: data.title,
      tags: data.tags,
    };

    try {
      const response = await axios.post(
        "http://localhost:6969/create-pending-problem",
        format,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
          validateStatus: (status) => status >= 200 && status < 500,
        }
      );

      if (response.data.status === "ok") {
        alert("Problem sent to our team for verification");
        reset(); 
      } else {
        alert(response.data.message);
      }
    } catch (err) {
      console.log(err);
      alert("An error occurred while adding the problem");
    } finally {
      setLoading(false); 
    }
  };

  const tags = [
    "Array",
    "Hash Table",
    "Linked List",
    "Math",
    "Two Pointers",
    "String",
    "Dynamic Programming",
    "Backtracking",
    "Divide and Conquer",
    "Binary Search",
    "Stack",
    "Heap",
    "Greedy",
    "Sort",
    "Graph",
    "Depth First Search",
    "Breadth First Search",
    "Bit Manipulation",
    "Tree",
    "Union Find",
    "Design",
    "Topological Sort",
    "Trie",
    "Binary Search Tree",
    "Brainteaser",
    "Segment Tree",
    "Binary Index Tree",
    "Memoization",
    "Binary Indexed Tree",
  ];

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
        <Box mb={2}>
          <Controller
            name="input"
            control={control}
            render={({ field }) => (
              <TextField
                {...field}
                label="Input According to question description"
                variant="outlined"
                multiline
                rows={4}
                fullWidth
                error={!!errors.input}
                helperText={errors.input?.message}
                placeholder={`Sample Input:\n4 \n2 3 4\n4 5 6\n7 8 9\n15 12 46`}
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
        <Grid container spacing={2}>
          <Grid item xs={12} sm={6}>
            <Controller
              name="tags"
              control={control}
              render={({ field: { onChange, value = [], onBlur } }) => (
                <FormControl fullWidth error={!!errors.tags}>
                  <InputLabel>Tags</InputLabel>
                  <Select
                    multiple
                    value={value}
                    onChange={onChange}
                    onBlur={onBlur}
                    label="Tags"
                    renderValue={(selected) => selected.join(", ")}
                  >
                    {tags.map((tag) => (
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
          </Grid>
          <Grid item xs={12} sm={6}>
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
          </Grid>
        </Grid>
        <Box mt={2}>
          <Button
            type="submit"
            variant="contained"
            color="secondary"
            disabled={loading} 
          >
            {loading ? "Submitting..." : "Submit"}
          </Button>
        </Box>
      </form>
    </Box>
  );
};

export default ContributeQuestion;
