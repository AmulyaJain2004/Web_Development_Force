import React, { useState } from "react";
import axios from "axios"; // Import axios
import { Link, useLocation, useNavigate } from "react-router-dom"; // Import useNavigate
import { toast } from "react-hot-toast"; // Import toast
import styles from "./loginPage.module.css"; // Import styles from CSS Module

const LoginPage = ({ login, admin, setUser }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [userExits, setUserExits] = useState(true);
  const [credentials, setCredentials] = useState(true);

  const navigate = useNavigate(); // Initialize navigate
  const location = useLocation();
  const redirectUrl = location.state?.redirect || "/";

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setUserExits(true);
    setCredentials(true);

    try {
      const response = await axios.post(
        `${import.meta.env.VITE_SERVER_URI}/users/login`,
        {
          email,
          password,
        }
      );
      console.log("Login successful:", response.data);
      login(true); // Update login state to true
      admin(response.data.isAdmin); // Update isAdmin state
      setUser(email); // Update userID state
      toast.success("Login successful!");

      setTimeout(() => {
        navigate(redirectUrl);
      }, 1500);
    } catch (err) {
      if (err.response?.data?.message === "User not found") {
        setUserExits(false);
      }
      if (err.response?.data?.message === "Invalid credentials") {
        setCredentials(false);
      }
      console.error("Login error:", err.response?.data);
      const errorMessage =
        err.response?.data?.message || "Login failed. Please try again.";

      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.loginContainer}>
      <form className={styles.loginForm} onSubmit={handleLogin}>
        <h2>Log in</h2>
        <hr className={styles.hr} />
        <div className={styles.inputGroup}>
          <input
            className={!userExits ? styles.inputError : ""}
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="E-mail"
            required
          />
        </div>
        <div className={styles.inputGroup}>
          <input
            className={!credentials ? styles.inputError : ""}
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Password"
            required
          />
        </div>
        <div className={styles.forgotPassword}>
          <Link className={styles.Link} to="/ForgotPassword">
            Forgot your password?
          </Link>
        </div>
        <button type="submit" className={styles.loginBtn} disabled={loading}>
          {loading ? "Logging in..." : "Login"} {/* Show loading text */}
        </button>
        <hr className={styles.hr} />
        <div className={styles.signupLink}>
          Don't have an account?{" "}
          <Link className={styles.Link} to="/SignUp">
            Sign up
          </Link>
        </div>
      </form>
    </div>
  );
};

export default LoginPage;
