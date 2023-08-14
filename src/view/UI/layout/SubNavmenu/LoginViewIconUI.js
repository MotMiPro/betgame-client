import React, { Fragment } from "react";
import { useDispatch, useSelector } from "react-redux";
import { userOpenPanel } from "~/state/ducks/actions/session";

const LoginIcon = () => {
  const dispatch = useDispatch();
  const { showSetting } = useSelector((state) => state.sessionReducer);
  const { userInfos } = useSelector((state) => state.userReducer);

  const handlePanel = () => {
    dispatch(userOpenPanel(showSetting ? false : true));
  };

  return (
    <div onClick={handlePanel}>
      {userInfos ? (
        <Fragment>{userInfos?._user}</Fragment>
      ) : (
        <span>
          <i style={{ fontSize: 18 }} className="fas fa-user" />
        </span>
      )}
    </div>
  );
};

export default LoginIcon;
