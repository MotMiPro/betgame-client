import styled, { css } from "styled-components";
import { appColor } from "~/settings/constants";
import React from "react";
import {
  Input,
  Select,
  Form,
  Button,
  DatePicker,
  Col,
  Row,
  Card,
  InputNumber,
  Switch,
  Badge,
  Slider,
} from "antd";
const { Option } = Select;

export const InputWrapper = styled(Input)`
  background-color: ${(props) => {
    props.bgColor;
  }};
  border-radius: 8px;
  border: none;
  width: 100%;
  input {
    background-color: transparent;
    color: whitesmoke;
  }
  .ant-input {
    background-color: transparent !important;
  }
`;

export const SliderWrapper = styled(Slider)`
  .ant-slider-rail {
    background-color: ${(props) =>
      props.isRollOver ? appColor.textPrimaryColor : appColor.red};
  }
  .ant-slider-track {
    background-color: ${(props) =>
      props.isRollOver ? appColor.red : appColor.textPrimaryColor} !important;
  }
  &:hover .ant-slider-track {
    background-color: ${(props) =>
      props.isRollOver ? appColor.red : appColor.textPrimaryColor};
  }
  &:hover .ant-slider-rail {
    background-color: ${(props) =>
      props.isRollOver ? appColor.textPrimaryColor : appColor.red};
  }
`;

// export const InputNumberWrapper = () => {
//   return (
//     <InputNumbers
//       decimalSeparator
//       pattern="[0-9]*"
//       inputMode="numeric"
//       type="number"
//     />
//   );
// };

export const InputNumberWrapper = styled(InputNumber)`
  border-radius: 5px;
  background: ${appColor.bgPrimaryColor};
  height: 40px;
  line-break: 40px;
  color: ${appColor.textSecondaryColor};
  width: 100%;
  .ant-input-number-handler-wrap {
    display: none;
  }
`;
export const RangePickerWrapper = styled(DatePicker.RangePicker)`
  border-radius: 5px;
`;
export const FormWrapper = styled(Form)``;
export const FormItemWrapper = styled(Form.Item)``;
export const FormListWrapper = styled(Form.List)``;

export const ColWrapper = styled(Col)``;
export const RowWrapper = styled(Row)``;
export const CardWrapper = styled(Card)``;
export const SwitchWrapper = styled(Switch)`
  border-radius: 5px;
`;
export const BadgeWrap = styled(Badge)`
  .ant-scroll-number-only {
    height: 100%;
  }
`;

export const PureButtonWrapper = styled(Button)``;
export const ButtonWrapper = styled(Button)`
  border-radius: ${(props) => (props.border ? props.border + "px" : "8px")};
  max-width: 150px;
  height: 35px;
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
        case "quaternary":
          if (props.ghost) {
            cBorder = `solid 1px ${appColor.orange}`;
            cBackgroundColor = `${appColor.orange}`;
            cColor = appColor.white;
          } else {
            cBackgroundColor = appColor.orange;
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

export const SelectWrapper = (props) => {
  const {
    selectList = [],
    handleChange,
    placeholder,
    style,
    className,
    value,
    allowClear = true,
  } = props;
  return (
    <Dropdown
      allowClear={allowClear}
      className={className}
      defaultValue={value}
      onChange={handleChange}
      placeholder={placeholder}
      style={{ ...style }}
    >
      {selectList.map((option, index) => {
        return (
          <Option key={index} value={option.value}>
            {option.label}
          </Option>
        );
      })}
    </Dropdown>
  );
};

const Dropdown = styled(Select)`
  .ant-select-selector {
    border: 0 !important;
    background: transparent !important;
  }
  span.ant-select-arrow {
    color: ${appColor.textSecondaryColor};
  }
`;
