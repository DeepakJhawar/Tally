import React from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import axios from "axios";
import Avatar from "@mui/material/Avatar";
import Button from "@mui/material/Button";
import CssBaseline from "@mui/material/CssBaseline";
import TextField from "@mui/material/TextField";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";
import { grey } from "@mui/material/colors";

const schema = yup.object().shape({
  email: yup.string().email("Invalid email").required("Email is required"),
});

const ForgotPassword = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
  });

  const onSubmit = async (data) => {
    try {
      const response = await axios.post(
        "http://localhost:6969/forgot-password",
        data
      );
      alert(response.data.message);
    } catch (error) {
      console.error("Error resetting password:", error);
      alert(
        "An error occurred while resetting your password. Please try again."
      );
    }
  };

  return (
      <Container component="main" maxWidth="xl"
      sx={{
        backgroundImage: 'url("https://i.pinimg.com/236x/0c/84/3f/0c843f96a6e997fff64e65057100b4af.jpg")',
        minHeight: "90vh",
        backgroundSize: 'cover',
        padding: 0,
        margin: 0,
      }}>
        <CssBaseline />
        <Box
          sx={{
            marginTop: 8,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <Avatar sx={{ m: 1, bgcolor: "secondary.main" }} />
          <Typography component="h1" variant="h5">
            Forgot Password
          </Typography>
          <Box
            component="form"
            onSubmit={handleSubmit(onSubmit)}
            noValidate
            sx={{ mt: 1 }}
          >
            <TextField
              margin="normal"
              required
              fullWidth
              id="email"
              label="Email Address"
              name="email"
              autoComplete="email"
              autoFocus
              {...register("email")}
              error={!!errors.email}
              helperText={errors.email?.message}
              sx={{
                "& .MuiOutlinedInput-root": {
                  "& fieldset": {
                    borderColor: "gray", 
                  },
                  "&:hover fieldset": {
                    borderColor: "gray", 
                  },
                  "&.Mui-focused fieldset": {
                    borderColor: "white", 
                  },
                },
                "& .MuiFormLabel-root.Mui-focused": {
                  color: "white", 
                },
              }}
            />
            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2, bgcolor: grey[500]}}
            >
              Reset Password
            </Button>
          </Box>
        </Box>
      </Container>
  );
};

export default ForgotPassword;
