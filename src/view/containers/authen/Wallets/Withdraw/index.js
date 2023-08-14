import React from "react";
import WithdrawViewHeader from "./WithdrawViewHeader";
import WithDrawHistory from "./WithDrawHistory";
import { useSelector } from "react-redux";

const WithDrawTransaction = () => {
  const { authHeader } = useSelector((state) => state.userReducer);

  return (
    <main>
      <WithdrawViewHeader getHeader={authHeader} />
      <WithDrawHistory getHeader={authHeader} />
    </main>
  );
};
export default React.memo(WithDrawTransaction);
