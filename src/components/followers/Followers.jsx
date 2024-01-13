import React, { useState } from "react";
import { Link } from "react-router-dom";
import "./followers.scss";
import EachFollower from "./EachFollower";

const Followers = ({ followers, handleFollowers }) => {
  const handleClose = (e) => {
    e.preventDefault();
    handleFollowers(0);
  };
  return (
    <div className="followers">
      <div className="head">
        <h1>Followers</h1>
      </div>{" "}
      <div className="users">
        {followers.map((user, index) => {
          return (
            <Link
              to={`/profile/${user}`}
              style={{ textDecoration: "none", color: "inherit" }}
            >
              <EachFollower key={index} follower={user} />
            </Link>
          );
        })}
      </div>
      <button onClick={handleClose}>Close</button>
    </div>
  );
};

export default Followers;
