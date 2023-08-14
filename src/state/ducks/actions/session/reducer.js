import { DISPATCH_TYPE } from "../../types";

const initialState = {
  isLoading: false,
  locale: "en-US",
  showChating: false,
  showSetting: false,
  showDropDownRight: false,
};

const sessionReducer = (state = initialState, { type, payload }) => {
  switch (type) {
    case DISPATCH_TYPE.LOADING:
      return {
        ...state,
        isLoading: payload,
      };
    case DISPATCH_TYPE.CHANGE_LOCALE:
      return {
        ...state,
        locale: payload,
      };
    case DISPATCH_TYPE.SHOW_CHATTING:
      return {
        ...state,
        showChating: payload,
        showSetting: false,
      };
    case DISPATCH_TYPE.SHOW_PANEL_SETTING:
      return {
        ...state,
        showSetting: payload,
        showChating: false,
      };
    case DISPATCH_TYPE.MOBILE_MENU_SHOWABLE:
      return {
        ...state,
        showDropDownRight: payload,
      };
    default:
      return state;
  }
};

export default sessionReducer;
