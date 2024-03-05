import {
  createRoutesFromElements,
  Route,
  RouterProvider,
  createBrowserRouter,
} from "react-router-dom";
import "./App.css";

import Home from "./pages/Home";

const router = createBrowserRouter(
  createRoutesFromElements(<Route path="/" element={<Home />}></Route>),
);

function App() {
  return <RouterProvider router={router} />;
}

export default App;
