import React, { useContext, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import "./post.scss";
import MoreHorizIcon from "@mui/icons-material/MoreHoriz";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import FavoriteIcon from "@mui/icons-material/Favorite";
import InsertCommentOutlinedIcon from "@mui/icons-material/InsertCommentOutlined";
import ShareIcon from "@mui/icons-material/Share";
import Comment from "../comments/Comment";
import axios from "axios";
import { AuthContext } from "../../context/authContext";

import { format } from "timeago.js";
import DropList from "../dropList/DropList";

const Post = ({ post, posts, setPosts }) => {
  const { currentUser } = useContext(AuthContext);
  const [user, setUser] = useState([]);

  const [commentOpen, setCommentOpen] = useState(false);
  //temp
  const [liked, setliked] = useState(post.likes.includes(currentUser._id));
  const [likes, setlikes] = useState(post.likes.length);

  const PF = process.env.REACT_APP_PUBLIC_FOLDER;

  //fetch user info for each post
  useEffect(() => {
    const fetchUser = async () => {
      const res = await axios.get(`/users/${post.userId}`).then((resp) => {
        setUser(resp.data);
      });
    };
    fetchUser();
  }, []);

  //update likes
  const updateLikes = async () => {
    setlikes(liked ? likes - 1 : likes + 1);
    const res = await axios.put(`/posts/${post._id}/like`, {
      postId: post._id,
      userId: currentUser._id,
    });
  };

  useEffect(() => {
    if (post.likes.includes(currentUser.id)) {
      setliked(true);
    }
  }, []);

  const DeletePost = async () => {
    try {
      await axios.delete(`/posts/${post._id}`, {
        data: { userId: currentUser._id },
      });
      const newArray = posts.filter((item) => item._id !== post._id);
      setPosts(newArray);
    } catch (e) {
      console.error(e);
    }
  };

  const droplist = [{ id: 1, name: "Delete Post", func: DeletePost }];

  return (
    <div className="post" key={post._id}>
      <div className="user">
        <Link
          to={`/profile/${user._id}`}
          style={{ textDecoration: "none", color: "inherit" }}
        >
          <div className="userInfo">
            <img
              src={
                user.profilePicture
                  ? "/images/" + user.profilePicture
                  : PF + "/profile.png"
              }
              alt=""
            />
            <div className="usr">
              <span>{user.firstName + " " + user.lastName}</span>
              <span className="time">{format(new Date(post.createdAt))}</span>
            </div>
          </div>
        </Link>
        {user._id == currentUser._id && (
          <DropList children={<MoreHorizIcon />} list={droplist} />
        )}
      </div>
      <div className="content">
        <p>{post.desc}</p>
        <img src={"/images/" + post.img} alt="" />
      </div>
      <div className="interaction">
        <div className="likes">
          {liked ? (
            <FavoriteIcon
              onClick={() => {
                updateLikes();
                setliked(!liked);
              }}
              style={{ cursor: "pointer" }}
            />
          ) : (
            <FavoriteBorderIcon
              onClick={() => {
                updateLikes();
                setliked(!liked);
              }}
              style={{ cursor: "pointer" }}
            />
          )}
          <span>{likes}</span>
        </div>
        <div
          className="comments"
          onClick={() => setCommentOpen(!commentOpen)}
          style={{ cursor: "pointer" }}
        >
          <InsertCommentOutlinedIcon />
          <span>Comments</span>
        </div>
        <div className="share">
          <ShareIcon />
          <span>Share</span>
        </div>
      </div>
      {commentOpen && (
        <Comment
          prevcomments={post.comments}
          postId={post._id}
          postUserId={post.userId}
        />
      )}
    </div>
  );
};

export default Post;
