import axios from "axios";

export const loginCall = async (userCredential, dispatch) => {
  dispatch({ type: "LOGIN_START" });
  try {
    const res = await axios.post("auth/login", userCredential);
    dispatch({ type: "LOGIN_SUCCESS", payload: res.data });
    try {
      localStorage.setItem("user", JSON.stringify(res.data));
    } catch (error) {
      console.log("Error parsing JSON:", error);
    }
  } catch (e) {
    dispatch({ type: "LOGIN_FAILURE", payload: e });
  }
};
export const reloginCall = async (userCredential, dispatch) => {
  dispatch({ type: "LOGIN_START" });
  try {
    const res = await axios.post("auth/relogin", userCredential);
    dispatch({ type: "LOGIN_SUCCESS", payload: res.data });

    localStorage.setItem("user", JSON.stringify(res.data));
    console.log(res.data);
  } catch (e) {
    dispatch({ type: "LOGIN_FAILURE", payload: e });
  }
};
