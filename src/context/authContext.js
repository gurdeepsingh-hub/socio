import axios from "axios";
import { createContext, useEffect, useReducer } from "react";
import AuthReducer from "./authReducer";

const historyUser = localStorage.getItem("user");

const fetchUser = async () => {
  try {
    const parsedUser = JSON.parse(historyUser);

    const res = await axios.get(`/users/${parsedUser._id}`);
    console.log(res.data);
    return res.data;
  } catch (error) {
    console.log("Error parsing JSON:", error);
  }
};

const INITIAL_STATE = {
  currentUser: historyUser ? JSON.parse(historyUser) : null,
  isFetching: false,
  error: false,
};

export const AuthContext = createContext(INITIAL_STATE);

export const AuthContextProvider = ({ children }) => {
  const [state, dispatch] = useReducer(AuthReducer, INITIAL_STATE);

  return (
    <AuthContext.Provider
      value={{
        currentUser: state.currentUser,
        isFetching: state.isFetching,
        error: state.error,
        dispatch,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
