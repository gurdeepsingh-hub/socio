import axios from "axios";
import React, { useEffect, useState } from "react";

const EachFollower = ({ follower }) => {
  const PF = process.env.REACT_APP_PUBLIC_FOLDER;
  const [user, setUser] = useState([]);
  useEffect(() => {
    //fetch user details
    const fetchUser = async () => {
      const res = await axios
        .get(`/users/${follower}`)
        .then((resp) => {
          setUser(resp.data);
        })
        .catch((err) => {
          console.log(err);
        });
    };
    fetchUser();
  }, []);
  return (
    <div>
      <img
        src={
          user.profilePicture
            ? "/images/" + user.profilePicture
            : PF + "/profile.png"
        }
        alt=""
      />
      <span>
        <p>{user.firstName + " " + user.lastName}</p>
      </span>
    </div>
  );
};

export default EachFollower;
