import {
  createRoutesFromElements,
  Route,
  RouterProvider,
  createBrowserRouter,
} from "react-router-dom";
import "./App.css";

import Home from "./pages/Home";
import Calendar from './pages/CalendarPage';
import Navbar from './components/Navbar';

// const router = createBrowserRouter(
//   createRoutesFromElements(<Route path="/" element={<Home />}></Route>),
// );

const router = createBrowserRouter(
  createRoutesFromElements([
      <Route key = "home" path="/" element={<Home />} />,
      <Route key = "CalendarPage" path="/CalendarPage" element={<Calendar />} />
  ])
);

function App() {
  //return <RouterProvider router={router} />;
  return (
    <RouterProvider router={router}>
        <Navbar />
    </RouterProvider>
  );
}

export default App;
