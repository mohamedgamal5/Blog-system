import { authActions } from "../slices/authSlices";
import request from "../../utils/request";
import { toast } from "react-toastify";
//login
export function loginUser(user) {
  return async (dispatch) => {
    try {
      const { data } = await request.post("/api/auth/login", user);
      dispatch(authActions.login(data));
      localStorage.setItem("userInfo", JSON.stringify(data));
    } catch (error) {
      toast.error(error.response.data.message);
    }
  };
}

//logout
export function logoutUser() {
  return async (dispatch) => {
    dispatch(authActions.logout());
    localStorage.removeItem("userInfo");
  };
}

//register
export function registerUser(user) {
  return async (dispatch) => {
    try {
      const { data } = await request.post("/api/auth/register", user);
      dispatch(authActions.register(data));
    } catch (error) {
      toast.error(error.response.data.message);
    }
  };
}

// Verify Email
export function verifyEmail(userId, token) {
  return async (dispatch) => {
    try {
      console.log(">>>>>>>>>>>>>>>>");
      await request.get(`/api/auth/${userId}/verify/${token}`);
      console.log("////////////////");
      dispatch(authActions.setIsEmailVerified());
      console.log("????????????????");
    } catch (error) {
      console.log(error);
    }
  };
}
