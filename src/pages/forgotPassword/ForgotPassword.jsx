import React, { useContext, useRef, useState } from "react";
import "./forgotPassword.scss";
import {
  Link,
  Navigate,
  useLoaderData,
  useLocation,
  useNavigate,
} from "react-router-dom";
import { AuthContext } from "../../context/authContext";
import axios from "axios";

const ForgotPassword = () => {
  const [isFetching, setFetching] = useState();
  const [error, setError] = useState();
  const [sucess, setSucess] = useState();

  const email = useRef();
  const location = useLocation();
  console.log(location);
  const navigate = useNavigate();

  const forgotApiCall = async (e) => {
    e.preventDefault();
    try {
      setError(false);
      setFetching(true);
      const res = await axios.post("/auth/forgot-password", {
        Email: email.current.value,
      });
      setFetching(false);
      setSucess(true);
      setTimeout(() => {
        console.log("res", res);
        if (res.status == 201) {
          return navigate("/");
        }
      }, 2000);
    } catch (err) {
      setFetching(false);
      setError(err);
    }
  };

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
          <h1>Forgot Password</h1>
          <form onSubmit={forgotApiCall}>
            <label htmlFor="email"></label>
            <input
              type="email"
              placeholder="Enter Username or Email"
              required
              id="email"
              ref={email}
            />{" "}
            {sucess && (
              <p
                style={{ color: "Green", fontSize: "small" }}
              >{`Email Sent Sucessfully`}</p>
            )}
            {error && (
              <p
                style={{ color: "red", fontSize: "small" }}
              >{`This email is nor registered`}</p>
            )}
            <button disabled={isFetching} onClick={forgotApiCall}>
              {isFetching ? "Sending.." : "Send OTP"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;
