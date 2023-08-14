import Balance from "./Balance";
import Transactions from "./Transactions";
import { isMobile } from "react-device-detect";
import { useHistory } from "react-router-dom";
import { API_METHOD, pathAPI, USDT, walletType } from "~/settings/constants";
import { pathName } from "../../../../../settings/constants";
import React, { useCallback, useEffect, useState } from "react";
import { useFetchAPI } from "~/customHooks/useFetchAPI";

export default function WalletSetting() {
  const history = useHistory();
  const [balanceChart, setBalanceChart] = useState([]);

  const [balanceData, setBalanceData] = useState(null);

  const { fetchDataEvent } = useFetchAPI();

  const handleBtn = (type) => {
    if (type === walletType.DEPOSITE) {
      history.push(pathName._DEPOSITE);
    }
    if (type === walletType.WITHDRAW) {
      history.push(pathName._WITHDRAW);
    }
  };

  const handleGetBalance = useCallback(async () => {
    try {
      const data = await fetchDataEvent({
        endpoint: pathAPI.GET_BALANCE,
        method: API_METHOD.GET,
        // hasLoading: false,
      });
      const productList = await fetchDataEvent({
        endpoint: pathAPI.GET_PRODUCT_LIST,
        method: API_METHOD.GET,
        // hasLoading: false,
      });

      if (productList.status && data.status) {
        const products = productList?.fetchData?.products;
        const balance = data?.fetchData?.balances ?? [];
        setBalanceData(balance);
        const chartData = JSON.parse(JSON.stringify([...balance])).reduce(
          (arr, item) => {
            if (item?.currency !== USDT) {
              const findBase = products.find(
                (product) => product.base === item?.currency
              );
              if (findBase) {
                item.amount = item?.amount * findBase?.price;
              }
            }
            return [...arr, item];
          },
          []
        );
        setBalanceChart(chartData);
      }
    } catch (error) {
      console.log({ error });
    }
  }, []);

  useEffect(() => {
    handleGetBalance();
  }, []);

  return (
    <section style={{ padding: isMobile ? 0 : 10, position: "relative" }}>
      {balanceChart && balanceData && (
        <Balance
          handleBtn={handleBtn}
          balanceChart={balanceChart}
          balanceData={balanceData}
        />
      )}
      <div style={{ marginTop: 15 }}>
        <Transactions />
      </div>
    </section>
  );
}
