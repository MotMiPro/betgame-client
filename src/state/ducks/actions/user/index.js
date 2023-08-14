import { DISPATCH_TYPE } from "../../types";

export const registerAction = (user) => ({
  type: DISPATCH_TYPE.REGISTER_API,
  payload: user,
});

export const loginAction = (user) => ({
  type: DISPATCH_TYPE.LOGIN_API,
  payload: user,
});
export const modifyUserData = (data) => ({
  type: DISPATCH_TYPE.MODIFY_USER_DATA,
  payload: data,
});

export const loginSuccess = (user) => ({
  type: DISPATCH_TYPE.LOGIN_SUCCESS,
  payload: user,
});

export const logoutAction = () => ({
  type: DISPATCH_TYPE.LOGOUT,
});
