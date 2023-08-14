import { withColumn } from "../../../presentations/games/withColumn";
import { socketTypes } from "~/settings/config";
import { MutualWrap } from "~/view/UI/reuseAbles";
import React, { useCallback, useEffect, useRef, useState } from "react";
import HomePageTable from "../../../presentations/tables/homePageTable";
import {
  mockColumns,
  turnDiceMygame,
  turnTableRealtime,
} from "../../../presentations/games/gameSetting";
import {
  diceSocketSubscriber,
  mainAllGameSocketSubscriber,
} from "~/customHooks/useSocket";
import { useIntl } from "react-intl";
import translationsComponents from "~/languageProvider/translateKeys";
import { mockMyDiceColumns } from "../../authen/BettingHistory/withColumn";
import { useSelector } from "react-redux";
import { useFetchAPI } from "~/customHooks/useFetchAPI";
import { API_METHOD, pathAPI } from "~/settings/constants";
import { addingToTable } from "~/ultils/aboutTables";

function GameTable() {
  const intl = useIntl();
  const tempAllGame = useRef(null);
  const tempLatestGame = useRef(null);
  const tempHighestGame = useRef(null);
  const tempMyGame = useRef(null);
  const tabHost = useRef(0);
  const { fetchDataEvent } = useFetchAPI();
  const { locale } = useSelector((state) => state.sessionReducer);

  const [allGame, setAllGame] = useState(null);
  const [lastest, setLastest] = useState(null);
  const [highest, setHighest] = useState(null);
  const [myGame, setMyGame] = useState(null);
  const [loading, setLoading] = useState(false);

  const allGameTitle = `${intl.formatMessage(translationsComponents.ALL_GAME)}`;
  const lastestTitle = `${intl.formatMessage(
    translationsComponents.LASTEST_ROLL
  )}`;
  const highestTitle = `${intl.formatMessage(
    translationsComponents.HIGHEST_PROFIT
  )}`;
  const myGameTitle = `${intl.formatMessage(translationsComponents.MY_GAME)}`;

  const allGameType = socketTypes.MAIN_ALL_GAME;
  const lastestType = socketTypes.DICE_LATEST_GAME;
  const typeMyGame = socketTypes.DICE_MY_GAME;

  const columnsAllGame = mockColumns(intl);
  const columnLatestGame = withColumn(intl);
  const columnMygame = mockMyDiceColumns(intl);

  const handleInsertAllgame = useCallback(
    (item) => {
      // console.log("insert dice game", item);
      if (parseInt(tabHost.current) !== 0) return;
      if (!!tempAllGame.current) {
        const resultData = addingToTable(tempAllGame.current, item);
        const mockData = turnTableRealtime(resultData);
        setAllGame((state) => ({
          ...state,
          data: mockData,
        }));
        tempAllGame.current = resultData;
      }
    },
    [tempAllGame]
  );

  const handleGetAllgame = async () => {
    try {
      const result = await fetchDataEvent({
        endpoint: pathAPI.LATEST_ALL_GAME,
        method: API_METHOD.GET,
      });
      if (result.status) {
        const data = result?.fetchData?.data;
        const mockData = turnTableRealtime(data);
        const allGameData = {
          title: allGameTitle,
          key: allGameType,
          column: columnsAllGame,
          data: mockData,
        };
        setAllGame((state) => ({ ...state, ...allGameData }));
        tempAllGame.current = data;
      }
    } catch (error) {
      console.log({ error });
    }
  };

  const handleGetMygame = useCallback(async () => {
    try {
      const result = await fetchDataEvent({
        endpoint: pathAPI.DICE_MYGAME,
        method: API_METHOD.GET,
      });
      if (result.status) {
        const myGameData = result?.fetchData?.data;
        const mockData = turnDiceMygame(myGameData);
        setMyGame((state) => ({
          ...state,
          column: columnMygame,
          data: mockData,
          key: typeMyGame,
          title: myGameTitle,
        }));
        tempMyGame.current = myGameData;
      }
    } catch (error) {
      console.log({ error });
    }
  }, []);

  const handleInsertMyGame = useCallback(
    (item) => {
      if (parseInt(tabHost.current) !== 3) return;
      if (!!tempMyGame.current) {
        const resultData = addingToTable(tempMyGame.current, item);
        const mockData = turnDiceMygame(resultData);
        setMyGame((state) => ({
          ...state,
          data: mockData,
        }));
        tempMyGame.current = resultData;
      }
    },
    [tempMyGame]
  );

  const handleGetLatestGame = useCallback(async () => {
    try {
      const result = await fetchDataEvent({
        endpoint: pathAPI.DICE_LATEST_ROLL,
        method: API_METHOD.GET,
      });
      if (result.status) {
        const latestRollData = result?.fetchData?.data;
        const mockData = turnTableRealtime(latestRollData);
        setLastest((state) => ({
          ...state,
          title: lastestTitle,
          key: lastestType,
          column: columnLatestGame,
          data: mockData,
        }));
        tempLatestGame.current = latestRollData;
      }
    } catch (error) {
      console.log({ error });
    }
  }, []);

  const handleInsertLatestGame = useCallback(
    (item) => {
      if (parseInt(tabHost.current) !== 1) return;
      if (!!tempLatestGame.current) {
        const resultData = addingToTable(tempLatestGame.current, item);
        const mockData = turnTableRealtime(resultData);
        setLastest((state) => ({
          ...state,
          data: mockData,
        }));
        tempLatestGame.current = resultData;
      }
    },
    [tempLatestGame]
  );

  useEffect(() => {
    handleGetAllgame();
    handleGetLatestGame();
    getHighestProfitGame();
    handleGetMygame();
  }, []);

  useEffect(() => {
    mainAllGameSocketSubscriber(allGameType, (data) => {
      // console.log("alldice game", data);
      if (data?.length === 0) return;
      if (data?.length > 0) {
        data.forEach((element) => {
          handleInsertAllgame(element);
        });
      }
    });
  }, []);

  useEffect(() => {
    diceSocketSubscriber(lastestType, (data) => {
      handleInsertLatestGame(data);
    });
  }, []);

  useEffect(() => {
    diceSocketSubscriber(typeMyGame, (data) => {
      handleInsertMyGame(data);
    });
  }, []);

  useEffect(() => {
    if (locale && !!tempAllGame.current) {
      setAllGame((state) => ({
        ...state,
        column: mockColumns(intl),
        title: allGameTitle,
      }));
      setHighest((state) => ({
        ...state,
        column: withColumn(intl),
        title: highestTitle,
      }));
      setLastest((state) => ({
        ...state,
        title: lastestTitle,
        column: withColumn(intl),
      }));
      setMyGame((state) => ({
        ...state,
        title: myGameTitle,
        column: mockMyDiceColumns(intl),
      }));
    }
  }, [locale, tempAllGame]);

  const getHighestProfitGame = async () => {
    try {
      setLoading(true);
      const result = await fetchDataEvent({
        endpoint: pathAPI.DICE_HIGHEST_PROFIT,
        method: API_METHOD.GET,
        hasLoading: false,
      });
      if (result.status) {
        const profitType = socketTypes.DICE_HIGHEST_PROFIT;
        const data = result?.fetchData?.data;
        const mockData = turnTableRealtime(data);
        const highestData = {
          column: withColumn(intl),
          data: mockData,
          key: profitType,
          title: highestTitle,
        };
        setHighest((state) => ({ ...state, ...highestData }));
        tempHighestGame.current = data;
      }
      setLoading(false);
    } catch (error) {
      console.log({ error });
      setLoading(false);
    }
  };

  const handleTableChange = (type) => {
    const tabsNumber = parseInt(type);
    if (tabsNumber === 0) {
      handleGetAllgame();
    }
    if (tabsNumber === 2) {
      getHighestProfitGame();
    }
    if (tabsNumber !== 2) {
      setLoading(true);
      setTimeout(() => {
        setLoading(false);
      }, 1500);
    }
    if (tabsNumber === 1 && !tempLatestGame.current) {
      handleGetLatestGame();
    }
    tabHost.current = tabsNumber;
  };

  return (
    <MutualWrap style={{ marginTop: 5, padding: 0 }}>
      {(!!highest || !!allGame || !!lastest) && (
        <HomePageTable
          loading={loading}
          dataTableHost={tabHost.current}
          handleTableChange={handleTableChange}
          stateTable={
            myGame
              ? [allGame, lastest, highest, myGame]
              : [allGame, lastest, highest]
          }
        />
      )}
    </MutualWrap>
  );
}
export default React.memo(GameTable);
