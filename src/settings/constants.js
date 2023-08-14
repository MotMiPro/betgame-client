import React from "react";
import translationsComponents from "~/languageProvider/translateKeys";
export const appColor = {
  bgPrimaryColor: "#272931",
  bgSecondaryColor: "#393C47",
  bgThirdColor: "#22252c",
  textPrimaryColor: "#1da57a",
  textSecondaryColor: "#bbbec5",
  textWhiteColor: "#ffffff",
  borderPrimaryColor: "#34363d",
  // extends
  white: "#fff",
  black: "#000",
  black1: "rgba(0, 0, 0, 0.85)",
  red: "#d0011b",
  red1: "#ce0a24",
  red2: "#d0011b",
  lightgray: "#dddddd",
  lightgray3: "#f7f7f7",
  darkgray: "#202021",
  newgray: "#bdc3c7",
  gray: "#4a4a4a", // text color
  gray2: "#f4f5f7",
  gray3: "#8e8e8e", // text color
  gray4: "#e7e9ec",
  gray9: "#858585",
  gray11: "#9b9b9b",
  blue: "#189eff",
  blue2: "#007bff",
  orange: "#f57224",
  pink: "#ff22bb",
  sky: "#00ccff",
  orangehighlight: "#f39c12",
};

export const pathName = {
  _HOME: "/",
  _MOON: "/moon",
  _DICE: "/dice",
  _SLOTS: "/slots",
  _LOGIN: "/login",
  _SIGNUP: "/signup",
  _WALLET: "/wallet",
  _SETTING: "/setting",
  _BALANCE: "/balance",
  _DEPOSITE: "/deposit",
  _WITHDRAW: "/withdraw",
  _VERIFY: "/user/verify",
  _AFFILIATE: "/affiliate",
  _FUNDWIHDRAW: "/fund/withdraw",
  _RESETPASSWORD: "/user/reset-password",
  _NEW_DICE: "/new-dice",
  _SWAP: "/swap",
  _BETTING_HISTORY: "/betting-history",
};

export const pathAPI = {
  GET_BALANCE: "fund/balance",
  WITHDRAWAL: "fund/withdraw",
  GET_BALANCE_HISTORY: "fund/balance-history",
  GET_ADDRESS_WALLET: "fund/get-address",
  GET_DEPOSIT_HISTORY: "fund/deposit-history",
  GET_WIDTHDRAW_HISTORY: "fund/withdraw-history",
  USER_LOGIN: "user/login",
  USER_LOGIN_HISTORY: "user/login-history",
  USER_REGISTER: "user/register",
  UPLOAD_AVATAR: "user/upload-avatar",
  USER_CHANGE_NAME: "user/change-username",
  USER_CHANGE_PASS: "user/change-password",
  USER_FORGOT_PASS: "user/forgot-password",
  USER_GET_2FA_KEYS: "user/get-2fa-key",
  USER_ENABLE_2FA: "user/enable-2fa",
  USER_DISABLE_2FA: "user/disable-2fa",
  USER_VERIFY_EMAIL: "user/verify-email",
  USER_RESET_PASSWORD: "user/reset-password",
  USER_GET_2FA_TOKEN: "user/get-2fa-token",
  USER_REFRESH_TOKEN: "user/refresh-token",
  GET_CURRENCY_LIST: "table/currency",
  GET_PRODUCT_LIST: "table/product",
  AFILIATE_COMMISSION_HISTORY: "affiliate/commission-history",
  AFILIATE_MEMBER_COMMISSION: "affiliate/members-commission",
  AFILIATE_COMMISSION: "affiliate/commission",
  AFILIATE_GETMEMBER: "affiliate/get-members",
  CREATE_SWAP: "swap/create-swap",
  SWAP_HISTORY: "swap/swap-history",

  //latest game
  LATEST_ALL_GAME: "game/latest-all-game",
  NEW_DICE_LATEST_ROLL: "game/latest-new-dice",
  DICE_LATEST_ROLL: "game/latest-dice",
  SLOTS_LATEST_GAME: "game/latest-slot",
  MOON_LATEST_GAME: "game/latest-moon",

  //mygame
  NEW_DICE_MYGAME: "game/my-game-new-dice",
  MOON_MYGAME: "game/my-game-moon",
  SLOT_MYGAME: "game/my-game-slot",
  DICE_MYGAME: "game/my-game-dice",

  //highest profit
  MOON_HIGHEST_PROFIT: "game/highest-moon",
  DICE_HIGHEST_PROFIT: "game/highest-dice",
  SLOTS_HIGHEST_PROFIT: "game/highest-slot",
  NEW_DICE_HIGHEST_PROFIT: "game/highest-new-dice",
  ALLGAME_HIGHEST_PROFIT: "game/highest-all-game",
};
export const API_METHOD = {
  GET: "GET",
  POST: "POST",
  PUT: "PUT",
  DELETE: "DELETE",
};

// env

export const BASE_URL = process.env.BASE_URL;
export const IP_TOKEN = process.env.IP_TOKEN;
export const BASE_URL_API = `${process.env.BASE_URL}api/`;

export const USDT = "USDT";
export const cookieN = "_hashToken";

export const newDiceBtnStatusCode = {
  ROLL: "ROLL",
  STOP: "STOP",
  AUTO: "AUTO",
};

export const moonGameAllStates = {
  FINISH: "FINISH",
  CASHOUT: "CASHOUT",
  RUN: "RUN",
  READY: "READY",
  WAIT: "WAIT",
  PLAYING: "PLAYING",
};

export const Constants = {
  REELS: 3,
  SYMBOLS: 3,
  REELS_REPEAT: 10,
};

export const demoBalance = [
  {
    currency: "USDT",
    amount: 200,
  },
  {
    currency: "SPC",
    amount: 200,
  },
];

export const walletType = {
  DEPOSITE: "_DEPOSIT",
  WITHDRAW: "_WITHDRAW",
};

export const pagingSample = {
  _data: [],
  _column: [],
  _pagination: {
    current: 1,
    pageSize: 10,
  },
};

export const ENOUGHBALANCE_CODE = "WSER002";
export const GAME_RUNNING = "WSER004";
export const REQUIRED_2FA = "USER009";

export const BITWIN_AUTH = "BITWIN_AUTH";

export const baseQuery = {
  page: 1,
  limit: 10,
};

export const accepList = [
  "image/jpeg",
  "image/JPEG",
  "image/jpg",
  "image/JPG",
  "image/png",
  "image/PNG",
  "image/gif",
  "image/GIF",
];

export const ggAddress = ({ email, key }) => {
  return "otpauth://totp/BitWin:" + email + "?secret=" + key + "&issuer=BitWin";
};

export const menuLeftListNoneLogin = (intl) => [
  {
    title: `${intl.formatMessage(translationsComponents.HOME_PAGE)}`,
    icon: <i className="fas fa-home" />,
    path: `${pathName._HOME}`,
  },
  {
    title: `${intl.formatMessage(translationsComponents.DICE_GAME)}`,
    icon: <i className="fas fa-dice" />,
    path: `${pathName._DICE}`,
  },
  {
    title: `${intl.formatMessage(translationsComponents.MOON_GAME)}`,
    icon: <i className="fas fa-rocket" />,
    path: `${pathName._MOON}`,
  },
  {
    title: `${intl.formatMessage(translationsComponents.SLOTS_GAME)}`,
    icon: <i className="fas fa-puzzle-piece" />,
    path: `${pathName._SLOTS}`,
  },
  {
    title: `${intl.formatMessage(translationsComponents.NEW_DICE)}`,
    icon: <i className="fas fa-dice" />,
    path: `${pathName._NEW_DICE}`,
  },
];

export const menuLeftListLogged = (intl) => [
  {
    title: "home",
    icon: <i className="fas fa-home" />,

    path: `${pathName._HOME}`,
    children: null,
  },
  {
    title: `${intl.formatMessage(translationsComponents.DICE_GAME)}`,
    icon: <i className="fas fa-dice" />,

    path: `${pathName._DICE}`,
    children: null,
  },
  {
    title: `${intl.formatMessage(translationsComponents.MOON_GAME)}`,
    icon: <i className="fas fa-rocket" />,
    path: `${pathName._MOON}`,
    children: null,
  },
  {
    title: `${intl.formatMessage(translationsComponents.SLOTS_GAME)}`,
    icon: <i className="fas fa-puzzle-piece" />,

    path: `${pathName._SLOTS}`,
    children: null,
  },
  {
    title: `${intl.formatMessage(translationsComponents.NEW_DICE)}`,
    icon: <i className="fas fa-dice" />,

    path: `${pathName._NEW_DICE}`,
    children: null,
  },
  {
    title: `${intl.formatMessage(translationsComponents.AFFILIATE)}`,
    icon: <i className="fab fa-connectdevelop" />,

    path: `${pathName._AFFILIATE}`,
    children: null,
  },
  {
    title: `${intl.formatMessage(translationsComponents.WALLET)}`,
    icon: <i className="fas fa-wallet" />,
    children: [
      {
        title: `${intl.formatMessage(translationsComponents.BALANCE)}`,
        icon: <i className="fab fa-affiliatetheme" />,
        path: `${pathName._BALANCE}`,
      },
      {
        title: `${intl.formatMessage(translationsComponents.SWAP)}`,
        icon: <i className="fab fa-affiliatetheme" />,
        path: `${pathName._SWAP}`,
      },
      {
        title: `${intl.formatMessage(translationsComponents.DEPOSITE)}`,
        icon: <i className="fab fa-affiliatetheme" />,
        path: `${pathName._DEPOSITE}`,
      },
      {
        title: `${intl.formatMessage(translationsComponents.WITH_DRAW)}`,
        icon: <i className="fab fa-affiliatetheme" />,
        path: `${pathName._WITHDRAW}`,
      },
    ],
  },
  {
    title: `${intl.formatMessage(translationsComponents.SETTING)}`,
    icon: <i className="fas fa-cog" />,

    path: `${pathName._SETTING}`,
    children: null,
  },
];

export const navMenu = (intl, langLabel) => [
  {
    title: langLabel?.label,
    icon: <i className="fas fa-language" />,
    tag: "lang",
    path: "/",
  },
  {
    title: `${intl.formatMessage(translationsComponents.BEGINER_GUIDE)}`,
    icon: <i className="fab fa-bitcoin" />,
    tag: "guide",
    path: "/",
  },
  {
    title: <i className="fas fa-comment-alt" />,
    icon: "",
    tag: "chating",
    path: "",
  },
  {
    title: `${intl.formatMessage(translationsComponents.LOG_IN)}`,
    icon: "",
    tag: "login",
    path: `${pathName._LOGIN}`,
  },
  {
    title: `${intl.formatMessage(translationsComponents.SIGN_UP)}`,
    icon: "",
    tag: "signup",
    path: `${pathName._SIGNUP}`,
  },
];

export const navMenu_login_mobile = [
  {
    title: null,
    icon: <i className="fab fa-bitcoin" />,
    tag: "dropdown",
    path: "menuLeft",
  },
  {
    title: null,
    icon: <i className="fas fa-home" />,
    tag: "home",
    path: `${pathName._HOME}`,
  },
  {
    title: null,
    icon: <i className="fas fa-user" />,
    tag: "dropdown",
    path: "menuRight",
  },
];
export const navMenu_login = (intl, langLabel) => [
  {
    title: langLabel?.label,
    icon: <i className="fas fa-language" />,
    tag: "lang",
    path: "/",
  },
  {
    title: 1000,
    icon: <i className="fab fa-bitcoin" />,
    tag: "guide",
    path: "/",
  },
  {
    title: <i className="fas fa-comment-alt" />,
    icon: "",
    tag: "chating",
    path: "",
  },
  {
    title: `${intl.formatMessage(translationsComponents.USER_NAME)}`,

    icon: <i className="fas fa-user" />,
    tag: "username",
    path: `${pathName._LOGIN}`,
  },
];

export const listMenuNoneLogin = (intl) => [
  {
    title: `${intl.formatMessage(translationsComponents.LOG_IN)}`,
    tag: "login",
    icon: <i className="fas fa-user" />,
    path: pathName._LOGIN,
  },
  {
    title: `${intl.formatMessage(translationsComponents.SIGN_UP)}`,
    tag: "signup",
    icon: <i className="fas fa-user-plus" />,
    path: pathName._SIGNUP,
  },
];

export const listMenuLoggedin = (intl) => [
  {
    title: "email@gmail.com",
    tag: "account",
    icon: <i className="fas fa-user" />,
    path: pathName._HOME,
  },
  {
    title: `${intl.formatMessage(translationsComponents.BETTING_HISTORY)}`,
    tag: "history",
    icon: <i className="fas fa-history" />,
    path: pathName._BETTING_HISTORY,
  },
  {
    title: `${intl.formatMessage(translationsComponents.SETTING)}`,
    tag: "setting",
    icon: <i className="fas fa-cog" />,
    path: pathName._SETTING,
  },
  {
    title: `${intl.formatMessage(translationsComponents.TELL_A_FRIEND)}`,
    tag: "tellfriend",
    icon: <i className="fas fa-handshake" />,
    path: pathName._AFFILIATE,
  },
  {
    title: `${intl.formatMessage(translationsComponents.LOG_OUT)}`,
    tag: "logout",
    icon: <i className="fas fa-sign-out-alt" />,
    path: pathName._LOGIN,
  },
];
