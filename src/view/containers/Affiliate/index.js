import React from "react";
import Commission from "./Commission";
import { MutualWrap } from "~/view/UI/reuseAbles";
import InviteFriends from "./InviteFriends";
import CommissionChart from "./CommissionChart";

function Affiliate() {
  return (
    <main>
      <InviteFriends />
      <MutualWrap>
        <CommissionChart />
      </MutualWrap>
      <Commission />
    </main>
  );
}

export default Affiliate;
