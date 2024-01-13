import axios from "axios";
import React, { useContext, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { format } from "timeago.js";
import DeleteIcon from "@mui/icons-material/Delete";
import { AuthContext } from "../../context/authContext";

const Eachcomment = ({
  comment,
  postId,
  postUserId,
  setComments,
  comments,
}) => {
  const { currentUser } = useContext(AuthContext);
  const PF = process.env.REACT_APP_PUBLIC_FOLDER;
  const [user, setUser] = useState([]);
  useEffect(() => {
    const fetchUser = async () => {
      const res = await axios.get(`/users/${comment.userId}`).then((resp) => {
        setUser(resp.data);
      });
    };
    fetchUser();
  }, []);

  const deleteAuth =
    currentUser._id == postUserId || currentUser._id == comment.userId;

  const handleDelete = async () => {
    try {
      const newArray = comments.filter(
        (item) => item.virtId !== comment.virtId
      );

      setComments(newArray);
      const res = await axios.put(`/posts/${postId}/del-comment`, {
        userId: currentUser._id,
        comment: comment.comment,
      });
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <div className="comment">
      <Link
        to={`/profile/${user._id}`}
        style={{ textDecoration: "none", color: "inherit" }}
      >
        <img src={user.profilePic || PF + "/profile.png"} alt="" />
      </Link>

      <div className="content">
        <Link
          to={`/profile/${user._id}`}
          style={{ textDecoration: "none", color: "inherit" }}
        >
          <span className="usrname">
            {user.firstName + " " + user.lastName}
          </span>
        </Link>

        <p>{comment.comment}</p>
      </div>
      <div className="time">{format(new Date(comment.commentTime))}</div>
      {deleteAuth && (
        <div className="deleteComment" onClick={handleDelete}>
          <DeleteIcon fontSize="small" />
        </div>
      )}
    </div>
  );
};

export default Eachcomment;
