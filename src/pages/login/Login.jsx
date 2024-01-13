import { Link, useLocation } from "react-router-dom";
import "./login.scss";
import { useContext, useRef, useState } from "react";
import { AuthContext } from "../../context/authContext";
import { loginCall } from "../../apiCalls";

const Login = () => {
  const { isFetching, error, dispatch } = useContext(AuthContext);
  const email = useRef();
  const password = useRef();

  const handleLogin = (e) => {
    e.preventDefault();
    loginCall(
      { email: email.current.value, password: password.current.value },
      dispatch
    );
    error && console.log(error.response.data.status);
  };
  const [value, setValue] = useState(1);
  return (
    <div className="login">
      <div className="card">
        <div className="left">
          <h1>SOCIO</h1>
          <p>Connecting people, empowering Communities</p>
          <span>Don't you have an account?</span>
          <Link to={"/register"}>
            <button>Register</button>
          </Link>
        </div>

        <div className="right">
          <h1>Login</h1>
          <form onSubmit={handleLogin}>
            <label htmlFor="email"></label>
            <input
              type="email"
              placeholder="Username"
              required
              id="email"
              ref={email}
            />{" "}
            {error && error.response.status == 404 && (
              <p style={{ color: "red", fontSize: "small" }}>
                {error.response.data.status}
              </p>
            )}
            <label htmlFor="password"></label>
            <input
              type="password"
              placeholder="Password"
              required
              minLength="6"
              id="password"
              ref={password}
            />
            {error && error.response.status == 400 && (
              <p style={{ color: "red", fontSize: "small" }}>
                {error.response.data.status}
              </p>
            )}
            <p style={{ fontSize: "small" }}>
              <Link to="/forgot-password" style={{ textDecoration: "none" }}>
                Forgot Password?
              </Link>
            </p>
            <button onClick={handleLogin} disabled={isFetching}>
              {isFetching ? "Loading.." : "Login"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;
