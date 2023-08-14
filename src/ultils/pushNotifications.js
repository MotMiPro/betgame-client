import { notification } from "antd";

export const pushNotification = ({ mess, title, time = 5, type }) => {
  const args = {
    message: title ?? "",
    description: mess,
    duration: time,
  };
  type ? notification[type](args) : notification.open(args);
};
