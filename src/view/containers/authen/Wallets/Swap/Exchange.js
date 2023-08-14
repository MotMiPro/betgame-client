import React, { useCallback, useContext, useEffect, useState } from "react";
import { useIntl } from "react-intl";
import { MutualWrap } from "~/view/UI/reuseAbles";
import {
  ButtonWrapper,
  ColWrapper,
  FormItemWrapper,
  FormWrapper,
  InputNumberWrapper,
  RowWrapper,
} from "~/view/UI/components/antComponents";
import { useForm } from "antd/lib/form/Form";
import { API_METHOD, appColor, pathAPI } from "~/settings/constants";
import { CardView } from "~/view/UI/components/CardWrapper";
import translationsComponents from "~/languageProvider/translateKeys";
import { RootContext } from "~/contextAPI/Authen";
import { useFetchAPI } from "~/customHooks/useFetchAPI";
import { Select } from "antd";
import styled, { css, keyframes } from "styled-components";
import { pushNotification } from "~/ultils/pushNotifications";
import { isMobile } from "react-device-detect";
import { useSelector } from "react-redux";

function ExchangeCurrency() {
  const intl = useIntl();
  const [form] = useForm();
  const { fetchDataEvent } = useFetchAPI();
  const { currentBalance, setCurrentBalance } = useContext(RootContext);
  const { userInfos } = useSelector((state) => state.userReducer);

  const [coinList, setCoinList] = useState(null);
  const [productList, setproductList] = useState(null);
  const [receiveList, setReceiveList] = useState([]);
  const [anBalance, setAnBalance] = useState(0);
  const [currenPrice, setCurrenPrice] = useState(null);

  const handleGetBalance = useCallback(async (accessToken) => {
    try {
      const result = await fetchDataEvent({
        endpoint: pathAPI.GET_BALANCE,
        method: API_METHOD.GET,
        attachAuth: { Authorization: "Bearer " + accessToken },
      });
      if (result.status) {
        setCurrentBalance(result?.fetchData?.balances);
      }
    } catch (error) {
      console.log({ error });
    }
  }, []);

  const handleGetListCurrency = async () => {
    try {
      const currenyResult = await fetchDataEvent({
        endpoint: pathAPI.GET_PRODUCT_LIST,
        method: API_METHOD.GET,
      });

      if (currenyResult.status) {
        const products = currenyResult?.fetchData?.products;
        setproductList(products);
      }
    } catch (error) {
      console.log({ error });
    }
  };

  useEffect(() => {
    handleGetListCurrency();
  }, []);

  useEffect(() => {
    if (currentBalance?.length > 0) {
      setCoinList(
        currentBalance.map((coin) => ({
          label: coin?.currency,
          value: coin?.currency,
        }))
      );
    }
  }, [currentBalance]);

  const handleSwap = async (values) => {
    try {
      if (values?.amount > 0) {
        const swapResult = await fetchDataEvent({
          endpoint: pathAPI.CREATE_SWAP,
          method: API_METHOD.POST,
          sendData: {
            base: values?.base,
            quote: currenPrice?.quote,
            amount: values?.amount,
            price: currenPrice?.price,
          },
        });
        if (swapResult?.status) {
          form.setFieldsValue({
            quote: null,
            receive: 0,
            base: null,
          });
          setAnBalance(0);
          handleGetBalance(userInfos?._token);
          pushNotification({
            time: 5,
            type: "success",
            title: "Bitwin",
            mess: `${intl.formatMessage(translationsComponents.SUCCESS)}`,
          });
        }
      } else {
        form.setFields([
          {
            name: "amount",
            errors: [`Minimum ${currenPrice?.minAmount} ${currenPrice?.base}`],
          },
        ]);
      }
    } catch (error) {
      console.log({ error });
    }
  };

  const handleChangeCoin = (value) => {
    form.setFieldsValue({
      quote: null,
      receive: 0,
    });
    setCurrenPrice(null);
    const result = productList.filter((item) => item.base === value);
    const balanceResult = currentBalance.find(
      (item) => item.currency === value
    );
    if (balanceResult) {
      setAnBalance(balanceResult);
    }
    if (result) {
      setReceiveList(
        result.map(({ quote }) => ({ label: quote, value: quote }))
      );
    }
  };

  const handleGetValueSwap = (receive) => {
    const result = productList.find((item) => item.quote === receive);
    setCurrenPrice(result);
    if (result?.price) {
      const getAmountValue = form.getFieldValue("amount");
      if (!!getAmountValue) {
        form.setFieldsValue({
          receive: result?.price * getAmountValue,
        });
      }
    }
  };

  const handleInputChange = (input) => {
    if (!!input && !!currenPrice) {
      form.setFieldsValue({
        receive: parseFloat(input) * currenPrice?.price,
      });
    }
  };

  return (
    <MutualWrap>
      <CardView
        title={intl.formatMessage(translationsComponents.SWAP)}
        icon={<i className="fas fa-exchange-alt" />}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <div
            style={{
              backgroundColor: appColor.bgPrimaryColor,
              maxWidth: 600,
              width: "100%",
              borderRadius: 10,
            }}
          >
            <CardView
              title={"Exchange"}
              style={{ backgroundColor: "transparent", padding: 0 }}
            >
              <FormWrapper
                initialValues={{
                  amount: 0,
                  receive: 0,
                }}
                form={form}
                layout="vertical"
                onFinish={handleSwap}
              >
                <RowMutual gutter={8}>
                  <ColWrapper xs={24} md={12} xl={12}>
                    <FormItemWrapper
                      name={["amount"]}
                      label={
                        <span
                          style={{
                            color: appColor.white,
                            textTransform: "capitalize",
                          }}
                        >
                          {intl.formatMessage(translationsComponents.SWAP)}
                        </span>
                      }
                      rules={[
                        {
                          required: true,
                          message: `${intl.formatMessage(
                            translationsComponents.PLEASE_INPUT
                          )}`,
                        },
                      ]}
                    >
                      <InputNumberWrapper
                        style={{
                          color: appColor.white,
                          backgroundColor: "transparent",
                          border: `1px solid ${appColor.borderPrimaryColor}`,
                        }}
                        min={0}
                        onChange={handleInputChange}
                      />
                    </FormItemWrapper>
                  </ColWrapper>
                  <ColWrapper xs={24} md={12} xl={12}>
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "flex-end",
                        flexDirection: "column",
                      }}
                    >
                      <FormItemWrapper
                        name="base"
                        rules={[
                          {
                            required: true,
                            message: `${intl.formatMessage(
                              translationsComponents.FUER002_INVALID_CURRENCY
                            )}`,
                          },
                        ]}
                      >
                        <SelectTempWrapper
                          style={{
                            width: isMobile ? "100%" : 150,
                            color: appColor.white,
                            float: "right",
                            border: `1px solid ${appColor.borderPrimaryColor}`,
                            borderRadius: 5,
                            height: 40,
                          }}
                          options={coinList}
                          onChange={handleChangeCoin}
                          placeholder={intl.formatMessage(
                            translationsComponents.SELECT_AN_OPTION
                          )}
                        />
                      </FormItemWrapper>
                      <div
                        style={{
                          color: appColor.white,
                          padding: "5px 10px",
                          textAlign: "right",
                        }}
                      >
                        <span>
                          Balance: <span>{anBalance?.amount ?? 0}</span>
                        </span>
                      </div>
                    </div>
                  </ColWrapper>
                </RowMutual>
                <div
                  style={{
                    textAlign: "center",
                    fontSize: 20,
                    color: appColor.textPrimaryColor,
                    padding: 15,
                  }}
                >
                  <i className="fas fa-arrow-alt-circle-down" />
                </div>
                <RowMutual gutter={8}>
                  <ColWrapper xs={24} md={12} xl={12}>
                    <FormItemWrapper
                      name={["receive"]}
                      label={
                        <span style={{ color: appColor.white }}>Receive</span>
                      }
                    >
                      <InputNumberWrapper
                        style={{
                          color: appColor.white,
                          backgroundColor: "transparent",
                          border: `1px solid ${appColor.borderPrimaryColor}`,
                        }}
                      />
                    </FormItemWrapper>
                  </ColWrapper>
                  <ColWrapper xs={24} md={12} xl={12}>
                    <FormItemWrapper
                      name={["quote"]}
                      rules={[
                        {
                          required: true,
                          message: `${intl.formatMessage(
                            translationsComponents.FUER002_INVALID_CURRENCY
                          )}`,
                        },
                      ]}
                    >
                      <SelectTempWrapper
                        style={{
                          width: isMobile ? "100%" : 150,
                          color: appColor.white,
                          border: `1px solid ${appColor.borderPrimaryColor}`,
                          borderRadius: 5,
                          height: 40,
                          float: "right",
                        }}
                        options={receiveList}
                        onChange={handleGetValueSwap}
                        placeholder={intl.formatMessage(
                          translationsComponents.SELECT_AN_OPTION
                        )}
                      />
                    </FormItemWrapper>
                  </ColWrapper>
                </RowMutual>
                <div
                  style={{
                    marginTop: 30,
                    width: "100%",
                    display: "flex",
                    justifyContent: "center",
                  }}
                >
                  <FormItemWrapper style={{ maxWidth: 300, width: "100%" }}>
                    <ButtonWrapper
                      block
                      type="primary"
                      htmlType="submit"
                      style={{ width: "100%", maxWidth: "100%", height: 40 }}
                    >
                      {intl.formatMessage(translationsComponents.SWAP)}
                    </ButtonWrapper>
                  </FormItemWrapper>
                </div>
                <div>
                  <div style={{ color: appColor.white, padding: 5 }}>
                    <FlexStyle>
                      {!!currenPrice ? (
                        <TransitionSmoothLeft>{`1 ${currenPrice?.base}`}</TransitionSmoothLeft>
                      ) : (
                        <span>1</span>
                      )}
                      {!!currenPrice ? (
                        <TransitionSmooth>{`${currenPrice?.price} ${currenPrice?.quote}`}</TransitionSmooth>
                      ) : (
                        <span>0</span>
                      )}
                    </FlexStyle>
                    <FlexStyle>
                      <span>Minimum</span>
                      {!!currenPrice ? (
                        <TransitionSmooth>{`${currenPrice?.minAmount} ${currenPrice?.base}`}</TransitionSmooth>
                      ) : (
                        <span>0</span>
                      )}
                    </FlexStyle>
                    <FlexStyle>
                      <span>Fee</span>
                      {!!currenPrice ? (
                        <TransitionSmooth>{`${currenPrice?.fee} ${currenPrice?.base}`}</TransitionSmooth>
                      ) : (
                        <span>0</span>
                      )}
                    </FlexStyle>
                  </div>
                </div>
              </FormWrapper>
            </CardView>
          </div>
        </div>
      </CardView>
    </MutualWrap>
  );
}

export default React.memo(ExchangeCurrency);

const RowMutual = styled(RowWrapper)`
  display: flex;
  justify-content: space-between;
  padding: 5px;
  border-radius: 10px;
  box-shadow: rgb(255 255 255 / 15%) 1.95px 1.95px 2.6px;
  align-items: flex-end;
  row-gap: 0 px;
`;

const FlexStyle = styled.div`
  display: flex;
  justify-content: space-between;
  padding: 5px 0;
  overflow: hidden;
`;

const TransitionSmooth = styled.span`
  position: relative;
  animation: ${() =>
    css`
      ${rightToLeft} .5s
    `};
  animation-fill-mode: forwards;
`;

const rightToLeft = keyframes`
from{
    opacity: 0;
    right:-40px;
}
to{
    opacity: 1;
    right:0
}
`;
const TransitionSmoothLeft = styled.span`
  position: relative;
  animation: ${() =>
    css`
      ${leftToRight} .5s
    `};
  animation-fill-mode: forwards;
`;

const leftToRight = keyframes`
from{
    opacity: 0;
    left:-40px;
}
to{
    opacity: 1;
    left:0
}
`;

const SelectTempWrapper = styled(Select)`
  .ant-select-selector {
    background: transparent !important;
    border: none !important;
  }
`;
