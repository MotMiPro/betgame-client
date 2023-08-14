import { withColumn } from "./withColumn";
import { socketTypes } from "~/settings/config";
import { MutualWrap } from "~/view/UI/reuseAbles";
import React, { useEffect, useRef, useState } from "react";
import HomePageTable from "~/view/presentations/tables/homePageTable";
import { turnTableRealtime } from "~/view/presentations/games/gameSetting";
import {
  disconnectSocket,
  initiateSocket,
  socketSubscriber,
} from "~/customHooks/useSocket";
import { useIntl } from "react-intl";
import { useSelector } from "react-redux";
import translationsComponents from "~/languageProvider/translateKeys";
import { useFetchAPI } from "~/customHooks/useFetchAPI";
import { API_METHOD, pathAPI } from "~/settings/constants";

function GeneralTable() {
  const intl = useIntl();
  const [allGame, setAllGame] = useState(null);
  const [highest, setHighest] = useState(null);
  const [loading, setLoading] = useState(false);
  const { fetchDataEvent } = useFetchAPI();

  const { authHeader } = useSelector((state) => state.userReducer);
  const { locale } = useSelector((state) => state.sessionReducer);

  const tempAllGame = useRef(null);
  const tempHighest = useRef(null);
  const highesttitle = `${intl.formatMessage(
    translationsComponents.HIGHEST_PROFIT
  )}`;
  const allGametitle = `${intl.formatMessage(translationsComponents.ALL_GAME)}`;

  useEffect(() => {
    initiateSocket(authHeader, () => {});
    return () => disconnectSocket();
  }, []);

  useEffect(() => {
    if (locale) {
      const type = socketTypes.MAIN_ALL_GAME;
      socketSubscriber(type, (data) => {
        const mockData = turnTableRealtime([data]);
        const allGameData = {
          title: allGametitle,
          key: type,
          column: withColumn(intl),
          data: mockData,
        };
        setAllGame(allGameData);
        tempAllGame.current = allGameData;
      });
    }
  }, [locale]);

  useEffect(() => {
    getHighestProfitGame();
  }, []);

  useEffect(() => {
    if (locale && (!!tempAllGame.current || !!tempHighest.current)) {
      const title = `${intl.formatMessage(translationsComponents.ALL_GAME)}`;
      const highestTitle = `${intl.formatMessage(
        translationsComponents.HIGHEST_PROFIT
      )}`;
      setAllGame((state) => ({
        ...state,
        column: withColumn(intl),
        title,
      }));
      setHighest((state) => ({
        ...state,
        column: withColumn(intl),
        title: highestTitle,
      }));
    }
  }, [locale, tempAllGame]);

  const getHighestProfitGame = async () => {
    try {
      setLoading(true);
      const result = await fetchDataEvent({
        endpoint: pathAPI.ALLGAME_HIGHEST_PROFIT,
        method: API_METHOD.GET,
        hasLoading: false,
      });
      if (result.status) {
        const profitType = socketTypes.MAIN_HIGHEST_PROFIT;
        const data = result?.fetchData?.data;
        const mockData = turnTableRealtime(data);
        setHighest({
          column: withColumn(intl),
          data: mockData,
          key: profitType,
          title: highesttitle,
        });
      }
      setLoading(false);
    } catch (error) {
      console.log({ error });
      setLoading(false);
    }
  };

  const handleTableChange = (type) => {
    if (parseInt(type) === 1) {
      getHighestProfitGame();
    }
    if (parseInt(type) !== 2) {
      setLoading(true);
      setTimeout(() => {
        setLoading(false);
      }, 1500);
    }
    setTabHost(type);
  };

  return (
    <MutualWrap style={{ marginTop: 30 }}>
      {(!!highest || !!allGame) && (
        <HomePageTable
          loading={loading}
          stateTable={[allGame, highest]}
          handleTableChange={handleTableChange}
        />
      )}
    </MutualWrap>
  );
}

export default GeneralTable;
