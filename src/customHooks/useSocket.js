import io from "socket.io-client";
import { BASE_URL } from "~/settings/constants";

let socket;
let socketDice;
let socketSlot;
let socketMoon;
let socketChat;
let socketNewDice;

export const initiateSocket = (token, cb) => {
  const baseUrl = `${BASE_URL}`;
  socket = token ? io(baseUrl, token) : io(baseUrl);
  if (socket.active) {
    cb(true);
  }
};

export const socketEmitter = (type, data, cb) => {
  if (!socket) return true;
  socket.emit(type, data, (err) => {
    return cb(err);
  });
};

export const disconnectSocket = () => {
  if (socket) socket.disconnect();
};

export const socketSubscriber = (type, cb) => {
  if (!socket) return true;
  socket.on(type, ({ data }) => {
    return cb(data);
  });
};

//dice game

export const initiatesocketDice = (token, cb) => {
  const diceUrl = `${BASE_URL}dice`;
  socketDice = token ? io(diceUrl, token) : io(diceUrl);
  if (socketDice.active) {
    cb(true);
  }
};

export const diceSocketEmitter = (type, data, cb) => {
  if (!socketDice) return true;
  socketDice.emit(type, data, (err) => {
    return cb(err);
  });
};

export const diceDisconnectSocket = () => {
  // console.log("Disconnecting socket...");
  if (socketDice) socketDice.disconnect();
};

export const diceSocketSubscriber = (type, cb) => {
  if (!socketDice) return true;
  socketDice.on(type, ({ data }) => {
    return cb(data);
  });
};

//new dice game

export const initiateSocketNewDice = (token, cb) => {
  const baseUrl = `${BASE_URL}newdice`;
  socketNewDice = io(baseUrl, token);
  if (socketNewDice.active) {
    cb(true);
  }
};

export const disconnectSocketNewDice = () => {
  if (socketNewDice) socketNewDice.disconnect();
};

export const newDiceSocketEmitter = (type, data, cb) => {
  if (!socketNewDice) return true;
  socketNewDice.emit(type, data, (err) => {
    return cb(err);
  });
};

export const newDiceSocketSubscriber = (type, cb) => {
  if (!socketNewDice) return true;
  socketNewDice.on(type, ({ data }) => {
    return cb(data);
  });
};

//slot game
export const initiatesocketSlot = (token, cb) => {
  const slotsUrl = `${BASE_URL}slot`;
  socketSlot = io(slotsUrl, token);
  if (socketSlot.active) {
    cb(true);
  }
};

export const slotSocketEmitter = (type, data, cb) => {
  if (!socketSlot) return true;
  socketSlot.emit(type, data, (err) => {
    return cb(err);
  });
};

export const slotDisconnectSocket = () => {
  if (socketSlot) socketSlot.disconnect();
};

export const slotSocketSubscriber = (type, cb) => {
  if (!socketSlot) return true;
  socketSlot.on(type, ({ data }) => {
    return cb(data);
  });
};

//moon game
export const initiateSocketMoon = (token, cb) => {
  const moonUrl = `${BASE_URL}moon`;
  socketMoon = token ? io(moonUrl, token) : io(moonUrl);
  if (socketMoon.active) {
    cb(true);
  }
};

export const moonSocketEmitter = (type, data, cb, cbSuccess = null) => {
  if (!socketMoon) return true;
  socketMoon.emit(type, data, (err) => (err ? cb(err) : cbSuccess(true)));
};

export const moonDisconnectSocket = () => {
  // console.log("Disconnecting socket...");
  if (socketMoon) socketMoon.disconnect();
};

export const moonSocketSubscriber = (type, cb) => {
  if (!socketMoon) return true;
  socketMoon.on(type, ({ data }) => {
    return cb(data);
  });
};

//chatting

export const initiatesocketChat = (token) => {
  const chatUrl = `${BASE_URL}chat`;
  socketChat = token ? io(chatUrl, token) : io(chatUrl);
  // console.log(`Connecting socket chat...`);
};

export const chatSocketEmitter = (type, data, cb) => {
  if (!socketChat) return true;
  socketChat.emit(type, data, (err) => {
    return cb(err);
  });
};

export const chatDisconnectSocket = () => {
  // console.log("Disconnecting socket...");
  if (socketChat) socketChat.disconnect();
};

export const chatSocketSubscriber = (type, cb) => {
  if (!socketChat) return true;
  socketChat.on(type, ({ data }) => {
    return cb(data);
  });
};

//main

export const mainAllGameSocketSubscriber = (type, cb) => {
  if (!socket) return true;
  socket.on(type, ({ data }) => {
    return cb(data);
  });
};
