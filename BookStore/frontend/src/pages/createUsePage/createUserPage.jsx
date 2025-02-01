import React, { useState } from "react";
import axios from "axios"; // Import axios
import { toast } from "react-hot-toast"; // Import toast
import styles from "./CreateUserPage.module.css"; // Import CSS module
import { Link, useNavigate } from "react-router-dom";

const CreateUserPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [adminCode, setAdminCode] = useState("");
  const [loading, setLoading] = useState(false);
  const [adminCodeError, setadminCodeError] = useState(false);
  const [userExists, setuserExists] = useState(false);
  const navigate = useNavigate();

  const handleCreateUser = async (e) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      toast.error("Passwords do not match!");
      return;
    }

    setLoading(true); // Start loading

    try {
      const response = await axios.post(
        `${import.meta.env.VITE_SERVER_URI}/users/register`,
        {
          email,
          password,
          adminCode,
        }
      );

      console.log("User created successfully:", response.data);
      toast.success("User created successfully!");
      setTimeout(() => {
        navigate("/Login"); // Redirect to the home page after 2 seconds
      }, 1500);
    } catch (err) {
      setadminCodeError(false);
      setuserExists(false);
      console.error("Error creating user:", err);
      const errorMessage =
        err.response?.data?.message ||
        "User creation failed. Please try again.";
      if (errorMessage === "User already exists") {
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
        <h2>Create Account</h2>
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
            className={password !== confirmPassword ? styles.inputError : ""}
            type="password"
            id="password"
            value={password}
            onChange={(e) => {
              setPassword(e.target.value);
            }}
            placeholder="Password"
            required
          />
        </div>

        <div className={styles.inputGroup}>
          <input
            className={password !== confirmPassword ? styles.inputError : ""}
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
          {loading ? "Creating..." : "Create Account"} {/* Show loading text */}
        </button>
        <hr className={styles.hr} />
        <div className={styles.signupLink}>
          Already have an account?{" "}
          <Link className={styles.Link} to="/Login">
            Log in
          </Link>
        </div>
      </form>
    </div>
  );
};

export default CreateUserPage;
