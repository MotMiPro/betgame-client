import { DISPATCH_TYPE } from "../../types";

const initialState = {
  allGame: null,
  lastestGame: null,
  highestGame: null,
  myGame: null,
};

const gamesReducer = (state = initialState, { type, payload }) => {
  switch (type) {
    case DISPATCH_TYPE.ALL_GAME_UPDATE:
      return {
        ...state,
        allGame: payload,
      };
    case DISPATCH_TYPE.LATEST_GAME_UPDATE:
      return {
        ...state,
        lastestGame: payload,
      };
    case DISPATCH_TYPE.HIGHEST_GAME_UPDATE:
      return {
        ...state,
        highestGame: payload,
      };
    case DISPATCH_TYPE.MY_GAME_UPDATE:
      return {
        ...state,
        myGame: payload,
      };
    default:
      return state;
  }
};

export default gamesReducer;
