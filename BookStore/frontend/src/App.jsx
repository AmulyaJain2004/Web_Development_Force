import "./App.css";
import { Routes, Route, Navigate } from "react-router-dom";
import { useState, useEffect } from "react";
import HomePage from "./pages/homePage.jsx";
import NavBar from "./Components/NavBar/NavBar.jsx";
import LoginPage from "./pages/loginPage/loginPage.jsx";
import CreateUserPage from "./pages/createUsePage/createUserPage.jsx";
import ForgotPasswordPage from "./pages/forgotPasswordPage/forgotPasswordPage.jsx";
import AdminHomePage from "./pages/adminHomePage/adminHomePage.jsx";
import EditBookPage from "./pages/editBookPage/editBookPage.jsx";
import AddBookPage from "./pages/addBookPage/addBookPage.jsx";
import RecommendationPage from "./pages/recommendationPage/recommendationPage.jsx";

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(true);
  const [isAdmin, setIsAdmin] = useState(true);
  const [userID, setUserID] = useState("admin@gmail.com"); // Replace with actual logic to get user ID
  console.log(userID);
  useEffect(() => {
    document.title = "The Book Store";
  }, []);

  return (
    <div>
      <Routes>
        <Route
          path="/"
          element={
            <>
              <NavBar
                login={isLoggedIn}
                setLogin={setIsLoggedIn}
                setUser={setUserID}
              />
              {isAdmin && isLoggedIn ? <AdminHomePage /> : <HomePage />}
            </>
          }
        />
        <Route
          path="/recommendations"
          element={
            isLoggedIn ? (
              <>
                <NavBar login={isLoggedIn} setLogin={setIsLoggedIn} />
                <RecommendationPage
                  user={userID}
                  isAdmin={isAdmin}
                  loggedin={isLoggedIn}
                />
              </>
            ) : (
              <Navigate to="/Login" state={{ redirect: "/recommendations" }} />
            )
          }
        />

        {/*//! Login Routes */}
        <Route
          path="/Login"
          element={
            <>
              <NavBar login={"hide"} />
              <LoginPage
                login={setIsLoggedIn}
                admin={setIsAdmin}
                setUser={setUserID}
              />
            </>
          }
        />
        <Route
          path="/SignUp"
          element={
            <>
              <NavBar login={isLoggedIn} />
              <CreateUserPage />
            </>
          }
        />
        <Route
          path="/ForgotPassword"
          element={
            <>
              <NavBar login={isLoggedIn} />
              <ForgotPasswordPage />
            </>
          }
        />

        {/*//* Admin Routes */}
        <Route
          path="/edit/:id"
          element={
            isAdmin && isLoggedIn ? (
              <>
                <NavBar login={isLoggedIn} setLogin={setIsLoggedIn} />
                <EditBookPage />
              </>
            ) : (
              <Navigate to="/" />
            )
          }
        />
        <Route
          path="/add"
          element={
            isAdmin && isLoggedIn ? (
              <>
                <NavBar login={isLoggedIn} setLogin={setIsLoggedIn} />
                <AddBookPage />
              </>
            ) : (
              <Navigate to="/" />
            )
          }
        />

        {/*//: Unknown Path Route */}
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </div>
  );
}

export default App;
