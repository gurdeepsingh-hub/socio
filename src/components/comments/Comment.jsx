import { useContext, useEffect, useState } from "react";
import "./comment.scss";
import { AuthContext } from "../../context/authContext";
import Eachcomment from "./Eachcomment";
import axios from "axios";
import { v4 as uuidv4 } from "uuid";

const Comment = ({ prevcomments, postId, postUserId }) => {
  const { currentUser } = useContext(AuthContext);

  const PF = process.env.REACT_APP_PUBLIC_FOLDER;
  const [comments, setComments] = useState(prevcomments);
  const [formData, setFormData] = useState({
    comment: "",
  });

  const handleInputChange = (event) => {
    setFormData({
      comment: event.target.value,
    });
  };

  const handleAddComment = (e) => {
    e.preventDefault();
    const { value } = e.target;

    if (formData.comment.trim() === "") {
      return; // Return early and prevent form submission
    }
    const vId = uuidv4();
    setComments((comments) => [
      ...comments,
      {
        userId: currentUser._id,
        comment: formData.comment,
        virtId: vId,
      },
    ]);

    const addComment = async () => {
      const response = await axios.put(`/posts/${postId}/comment`, {
        postId: postId,
        userId: currentUser._id,
        comment: formData.comment,
        virtId: vId,
      });
    };
    addComment();

    setFormData({
      comment: "",
    });
  };

  return (
    <div className="comments">
      <form className="write" onSubmit={handleAddComment}>
        <img src={currentUser.profilePic || PF + "/profile.png"} alt="" />
        <input
          id="comment"
          type="text"
          placeholder="Write a comment...."
          value={formData.comment}
          required
          onChange={handleInputChange}
        />
        <button type="submit" onClick={handleAddComment}>
          Send
        </button>
      </form>
      {comments.map((comment, index) => (
        <div key={index}>
          <Eachcomment
            comment={comment}
            postId={postId}
            postUserId={postUserId}
            setComments={setComments}
            comments={comments}
          />
        </div>
      ))}
    </div>
  );
};

export default Comment;
