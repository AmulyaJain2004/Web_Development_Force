import React from 'react';
import { BrowserRouter as Router, Routes, Route, Outlet } from "react-router-dom";

import Dashboard from "./pages/Admin/Dashboard.jsx";

import Login from "./pages/Auth/Login.jsx";
import SignUp from "./pages/Auth/Signup.jsx";

import ManageTasks from "./pages/Admin/ManageTasks.jsx";
import CreateTask from "./pages/Admin/CreateTask.jsx";
import ManageUsers from "./pages/Admin/ManageUsers.jsx";

import UserDashboard from './pages/User/UserDashboard.jsx';
import MyTasks from './pages/User/MyTasks.jsx';
import ViewTaskDetails from './pages/User/ViewTaskDetails.jsx';

import PrivateRoute from './routes/PrivateRoute.jsx';
import UserProvider, {UserContext} from './context/userContext.jsx';

const App = () => {
  return (
    <UserProvider>
    <div>
      <Router>
        <Routes>
          <Route path="/login" element={<Login/>} />
          <Route path="/signUp" element={<SignUp/>} />

          {/*Admin Routes*/}
          <Route element={<PrivateRoute allowedRoles={["admin"]}/>}>
            <Route path="/admin/dashboard" element={<Dashboard/>} />
            <Route path="/admin/tasks" element={<ManageTasks/>} />
            <Route path="/admin/create-task" element={<CreateTask/>} />
            <Route path="/admin/users" element={<ManageUsers/>} />
          </Route>

          {/*User Routes*/}
          <Route element={<PrivateRoute allowedRoles={["user"]}/>}>
            <Route path="/user/dashboard" element={<UserDashboard/>} />
            <Route path="/user/tasks" element={<MyTasks/>} />
            <Route path="/user/tasks-details/:id" element={<ViewTaskDetails/>} />
          </Route>

          {/*Default Route*/}
          <Route path="/" element={<Root/>} />

        </Routes>
      </Router>
    </div>
    </UserProvider>
  )
}

export default App;

const Root = () => {
  const {user, loading} = useUserContext(UserContext);

  if (loading) return <Outlet/>;

  if (!user){
    return <Navigate to="/login" />;
  }

  return user.role === "admin" ? <Navigate to="/admin/dashboard" /> : <Navigate to="/user/dashboard" />;
}