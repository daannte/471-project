import axios from "axios";
import "./Login.css";
import Navbar from "@/components/navbar/Navbar";
import { useNavigate } from "react-router-dom";

function Login() {
  const navigate = useNavigate();

  async function fetchUserData() {
    try {
      const res = await axios.get("/api/users");
      return res.data;
    } catch (err) {
      console.error("Error fetching user data: " + err);
    }
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const email = (event.target as any).elements.email.value;
    const password = (event.target as any).elements.password.value;
    const data = await fetchUserData();

    data.forEach((user: any) => {
      if (email === user.email && password === user.password) {
        navigate("/");
      }
    });
  }

  return (
    <>
      <Navbar />
      <div className="login">
        <h2 className="login__title">Login</h2>
        <form className="login__form" onSubmit={handleSubmit}>
          <div className="login__input-container"></div>
          <input
            className="login__input"
            name="email"
            type="email"
            placeholder="EMAIL"
            autoComplete="off"
            required
          />
          <div className="login__input-container"></div>
          <input
            className="login__input-password"
            name="password"
            type="password"
            placeholder="PASSWORD"
            autoComplete="off"
            required
          />
          <button className="login__submit-button" type="submit">
            Login
          </button>
        </form>
      </div>
    </>
  );
}

export default Login;
