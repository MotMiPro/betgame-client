import { DISPATCH_TYPE } from "../../types";

export const userChangeLocale = (locale) => ({
  type: DISPATCH_TYPE.CHANGE_LOCALE,
  payload: locale,
});
export const userOpenChatting = (status) => ({
  type: DISPATCH_TYPE.SHOW_CHATTING,
  payload: status,
});
export const userOpenPanel = (status) => ({
  type: DISPATCH_TYPE.SHOW_PANEL_SETTING,
  payload: status,
});
export const mobileUserClosePanel = (status) => ({
  type: DISPATCH_TYPE.MOBILE_MENU_SHOWABLE,
  payload: status,
});
