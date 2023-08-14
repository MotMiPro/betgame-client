import styled from "styled-components";
import React from "react";
import { appColor } from "~/settings/constants";

export const SpeakerComponent = ({ isActive }) => {
  return isActive ? (
    <Speaker isActive={isActive}>
      <span className="speaker -on" />
    </Speaker>
  ) : (
    <Speaker isActive={isActive}>
      <span className="speaker -off" />
    </Speaker>
  );
};

const Speaker = styled.div`
  background-color: ${(props) =>
    props.isActive ? appColor.textPrimaryColor : "#272931"};
  max-width: 50px;
  padding: 5px;
  border-radius: 5px;
  cursor: pointer;
  color: white;
  width: 150px;
  /* margin: 0 auto; */
  transition: all 0.5s ease-in-out;
  .speaker {
    vertical-align: middle;
    box-sizing: border-box;
    display: inline-block;
    background: currentColor;
    background-clip: content-box;
    width: 1em;
    height: 1em;
    border: 0.333em solid transparent;
    border-right-color: currentColor;
    position: relative;
    left: -0.337em;
    transition: all 0.5s ease-in-out;
  }

  .speaker.-on:before,
  .speaker.-on:after {
    content: "";
    background: currentColor;
    width: 0.1em;
    position: absolute;
  }
  .speaker.-on:before {
    height: 0.333em;
    right: -0.533em;
  }
  .speaker.-on:after {
    height: 0.667em;
    right: -0.733em;
    top: -50%;
  }
  .speaker.-off:before,
  .speaker.-off:after {
    content: "";
    background: currentColor;
    width: 0.1em;
    position: absolute;
    height: 1.2em;
    margin-top: -0.333em;
    top: -0.1em;
    left: 0.1em;
    transform: translateX(0.333em) rotate(-45deg);
  }
  .speaker.-off:before {
    background: #04233d;
    left: 0.2em;
  }
`;
