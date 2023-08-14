import Cookies from "js-cookie";
import { cookieN } from "./constants";

export const setCookie = (key, value, expireDay = 7) => {
  Cookies.set(key, value, {
    expires: expireDay,
    path: "/",
  });
};

export const removeCookie = (key) => {
  Cookies.remove(key, {
    expires: 1,
  });
};

export const getCookie = (key) => {
  return Cookies.getJSON(key);
};

export const authHeader = (isSocket = false) => {
  let token = getCookie(cookieN);

  if (token) {
    return isSocket
      ? {
          query: {
            accessToken: `Bearer ${token?._token}`,
          },
        }
      : { Authorization: "Bearer " + token?._token };
  } else {
    return {};
  }
};
