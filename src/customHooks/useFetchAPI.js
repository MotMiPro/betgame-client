import { useContext } from "react";
import { useSelector } from "react-redux";
import { RootContext } from "~/contextAPI/Authen";
import { useExceptions } from "./useExceptions";
import axiosService from "~/state/ducks/apiService";
import { API_METHOD, BASE_URL_API } from "~/settings/constants";

export const useFetchAPI = () => {
  const { handleException } = useExceptions();
  const { authHeader } = useSelector((state) => state.userReducer);
  const { setWaiting } = useContext(RootContext);

  const fetchDataEvent = async (setting) => {
    const {
      endpoint,
      method = API_METHOD.GET,
      config = null,
      sendData = null,
      attachAuth = null,
      hasLoading = true,
    } = setting;
    try {
      hasLoading && setWaiting(true);
      const url = `${BASE_URL_API}${endpoint}`;
      switch (method) {
        case API_METHOD.POST:
          const { data: postData } = await axiosService.post(
            url,
            sendData,
            attachAuth ? attachAuth : authHeader,
            config
          );
          if (!postData?.success) {
            return handleException(postData);
          }
          if (postData?.success) {
            hasLoading && setWaiting(false);
            return { status: true, fetchData: postData?.data };
          }
          break;
        case API_METHOD.PUT:
          const { data: putData } = await axiosService.put(
            url,
            sendData,
            authHeader
          );
          if (!putData?.success) {
            return handleException(putData);
          }
          if (putData?.success) {
            hasLoading && setWaiting(false);
            return { status: true, fetchData: putData?.data };
          }
          break;

        default:
          const { data: getData } = await axiosService.get(
            url,
            attachAuth ? attachAuth : authHeader
          );
          if (!getData?.success) {
            return handleException(getData);
          }
          if (getData?.success) {
            hasLoading && setWaiting(false);
            return { status: true, fetchData: getData?.data };
          }
          break;
      }
    } catch (error) {
      hasLoading && setWaiting(false);
      console.log("fetch API", error);
    }
  };
  return { fetchDataEvent };
};
