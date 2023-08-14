import React, { useCallback, useEffect, useRef, useState } from "react";
import { parseTimer, socketTypes } from "~/settings/config";
import { API_METHOD, appColor, pathAPI } from "~/settings/constants";
import { parseCurrency } from "~/ultils/currency";
import { flatNumber } from "~/ultils/excuse";
import { formatView } from "~/ultils/formatView";
import HomePageTable from "~/view/presentations/tables/homePageTable";
import AmountUI, { UsersUI } from "~/view/UI/components/AmountUI";
import { MutualWrap } from "~/view/UI/reuseAbles";
import { v4 as uuid } from "uuid";
import {
  mainAllGameSocketSubscriber,
  moonSocketSubscriber,
} from "~/customHooks/useSocket";
import { GameIcon } from "~/view/UI/components/GameIcons";
import { useIntl } from "react-intl";
import translationsComponents from "~/languageProvider/translateKeys";
import { useFetchAPI } from "~/customHooks/useFetchAPI";
import { addingToTable } from "~/ultils/aboutTables";
import { turnMoonMygame } from "~/view/presentations/games/gameSetting";
import { mockMyMoonColumns } from "../../authen/BettingHistory/withColumn";
import { useSelector } from "react-redux";

function MoonTable() {
  const intl = useIntl();
  const tempAllGame = useRef([]);
  const tempMyGame = useRef([]);
  const tabHost = useRef(0);

  const { fetchDataEvent } = useFetchAPI();
  const [allGame, setAllGame] = useState(null);
  const [lastest, setLastest] = useState(null);
  const [highest, setHighest] = useState(null);
  const [myGame, setMyGame] = useState(null);
  const [loading, setLoading] = useState(false);

  const { authHeader } = useSelector((state) => state.userReducer);
  const { locale } = useSelector((state) => state.sessionReducer);

  const myGameTitle = `${intl.formatMessage(translationsComponents.MY_GAME)}`;
  const highestGameTitle = `${intl.formatMessage(
    translationsComponents.HIGHEST_PROFIT
  )}`;
  const latestGameTitle = `${intl.formatMessage(
    translationsComponents.LASTEST_GAMES
  )}`;
  const allGameTitle = `${intl.formatMessage(translationsComponents.ALL_GAME)}`;
  const mainAllGameType = socketTypes.MAIN_ALL_GAME;

  const mockColumnUI = mockColumns(intl);
  const mockHighestColumnUI = mockColumnsHighest(intl);
  const mockMyGameColumn = mockMyMoonColumns(intl);
  const mockLatestColumn = mockColumnsLastest(intl);

  const handleGetAllgame = async () => {
    try {
      const result = await fetchDataEvent({
        endpoint: pathAPI.LATEST_ALL_GAME,
        method: API_METHOD.GET,
      });
      if (result.status) {
        const allGameData = result?.fetchData?.data;
        tempAllGame.current = allGameData;
        if (!lastest || !highest || !allGame) {
          const mockData = turnTableRealtime(allGameData);
          const tableAllGame = {
            title: allGameTitle,
            column: mockColumnUI,
            data: mockData,
            key: 0,
          };
          const tableLastestGame = {
            title: latestGameTitle,
            column: [],
            data: [],
            key: 1,
          };
          const tableHighest = {
            title: highestGameTitle,
            column: [],
            data: [],
            key: 2,
          };
          setAllGame((state) => ({ ...state, ...tableAllGame }));
          setLastest((state) => ({ ...state, ...tableLastestGame }));
          setHighest((state) => ({ ...state, ...tableHighest }));
        }
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
      // console.log("insert moongame", item);
      if (parseInt(tabHost.current) !== 0) return;
      const resultData = addingToTable(tempAllGame.current, item);
      const mockData = turnTableRealtime(resultData, mainAllGameType);
      setAllGame((state) => ({
        ...state,
        data: mockData,
      }));
      tempAllGame.current = resultData;
    },
    [tempAllGame]
  );

  useEffect(() => {
    mainAllGameSocketSubscriber(mainAllGameType, (data) => {
      // console.log("all moongame", data);
      if (data?.length === 0) return;
      if (data?.length > 0) {
        data.forEach((element) => {
          handleInsertData(element);
        });
      }
    });
  }, []);

  const handleGetMygame = async () => {
    try {
      const result = await fetchDataEvent({
        endpoint: pathAPI.MOON_MYGAME,
        method: API_METHOD.GET,
      });
      if (result.status) {
        const myGameData = result?.fetchData?.data;
        tempMyGame.current = myGameData;
        const mockData = turnMoonMygame(myGameData);
        setMyGame((state) => ({
          ...state,
          column: mockMyGameColumn,
          data: mockData,
          key: myGame,
          title: myGameTitle,
        }));
      }
    } catch (error) {
      console.log({ error });
    }
  };

  const handleInsertMyGameData = useCallback(
    (item) => {
      if (parseInt(tabHost.current) !== 3) return;
      const resultData = addingToTable(tempMyGame.current, item, true);
      setMyGame((state) => ({
        ...state,
        column: mockMyGameColumn,
        data: turnMoonMygame(resultData),
      }));
      tempMyGame.current = resultData;
    },
    [tempMyGame]
  );

  useEffect(() => {
    const lastestType = socketTypes.MOON_LATEST_GAME;
    moonSocketSubscriber(lastestType, (data) => {
      const mockData = turnTableRealtime(data);
      setLastest((state) => ({
        ...state,
        title: latestGameTitle,
        key: lastestType,
        column: mockLatestColumn,
        data: mockData,
      }));
    });
  }, [intl]);

  useEffect(() => {
    const myGame = socketTypes.MOON_MY_GAME;
    moonSocketSubscriber(myGame, (data) => {
      handleInsertMyGameData(data, intl);
    });
  }, [intl]);

  useEffect(() => {
    if (locale) {
      setAllGame((state) => ({
        ...state,
        title: allGameTitle,
        column: mockColumnUI,
      }));

      setHighest((state) => ({
        ...state,
        title: highestGameTitle,
        column: mockHighestColumnUI,
      }));

      setLastest((state) => ({
        ...state,
        title: latestGameTitle,
        column: mockLatestColumn,
      }));
      setMyGame((state) => ({
        ...state,
        title: myGameTitle,
        column: mockMyGameColumn,
      }));
    }
  }, [locale]);

  const getHighestProfitGame = async () => {
    try {
      setLoading(true);
      const result = await fetchDataEvent({
        endpoint: pathAPI.MOON_HIGHEST_PROFIT,
        method: API_METHOD.GET,
        hasLoading: false,
      });
      if (result.status) {
        const profitType = socketTypes.MOON_HIGHEST_PROFIT;
        const data = result?.fetchData?.data;
        const mockData = turnTableRealtime(data);
        setHighest((state) => ({
          ...state,
          column: mockHighestColumnUI,
          data: mockData,
          key: profitType,
          title: highestGameTitle,
        }));
      }
      setLoading(false);
    } catch (error) {
      console.log({ error });
      setLoading(false);
    }
  };

  const handleTableChange = (type) => {
    const tabNumber = parseInt(type);
    console.log({ tabNumber });
    if (tabNumber === 0) {
      handleGetAllgame();
    }
    if (tabNumber === 2) {
      getHighestProfitGame();
    }
    if (tabNumber === 3) {
      handleGetMygame();
    }
    if (tabNumber !== 2) {
      setLoading(true);
      setTimeout(() => {
        setLoading(false);
      }, 1500);
    }
    tabHost.current = tabNumber;
  };

  return (
    <MutualWrap style={{ marginTop: 5, padding: 0 }}>
      {(!!allGame || !!lastest || !!highest) && (
        <HomePageTable
          loading={loading}
          dataTableHost={tabHost.current}
          handleTableChange={handleTableChange}
          stateTable={
            authHeader
              ? [allGame, lastest, highest, myGame]
              : [allGame, lastest, highest]
          }
        />
      )}
    </MutualWrap>
  );
}

export default React.memo(MoonTable);

export const turnTableRealtime = (list, type) => {
  if (!list || list?.length === 0) return;
  return list.map((item, index) => {
    return {
      date: item?.createdAt,
      user: item?.userId?.userName,
      amount: item,
      game: item?.game,
      multiplier: item?.multipliers ?? item?.multiplier,
      profit: item?.profit,
      hash: item?.hash,
      id: item?.id,
      key: `${uuid()}_${index}_${type}`,
    };
  });
};

export const mockColumnsLastest = (intl) => [
  {
    title: `${intl.formatMessage(translationsComponents.DATE_TAB)}`,

    dataIndex: "date",
    key: "date",
    responsive: ["xs", "sm"],
    render: (item) => <span>{parseTimer(item)}</span>,
  },
  {
    title: `${intl.formatMessage(translationsComponents.ID_TAB)}`,
    dataIndex: "id",
    key: "id",
    responsive: ["xs", "sm"],
    render: (item) => <span>{item}</span>,
  },
  {
    title: `${intl.formatMessage(translationsComponents.HASH_TAB)}`,
    dataIndex: "hash",
    key: "hash",
    responsive: ["xs", "sm"],
    render: (item) => (
      <span style={{ textTransform: "lowercase" }}>{item}</span>
    ),
  },
  {
    title: `${intl.formatMessage(translationsComponents.MULTIPLIERS_TAB)}`,
    dataIndex: "multiplier",
    key: "multiplier",
    responsive: ["xs", "sm"],
    render: (item) => <span>{item}</span>,
  },
];
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
    render: (item) => <span>{item}</span>,
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
        {!!item && parseCurrency(item)}
      </span>
    ),
  },
];

export const mockColumns = (intl) => [
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
    title: `${intl.formatMessage(translationsComponents.GAME_TAB)}`,
    dataIndex: "game",
    key: "game",
    responsive: ["xs", "sm"],
    render: (item) => <GameIcon name={item} />,
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
    title: `${intl.formatMessage(translationsComponents.AMOUNT_TAB)}`,
    dataIndex: "amount",
    key: "amount",
    responsive: ["xs", "sm"],
    render: (item) => <AmountUI data={item} />,
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
        {!!item && parseCurrency(item)}
      </span>
    ),
  },
];
