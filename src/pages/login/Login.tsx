import "./Login.css";
import Navbar from "@/components/navbar/Navbar";

function Login() {
  return (
    <>
      <Navbar />
      <div className="login">
        <h2 className="login__title">Login</h2>
        <form className="login__form">
          <div className="login__input-container"></div>
          <input
            className="login__input"
            type="email"
            placeholder="EMAIL"
            autoComplete="off"
            required
          />
          <div className="login__input-container"></div>
          <input
            className="login__input-password"
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
