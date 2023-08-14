import React from "react";
import { isMobile } from "react-device-detect";
import { useHistory } from "react-router";
import { appColor, pathName } from "~/settings/constants";

function DepositWaring() {
  const history = useHistory();
  return (
    <div
      style={{
        position: "relative",
        top: isMobile ? 70 : 5,
        zIndex: 10,
        width: "100%",
      }}
    >
      <div
        style={{
          backgroundColor: "rgba(231, 76, 60,1.0)",
          padding: "5px 10px",
          color: appColor.white,
        }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <span>Make your first deposit now and collect up FREE SPINS!</span>
          <span
            style={{
              borderRadius: 5,
              border: `1px solid #fff`,
              padding: "5px 10px",
              cursor: "pointer",
              whiteSpace: "nowrap",
            }}
            onClick={() => history.push(pathName._DEPOSITE)}
          >
            <i className="fas fa-arrow-circle-right" /> Deposit now
          </span>
        </div>
      </div>
    </div>
  );
}

export default DepositWaring;
