import {
  createRoutesFromElements,
  Route,
  RouterProvider,
  createBrowserRouter,
} from "react-router-dom";
import "./App.css";

import Home from "@/pages/home/Home";
import Calendar from "@/pages/calendar/CalendarPage";
import Login from "@/pages/login/Login";

const router = createBrowserRouter(
  createRoutesFromElements(
    <Route path="/">
      <Route index element={<Home />} />
      <Route path="calendar" element={<Calendar />} />
      <Route path="login" element={<Login />} />
      <Route path="*" element={<div>Seems like you got lost!</div>} />
    </Route>,
  ),
);

function App() {
  return <RouterProvider router={router} />;
}

export default App;
