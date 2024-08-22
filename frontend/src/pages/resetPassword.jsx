import React from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import axios from "axios";
import { useNavigate, useLocation } from "react-router-dom"; 
import Button from "@mui/material/Button";
import CssBaseline from "@mui/material/CssBaseline";
import TextField from "@mui/material/TextField";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";
import { grey } from "@mui/material/colors";

const schema = yup.object().shape({
  password: yup
    .string()
    .min(6, "Password must be at least 6 characters")
    .required("Password is required"),
  confirmPassword: yup
    .string()
    .oneOf([yup.ref("password"), null], "Passwords must match")
    .required("Confirm Password is required"),
});

const ResetPassword = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
  });

  const navigate = useNavigate();
  const location = useLocation();

  const queryParams = new URLSearchParams(location.search);
  const token = queryParams.get("token");

  const onSubmit = async (data) => {
    try {
      const response = await axios.post(
        `http://localhost:6969/reset-password/${token}`,
        data,
        {
          validateStatus: (status) => status >= 200 && status < 500,
        }
      );
      if (response.data.status === "ok") navigate("/login");
      else alert(response.data.message || "An error occurred");
    } catch (error) {
      console.error(error);
      alert("An error occurred while resetting the password");
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
          <Typography component="h1" variant="h5">
            Reset Password
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
              name="password"
              label="New Password"
              type="password"
              id="password"
              autoComplete="new-password"
              {...register("password")}
              error={!!errors.password}
              helperText={errors.password?.message}
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
            <TextField
              margin="normal"
              required
              fullWidth
              name="confirmPassword"
              label="Confirm New Password"
              type="password"
              id="confirmPassword"
              {...register("confirmPassword")}
              error={!!errors.confirmPassword}
              helperText={errors.confirmPassword?.message}
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
              sx={{ mt: 3, mb: 2, bgcolor: grey[500] }}
            >
              Reset Password
            </Button>
          </Box>
        </Box>
      </Container>
  );
};

export default ResetPassword;
