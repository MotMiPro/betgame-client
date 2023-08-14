import GameSlider from "../mainGame";
import { useHistory } from "react-router-dom";
import React, { Fragment } from "react";
import BanerHome from "../../presentations/banner";
import { pathName } from "../../../settings/constants";
// import GeneralTable from "./GeneralTable";

const OpenerPage = () => {
  let history = useHistory();

  return (
    <Fragment>
      <section
        onClick={() => {
          history.push(pathName._MOON);
        }}
      >
        <BanerHome />
      </section>
      <GameSlider history={history} />
      {/* <GeneralTable /> */}
    </Fragment>
  );
};

export default OpenerPage;
