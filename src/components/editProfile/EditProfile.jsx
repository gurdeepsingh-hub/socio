import React, { useContext, useEffect, useState } from "react";
import "./editProfile.scss";
import { AuthContext } from "../../context/authContext";
import CropImage from "../cropImage/CropImage";
import axios from "axios";
import { reloginCall } from "../../apiCalls";

const EditProfile = () => {
  const { currentUser } = useContext(AuthContext);
  const PF = process.env.REACT_APP_PUBLIC_FOLDER;
  const [previewURL, setPreviewURL] = useState("");
  const [file, setFile] = useState(null);
  const [usernameAvailable, setUsernameAvailable] = useState(true);
  const [passwordMatch, setPasswordMatch] = useState(true);
  const [formData, setFormData] = useState({
    userId: currentUser._id,
    passwordAgain: "",
  });

  useEffect(() => {
    let res = true;
    formData.password &&
      (res = formData.password.includes(formData.passwordAgain));
    setPasswordMatch(res);
    if (formData.password == "") {
      delete formData.password;
    }
    console.log(formData);
  }, [formData.password, formData.passwordAgain]);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setFile(file);

    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewURL(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleInputChange = (e) => {
    e.preventDefault();
    const { name, value } = e.target;
    setFormData((prevData) => ({
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
  const handleBlur = () => {
    setPasswordMatch(
      formData.password == formData.passwordAgain &&
        formData.password.length >= 8
    );
  };
  const handleValidChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
    if (value == currentUser.username) {
      delete formData.username;
    } else {
      checkUsernameAvailability(value);
    }
  };

  const { isFetching, error, dispatch } = useContext(AuthContext);
  const handleSubmit = async (e) => {
    e.preventDefault();

    const newPost = {
      ...formData,
    };

    if (file) {
      const data = new FormData();
      const fileName = "/profiles/" + Date.now() + file.name;
      console.log(fileName);
      data.append("name", fileName);
      data.append("file", file);

      newPost.profilePicture = fileName;
      try {
        await axios.post("/upload", data);
      } catch (error) {
        console.log(error);
      }
    }
    console.log(newPost);

    try {
      await axios.put(`/users/${currentUser._id}`, newPost);
      window.location.reload();
      const email = currentUser.email;
      const password = currentUser.password;

      reloginCall({ email: email, password: password }, dispatch);
      error && console.log(error.response.data.status);
    } catch (err) {
      console.error(err);
    }
  };
  return (
    <div className="editProfile">
      <div className="container">
        <div className="heading">
          <h1>Edit Profile</h1>
        </div>
        <form action="" onSubmit={handleSubmit}>
          <div className="pp">
            <label htmlFor="profilePic">
              <button type="button" className="addPP">
                +
              </button>
              <img
                src={
                  previewURL || formData.profilePicture || PF + "/profile.png"
                }
                alt=""
              />
              <input
                type="file"
                id="profilePic"
                accept=".jpg,.jpeg,.png"
                style={{ display: "none" }}
                onChange={handleFileChange}
              />
            </label>
          </div>
          <div>
            <label htmlFor="displayName" />
            <input
              name="displayName"
              type="text"
              id="displayName"
              className="displayName"
              placeholder="Display Name"
              defaultValue={currentUser.displayName}
              onChange={handleInputChange}
            />
          </div>
          <div className="names">
            <div className="">
              <label htmlFor="firstName" />
              <input
                type="text"
                id="firstName"
                className="firstName"
                placeholder="First Name"
                readOnly
                defaultValue={currentUser.firstName}
                onChange={handleInputChange}
              />
            </div>
            <div className="">
              <label htmlFor="lastName" />
              <input
                type="text"
                id="lastName"
                className="lastName"
                placeholder="Last Name"
                readOnly
                defaultValue={currentUser.lastName}
                onChange={handleInputChange}
              />
            </div>
          </div>
          <div className="">
            <label htmlFor="username" />
            <input
              name="username"
              type="text"
              id="username"
              className="username"
              placeholder="Username"
              defaultValue={currentUser.username}
              onChange={handleValidChange}
              style={
                usernameAvailable
                  ? {}
                  : { color: `red`, borderBottom: `1px solid red` }
              }
            />
            {!usernameAvailable && (
              <p className="error">Username is already taken</p>
            )}
          </div>

          <div className="passwords">
            <div className="">
              <label htmlFor="password" />
              <input
                name="password"
                type="password"
                id="password"
                className="password"
                placeholder="Password"
                onChange={handleInputChange}
                onBlur={handleBlur}
                minLength="8"
              />
            </div>
            <div className="">
              <label htmlFor="passwordAgain" />
              <input
                name="passwordAgain"
                type="password"
                id="passwordAgain"
                className="passwordAgain"
                placeholder="Confirm Password"
                onChange={handleInputChange}
                onBlur={handleBlur}
                style={
                  passwordMatch
                    ? {}
                    : { color: `red`, borderBottom: `1px solid red` }
                }
                minLength="8"
              />
              {(!passwordMatch &&
                formData.password &&
                formData.password.length < 8 && (
                  <p className="error">Passwords Too short </p>
                )) ||
                (!passwordMatch && (
                  <p className="error">Passwords not match</p>
                ))}
            </div>
          </div>
          <div className="">
            <label htmlFor="password" />
            <textarea
              name="desc"
              type="text"
              id="caption"
              className="caption"
              placeholder="Caption"
              defaultValue={currentUser.desc}
              onChange={handleInputChange}
              rows={3}
              cols={20}
            />
          </div>
          <div className="">
            <label htmlFor="relationship" className="relation">
              Relation Status:
            </label>
            <select
              name="relationship"
              className="relationship"
              id="relationship"
              onChange={handleInputChange}
            >
              <option
                value="1"
                {...(currentUser.relationship == 1 ? "default" : "")}
              >
                Single
              </option>
              <option
                value="2"
                {...(currentUser.relationship == 2 ? "default" : "")}
              >
                Committed
              </option>
              <option
                value="3"
                {...(currentUser.relationship == 3 ? "default" : "")}
              >
                Happy
              </option>
            </select>
          </div>
          <button
            type="submit"
            onClick={handleSubmit}
            disabled={!passwordMatch || !usernameAvailable}
            style={
              !passwordMatch || !usernameAvailable
                ? {
                    background: "gray",
                  }
                : {}
            }
          >
            Save
          </button>
        </form>
      </div>
    </div>
  );
};

export default EditProfile;
