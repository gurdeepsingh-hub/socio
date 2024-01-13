import { useContext, useEffect, useState } from "react";
import "./profile.scss";
import {
  EmailOutlined,
  FacebookTwoTone,
  Handshake,
  Instagram,
  Language,
  LinkedIn,
  MoreVert,
  Pinterest,
  Place,
  Twitter,
} from "@mui/icons-material";
import Posts from "../../components/posts/Posts";
import { useParams } from "react-router-dom";
import axios from "axios";
import { AuthContext } from "../../context/authContext";
import Followers from "../../components/followers/Followers";

const Profile = () => {
  const { currentUser } = useContext(AuthContext);
  const [user, setUser] = useState([]);
  const [loggedUser, setLoggedUser] = useState([]);

  const PF = process.env.REACT_APP_PUBLIC_FOLDER;
  let { id } = useParams();
  const [followerShow, setFollowerShow] = useState(0);

  //state to switch buttons after request was made
  const [followed, setFollowed] = useState({
    following: currentUser && currentUser.following.includes(id),
    followedBy: currentUser && currentUser.followers.includes(id),
  });

  useEffect(() => {
    //fetch user details
    const fetchUser = async () => {
      const res = await axios
        .get(`/users/${id}`)
        .then((resp) => {
          setUser(resp.data);
        })
        .catch((err) => {
          console.log(err);
        });
    };
    fetchUser();
  }, [id]);

  const handleFollow = async () => {
    console.log("follow");
    setFollowed({ following: true, followedBy: followed.followedBy });
    const res = await axios.put(`/users/${user._id}/follow`, {
      userId: currentUser._id,
    });
  };
  const handleUnfollow = async () => {
    setFollowed({ following: false, followedBy: followed.followedBy });
    console.log("unfollow");
    const res = await axios.put(`/users/${user._id}/unfollow`, {
      userId: currentUser._id,
    });
  };

  useEffect(() => {
    //fetch Logged user details
    const fetchUser = async () => {
      const res = await axios
        .get(`/users/${currentUser._id}`)
        .then((resp) => {
          setLoggedUser(resp.data);
        })
        .catch((err) => {
          console.log(err);
        });
    };
    fetchUser();
  }, []);

  useEffect(() => {
    if (
      loggedUser &&
      loggedUser.following &&
      loggedUser.following.includes(user._id) &&
      loggedUser.followers.includes(user._id)
    ) {
      //Both follow each other(Following)
      setFollowed({ following: true, followedBy: true });
    } else if (
      loggedUser &&
      loggedUser.following &&
      loggedUser.following.includes(user._id) &&
      !loggedUser.followers.includes(user._id)
    ) {
      // you follow other not(Following)
      setFollowed({ following: true, followedBy: false });
    } else if (
      loggedUser &&
      loggedUser.following &&
      !loggedUser.following.includes(user._id) &&
      loggedUser.followers.includes(user._id)
    ) {
      //you dont follow back(Follow back)
      setFollowed({ following: false, followedBy: true });
    } else {
      //both not follow each other(Follow)
      setFollowed({ following: false, followedBy: false });
    }
  }, [, loggedUser]);

  const handleFollowers = (x) => {
    console.log(x);
    setFollowerShow(x);

    const elements = document.querySelectorAll("#root > *:not(.followers)");
    elements.forEach((element) => {
      element.classList.toggle("disable-pointer-events", !followerShow);
    });
  };

  return (
    <div className="profile">
      <div className="images">
        <img
          src={user.coverPicture || PF + "/cover.jpeg"}
          alt=""
          className="cover"
        />
        <img
          src={
            user.profilePicture
              ? "/images/" + user.profilePicture
              : PF + "/profile.png"
          }
          alt=""
          className="profilePic"
        />
      </div>
      <div className="container">
        <div className="profileContainer">
          <div className="left">
            <a href="">
              <FacebookTwoTone fontSize="large" />
            </a>
            <a href="">
              <Instagram fontSize="large" />
            </a>
            <a href="">
              <Twitter fontSize="large" />
            </a>
            <a href="">
              <LinkedIn fontSize="large" />
            </a>
            <a href="">
              <Pinterest fontSize="large" />
            </a>
          </div>
          <div className="center">
            <p className="name">{user.firstName + " " + user.lastName}</p>
            <p className="userName">{user.username}</p>
            {id != currentUser._id ? (
              (followed.followedBy && followed.following && (
                <button type="button" onClick={handleUnfollow}>
                  Following
                </button>
              )) ||
              (followed.followedBy && !followed.following && (
                <button type="button" onClick={handleFollow}>
                  Follow Back
                </button>
              )) ||
              (!followed.followedBy && followed.following && (
                <button type="button" onClick={handleUnfollow}>
                  Following
                </button>
              )) ||
              (!followed.followedBy && !followed.following && (
                <button type="button" onClick={handleFollow}>
                  Follow
                </button>
              ))
            ) : (
              // followed.following && followed.followedBy ? (
              //   <button type="button" onClick={handleUnfollow}>
              //     Following
              //   </button>
              // ) : !followed.followedBy ? (
              //   <button type="button" onClick={handleFollow}>
              //     Follow Back
              //   </button>
              // ) : (
              //   <button type="button" onClick={handleFollow}>
              //     Follow
              //   </button>
              // )
              <div>
                <button type="button" onClick={() => handleFollowers(1)}>
                  Followers
                </button>
                <button type="button" onClick={() => handleFollowers(2)}>
                  Following
                </button>
              </div>
            )}
            {followerShow == 1 && (
              <div>
                <div className="overlay"></div>
                <Followers
                  followers={loggedUser.followers}
                  handleFollowers={handleFollowers}
                />
              </div>
            )}
            {followerShow == 2 && (
              <div>
                <div className="overlay"></div>
                <Followers
                  followers={loggedUser.following}
                  handleFollowers={handleFollowers}
                />
              </div>
            )}
          </div>
          <div className="right">
            <div className="caption">{user.desc}</div>
            <div className="info">
              <div className="item">
                <Place />
                <span>{user.state}</span>
              </div>

              <div className="item">
                <Handshake />
                <span>
                  {user.relationship == 1
                    ? "Single"
                    : user.relation == 2
                    ? "Taken"
                    : "Married"}
                </span>
              </div>
            </div>
          </div>
        </div>
        <Posts userId={id} />
      </div>
    </div>
  );
};

export default Profile;
