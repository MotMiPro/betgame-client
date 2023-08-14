import React from "react";
// import { useSelector } from "react-redux";
// import { initiatesocketSlot } from "./useSocket";

export default function SocketProvider(props) {
  //   const { authHeader } = useSelector((state) => state.userReducer);
  //   useEffect(() => {
  //     initiatesocketSlot(authHeader, (type) => {
  //       console.log({ type });
  //     });
  //   }, []);
  return <section>{props.children}</section>;
}
