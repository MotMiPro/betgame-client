import Bowser from "bowser";
import publicIp from "public-ip";

export const getLocationByIP = async () => {
  try {
    const ip = await publicIp.v4();
    return ip;
  } catch (error) {
    return console.log(error);
  }
};

export const userAgentDetect = () => {
  const userAgent = navigator.userAgent;

  return Bowser.parse(userAgent);
};

export const getUID = () => {
  var navigator_info = window.navigator;
  var screen_info = window.screen;
  var uid = navigator_info.mimeTypes.length;
  uid += navigator_info.userAgent.replace(/\D+/g, "");
  uid += navigator_info.plugins.length;
  uid += screen_info.height || "";
  uid += screen_info.width || "";
  uid += screen_info.pixelDepth || "";
  return uid;
};
