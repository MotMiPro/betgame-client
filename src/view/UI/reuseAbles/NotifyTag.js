import React from "react";
import { useHistory } from "react-router-dom";
import { appColor, pathName } from "../../../settings/constants";
import { ButtonWrapper } from "../components/antComponents";

export function SuccessRequest({ url }) {
  const history = useHistory();
  return (
    <div>
      <div
        style={{
          fontSize: 65,
          color: appColor.textPrimaryColor,
        }}
      >
        <i className="far fa-check-circle" />
      </div>
      <div
        style={{
          padding: "0 0 25px 0",
        }}
      >
        <div
          style={{
            color: appColor.textPrimaryColor,
            fontSize: 24,
          }}
        >
          success!
        </div>
        <div>Your request have been confirmed</div>
      </div>
      <div
        style={{
          padding: "15px 0",
        }}
      >
        <ButtonWrapper
          onClick={() => history.push(`${url ? url : pathName._HOME}`)}
          type="primary"
          style={{
            maxWidth: 200,
            width: "100%",
          }}
        >
          Continue
        </ButtonWrapper>
      </div>
    </div>
  );
}

export function FailRequest() {
  const history = useHistory();
  return (
    <div>
      <div
        style={{
          fontSize: 65,
          color: appColor.orange,
        }}
      >
        <i className="fas fa-exclamation-triangle" />
      </div>
      <div
        style={{
          padding: "0 0 25px 0",
        }}
      >
        <div
          style={{
            color: appColor.orange,
            fontSize: 24,
          }}
        >
          oops!
        </div>
        <div>Sorry something went wrong</div>
      </div>
      <div
        style={{
          padding: "15px 0",
        }}
      >
        <ButtonWrapper
          onClick={() => history.push(`${pathName._HOME}`)}
          type="quaternary"
          style={{
            maxWidth: 200,
            width: "100%",
          }}
        >
          Back Home
        </ButtonWrapper>
      </div>
    </div>
  );
}
