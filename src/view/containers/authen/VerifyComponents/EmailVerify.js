import { useParams } from "react-router-dom";
import React, { useEffect, useState } from "react";
import { ScreenView } from "../../../UI/components";
import { parseUrlToQuery } from "~/ultils/parseQuery";
import { useFetchAPI } from "~/customHooks/useFetchAPI";
import NotFound from "../../../UI/components/NotFoundPage";
import { API_METHOD, appColor, pathAPI } from "~/settings/constants";
import { FailRequest, SuccessRequest } from "../../../UI/reuseAbles/NotifyTag";

const EmailVerification = () => {
  let { verifyCode } = useParams();
  const { fetchDataEvent } = useFetchAPI();
  const [iserrorUrl, setIserrorUrl] = useState(false);

  const [successUI, setSuccessUI] = useState(false);
  const [failedUI, setFailedUI] = useState(false);

  const handleVerifyEmail = async (code) => {
    try {
      if (code) {
        const data = fetchDataEvent({
          endpoint: `${pathAPI.USER_VERIFY_EMAIL}${parseUrlToQuery({
            hash: code,
          })}`,
          method: API_METHOD.GET,
        });
        if (data?.status) {
          setSuccessUI(true);
        }
        if (!data?.status) {
          setFailedUI(true);
        }
      } else {
        setIserrorUrl(true);
      }
    } catch (error) {}
  };

  useEffect(() => {
    handleVerifyEmail(verifyCode);
  }, [verifyCode]);

  return (
    <main
      style={{
        height: "calc(100vh - 64px)",
        display: "flex",
        justifyContent: "center",
        flexDirection: "column",
        alignItems: "center",
        color: appColor.textSecondaryColor,
        textAlign: "center",
      }}
    >
      {iserrorUrl ? (
        <NotFound />
      ) : (
        <ScreenView
          style={{
            maxWidth: "550px",
            height: "auto",
            width: "100%",
            textAlign: "center",
            padding: "10px 20px",
            borderRadius: 5,
            position: "relative",
            boxShadow: `rgba(0, 0, 0, 0.1) 0px 10px 50px`,
          }}
        >
          {successUI && <SuccessRequest />}
          {failedUI && <FailRequest />}
        </ScreenView>
      )}
    </main>
  );
};
export default EmailVerification;
