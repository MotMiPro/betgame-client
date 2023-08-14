import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { userOpenChatting } from "~/state/ducks/actions/session";

const ChatViewUI = () => {
  const dispatch = useDispatch();
  const { showChating } = useSelector((state) => state.sessionReducer);

  const handleChatting = () => {
    dispatch(userOpenChatting(showChating ? false : true));
  };
  return (
    <div onClick={handleChatting}>
      <i className="fas fa-comment-alt" />
    </div>
  );
};

export default React.memo(ChatViewUI);
