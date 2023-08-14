import { socketTypes } from "~/settings/config";
import { MutualWrap } from "~/view/UI/reuseAbles";
import { RootContext } from "~/contextAPI/Authen";
import {
  mainAllGameSocketSubscriber,
  slotSocketSubscriber,
} from "~/customHooks/useSocket";
import React, {
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import HomePageTable from "~/view/presentations/tables/homePageTable";

import {
  mockColumns,
  mockColumnsHighest,
  mockSlotMygameColumns,
  turnSlotMyGame,
  turnTableRealtime,
} from "~/view/presentations/games/gameSetting";
import { useIntl } from "react-intl";
import translationsComponents from "~/languageProvider/translateKeys";
import { useDispatch, useSelector } from "react-redux";
import { DISPATCH_TYPE } from "~/state/ducks/types";
import { useFetchAPI } from "~/customHooks/useFetchAPI";
import { API_METHOD, pathAPI } from "~/settings/constants";
import { addingToTable } from "~/ultils/aboutTables";

function SlotGameTable() {
  const intl = useIntl();
  const dispatch = useDispatch();
  const tabHost = useRef(0);
  const tempAllGame = useRef(null);
  const tempDataAllGame = useRef(null);
  const tempLatestGame = useRef(null);
  const tempLatestDataGame = useRef(null);
  const tempHighestGame = useRef(null);
  const tempMyGame = useRef(null);
  const tempDataMyGame = useRef(null);
  const allGameTitle = `${intl.formatMessage(translationsComponents.ALL_GAME)}`;
  const lastestTitle = `${intl.formatMessage(
    translationsComponents.LASTEST_SPINS
  )}`;
  const highestTitle = `${intl.formatMessage(
    translationsComponents.HIGHEST_PROFIT
  )}`;
  const mygameTitle = `${intl.formatMessage(translationsComponents.MY_GAME)}`;
  const { btnEvt } = useContext(RootContext);
  const { fetchDataEvent } = useFetchAPI();
  const { locale } = useSelector((state) => state.sessionReducer);
  const { loggedIn } = useSelector((state) => state.userReducer);
  const { allGame, lastestGame, highestGame, myGame } = useSelector(
    (state) => state.gamesReducer
  );

  const [testAllGAme, setTestAllGAme] = useState(null);
  const [latestGame, setlatestGame] = useState(null);
  const [myStateGame, setmyStateGame] = useState(null);
  const [highestState, setHighestState] = useState(null);

  const [loading, setLoading] = useState(false);

  const allGameColumn = mockColumns(intl);
  const mockColumnData = mockColumnsHighest(intl);
  const mockMyGamecolumn = mockSlotMygameColumns(intl);
  const typeAllGame = socketTypes.MAIN_ALL_GAME;
  const lastestType = socketTypes.SLOT_LATEST_GAME;
  const myGameType = socketTypes.SLOT_MY_GAME;

  const getHighestProfitGame = async () => {
    try {
      setLoading(true);
      const result = await fetchDataEvent({
        endpoint: pathAPI.SLOTS_HIGHEST_PROFIT,
        method: API_METHOD.GET,
        hasLoading: false,
      });
      if (result.status) {
        const profitType = socketTypes.SLOT_HIGHEST_PROFIT;
        const data = result?.fetchData?.data;
        const mockData = turnTableRealtime(data, profitType);
        const highestData = {
          column: mockColumnData,
          data: mockData,
          key: profitType,
          title: highestTitle,
        };
        tempHighestGame.current = highestData;
        setHighestState((state) => ({ ...state, ...highestData }));
      }
      setLoading(false);
    } catch (error) {
      console.log({ error });
      setLoading(false);
    }
  };

  const handleInsertMyGame = useCallback(
    (item) => {
      if (parseInt(tabHost.current) !== 3) return;
      if (!!tempDataMyGame.current) {
        const resultData = addingToTable(tempDataMyGame.current, item);
        const mockData = turnSlotMyGame(resultData);
        const myGameData = {
          ...tempMyGame.current,
          data: mockData,
        };
        tempMyGame.current = myGameData;
        tempDataMyGame.current = resultData;
        setmyStateGame((state) => ({ ...state, ...myGameData }));
      }
    },
    [tempDataMyGame, tabHost]
  );

  const handleGetMygame = useCallback(async () => {
    try {
      const result = await fetchDataEvent({
        endpoint: pathAPI.SLOT_MYGAME,
        method: API_METHOD.GET,
      });
      if (result.status) {
        const data = result?.fetchData?.data;
        const myGameData = {
          key: myGameType,
          column: mockMyGamecolumn,
          data: turnSlotMyGame(data),
          title: mygameTitle,
        };
        tempMyGame.current = myGameData;
        tempDataMyGame.current = data;
        setmyStateGame((state) => ({ ...state, ...myGameData }));
      }
    } catch (error) {
      console.log({ error });
    }
  }, []);

  const handleInsertAllGame = useCallback(
    (item) => {
      // console.log("insert slot game", item);
      if (parseInt(tabHost.current) !== 0) return;
      if (!!tempDataAllGame.current) {
        const resultData = addingToTable(tempDataAllGame.current, item);
        const mockData = turnTableRealtime(resultData);
        const allGamedata = {
          ...tempAllGame.current,
          data: mockData,
        };
        tempAllGame.current = allGamedata;
        tempDataAllGame.current = resultData;
        setTestAllGAme((state) => ({ ...state, ...allGamedata }));
      }
    },
    [tempDataAllGame, tabHost]
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
        const allGamedata = {
          title: allGameTitle,
          key: typeAllGame,
          column: allGameColumn,
          data: mockData,
        };
        tempAllGame.current = allGamedata;
        tempDataAllGame.current = data;
        setTestAllGAme((state) => ({ ...state, ...allGamedata }));
      }
    } catch (error) {
      console.log({ error });
    }
  };

  const handleInsertLatestGame = useCallback(
    (item) => {
      if (parseInt(tabHost.current) !== 1) return;
      if (!!tempLatestDataGame.current) {
        const resultData = addingToTable(tempLatestDataGame.current, item);
        const mockData = turnTableRealtime(resultData, lastestType);
        const latestGamedata = {
          ...tempLatestGame.current,
          data: mockData,
        };
        tempLatestGame.current = latestGamedata;
        tempLatestDataGame.current = resultData;
        setlatestGame((state) => ({ ...state, ...latestGamedata }));
      }
    },
    [tempLatestDataGame, tabHost]
  );

  const handleGetLatestGame = useCallback(async () => {
    try {
      const result = await fetchDataEvent({
        endpoint: pathAPI.SLOTS_LATEST_GAME,
        method: API_METHOD.GET,
      });
      if (result.status) {
        const data = result?.fetchData?.data;
        const mockData = turnTableRealtime(data, lastestType);
        const latestGamedata = {
          title: lastestTitle,
          key: lastestType,
          column: mockColumnData,
          data: mockData,
        };
        tempLatestGame.current = latestGamedata;
        tempLatestDataGame.current = data;
        setlatestGame((state) => ({ ...state, ...latestGamedata }));
      }
    } catch (error) {
      console.log({ error });
    }
  }, []);

  useEffect(() => {
    handleGetLatestGame();
    handleGetMygame();
    getHighestProfitGame();
    handleGetAllgame();
  }, []);

  useEffect(() => {
    mainAllGameSocketSubscriber(typeAllGame, (data) => {
      if (data?.length === 0) return;
      if (data?.length > 0) {
        // console.log("all slot game", data);
        data.forEach((element) => {
          handleInsertAllGame(element);
        });
      }
    });
  }, []);

  useEffect(() => {
    slotSocketSubscriber(lastestType, (data) => {
      handleInsertLatestGame(data);
    });
  }, []);

  useEffect(() => {
    slotSocketSubscriber(myGameType, (data) => {
      handleInsertMyGame(data);
    });
  }, []);

  useEffect(() => {
    if (!btnEvt?.onClick && !!testAllGAme) {
      dispatch({
        type: DISPATCH_TYPE.ALL_GAME_UPDATE,
        payload: tempAllGame.current,
      });
    }
  }, [btnEvt.onClick, testAllGAme]);

  useEffect(() => {
    if (!btnEvt?.onClick && !!latestGame) {
      dispatch({
        type: DISPATCH_TYPE.LATEST_GAME_UPDATE,
        payload: tempLatestGame.current,
      });
    }
  }, [btnEvt.onClick, latestGame]);

  useEffect(() => {
    if (!btnEvt?.onClick && !!highestState) {
      dispatch({
        type: DISPATCH_TYPE.HIGHEST_GAME_UPDATE,
        payload: tempHighestGame.current,
      });
    }
  }, [btnEvt.onClick, highestState]);

  useEffect(() => {
    if (!btnEvt?.onClick && !!myStateGame) {
      dispatch({
        type: DISPATCH_TYPE.MY_GAME_UPDATE,
        payload: tempMyGame.current,
      });
    }
  }, [btnEvt.onClick, myStateGame]);

  useEffect(() => {
    if (locale && allGame) {
      dispatch({
        type: DISPATCH_TYPE.ALL_GAME_UPDATE,
        payload: { ...allGame, column: mockColumns(intl), title: allGameTitle },
      });
      dispatch({
        type: DISPATCH_TYPE.LATEST_GAME_UPDATE,
        payload: {
          ...lastestGame,
          column: mockColumnData,
          title: lastestTitle,
        },
      });
      dispatch({
        type: DISPATCH_TYPE.HIGHEST_GAME_UPDATE,
        payload: {
          ...highestGame,
          column: mockColumnData,
          title: highestTitle,
        },
      });
      dispatch({
        type: DISPATCH_TYPE.MY_GAME_UPDATE,
        payload: {
          ...myGame,
          column: mockSlotMygameColumns(intl),
          title: mygameTitle,
        },
      });
    }
  }, [locale]);

  const handleTableChange = (type) => {
    const tabsNumber = parseInt(type);
    if (tabsNumber === 2) {
      getHighestProfitGame();
    }
    if (tabsNumber !== 2) {
      setLoading(true);
      setTimeout(() => {
        setLoading(false);
      }, 1500);
    }
    if (tabsNumber === 3) {
      handleGetMygame();
    }
    if (tabsNumber === 0) {
      handleGetAllgame();
    }
    tabHost.current = type;
  };
  return (
    <MutualWrap style={{ marginTop: 5, padding: 0 }}>
      {!!allGame && (
        <HomePageTable
          loading={loading}
          dataTableHost={tabHost.current}
          handleTableChange={handleTableChange}
          stateTable={
            loggedIn
              ? [allGame, lastestGame, highestGame, myGame]
              : [allGame, lastestGame, highestGame]
          }
        />
      )}
    </MutualWrap>
  );
}
export default React.memo(SlotGameTable);
