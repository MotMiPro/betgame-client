import React, { useCallback, useState, useEffect } from "react";
import { MutualWrap } from "~/view/UI/reuseAbles";
import { CardView } from "~/view/UI/components/CardWrapper";
import { API_METHOD, baseQuery, pathAPI } from "~/settings/constants";
import { parseUrlToQuery } from "~/ultils/parseQuery";
import { useFetchAPI } from "~/customHooks/useFetchAPI";
import { useSelector } from "react-redux";
import HomePageTable from "~/view/presentations/tables/homePageTable";
import {
  mockSlotMygameColumns,
  turnDiceMygame,
  turnMoonMygame,
  turnNewDiceMygame,
  turnSlotMyGame,
} from "~/view/presentations/games/gameSetting";
import {
  mockMyDiceColumns,
  mockMyMoonColumns,
  mockMyNewDiceColumns,
} from "./withColumn";
import { useIntl } from "react-intl";
import translationsComponents from "~/languageProvider/translateKeys";

function BettingHistory() {
  const intl = useIntl();
  const { fetchDataEvent } = useFetchAPI();
  const { authHeader } = useSelector((state) => state.userReducer);
  const [myNewDiceTab, setMyNewDiceTab] = useState(null);
  const [myMoonTab, setMyMoonTab] = useState(mymoon);
  const [myDiceTab, setMyDiceTab] = useState(myDice);
  const [mySlotsTab, setMySlots] = useState(mySlots);
  const [tabHost, setTabHost] = useState(0);
  const [aDataTab, setaDataTab] = useState({
    title: `New Dice`,
    endpoint: pathAPI.NEW_DICE_MYGAME,
  });

  const [loading, setLoading] = useState(false);

  const handlegetMyGame = useCallback(async (pageQuery) => {
    const {
      current = 1,
      pageSize = 10,
      endpoint = `${pathAPI.NEW_DICE_MYGAME}`,
      title = `New Dice`,
    } = !!pageQuery && pageQuery;
    try {
      let query = baseQuery;
      query.page = current;
      query.limit = pageSize;
      setLoading(true);
      const { fetchData } = await fetchDataEvent({
        endpoint: `${endpoint}${parseUrlToQuery(query)}`,
        method: API_METHOD.GET,
        attachAuth: authHeader,
      });
      const { data, page, limit, total } = fetchData;
      switch (endpoint) {
        case pathAPI.MOON_MYGAME:
          setMyMoonTab({
            title,
            column: mockMyMoonColumns(intl),
            data: turnMoonMygame(data),
            pagin: {
              pageSize: limit,
              page,
              total,
            },
            key: 0,
          });
          break;
        case pathAPI.SLOT_MYGAME:
          setMySlots({
            title,
            column: mockSlotMygameColumns(intl),
            data: turnSlotMyGame(data),
            pagin: {
              pageSize: limit,
              page,
              total,
            },
            key: 1,
          });
          break;
        case pathAPI.DICE_MYGAME:
          setMyDiceTab({
            title,
            column: mockMyDiceColumns(intl),
            data: turnDiceMygame(data),
            pagin: {
              pageSize: limit,
              page,
              total,
            },
            key: 0,
          });
          break;
        default:
          setMyNewDiceTab({
            title,
            column: mockMyNewDiceColumns(intl),
            data: turnNewDiceMygame(data),
            pagin: {
              pageSize: limit,
              page,
              total,
            },
            key: 0,
          });
          break;
      }
      setLoading(false);
    } catch (error) {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    handlegetMyGame();
  }, []);

  const handleTableChange = (key) => {
    if (tabHost === parseInt(key)) return;
    setTabHost(key);
    const { title, endpoint } = tabTitle[key];
    setaDataTab(tabTitle[key]);
    handlegetMyGame({ title, endpoint });
  };

  const handlePaging = ({ current, pageSize }) => {
    const { title, endpoint } = aDataTab;
    handlegetMyGame({ current, pageSize, title, endpoint });
  };

  return (
    <MutualWrap>
      <CardView
        icon={<i className="fas fa-history" />}
        title={intl.formatMessage(translationsComponents.BETTING_HISTORY)}
      >
        {!!myNewDiceTab && (
          <HomePageTable
            loading={loading}
            dataTableHost={tabHost}
            stateTable={[myNewDiceTab, mySlotsTab, myMoonTab, myDiceTab]}
            handlePaging={handlePaging}
            handleTableChange={handleTableChange}
          />
        )}
      </CardView>
    </MutualWrap>
  );
}

export default React.memo(BettingHistory);

const tabTitle = {
  0: {
    title: `New Dice`,
    endpoint: pathAPI.NEW_DICE_MYGAME,
  },
  1: {
    title: `Slots`,
    endpoint: pathAPI.SLOT_MYGAME,
  },
  2: {
    title: `Moon`,
    endpoint: pathAPI.MOON_MYGAME,
  },
  3: {
    title: `dice`,
    endpoint: pathAPI.DICE_MYGAME,
  },
};

const mySlots = {
  title: "Slots",
  column: [],
  data: [],
  pagin: {
    pageSize: 0,
    page: 1,
    total: 0,
  },
  key: 1,
};

const mymoon = {
  title: "Moon",
  column: [],
  data: [],
  pagin: {
    pageSize: 0,
    page: 1,
    total: 0,
  },
  key: 2,
};

const myDice = {
  title: "Dice",
  column: [],
  data: [],
  pagin: {
    pageSize: 0,
    page: 1,
    total: 0,
  },
  key: 3,
};
