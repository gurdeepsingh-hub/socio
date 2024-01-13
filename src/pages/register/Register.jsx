import { Link, Navigate, useNavigate } from "react-router-dom";
import { useContext, useEffect, useState } from "react";
import "./register.scss";
import axios from "axios";
import { loginCall } from "../../apiCalls";
import { AuthContext } from "../../context/authContext";

const Register = ({ history }) => {
  const [page, setPage] = useState(1);
  const [userData, setUserData] = useState({
    username: "",
    email: "",
    password: "",
    firstName: "",
    passwordAgain: "",
    lastName: "",
    desc: "",
    dob: "",
  });
  const { isFetching, error, dispatch } = useContext(AuthContext);
  const [passwordMatch, setPasswordMatch] = useState(true);
  const [usernameAvailable, setUsernameAvailable] = useState(true);
  const [emailAvailable, setEmailAvailable] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const res =
      userData.password.includes(userData.passwordAgain) ||
      userData.password === userData.passwordAgain;
    setPasswordMatch(res);
  }, [, userData.passwordAgain, userData.password]);

  const nextPage = () => {
    setPage(2);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setUserData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const checkUsernameAvailability = async (username) => {
    try {
      const response = await axios.get(`/auth/check-username/${username}`);
      const data = response.data;
      setUsernameAvailable(!data.isTaken);
    } catch (error) {
      console.error("Error checking username availability:", error);
    }
  };

  const checkEmailAvailability = async (email) => {
    try {
      const response = await axios.get(`/auth/check-email/${email}`);
      const data = response.data;
      setEmailAvailable(!data.isTaken);
      console.log(emailAvailable);
    } catch (error) {
      console.error("Error checking email availability:", error);
    }
  };

  const handleValidChange = (e) => {
    const { name, value } = e.target;
    setUserData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
    name == "username" && checkUsernameAvailability(value);
    name == "email" && checkEmailAvailability(value);
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    // Send the userData object with the collected data to the server
    if (usernameAvailable && emailAvailable && passwordMatch) {
      const { passwordAgain, ...user } = userData;
      console.log(user);
      await axios.post("/auth/register", user);
      navigate("/login");
      // loginCall({ email: user.email, password: user.password }, dispatch);
    }
  };

  return (
    <div className="register">
      <div className="card">
        <div className="left">
          <h1>Register</h1>
          <form onSubmit={handleFormSubmit}>
            {(page === 1 && (
              <div className="page1">
                <input
                  type="text"
                  name="username"
                  placeholder="Username"
                  value={userData.username}
                  onChange={handleValidChange}
                  required
                  style={
                    usernameAvailable
                      ? {}
                      : { color: `red`, borderBottom: `1px solid red` }
                  }
                />
                {!usernameAvailable && (
                  <p className="error">Username is already taken</p>
                )}
                <input
                  type="email"
                  name="email"
                  placeholder="Email"
                  value={userData.email}
                  onChange={handleValidChange}
                  required
                  style={
                    emailAvailable
                      ? {}
                      : { color: `red`, borderBottom: `1px solid red` }
                  }
                />
                {!emailAvailable && (
                  <p className="error">Email is already registered</p>
                )}
                <input
                  type="text"
                  name="firstName"
                  placeholder="First Name"
                  value={userData.firstName}
                  onChange={handleInputChange}
                  required
                />
                <input
                  type="text"
                  name="lastName"
                  placeholder="Last Name"
                  value={userData.lastName}
                  onChange={handleInputChange}
                  required
                />
                <div className="buttons">
                  <button type="button" onClick={() => setPage(2)}>
                    Next
                  </button>
                </div>
              </div>
            )) ||
              (page == 2 && (
                <div className="page2">
                  <input
                    type="password"
                    name="password"
                    placeholder="Password"
                    value={userData.password}
                    onChange={handleInputChange}
                    className="passwords"
                    required
                    minLength="8"
                  />
                  <input
                    type="password"
                    name="passwordAgain"
                    placeholder="Password again"
                    value={userData.passwordAgain}
                    onChange={handleInputChange}
                    className="passwords"
                    required
                    style={
                      passwordMatch
                        ? {}
                        : { color: `red`, borderBottom: `1px solid red` }
                    }
                    minLength="8"
                  />
                  {!passwordMatch && (
                    <p className="error">Passwords not match</p>
                  )}
                  <input
                    type="text"
                    name="desc"
                    placeholder="Caption"
                    value={userData.desc}
                    onChange={handleInputChange}
                  />
                  <input
                    type="text"
                    name="dob"
                    placeholder="Date of birth"
                    value={userData.dob}
                    onBlur={(e) => (e.currentTarget.type = "text")}
                    onFocus={(e) => (e.currentTarget.type = "date")}
                    onChange={handleInputChange}
                  />
                  <div className="buttons">
                    <button type="button" onClick={() => setPage(1)}>
                      Previous
                    </button>
                    <button
                      type="submit"
                      disabled={
                        !usernameAvailable ||
                        !emailAvailable ||
                        !passwordMatch ||
                        isFetching
                      }
                      style={
                        !usernameAvailable || !emailAvailable || !passwordMatch
                          ? {
                              background: "gray",
                              cursor: "auto",
                            }
                          : { color: "white" }
                      }
                    >
                      Register
                    </button>
                  </div>
                </div>
              ))}
          </form>
        </div>
        <div className="right">
          <h1>SOCIO</h1>
          <p>Connecting People, Empowering Communities</p>
          <span>Do you have an account?</span>
          <Link to={"/login"}>
            <button>Login</button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Register;
