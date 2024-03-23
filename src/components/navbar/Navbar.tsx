import { Link } from "react-router-dom";
import "./Navbar.css";
function Navbar() {
  return (
    <nav className="navbar">
      <Link to="/">Home</Link>
      <Link to="/calendar">Calendar</Link>
      <Link className="navbar__login-text" to="/login">
        Login
      </Link>
      <Link to = "/Grades">Grades</Link>
    </nav>
  );
}

export default Navbar;
