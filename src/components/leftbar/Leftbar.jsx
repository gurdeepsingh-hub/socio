import React, { useContext } from "react";
import "./leftbar.scss";
import {
  AccountCircle,
  Diversity3,
  Group,
  Storefront,
  Subscriptions,
  AccessAlarms,
} from "@mui/icons-material";

import {
  EmojiEvents,
  SportsEsports,
  Collections,
  Videocam,
  Forum,
} from "@mui/icons-material";
import {
  AccountBalanceWallet,
  LibraryBooks,
  AdminPanelSettings,
} from "@mui/icons-material";
import { Link } from "react-router-dom";
import { AuthContext } from "../../context/authContext";

const shortcut = [
  {
    id: 1,

    name: "Event",
    icon: <EmojiEvents className="icon" />,
  },
  {
    id: 2,
    name: "Gaming",
    icon: <SportsEsports className="icon" />,
  },
  { id: 3, name: "Gallery", icon: <Collections className="icon" /> },
  { id: 4, name: "Video", icon: <Videocam className="icon" /> },
  { id: 5, name: "Messaging", icon: <Forum className="icon" /> },
];
const others = [
  {
    id: 1,
    name: "Fundraiser",
    icon: <AccountBalanceWallet className="icon" />,
  },
  {
    id: 2,
    name: "Tutorial",
    icon: <LibraryBooks className="icon" />,
  },
  { id: 3, name: "courses", icon: <AdminPanelSettings className="icon" /> },
];
const Leftbar = () => {
  const { currentUser } = useContext(AuthContext);
  let menu = [
    {
      id: 1,
      name: "Profile",
      icon: (
        <Link to={`/profile/${currentUser._id}`}>
          {" "}
          <AccountCircle className="icon" />
        </Link>
      ),
    },
    { id: 2, name: "Friends", icon: <Diversity3 className="icon" /> },
    { id: 3, name: "Group", icon: <Group className="icon" /> },
    { id: 4, name: "Marketplace", icon: <Storefront className="icon" /> },
    { id: 5, name: "Watch", icon: <Subscriptions className="icon" /> },
    { id: 6, name: "Memories", icon: <AccessAlarms className="icon" /> },
  ];
  return (
    <div className="leftbar">
      <div className="container">
        <span>Menu</span>

        {menu.map((item) => {
          return (
            <div className="item" key={item.id}>
              <span>{item.icon}</span>
              <span>{item.name}</span>
            </div>
          );
        })}
      </div>
      <hr />
      <div className="container">
        <span>Shortcuts</span>
        {shortcut.map((item) => {
          return (
            <div className="item" key={item.id}>
              <span>{item.icon}</span>
              <span>{item.name}</span>
            </div>
          );
        })}
      </div>
      <hr />
      <div className="container">
        <span>Others</span>
        {others.map((item) => {
          return (
            <div className="item" key={item.id}>
              <span>{item.icon}</span>
              <span>{item.name}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Leftbar;
