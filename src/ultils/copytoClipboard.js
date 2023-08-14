import { pushNotification } from "~/ultils/pushNotifications";

export const copyToClipboard = (text) => {
  return navigator.clipboard.writeText(text).then(
    () => {
      pushNotification({
        mess: "Copying to clipboard was successful!",
        title: "Notification",
        type: "success",
      });
    },
    () => {
      pushNotification({
        mess: "Could not copy text!",
        title: "Notification",
        type: "error",
      });
    }
  );
};
