import {
  createRoutesFromElements,
  Route,
  RouterProvider,
  createBrowserRouter,
  Navigate,
} from "react-router-dom";
import "./App.css";

import Home from "@/pages/home/Home";
import Calendar from "@/pages/calendar/CalendarPage";
import Login from "@/pages/login/Login";
import Grades from "@/pages/grades/Grades";

const isAuthenticated = () => {
  const token = localStorage.getItem("token");
  return token !== undefined && token !== null;
};

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
        path="login"
        element={isAuthenticated() ? <Navigate to="/" /> : <Login />}
      />
      <Route
        path="grades"
        element={isAuthenticated() ? <Grades /> : <Navigate to="/login" />}
      />
      <Route path="*" element={<div>Seems like you got lost!</div>} />
    </Route>,
  ),
);

function App() {
  return <RouterProvider router={router} />;
}

export default App;
