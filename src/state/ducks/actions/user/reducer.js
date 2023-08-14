import { DISPATCH_TYPE } from "../../types";

const initialState = {
  userInfos: null,
  loggedIn: false,
  register: {},
  authHeader: null,
};

const userReducer = (state = initialState, { type, payload }) => {
  switch (type) {
    case DISPATCH_TYPE.LOGIN_SUCCESS:
      return {
        ...state,
        userInfos: payload,
        loggedIn: true,
        authHeader: { Authorization: "Bearer " + payload?._token },
      };
    case DISPATCH_TYPE.REGISTER_SUCCESS:
      return {
        ...state,
        register: payload,
      };
    case DISPATCH_TYPE.MODIFY_USER_2FA:
      return {
        ...state,
        userInfos: {
          ...state.userInfos,
          _gaEnabled: !state.userInfos._gaEnabled,
        },
      };
    case DISPATCH_TYPE.MODIFY_AVATAR:
      return {
        ...state,
        userInfos: {
          ...state.userInfos,
          _avatar: payload,
        },
      };
    case DISPATCH_TYPE.MODIFY_USER_NAME:
      return {
        ...state,
        userInfos: {
          ...state.userInfos,
          _user: payload,
        },
      };
    case DISPATCH_TYPE.LOGOUT:
      return initialState;
    default:
      return state;
  }
};

export default userReducer;
