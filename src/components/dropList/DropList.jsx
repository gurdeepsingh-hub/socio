import React, { useState } from "react";
import "./dropList.scss";

const DropList = ({ children, list }) => {
  const [clicked, setClicked] = useState(false);
  return (
    <div className="DropList">
      <span
        onMouseEnter={() => setClicked(true)}
        onMouseLeave={() => setClicked(false)}
      >
        {children}
      </span>
      {clicked && (
        <div
          className="drop-list"
          onMouseOver={() => setClicked(true)}
          onMouseLeave={() => setClicked(false)}
        >
          {list.map((item) => {
            return (
              <div key={item.id} className="drop-list-item" onClick={item.func}>
                {item.name}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default DropList;
