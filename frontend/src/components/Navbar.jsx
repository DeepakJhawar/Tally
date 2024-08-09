import React, { useState } from "react";
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import IconButton from "@mui/material/IconButton";
import Button from "@mui/material/Button";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import AccountCircle from "@mui/icons-material/AccountCircle";
import { Container } from "@mui/material";
import { styled } from "@mui/material/styles";
import { Link } from "react-router-dom";

const FullWidthAppBar = styled(AppBar)({
  width: "100%",
});

const Navbar = () => {
  const [anchorEl, setAnchorEl] = useState(null);

  const handleMenu = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <FullWidthAppBar position="static" color="primary">
      <Toolbar>
        <Container
          maxWidth="lg"
          style={{ display: "flex", alignItems: "center" }}
        >
          <Typography variant="h6" style={{ flexGrow: 1 }}>
            Tally CodeBrewers
          </Typography>
          <Button
            color="inherit"
            component={Link}
            to="/problems"
            sx={{ marginLeft: 2 }}
          >
            Problems
          </Button>
          <Button
            color="inherit"
            component={Link}
            to="/contest"
            sx={{ marginLeft: 2 }}
          >
            Contest
          </Button>
          <Button
            color="inherit"
            component={Link}
            to="/login"
            sx={{ marginLeft: 2 }}
          >
            Login
          </Button>
          <IconButton
            aria-label="account of current user"
            aria-controls="menu-appbar"
            aria-haspopup="true"
            onClick={handleMenu}
            color="inherit"
            sx={{ marginLeft: 2 }}
          >
            <AccountCircle />
          </IconButton>
          <Menu
            id="menu-appbar"
            anchorEl={anchorEl}
            anchorOrigin={{
              vertical: "top",
              horizontal: "right",
            }}
            keepMounted
            transformOrigin={{
              vertical: "top",
              horizontal: "right",
            }}
            open={Boolean(anchorEl)}
            onClose={handleClose}
          >
            <MenuItem onClick={handleClose}>Profile</MenuItem>
            <MenuItem onClick={handleClose}>My account</MenuItem>
            <MenuItem onClick={handleClose}>Logout</MenuItem>
          </Menu>
        </Container>
      </Toolbar>
    </FullWidthAppBar>
  );
};

export default Navbar;
