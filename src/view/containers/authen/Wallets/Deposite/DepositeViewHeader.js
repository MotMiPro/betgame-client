import { Col, Row } from "antd";
import React, {
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import { CardView } from "~/view/UI/components/CardWrapper";
import { MutualWrap } from "~/view/UI/reuseAbles";
import { API_METHOD, appColor, pathAPI } from "~/settings/constants";
import DepositeRightColumn from "./DepositeRightColumn";
import DepositeLeftColumn from "./LeftColumn";
import { RootContext } from "~/contextAPI/Authen";
import translationsComponents from "~/languageProvider/translateKeys";
import { useIntl } from "react-intl";
import { useFetchAPI } from "~/customHooks/useFetchAPI";

function DepositeViewHeader() {
  const intl = useIntl();
  const [dataView, setDataView] = useState(null);
  const { username } = useContext(RootContext);

  const [depositeSelection, setDepositeSelection] = useState(null);
  const [rightSelection, setRightSelection] = useState(null);

  const [balanceRef, setBalanceRef] = useState(null);
  const totalBalanceRef = useRef(null);
  const currencyParser = useRef(null);

  const leftRefSelected = useRef(null);

  const { fetchDataEvent } = useFetchAPI();

  const handleGetListCurrency = useCallback(async () => {
    try {
      const currenyResult = await fetchDataEvent({
        endpoint: pathAPI.GET_CURRENCY_LIST,
        method: API_METHOD.GET,
      });
      if (currenyResult.status) {
        const listCurrencies = currenyResult?.fetchData?.listCurrencies;
        currencyParser.current = listCurrencies;
        return listCurrencies;
      }
    } catch (error) {
      console.log({ error });
    }
  }, []);

  const handleBalance = async (currencies) => {
    try {
      const balancedata = await fetchDataEvent({
        endpoint: pathAPI.GET_BALANCE,
        method: API_METHOD.GET,
      });

      if (balancedata.status) {
        const balance = balancedata?.fetchData?.balances ?? [];
        if (balance) {
          setDepositeSelection(
            balance.map(({ currency }) => ({
              label: currency,
              value: currency,
            }))
          );
          totalBalanceRef.current = balance;
          if (balance?.length > 0) {
            leftRefSelected.current = balance[0].currency;
            setBalanceRef(balance[0]);
            const currenciesFilter = currencies.filter(
              (item) => item.currency === balance[0]?.currency
            );
            setRightSelection(currenciesFilter);
            if (currenciesFilter?.length > 0) {
              handleGetAddress({
                currency: currenciesFilter[0].currency,
                network: currenciesFilter[0].network,
              });
            }
          }
        }
      }
    } catch (error) {
      console.log({ error });
    }
  };

  const handleChangeCoin = useCallback(
    (currency) => {
      const currenciesFilter = currencyParser.current.filter(
        (res) => res.currency === currency
      );
      setRightSelection(currenciesFilter);
      if (currenciesFilter?.length > 0) {
        leftRefSelected.current = currency;
        handleGetAddress({
          currency: currenciesFilter[0].currency,
          network: currenciesFilter[0].network,
        });
      }
    },
    [currencyParser]
  );

  const handleGetAddress = async (obj) => {
    try {
      const dataAddress = await fetchDataEvent({
        endpoint: pathAPI.GET_ADDRESS_WALLET,
        method: API_METHOD.POST,
        sendData: obj,
      });
      if (dataAddress?.status) {
        setDataView(dataAddress?.fetchData);
      }
    } catch (error) {}
  };

  const handleChangeCurrencies = (netW) => {
    handleGetAddress({
      currency: leftRefSelected.current,
      network: netW,
    });
  };

  useEffect(() => {
    (async () => {
      const result = await handleGetListCurrency();
      await handleBalance(result);
    })();
  }, []);

  return (
    <MutualWrap>
      <CardView title={intl.formatMessage(translationsComponents.DEPOSITE)}>
        <Row
          gutter={[16, { xs: 8, sm: 16, md: 20, lg: 32 }]}
          style={{
            color: appColor.textWhiteColor,
            alignItems: "stretch",
            justifyContent: "space-between",
          }}
        >
          <Col
            xs={24}
            md={11}
            xl={11}
            style={{
              height: "auto",
            }}
          >
            {balanceRef && (
              <DepositeLeftColumn
                intl={intl}
                dataView={dataView}
                coinList={depositeSelection}
                handleChangeCoin={handleChangeCoin}
                currentbalance={balanceRef}
                initCoin={balanceRef.currency}
              />
            )}
          </Col>
          <Col
            xs={24}
            md={11}
            xl={11}
            style={{
              height: "auto",
            }}
          >
            {dataView && (
              <DepositeRightColumn
                intl={intl}
                dataView={dataView}
                username={username}
                coinList={rightSelection}
                handleChangeCurrencies={handleChangeCurrencies}
              />
            )}
          </Col>
        </Row>
      </CardView>
    </MutualWrap>
  );
}

export default DepositeViewHeader;
