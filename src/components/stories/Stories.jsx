import { useContext } from "react";
import "./stories.scss";
import { AuthContext } from "../../context/authContext";

const Stories = () => {
  const { currentUser } = useContext(AuthContext);
  const PF = process.env.REACT_APP_PUBLIC_FOLDER;

  const stories = [
    {
      id: 1,
      name: "heyya",
      img: "https://picsum.photos/540/960",
    },
    {
      id: 2,
      name: "heyya",
      img: "https://picsum.photos/540/960",
    },
    {
      id: 3,
      name: "heyya",
      img: "https://picsum.photos/540/960",
    },
    {
      id: 4,
      name: "heyya",
      img: "https://picsum.photos/540/960",
    },
    {
      id: 5,
      name: "heyya",
      img: "https://picsum.photos/540/960",
    },
    {
      id: 6,
      name: "heyya",
      img: "https://picsum.photos/540/960",
    },
    {
      id: 7,
      name: "heyya",
      img: "https://picsum.photos/540/960",
    },
    {
      id: 8,
      name: "heyya",
      img: "https://picsum.photos/540/960",
    },
  ];
  return (
    <div className="stories">
      <div className="story">
        <img
          src={
            currentUser.profilePicture
              ? "/images/" + currentUser.profilePicture
              : PF + "/profile.png"
          }
          alt=""
        />
        <span>{currentUser.username}</span>
        <button>+</button>
      </div>
      {stories.map((story) => {
        return (
          <div className="story" key={story.id}>
            <img src={story.img} alt="" />
            <span>{story.name}</span>
          </div>
        );
      })}
    </div>
  );
};

export default Stories;
