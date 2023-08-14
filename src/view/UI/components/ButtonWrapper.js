import { Button } from "antd";
import styled, { css } from "styled-components";
import { appColor } from "../../../settings/constants";

const ButtonWrapper = styled(Button)`
  border-radius: ${(props) => (props.border ? props.border + "px" : "8px")};
  min-width: 150px;
  height: 40px;
  text-transform: uppercase;
  ${(props) => {
    let cBorder = "none",
      cBackgroundColor = appColor.lightgray,
      cColor = appColor.white;
    if (!props.disabled) {
      switch (props.type) {
        case "primary":
          cBorder = `none`;
          cBackgroundColor = `${appColor.textPrimaryColor}`;
          cColor = appColor.textWhiteColor;
          break;
        case "sos":
          if (props.ghost) {
            cBorder = `solid 1px ${appColor.red}`;
            cBackgroundColor = `${appColor.white}`;
            cColor = appColor.red;
          } else {
            cBackgroundColor = appColor.red;
          }
          break;
        case "secondary":
          if (props.ghost) {
            cBorder = `solid 1px ${appColor.blue}`;
            cBackgroundColor = `${appColor.white}`;
            cColor = appColor.blue;
          } else {
            cBackgroundColor = appColor.blue;
          }
          break;
        case "thirdary":
          if (props.ghost) {
            cBorder = `solid 1px ${appColor.blue2}`;
            cBackgroundColor = `${appColor.white}`;
            cColor = appColor.blue2;
          } else {
            cBackgroundColor = appColor.blue2;
          }
          break;

        default:
          return null;
      }
    }
    return css`
      && {
        background-color: ${cBackgroundColor};
        color: ${cColor};
        border: ${cBorder};
        &:hover {
          border: ${cBorder};
          background-color: ${cBackgroundColor};
          color: ${cColor};
        }
      }
    `;
  }};
`;
export default ButtonWrapper;
