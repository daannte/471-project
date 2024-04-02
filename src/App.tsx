import {
  createRoutesFromElements,
  Route,
  RouterProvider,
  createBrowserRouter,
  Navigate,
} from "react-router-dom";
import isAuthenticated from "./utils/auth";
import "./App.css";

import Home from "@/pages/home/Home";
import Calendar from "@/pages/calendar/CalendarPage";
import Login from "@/pages/login/Login";
import Logout from "./utils/Logout";
import Grades from "@/pages/grades/Grades";

const router = createBrowserRouter(
  createRoutesFromElements(
    <Route path="/">
      <Route
        index
        element={isAuthenticated() ? <Home /> : <Navigate to="/login" />}
      />
      <Route
        path="calendar"
        element={isAuthenticated() ? <Calendar /> : <Navigate to="/login" />}
      />
      <Route
        path="grades"
        element={isAuthenticated() ? <Grades /> : <Navigate to="/login" />}
      />
      <Route
        path="login"
        element={isAuthenticated() ? <Navigate to="/" /> : <Login />}
      />
      <Route
        path="logout"
        element={isAuthenticated() ? <Logout /> : <Navigate to="/login" />}
      />
      <Route path="*" element={<div>Seems like you got lost!</div>} />
    </Route>,
  ),
);

function App() {
  return <RouterProvider router={router} />;
}

export default App;
