import axios from "axios";
import "./Login.css";
import Navbar from "@/components/navbar/Navbar";

function Login() {
  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const email = (event.target as any).elements.email.value;
    const password = (event.target as any).elements.password.value;

    try {
      const res = await axios.post("/api/login", { email, password });
      const token = res.data.token;
      const ucid = res.data.ucid;

      localStorage.setItem("token", token);
      localStorage.setItem("ucid", ucid);

      window.location.reload();
    } catch (err) {
      console.error("Error: " + err);
    }
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
