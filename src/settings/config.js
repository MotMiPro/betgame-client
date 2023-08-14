import BTC from "~/assets/images/coins/btc.svg";
import ETH from "~/assets/images/coins/eth.svg";
import BIT from "~/assets/images/coins/bitwin.svg";
import DAS from "~/assets/images/coins/dash.svg";
import LIT from "~/assets/images/coins/lite.svg";
import MON from "~/assets/images/coins/monero.svg";

// import BTC from "~/assets/images/coins-png/btc.png";
// import ETH from "~/assets/images/coins-png/eth.png";
// import BIT from "~/assets/images/coins-png/bitwin.png";
// import DAS from "~/assets/images/coins-png/dash.png";
// import LIT from "~/assets/images/coins-png/lite.png";
// import MON from "~/assets/images/coins-png/monero.png";

import moonGameImg from "~/assets/images/gameBanners/moon-game.png";
import diceGameImg from "~/assets/images/gameBanners/dice-game.png";
import slotsGameImg from "~/assets/images/gameBanners/slots-game.png";
import slotRules from "~/assets/images/slots/slotRules.png";
export const imgAssets = {
  slot: slotRules,
};

import moment from "moment";
import { pathName } from "./constants";

export const languageList = [
  {
    label: "English",
    code: "en-US",
  },
  {
    label: "Korean",
    code: "ko-KR",
  },
  {
    label: "Vietnamese",
    code: "vi-VN",
  },
];

export const gameSlider = [
  {
    url: diceGameImg,
    label: "dice",
    path: `${pathName._DICE}`,
  },
  {
    url: moonGameImg,
    label: "moon",
    path: `${pathName._MOON}`,
  },
  {
    url: slotsGameImg,
    label: "slots",
    path: `${pathName._SLOTS}`,
  },
];

export const iconCollection = {
  0: BIT,
  1: BTC,
  2: ETH,
  3: MON,
  4: DAS,
  5: LIT,
};

export const parseTimer = (time, isfull) => {
  return isfull ? moment(time).format("LLL") : moment(time).format("LT");
};

export const statusCodeList = {
  USER001: {
    code: "USER001",
    message: "Invalid user name",
  },
  USER002: {
    code: "USER002",
    message: "Invalid user name",
  },
  USER003: {
    code: "USER003",
    message: "Invalid password",
  },
  USER004: {
    code: "USER004",
    message: "User already exist",
  },
  USER005: {
    code: "USER005",
    message: "Invalid referral id",
  },
};

export const socketTypes = {
  WALLET_BALANCE: "WALLET.BALANCE",
  MAIN_ALL_GAME: "MAIN.ALL_GAME",
  MAIN_HIGHEST_PROFIT: "MAIN.HIGHEST_PROFIT",

  // chatting
  CHAT_NOTIFICATION: "CHAT.NOTIFICATION",
  CHAT_SEND_MESSAGE: "CHAT.SEND_MESSAGE",
  CHAT_MESSAGES: "CHAT.MESSAGES",

  // dice game
  DICE_ALL_GAME: "DICE.ALL_GAME",
  DICE_LATEST_GAME: "DICE.LATEST_GAME",
  DICE_HIGHEST_PROFIT: "DICE.HIGHEST_PROFIT",
  DICE_PLAY: "DICE.PLAY",
  DICE_RESULT: "DICE.RESULT",

  // slot game
  SLOT_ALL_GAME: "SLOT.ALL_GAME",
  SLOT_LATEST_GAME: "SLOT.LATEST_GAME",
  SLOT_HIGHEST_PROFIT: "SLOT.HIGHEST_PROFIT",
  SLOT_PLAY: "SLOT.PLAY",
  SLOT_RESULT: "SLOT.RESULT",

  // moon game
  MOON_ALL_GAME: "MOON.ALL_GAME",
  MOON_LATEST_GAME: "MOON.LATEST_GAME",
  MOON_HIGHEST_PROFIT: "MOON.HIGHEST_PROFIT",
  MOON_PLACE_BET: "MOON.PLACE_BET",
  MOON_LEAVE: "MOON.LEAVE",
  MOON_PLAYERS: "MOON.PLAYERS",
  MOON_STATE_WAIT: "MOON.STATE_WAIT",
  MOON_STATE_READY: "MOON.STATE_READY",
  MOON_STATE_RUN: "MOON.STATE_RUN",
  MOON_STATE_FINISH: "MOON.STATE_FINSH",
  MOON_TICK: "MOON.TICK",
  MOON_GET_STATE: "MOON.GET_STATE",
  MOON_RESULT: "MOON.RESULT",
  MOON_BALANCE: "MOON_BALANCE",
  MOON_PLAYER: "MOON.PLAYER",

  // new dice
  NEW_DICE_PLAY: "NEW_DICE.PLAY",
  NEW_DICE_RESULT: "NEW_DICE.RESULT",
  NEW_DICE_ALL_GAME: "NEW_DICE.ALL_GAME",
  NEW_DICE_LAST_GAME: "NEW_DICE.LAST_GAME",
  NEW_DICE_LATEST_GAME: "NEW_DICE.LATEST_GAME",
  NEW_DICE_HIGHEST_PROFIT: "NEW_DICE.HIGHEST_PROFIT",

  //mygame
  NEW_DICE_MY_GAME: "NEW_DICE.MY_GAME",
  MOON_MY_GAME: "MOON.MY_GAME",
  SLOT_MY_GAME: "SLOT.MY_GAME",
  DICE_MY_GAME: "DICE.MY_GAME",
};

export const ACTIVE = "_ACTIVE";
export const DISABLE = "_DISABLE";
export const DEFAULT = "_DEFAULT";

export const cointList = [
  {
    name: "bitwin",
    src: BIT,
    isActive: DEFAULT,
    id: 0,
  },
  {
    name: "bitcoin",
    src: BTC,
    isActive: DEFAULT,
    id: 1,
  },
  {
    name: "ethereum",
    src: ETH,
    isActive: DEFAULT,
    id: 2,
  },
  {
    name: "monerocoin",
    src: MON,
    isActive: DEFAULT,
    id: 3,
  },

  {
    name: "dashcoin",
    src: DAS,
    isActive: DEFAULT,
    id: 4,
  },
  {
    name: "litecoin",
    src: LIT,
    isActive: DEFAULT,
    id: 5,
  },
];

export const mockSlotData = {
  hits: [
    [false, false, false],
    [false, false, false],
    [false, false, false],
  ],
  multipliers: [0],
  numbers: [
    [
      { num: 3, class: `coin-current` },
      { num: 5, class: `coin-current` },
      { num: 2, class: `coin-current` },
      { num: 0, class: `coin-current` },
      { num: 1, class: `coin-current` },
      { num: 2, class: `coin-current` },
      { num: 3, class: `coin-current` },
      { num: 4, class: `coin-current` },
      { num: 5, class: `coin-current` },
    ],
    [
      { num: 1, class: `coin-current` },
      { num: 3, class: `coin-current` },
      { num: 0, class: `coin-current` },
      { num: 0, class: `coin-current` },
      { num: 1, class: `coin-current` },
      { num: 2, class: `coin-current` },
      { num: 3, class: `coin-current` },
      { num: 4, class: `coin-current` },
      { num: 5, class: `coin-current` },
    ],
    [
      { num: 3, class: `coin-current` },
      { num: 5, class: `coin-current` },
      { num: 2, class: `coin-current` },
      { num: 0, class: `coin-current` },
      { num: 1, class: `coin-current` },
      { num: 2, class: `coin-current` },
      { num: 3, class: `coin-current` },
      { num: 4, class: `coin-current` },
      { num: 5, class: `coin-current` },
    ],
  ],
};
