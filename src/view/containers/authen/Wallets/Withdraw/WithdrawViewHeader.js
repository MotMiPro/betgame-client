import { Col, Row, Form } from "antd";
import LeftColumn from "./LeftColumn";
import RightColumn from "./RightColumn";
import { useIntl } from "react-intl";
import { MutualWrap } from "~/view/UI/reuseAbles";
import { useFetchAPI } from "~/customHooks/useFetchAPI";
import { CardView } from "~/view/UI/components/CardWrapper";
import { pushNotification } from "~/ultils/pushNotifications";
import React, { useCallback, useEffect, useRef, useState } from "react";
import translationsComponents from "~/languageProvider/translateKeys";
import { API_METHOD, appColor, pathAPI, USDT } from "~/settings/constants";

function WithdrawViewHeader() {
  const intl = useIntl();
  const [form] = Form.useForm();
  const [dataView, setDataView] = useState(null);
  const [currentbalance, setCurrentbalance] = useState(null);
  const [isAuthen, setIsAuthen] = useState(false);

  const [withDrawLeftSelection, setWithDrawLeftSelection] = useState(null);
  const totalBalanceRef = useRef(null);
  const [initSelection, setInitSelection] = useState(null);
  const [rightSelection, setRightSelection] = useState(null);

  const currencyParser = useRef(null);
  const netWorkRef = useRef(null);
  const selectCurRef = useRef(null);

  const [isSubmmiting, setIsSubmmiting] = useState(false);

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

  const handleBalance = async (currencies = null) => {
    try {
      const data = await fetchDataEvent({
        endpoint: pathAPI.GET_BALANCE,
        method: API_METHOD.GET,
      });
      if (data.status) {
        const balance = data?.fetchData?.balances ?? [];
        setWithDrawLeftSelection(
          balance.map(({ currency }) => ({
            label: currency,
            value: currency,
          }))
        );
        totalBalanceRef.current = balance;
        if (balance) {
          const findRef = balance.find(
            (item) => item?.currency === selectCurRef.current
          );
          if (selectCurRef.current && findRef) {
            setCurrentbalance(findRef);
            setInitSelection(findRef);
          } else {
            setCurrentbalance(balance[0]);
            setInitSelection(balance[0]);
          }
          if (!!currencies) {
            const currenciesFilter = currencies.filter(
              (item) => item.currency === balance[0]?.currency
            );
            setRightSelection(currenciesFilter);
            setDataView(currenciesFilter[0]);
          }
        }
      }
    } catch (error) {
      console.log({ error });
    }
  };

  useEffect(() => {
    (async () => {
      const result = await handleGetListCurrency();
      await handleBalance(result);
    })();
  }, []);

  const handleChangeCoin = useCallback(
    (currency) => {
      selectCurRef.current = currency;
      const currenciesFilter = currencyParser.current.filter(
        (item) => item.currency === currency
      );
      setRightSelection(currenciesFilter);
      setDataView(currenciesFilter[0]);
      const foundBalance = totalBalanceRef.current.find(
        (item) => item?.currency === currency
      );
      foundBalance && setCurrentbalance(foundBalance);
    },
    [currencyParser, totalBalanceRef]
  );

  const handleSubmitWithDraw = async (values) => {
    if (values) {
      try {
        const data = await fetchDataEvent({
          endpoint: pathAPI.WITHDRAWAL,
          method: API_METHOD.POST,
          sendData: {
            address: values?.address,
            network: dataView?.network ?? netWorkRef.current,
            currency: dataView?.currency,
            memo: values?.memo,
            token2fa: values?.token2fa ?? "",
            amount: values?.amount ?? dataView?.minWithdraw,
          },
        });
        if (data.status) {
          pushNotification({
            mess: `${intl.formatMessage(
              translationsComponents.EMAIL_CHECKING
            )}`,
            title: "Bitwin",
            type: "success",
          });
          form.resetFields();
          handleBalance();
          return;
        }
        const ggAuth = data?.fetchData?.code === "USER018";
        if (ggAuth) {
          setIsAuthen(true);
          return;
        }
      } catch (error) {
        console.log({ error });
        setIsSubmmiting(false);
      }
    }
  };

  const handleChangeCurrencies = (netW) => {
    netWorkRef.current = netW;
    const currenciesFilter = currencyParser.current.filter(
      (item) => item.network === netW
    );
    setDataView(currenciesFilter[0]);
  };

  return (
    <MutualWrap>
      <CardView title={intl.formatMessage(translationsComponents.WITH_DRAW)}>
        <Form form={form} layout="vertical" onFinish={handleSubmitWithDraw}>
          <Row
            gutter={[16, { xs: 8, sm: 16, md: 20, lg: 32 }]}
            style={{
              alignItems: "stretch",
              color: appColor.textWhiteColor,
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
              {initSelection && (
                <LeftColumn
                  initCoin={initSelection?.currency}
                  coinList={withDrawLeftSelection}
                  handleChangeCoin={handleChangeCoin}
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
              {dataView && rightSelection && (
                <RightColumn
                  form={form}
                  dataView={dataView}
                  isAuthen={isAuthen}
                  isSubmmiting={isSubmmiting}
                  currentbalance={currentbalance}
                  handleSubmitWithDraw={handleSubmitWithDraw}
                  coinList={rightSelection}
                  handleChangeCurrencies={handleChangeCurrencies}
                />
              )}
            </Col>
          </Row>
        </Form>
      </CardView>
    </MutualWrap>
  );
}

export default React.memo(WithdrawViewHeader);
