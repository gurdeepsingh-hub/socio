import React, { useContext, useState } from "react";
import "./navbar.scss";
import { Link, Navigate, useNavigate } from "react-router-dom";
import HomeOutlinedIcon from "@mui/icons-material/HomeOutlined";
import DarkModeOutlinedIcon from "@mui/icons-material/DarkModeOutlined";
import WbSunnyOutlinedIcon from "@mui/icons-material/WbSunnyOutlined";
import WidgetsOutlinedIcon from "@mui/icons-material/WidgetsOutlined";
import SearchOutlinedIcon from "@mui/icons-material/SearchOutlined";
import PersonOutlineOutlinedIcon from "@mui/icons-material/PersonOutlineOutlined";
import EmailOutlinedIcon from "@mui/icons-material/EmailOutlined";
import NotificationsNoneOutlinedIcon from "@mui/icons-material/NotificationsNoneOutlined";
import DropList from "../dropList/DropList";
import { DarkModeContext } from "../../context/darkModeContext";
import { AuthContext } from "../../context/authContext";
import axios from "axios";

const Navbar = () => {
  const { toggle, darkMode } = useContext(DarkModeContext);
  const { currentUser } = useContext(AuthContext);
  const [searchList, setSearchList] = useState();
  const PF = process.env.REACT_APP_PUBLIC_FOLDER;
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("user");
    window.location.reload();
  };

  const handleEditProfile = () => {
    navigate(`/edit-profile`);
  };
  const dropList = [
    {
      id: 1,
      name: "Edit Profile",
      func: handleEditProfile,
    },
    {
      id: 2,
      name: "Logout",
      func: handleLogout,
    },
  ];

  const handleSearchChange = async (e) => {
    try {
      const { value } = e.target;
      console.log(e.target.value);
      const matches = await axios.get(`/users/${value}/search`);
      if (value == "") {
        setSearchList();
      }
      if (matches.data.length > 0) {
        setSearchList(matches.data);
      }
    } catch (e) {
      setSearchList();
      console.log(e);
    }
  };
  const handleSearchOnblur = () => {
    setSearchList();
  };
  const handleResultSelection = (item) => {
    // Perform actions when a result is selected
    navigate(`/profile/${item._id}`);
  };

  return (
    <div className="navbar">
      <div className="left">
        <Link to="/" style={{ textDecoration: "none" }}>
          <span>Socio</span>
        </Link>
        <Link to="/" style={{ textDecoration: "none" }}>
          <HomeOutlinedIcon className="Icon" />
        </Link>

        {darkMode ? (
          <WbSunnyOutlinedIcon onClick={toggle} />
        ) : (
          <DarkModeOutlinedIcon onClick={toggle} />
        )}
        <WidgetsOutlinedIcon className="widget" />
        <div className="search">
          <SearchOutlinedIcon />
          <input
            type="text"
            placeholder="Search..."
            onChange={handleSearchChange}
            // onBlur={handleSearchOnblur}
          />
        </div>
        {searchList && (
          <div className="search-results">
            {searchList.map((item) => (
              <div
                key={item._id}
                className="search-result-option"
                onClick={() => handleResultSelection(item)}
              >
                <div className="resultUsers">
                  <img
                    src={
                      item.profilePicture
                        ? "/images/" + item.profilePicture
                        : PF + "/profile.png"
                    }
                    alt=""
                  />
                  <div className="names">
                    <p>{item.username} </p>
                    <p>{item.firstName + " " + item.lastName}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
      <div className="right">
        <Link
          to={`/profile/${currentUser._id}`}
          style={{ textDecoration: "none" }}
        >
          <PersonOutlineOutlinedIcon className="Icon" />
        </Link>
        <EmailOutlinedIcon />
        <NotificationsNoneOutlinedIcon />
        <DropList
          children={
            <div className="user">
              <img
                src={
                  currentUser.profilePicture
                    ? "/images/" + currentUser.profilePicture
                    : PF + "/profile.png"
                }
                alt=""
              />
              <span>{currentUser.firstName + " " + currentUser.lastName}</span>
            </div>
          }
          list={dropList}
        />
      </div>
    </div>
  );
};

export default Navbar;
