import React, { useContext, useEffect, useRef, useState } from "react";
import "./posts.scss";
import Post from "../post/Post";
import axios from "axios";
import { AuthContext } from "../../context/authContext";
import CollectionsIcon from "@mui/icons-material/Collections";
const Posts = ({ userId }) => {
  const [posts, setPosts] = useState([]);
  const { currentUser } = useContext(AuthContext);
  const PF = process.env.REACT_APP_PUBLIC_FOLDER;

  const desc = useRef();
  const [file, setFile] = useState(null);
  const [previewURL, setPreviewURL] = useState("");

  useEffect(() => {
    const fetchPosts = async () => {
      const url = userId
        ? `/posts/profile/${userId}`
        : `/posts/timeline/${currentUser._id}`;
      const res = await axios.get(url).then((resp) => {
        setPosts(resp.data);
      });
    };
    fetchPosts();
  }, [userId]);

  const handleFileChnage = (e) => {
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

  const handlePreviewDelete = (e) => {
    e.preventDefault();
    setPreviewURL("");
    setFile(null);
  };

  const submitHandler = async (e) => {
    e.preventDefault();

    const newPost = {
      userId: currentUser._id,
      desc: desc.current.value,
    };

    if (file) {
      const data = new FormData();
      const fileName = "/posts/" + Date.now() + file.name;
      console.log(fileName);
      data.append("name", fileName);
      data.append("file", file);

      newPost.img = fileName;
      try {
        await axios.post("/upload", data);
      } catch (error) {
        console.log(error);
      }
    }

    try {
      await axios.post("/posts", newPost);
      window.location.reload();
    } catch (err) {
      console.error(err);
    }
  };
  return (
    <div className="posts">
      <form onSubmit={submitHandler}>
        <div className="addPost-container">
          <div className="desc">
            <img
              src={
                currentUser.profilePicture
                  ? "/images/" + currentUser.profilePicture
                  : PF + "/profile.png"
              }
              alt=""
            />
            <textarea
              name=""
              id=""
              cols="30"
              rows="10"
              placeholder={
                "What's in your mind " + currentUser.firstName + " ?"
              }
              ref={desc}
            ></textarea>
          </div>
          <hr />
          <div className="down">
            <label htmlFor="file" className="addPic">
              <CollectionsIcon fontSize="large" style={{ cursor: "pointer" }} />
              <input
                style={{ display: "none" }}
                type="file"
                id="file"
                accept=".png,.jpeg,.jpg"
                onChange={handleFileChnage}
              />
            </label>
            <button type="submit">Share</button>
          </div>
          {file && (
            <div className="preview">
              <p>Selected File:</p>
              <img className="previewImg" src={previewURL} alt="Preview" />
              <button type="button" onClick={handlePreviewDelete}>
                X
              </button>
            </div>
          )}
        </div>
      </form>
      {posts.map((post) => {
        return (
          <div key={post._id}>
            <Post post={post} posts={posts} setPosts={setPosts} />
          </div>
        );
      })}
    </div>
  );
};

export default Posts;
