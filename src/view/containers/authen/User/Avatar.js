import { message, Progress } from "antd";
import React, { useCallback, useState } from "react";
import { useIntl } from "react-intl";
import { useDispatch, useSelector } from "react-redux";
import styled from "styled-components";
import { useFetchAPI } from "~/customHooks/useFetchAPI";
import translationsComponents from "~/languageProvider/translateKeys";
import { accepList, API_METHOD, appColor, pathAPI } from "~/settings/constants";
import { DISPATCH_TYPE } from "~/state/ducks/types";
import { getBase64 } from "~/ultils/parseB64";
import { InputWrapper } from "~/view/UI/components/antComponents";

function UserAvatar() {
  const intl = useIntl();
  const dispatch = useDispatch();
  const { userInfos } = useSelector((state) => state.userReducer);

  const [isUploading, setIsUploading] = useState(false);
  const [percentUpload, setpercentUpload] = useState(0);
  const [imgSrc, setImgSrc] = useState(userInfos?._avatar);
  const { fetchDataEvent } = useFetchAPI();

  const avatarLabel = `${intl.formatMessage(
    translationsComponents.CHANGE_AVARTAR
  )}`;
  const avatarLabelSuccess = `${intl.formatMessage(
    translationsComponents.CHANGE_AVARTAR_SUCCESS
  )}`;
  const avatarLabelError = `${intl.formatMessage(
    translationsComponents.CHANGE_AVARTAR_ERROR
  )}`;
  const avatarLabelFile = `${intl.formatMessage(
    translationsComponents.CHANGE_AVARTAR_WARNING_FILE
  )}`;
  const avatarLabelSize = `${intl.formatMessage(
    translationsComponents.CHANGE_AVARTAR_WARNING_SIZE
  )}`;

  const handlePercent = useCallback((progressEvent) => {
    const totalLength = progressEvent.lengthComputable
      ? progressEvent.total
      : progressEvent.target.getResponseHeader("content-length") ||
        progressEvent.target.getResponseHeader("x-decompressed-content-length");

    if (totalLength !== null) {
      const percentCompleted = Math.round(
        (progressEvent.loaded * 100) / totalLength
      );
      setpercentUpload(percentCompleted);
      if (percentCompleted === 100) {
        setTimeout(() => {
          setpercentUpload(0);
        }, 1000);
      }
    }
  }, []);

  const handleUploadAvatar = async (file) => {
    try {
      setIsUploading(true);
      const sendData = new FormData();
      sendData.append("image", file);
      const uploadResult = await fetchDataEvent({
        endpoint: pathAPI.UPLOAD_AVATAR,
        method: API_METHOD.POST,
        sendData,
        config: (event) => handlePercent(event),
      });
      if (uploadResult?.status) {
        dispatch({
          type: DISPATCH_TYPE.MODIFY_AVATAR,
          payload: uploadResult?.fetchData?.avatar,
        });
        message.success(avatarLabelSuccess);
      }
      if (!uploadResult?.status) {
        const errMess = uploadResult?.fetchData;
        console.log({ errMess });
      }
      setIsUploading(false);
    } catch (error) {
      message.error(avatarLabelError);
      console.log({ error });
      setIsUploading(false);
    }
  };

  const handleChange = async (event) => {
    try {
      const file = event.target.files[0];
      if (file) {
        const isJpgOrPng = accepList.includes(file.type);
        if (!isJpgOrPng) {
          message.error(avatarLabelFile);
        }
        const isLt2M = file.size / 1024 / 1024 < 4;
        if (!isLt2M) {
          message.error(avatarLabelSize);
        }
        const result = await getBase64(file);
        if (result && isLt2M) {
          setImgSrc(result);
          handleUploadAvatar(file);
        }
      }
    } catch (error) {
      console.log({ error });
    }
  };

  return (
    <div style={{ position: "relative" }}>
      <Label>{avatarLabel}</Label>
      <Wrapper
        style={{
          pointerEvents: isUploading ? "none" : "all",
        }}
      >
        <AvatarWrapper>
          {percentUpload > 0 && percentUpload < 101 && (
            <ProgressWrapper
              type="circle"
              strokeColor={{
                "0%": "#108ee9",
                "100%": "#87d068",
              }}
              width={150}
              height={150}
              percent={percentUpload}
              style={{
                color: appColor.textSecondaryColor,
              }}
            />
          )}
          {imgSrc && (
            <img
              style={{
                width: "100%",
                height: "100%",
              }}
              src={imgSrc}
            />
          )}
          <div className="upload-button">
            <InputWrapper
              type="file"
              style={{
                opacity: 0,
                width: "100%",
                height: "100%",
                cursor: "pointer",
              }}
              accept="image/*"
              onChange={handleChange}
            />
          </div>
        </AvatarWrapper>
      </Wrapper>
    </div>
  );
}

export default React.memo(UserAvatar);

const Wrapper = styled.div`
  box-shadow: 1px 1px 15px -5px ${appColor.textPrimaryColor};
  padding: 12px;
  width: max-content;
  border-radius: 100%;
  margin: 10px auto;
`;

const Label = styled.div`
  padding-bottom: 20px;
  color: ${appColor.textSecondaryColor};
`;

const ProgressWrapper = styled(Progress)`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  margin: auto;
  span.ant-progress-text {
    color: ${appColor.orange};
  }
`;

const AvatarWrapper = styled.div`
  position: relative;
  height: 150px;
  width: 150px;
  border-radius: 50%;
  overflow: hidden;
  transition: all 0.3s ease;
  &:hover {
    transform: scale(1.05);
    cursor: pointer;
  }
  .profile-pic {
    height: 100%;
    width: 100%;
    transition: all 0.3s ease;
    object-fit: cover;
  }
  .upload-button {
    position: absolute;
    top: 0;
    left: 0;
    height: 100%;
    width: 100%;
  }
`;
