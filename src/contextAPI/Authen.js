import React, { createContext, useState } from "react";
import { Modal, Spin } from "antd";
import { appColor, cookieN, USDT } from "~/settings/constants";
import styled from "styled-components";
import { getCookie } from "~/settings/cookies";
import { mockSlotData } from "~/settings/config";

export const RootContext = createContext();

export const ContextProvider = (props) => {
  const token = getCookie(cookieN);
  const [hasSoundEffect, setHasSoundEffect] = useState(false);
  const [username, setUsername] = useState(token ?? null);
  const [isloading, setIsloading] = useState(false);
  const [modalObject, setModalObject] = useState({
    state: false,
    title: null,
    modalContent: null,
    modalClass: "mutual-class",
    isCenter: true,
    modalStyle: { maxWidth: 520, width: "100%" },
    width: "100%",
  });
  const [currentUnit, setCurrentUnit] = useState(USDT);

  const [slotsSetting, setSlotsSetting] = useState({
    winList: mockSlotData?.numbers,
    multiList: null,
    isAnimateNumbers: false,
    highlightList: null,
    infiniteRun: 100,
    lines: 1,
  });

  const [currentBalance, setCurrentBalance] = useState([]);

  const [isDeposit, setIsDeposit] = useState(false);

  const [btnEvt, setBtnEvt] = useState({
    onClick: false,
  });

  const [isAnimateHits, setIsAnimateHits] = useState(false);

  const handleCancel = () => {
    setModalObject((modal) => ({ ...modal, state: false, modalContent: null }));
    return false;
  };

  return (
    <RootContext.Provider
      value={{
        username,
        isloading,
        updateUserName: (value) => {
          setUsername(value);
        },
        setWaiting: (value) => {
          setIsloading(value);
        },
        modalObject,
        setModalObject,
        setCurrentUnit,
        currentUnit,
        setSlotsSetting,
        slotsSetting,
        setBtnEvt,
        btnEvt,
        setIsAnimateHits,
        isAnimateHits,
        currentBalance,
        setCurrentBalance,
        setHasSoundEffect,
        hasSoundEffect,
        setIsDeposit,
        isDeposit,
      }}
    >
      <Spin
        tip="Loading..."
        spinning={isloading}
        style={{ maxHeight: "unset" }}
      >
        {props.children}
        <ModalWrapper
          maskClosable={false}
          style={{
            ...modalObject.modalStyle,
          }}
          footer={false}
          onCancel={handleCancel}
          title={<span>{modalObject.title}</span>}
          width={modalObject.width}
          visible={modalObject?.state}
          centered={modalObject.isCenter}
          className={modalObject.modalClass}
        >
          {modalObject.modalContent}
        </ModalWrapper>
      </Spin>
    </RootContext.Provider>
  );
};

const ModalWrapper = styled(Modal)`
  /* font-family: "monospace"; */
  .ant-modal-content,
  .ant-modal-header {
    background-color: ${appColor.bgSecondaryColor};
    color: white;
  }
  .ant-modal-header {
    border-bottom: 1px solid ${appColor.borderPrimaryColor};
    .ant-modal-title {
      color: white;
    }
  }
  button.ant-modal-close {
    color: white;
  }
`;
