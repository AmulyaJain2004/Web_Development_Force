import React from "react";
import "./NavBar.css";
import { Button } from "@mui/material";
import { Link } from "react-router-dom";
import toast from "react-hot-toast";

const NavBar = ({ login, setLogin, setUser }) => {
  const handleLogout = () => {
    toast.success("Logged out");
    setLogin(false);
    setUser(null);
  };

  return (
    <div className="NavBarContainer">
      <Link className="link" to="/">
        <p>BOOK STORE</p>
      </Link>
      <Link className="link" to="/recommendations">
        <Button
          variant="outlined"
          sx={{
            borderColor: "white",
            borderWidth: {
              xs: "1px",
              md: "1px",
              lg: "2px",
            },
            color: "white",
          }}
        >
          Recommendations
        </Button>
      </Link>
      {login === "hide" ? null : login ? (
        <Button
          variant="outlined"
          sx={{
            borderColor: "white",
            borderWidth: {
              xs: "1px",
              md: "1px",
              lg: "2px",
            },
            color: "white",
          }}
          onClick={handleLogout}
        >
          Logout
        </Button>
      ) : (
        <Link className="link" to="/Login">
          <Button
            variant="outlined"
            sx={{
              borderColor: "white",
              borderWidth: {
                xs: "1px",
                md: "1px",
                lg: "2px",
              },
              color: "white",
            }}
          >
            Login
          </Button>
        </Link>
      )}
    </div>
  );
};

export default NavBar;
