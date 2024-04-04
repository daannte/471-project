import { Link } from "react-router-dom";
import isAuthenticated from "@/utils/auth";
import "./Navbar.css";

function Navbar() {
  return (
    <nav className="navbar">
      {isAuthenticated() ? (
        <>
          <Link to="/">Home</Link>
          <Link to="/calendar">Calendar</Link>
          {/* <Link to="/Grades">Grades</Link> */}
          <Link to="/logout">Logout</Link>
        </>
      ) : (
        <Link to="/login">Login</Link>
      )}
    </nav>
  );
}

export default Navbar;
