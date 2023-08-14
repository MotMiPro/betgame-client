import { useParams } from "react-router-dom";
import { RootContext } from "~/contextAPI/Authen";
import { ScreenView } from "../../../UI/components";
import { useFetchAPI } from "~/customHooks/useFetchAPI";
import NotFound from "../../../UI/components/NotFoundPage";
import React, { useContext, useEffect, useState } from "react";
import { API_METHOD, appColor, pathAPI } from "~/settings/constants";
import { FailRequest, SuccessRequest } from "../../../UI/reuseAbles/NotifyTag";

const FundWithdraw = () => {
  let { withdrawToken } = useParams();

  const [iserrorUrl, setIserrorUrl] = useState(false);
  const { setWaiting } = useContext(RootContext);
  const [successUI, setSuccessUI] = useState(false);
  const [failedUI, setFailedUI] = useState(false);

  const { fetchDataEvent } = useFetchAPI();

  const handleConfirmWithdraw = async (code) => {
    try {
      if (code) {
        const data = await fetchDataEvent({
          endpoint: `${pathAPI.WITHDRAWAL}/${code}`,
          method: API_METHOD.PUT,
          sendData: null,
        });
        if (data?.status) {
          setSuccessUI(true);
        }
        if (!data?.status) {
          setFailedUI(true);
          setWaiting(false);
        }
      }
    } catch (error) {
      setWaiting(false);
      setIserrorUrl(true);
      console.log({ error });
    }
  };

  useEffect(() => {
    handleConfirmWithdraw(withdrawToken);
  }, [withdrawToken]);

  return (
    <main
      style={{
        height: "calc(100vh - 64px)",
        display: "flex",
        justifyContent: "center",
        flexDirection: "column",
        alignItems: "center",
        color: appColor.textSecondaryColor,
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
export default FundWithdraw;
