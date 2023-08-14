import React, {
  useCallback,
  useContext,
  useEffect,
  useState,
  useRef,
} from "react";
import { useIntl } from "react-intl";
import {
  turnTableRealtime,
  mockColumns,
  formatView,
  turnNewDiceMygame,
} from "~/view/presentations/games/gameSetting";
import { useSelector } from "react-redux";
import { TurnDiceFace } from "./GameResult";
import { flatNumber } from "~/ultils/excuse";
import { MutualWrap } from "~/view/UI/reuseAbles";
import { parseCurrency } from "~/ultils/currency";
import { addingToTable } from "~/ultils/aboutTables";
import { GameContext } from "~/contextAPI/GameManager";
import { useFetchAPI } from "~/customHooks/useFetchAPI";
import { parseTimer, socketTypes } from "~/settings/config";
import {
  mainAllGameSocketSubscriber,
  newDiceSocketSubscriber,
} from "~/customHooks/useSocket";
import AmountUI, { UsersUI } from "~/view/UI/components/AmountUI";
import translationsComponents from "~/languageProvider/translateKeys";
import HomePageTable from "~/view/presentations/tables/homePageTable";
import { API_METHOD, appColor, pathAPI } from "~/settings/constants";
import { mockMyNewDiceColumns } from "../../authen/BettingHistory/withColumn";

export default function DiceTable() {
  const intl = useIntl();
  const tempAllGame = useRef([]);
  const tempLatestGame = useRef([]);
  const tempMyGame = useRef([]);
  const tabHost = useRef(0);
  const { fetchDataEvent } = useFetchAPI();
  const { modalNewDice } = useContext(GameContext);
  const { isFinishRoll } = modalNewDice;

  const [allGame, setAllGame] = useState(null);
  const [lastest, setLastest] = useState(null);
  const [highest, setHighest] = useState(null);
  const [myGame, setMyGame] = useState(null);
  const [allTable, setAllTable] = useState([]);
  const [loading, setLoading] = useState(false);
  const { authHeader } = useSelector((state) => state.userReducer);
  const { locale } = useSelector((state) => state.sessionReducer);

  const myGameTitle = `${intl.formatMessage(translationsComponents.MY_GAME)}`;
  const highestGameTitle = `${intl.formatMessage(
    translationsComponents.HIGHEST_PROFIT
  )}`;
  const latestGameTitle = `${intl.formatMessage(
    translationsComponents.LASTEST_ROLL
  )}`;
  const allGameTitle = `${intl.formatMessage(translationsComponents.ALL_GAME)}`;

  const mockColumn = mockMyNewDiceColumns(intl);
  const mockHighestColumn = mockColumnsHighest(intl);
  const mockBaseColumn = mockColumns(intl);

  const handleGetAllgame = async () => {
    try {
      const result = await fetchDataEvent({
        endpoint: pathAPI.LATEST_ALL_GAME,
        method: API_METHOD.GET,
      });
      if (result.status) {
        const allGameData = result?.fetchData?.data;
        tempAllGame.current = allGameData;
        if (lastest?.length > 0 || highest?.length > 0 || allGame?.length > 0) {
          setAllTable([allGame, lastest, highest]);
        } else {
          const mockData = turnTableRealtime(allGameData);
          const tableAllGame = {
            title: allGameTitle,
            column: mockBaseColumn,
            data: mockData,
            key: 0,
          };
          const tableLastestGame = {
            title: `${intl.formatMessage(
              translationsComponents.LASTEST_SPINS
            )}`,
            column: [],
            data: [],
            key: 1,
          };
          const tableHighest = {
            title: `${intl.formatMessage(
              translationsComponents.HIGHEST_PROFIT
            )}`,
            column: [],
            data: [],
            key: 2,
          };
          setAllGame((state) => ({ ...state, ...tableAllGame }));
          setAllTable([tableAllGame, tableLastestGame, tableHighest]);
        }
      }
    } catch (error) {
      console.log({ error });
    }
  };

  const handleGetLatestgame = async () => {
    try {
      const result = await fetchDataEvent({
        endpoint: pathAPI.NEW_DICE_LATEST_ROLL,
        method: API_METHOD.GET,
      });
      if (result.status) {
        const latestGameData = result?.fetchData?.data;
        tempLatestGame.current = latestGameData;
        const lastestType = socketTypes.NEW_DICE_LATEST_GAME;
        const mockData = turnTableRealtime(latestGameData, lastestType);
        setLastest((state) => ({
          ...state,
          title: latestGameTitle,
          column: mockHighestColumn,
          data: mockData,
          key: 1,
        }));
      }
    } catch (error) {
      console.log({ error });
    }
  };

  useEffect(() => {
    handleGetAllgame();
  }, []);

  const handleInsertData = useCallback(
    (item) => {
      // console.log("insert newdice game", item);
      if (tabHost.current !== 0) return;
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
  const handleInsertLatestData = useCallback(
    (item) => {
      if (tabHost.current !== 1) return;
      if (!!tempLatestGame.current) {
        const lastestType = socketTypes.NEW_DICE_LATEST_GAME;
        const resultData = addingToTable(tempLatestGame.current, item);
        const mockData = turnTableRealtime(resultData, lastestType);
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
    const type = socketTypes.MAIN_ALL_GAME;
    mainAllGameSocketSubscriber(type, (data) => {
      // console.log("all newdice game", data);
      if (data?.length === 0) return;
      if (data?.length > 0) {
        data.forEach((element) => {
          handleInsertData(element);
        });
      }
    });
  }, []);

  useEffect(() => {
    const lastestType = socketTypes.NEW_DICE_LATEST_GAME;
    newDiceSocketSubscriber(lastestType, (data) => {
      handleInsertLatestData(data, intl);
    });
  }, [intl]);

  const handleInsertMyGameData = useCallback(
    (item) => {
      if (tabHost.current !== 3) return;

      if (!!tempMyGame.current) {
        const foundIndex =
          tempMyGame.current.findIndex(({ _id }) => _id === item?._id) ?? false;
        if (foundIndex !== -1) {
          tempMyGame.current[foundIndex] = item;
          setMyGame((state) => ({
            ...state,
            data: turnNewDiceMygame(tempMyGame.current),
          }));
          tempMyGame.current = tempMyGame.current;
        } else {
          const resultData = addingToTable(tempMyGame.current, item);
          setMyGame((state) => ({
            ...state,
            data: turnNewDiceMygame(resultData),
          }));
          tempMyGame.current = resultData;
        }
      }
    },
    [tempMyGame, intl]
  );

  const handleGetMygame = async () => {
    try {
      const result = await fetchDataEvent({
        endpoint: pathAPI.NEW_DICE_MYGAME,
        method: API_METHOD.GET,
      });
      if (result.status) {
        const myGameData = result?.fetchData?.data;
        tempMyGame.current = myGameData;
        setMyGame((state) => ({
          ...state,
          title: myGameTitle,
          column: mockColumn,
          data: turnNewDiceMygame(myGameData),
          key: 3,
        }));
      }
    } catch (error) {
      console.log({ error });
    }
  };

  useEffect(() => {
    const myGame = socketTypes.NEW_DICE_MY_GAME;
    newDiceSocketSubscriber(myGame, (data) => {
      handleInsertMyGameData(data);
    });
  }, []);

  useEffect(() => {
    if ((allGame || lastest || highest || myGame) && !isFinishRoll) {
      authHeader
        ? setAllTable([allGame, lastest, highest, myGame])
        : setAllTable([allGame, lastest, highest]);
    }
  }, [highest, isFinishRoll, myGame, authHeader, lastest, allGame]);

  useEffect(() => {
    if (locale) {
      setAllGame((state) => ({
        ...state,
        title: allGameTitle,
        column: mockBaseColumn,
      }));

      setHighest((state) => ({
        ...state,
        title: highestGameTitle,
        column: mockHighestColumn,
      }));

      setLastest((state) => ({
        ...state,
        title: latestGameTitle,
        column: mockHighestColumn,
      }));
      setMyGame((state) => ({
        ...state,
        title: myGameTitle,
        column: mockColumn,
      }));
    }
  }, [locale]);

  const getHighestProfitGame = async () => {
    try {
      setLoading(true);
      const result = await fetchDataEvent({
        endpoint: pathAPI.NEW_DICE_HIGHEST_PROFIT,
        method: API_METHOD.GET,
        hasLoading: false,
      });
      if (result.status) {
        const profitType = socketTypes.NEW_DICE_HIGHEST_PROFIT;
        const data = result?.fetchData?.data;
        const mockData = turnTableRealtime(data, profitType);
        setHighest((state) => ({
          ...state,
          title: highestGameTitle,
          column: mockHighestColumn,
          data: mockData,
          key: 2,
        }));
      }
      setLoading(false);
    } catch (error) {
      console.log({ error });
      setLoading(false);
    }
  };

  const handleTableChange = useCallback((type) => {
    const tabNumber = parseInt(type);

    if (tabNumber === 2) {
      getHighestProfitGame();
    }
    if (tabNumber !== 2) {
      setLoading(true);
      setTimeout(() => {
        setLoading(false);
      }, 1500);
    }
    if (tabNumber === 0) {
      handleGetAllgame();
    }
    if (tabNumber === 1) {
      handleGetLatestgame();
    }
    if (tabNumber === 3) {
      handleGetMygame();
    }
    tabHost.current = tabNumber;
  }, []);

  return (
    <MutualWrap style={{ marginTop: 5, padding: 0 }}>
      {allTable?.length >= 3 && (
        <HomePageTable
          loading={loading}
          stateTable={allTable}
          dataTableHost={tabHost.current}
          handleTableChange={handleTableChange}
        />
      )}
    </MutualWrap>
  );
}

export const mockColumnsHighest = (intl) => [
  {
    title: `${intl.formatMessage(translationsComponents.DATE_TAB)}`,
    dataIndex: "date",
    key: "date",
    responsive: ["xs", "sm"],
    render: (item) => <span>{parseTimer(item)}</span>,
  },
  {
    title: `${intl.formatMessage(translationsComponents.USER_TAB)}`,
    dataIndex: "user",
    key: "user",
    responsive: ["xs", "sm"],
    render: (item) => <UsersUI user={item} />,
  },
  {
    title: `${intl.formatMessage(translationsComponents.AMOUNT_TAB)}`,
    dataIndex: "amount",
    key: "amount",
    responsive: ["xs", "sm"],
    render: (item) => <AmountUI data={item} />,
  },
  {
    title: `${intl.formatMessage(translationsComponents.MULTIPLIERS_TAB)}`,
    dataIndex: "multiplier",
    key: "multiplier",
    responsive: ["xs", "sm"],
    render: (item) => {
      if (Array.isArray(item)) {
        return (
          <div>
            {flatNumber(item).map((mul, i) => {
              return <div key={i}>{formatView(mul)}</div>;
            })}
          </div>
        );
      }
      return <span>{formatView(item)}</span>;
    },
  },
  {
    title: `${intl.formatMessage(translationsComponents.PROFIT_TAB)}`,
    dataIndex: "profit",
    key: "profit",
    responsive: ["xs", "sm"],
    render: (item) => (
      <span
        style={{
          color:
            item > 0
              ? appColor.textPrimaryColor
              : item === 0
              ? appColor.red
              : appColor.textSecondaryColor,
        }}
      >
        {parseCurrency(item)}
      </span>
    ),
  },
  {
    title: `${intl.formatMessage(translationsComponents.GAME_TAB)}`,
    dataIndex: "numbers",
    key: "numbers",
    responsive: ["xs", "sm"],
    render: (item) => (
      <div style={{ display: "flex" }}>
        {item?.length > 0
          ? item.map((num, idx) => (
              <div
                key={idx}
                style={{
                  padding: 3,
                }}
              >
                <TurnDiceFace number={num} />
              </div>
            ))
          : null}
      </div>
    ),
  },
];
