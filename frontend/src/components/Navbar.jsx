import React, { useEffect, useState } from "react";
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
import { Link, useLocation } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "../AuthContext";

const FullWidthAppBar = styled(AppBar)({
  width: "100%",
  backgroundColor: 'primary',
});

const Navbar = () => {
  const [anchorEl, setAnchorEl] = useState(null);
  const location = useLocation(); 
  const { isLoggedIn } = useContext(AuthContext);

  const handleMenu = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    localStorage.clear("token");
    localStorage.clear("role");
    window.location.reload();
  }

  useEffect(()=> {

  },[isLoggedIn])

  // Function to determine if a button should be highlighted
  const isActive = (path) => location.pathname === path;

  return (
    <FullWidthAppBar position="static">
      <Toolbar>
        <Container
          maxWidth="lg"
          style={{ display: "flex", alignItems: "center" }}
        >
          <Typography
            variant="h6"
            component={Link}
            to={"/"}
            sx={{
              flexGrow: 1,
              textDecoration: "none",
              color: isActive("/") ? '#00C853' : '#E0E0E0', 
              "&:hover": {
                color: '#00C853', 
              },
            }}
          >
            Tally CodeBrewers
          </Typography>

          <Button
            component={Link}
            to="/playground"
            sx={{
              marginLeft: 2,
              color: isActive("/playground") ? '#00C853' : '#E0E0E0',
              "&:hover": {
                color: '#00C853',
              },
            }}
          >
            Playground
          </Button>
          <Button
            component={Link}
            to="/problems"
            sx={{
              marginLeft: 2,
              color: isActive("/problems") ? '#00C853' : '#E0E0E0', 
              "&:hover": {
                color: '#00C853',
              },
            }}
          >
            Problems
          </Button>
          <Button
            component={Link}
            to="/contribute"
            sx={{
              marginLeft: 2,
              color: isActive("/contribute") ? '#00C853' : '#E0E0E0', 
              "&:hover": {
                color: '#00C853', 
              },
            }}
          >
            Contribute
          </Button>
          <Button
            component={Link}
            to="/contest"
            sx={{
              marginLeft: 2,
              color: isActive("/contest") ? '#00C853' : '#E0E0E0', 
              "&:hover": {
                color: '#00C853', 
              },
            }}
          >
            Contest
          </Button>
          {!isLoggedIn && <Button
            component={Link}
            to="/login"
            sx={{
              marginLeft: 2,
              color: isActive("/login") ? '#00C853' : '#E0E0E0', 
              "&:hover": {
                color: '#00C853', 
              },
            }}
          >
            Login
          </Button>}
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
            <MenuItem onClick={handleLogout}>Logout</MenuItem>
          </Menu>
        </Container>
      </Toolbar>
    </FullWidthAppBar>
  );
};

export default Navbar;
