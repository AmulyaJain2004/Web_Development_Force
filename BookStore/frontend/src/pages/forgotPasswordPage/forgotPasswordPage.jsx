import React, { useState } from "react";
import axios from "axios"; // Import axios
import { toast } from "react-hot-toast"; // Import toast for notifications
import styles from "./forgotPasswordPage.module.css"; // Import CSS module
import { Link, useNavigate } from "react-router-dom";

const ForgotPasswordPage = () => {
  const [email, setEmail] = useState("");
  const [newPassword, setnewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [adminCode, setAdminCode] = useState("");
  const [loading, setLoading] = useState(false);
  const [adminCodeError, setadminCodeError] = useState(false);
  const [userExists, setuserExists] = useState(false);
  const navigate = useNavigate();

  const handleCreateUser = async (e) => {
    e.preventDefault();

    if (newPassword !== confirmPassword) {
      toast.error("Passwords do not match!");
      return;
    }

    setLoading(true); // Start loading

    try {
      const response = await axios.post(
        `${import.meta.env.VITE_SERVER_URI}/users/forgotPassword`,
        {
          email,
          newPassword,
          adminCode,
        }
      );

      console.log("Password changed successfully:", response.data);
      toast.success("Password changed successfully!");
      setTimeout(() => {
        navigate("/Login"); // Redirect to the home page after 2 seconds
      }, 1500);
    } catch (err) {
      setadminCodeError(false);
      setuserExists(false);
      console.error("Error reseting password:", err);
      const errorMessage =
        err.response?.data?.message ||
        "Password reseting failed. Please try again.";
      if (errorMessage === "User not found") {
        setuserExists(true);
      }

      if (errorMessage === "Wrong Admin Code") {
        setadminCodeError(true);
      }

      toast.error(errorMessage);
    } finally {
      setLoading(false); // Stop loading
    }
  };

  const resetForm = () => {
    setEmail("");
    setPassword("");
    setConfirmPassword("");
    setAdminCode(""); // Reset admin code
  };

  return (
    <div className={styles.loginContainer}>
      <form className={styles.loginForm} onSubmit={handleCreateUser}>
        <h2>Reset Password</h2>
        <hr className={styles.hr} />

        <div className={styles.inputGroup}>
          <input
            className={userExists ? styles.inputError : ""}
            type="email"
            id="email"
            value={email}
            onChange={(e) => {
              setEmail(e.target.value);
            }}
            placeholder="E-mail"
            required
          />
        </div>

        <div className={styles.inputGroup}>
          <input
            className={newPassword !== confirmPassword ? styles.inputError : ""}
            type="password"
            id="password"
            value={newPassword}
            onChange={(e) => {
              setnewPassword(e.target.value);
            }}
            placeholder="Password"
            required
          />
        </div>

        <div className={styles.inputGroup}>
          <input
            className={newPassword !== confirmPassword ? styles.inputError : ""}
            type="password"
            id="confirm-password"
            value={confirmPassword}
            onChange={(e) => {
              setConfirmPassword(e.target.value);
            }}
            placeholder="Confirm Password"
            required
          />
        </div>

        <div className={styles.inputGroup}>
          <input
            type="password"
            id="admin-code"
            className={adminCodeError ? styles.inputError : ""}
            value={adminCode}
            onChange={(e) => {
              setAdminCode(e.target.value);
            }}
            placeholder="Admin Code"
            required
          />
        </div>

        <button type="submit" className={styles.createBtn} disabled={loading}>
          {loading ? "Reseting..." : "Reset password"} {/* Show loading text */}
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

export default ForgotPasswordPage;
