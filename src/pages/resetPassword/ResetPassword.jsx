import React, { useContext, useEffect, useRef, useState } from "react";
import {
  Link,
  Navigate,
  useLoaderData,
  useLocation,
  useNavigate,
} from "react-router-dom";
import { AuthContext } from "../../context/authContext";
import axios from "axios";

const ResetPassword = () => {
  const [isFetching, setFetching] = useState();
  const [error, setError] = useState();
  const [sucess, setSucess] = useState();
  const [passwords, setPasswords] = useState({
    password: "",
    cPassword: "",
  });
  const navigate = useNavigate();

  //helper Functions
  const handleChange = (e) => {
    const { name, value } = e.target;
    setPasswords((prevState) => ({ ...prevState, [name]: value }));
  };

  const checkEquality = () => {
    if (passwords.password == "" || passwords.cPassword == "") {
      return;
    }
    if (passwords.password != passwords.cPassword) {
      setSucess(false);
      setError("Password and Confirm Password does not match");
    } else {
      setError(null);
      setSucess(false);
    }
  };

  //Api Calls
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
          <h1>Reset Password</h1>
          <form onSubmit={forgotApiCall}>
            <input
              type="password"
              name="password"
              placeholder="Password"
              className="passwords"
              required
              minLength="8"
              onChange={handleChange}
              onBlur={checkEquality}
            />
            <input
              type="password"
              name="cPassword"
              placeholder="Confirm Password"
              className="passwords"
              required
              minLength="8"
              onChange={handleChange}
              onBlur={checkEquality}
            />{" "}
            {error && (
              <p style={{ color: "red", fontSize: "small" }}>{error}</p>
            )}
            <button disabled={isFetching} onClick={forgotApiCall}>
              {isFetching ? "Sending.." : "Reset"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ResetPassword;
