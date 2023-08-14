import { Form, InputNumber } from "antd";
import React, { Fragment, useMemo, useState } from "react";
import { useIntl } from "react-intl";
import styled, { css, keyframes } from "styled-components";
import translationsComponents from "~/languageProvider/translateKeys";
import { appColor } from "~/settings/constants";
import {
  ButtonWrapper,
  InputWrapper,
  SelectWrapper,
} from "~/view/UI/components/antComponents";

const RightColumn = (props) => {
  let timeout = null;
  const intl = useIntl();
  const {
    dataView,
    currentbalance,
    form,
    isAuthen,
    isSubmmiting,
    coinList,
    handleChangeCurrencies,
  } = props;

  const minValue = dataView?.minWithdraw;

  const [receiveAmount, setReceiveAmount] = useState(0);

  const selectCoinList = useMemo(
    () =>
      coinList.map((item) => ({ label: item?.network, value: item?.network })),
    [coinList]
  );

  const handleChangeAmount = (value) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => {
      if (value > currentbalance?.amount) {
        form.setFieldsValue({
          amount: parseFloat(currentbalance?.amount),
        });
        return;
      } else {
        const result = value - dataView?.feeExternal;
        setReceiveAmount(result);
      }
    }, 300);
  };

  return (
    <div>
      <div
        style={{
          marginBottom: "24px",
        }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            padding: 5,
            alignItems: "center",
          }}
        >
          <Form.Item
            label={
              <span
                style={{
                  color: appColor.textSecondaryColor,
                  textTransform: "capitalize",
                }}
              >
                {intl.formatMessage(translationsComponents.NETWORK_TAB)}
              </span>
            }
            name="currency"
            initialValue={dataView?.network}
          >
            {selectCoinList?.length > 1 ? (
              <SelectWrapper
                allowClear={false}
                value={dataView?.network}
                style={{
                  width: 150,
                  borderRadius: 5,
                  color: appColor.white,
                  border: `1px solid ${appColor.textSecondaryColor}`,
                }}
                selectList={selectCoinList}
                placeholder="Select an option"
                handleChange={handleChangeCurrencies}
              />
            ) : (
              <ButtonWrapper
                style={{
                  backgroundColor: "transparent",
                  pointerEvents: "none",
                  color: appColor.textSecondaryColor,
                  width: 150,
                  border: `1px solid ${appColor.textSecondaryColor}`,
                  borderRadius: 5,
                }}
              >
                {dataView?.network}
              </ButtonWrapper>
            )}
          </Form.Item>
          <Form.Item>
            <div
              style={{
                color: appColor.textSecondaryColor,
                textAlign: "right",
                textTransform: "capitalize",
              }}
            >
              <span
                style={{
                  display: "block",
                  marginBottom: 7,
                  textTransform: "capitalize",
                }}
              >
                {intl.formatMessage(translationsComponents.MIN_WITHDRAW)}
              </span>
              <span
                style={{
                  fontWeight: "bold",
                }}
              >{`${minValue} ${dataView?.currency}`}</span>
            </div>
          </Form.Item>
        </div>
      </div>

      <Form.Item
        label={
          <span
            style={{
              color: appColor.textSecondaryColor,
              textTransform: "capitalize",
            }}
          >
            {`${intl.formatMessage(translationsComponents.RECIPIENT)} ${
              dataView?.network
            } ${intl.formatMessage(translationsComponents.ADDRESS_TAB)}`}
          </span>
        }
        name="address"
        rules={[
          {
            required: true,
            message: `${intl.formatMessage(
              translationsComponents.ERR_INPUT_ADDRESS
            )}`,
          },
        ]}
      >
        <InputWrapper
          type="text"
          placeholder={intl.formatMessage(
            translationsComponents.WALLET_ADDRESS
          )}
          style={{
            background: appColor.borderPrimaryColor,
            height: "40px",
            color: appColor.textSecondaryColor,
            borderRadius: 8,
          }}
        />
      </Form.Item>
      {dataView?.hasAddressTag && (
        <Fragment>
          <CollapseStype
            label={
              <span
                style={{
                  color: appColor.textSecondaryColor,
                  textTransform: "capitalize",
                }}
              >
                {intl.formatMessage(translationsComponents.MEMO_TAB)}
              </span>
            }
            name="memo"
          >
            <InputWrapper
              type="text"
              placeholder={intl.formatMessage(translationsComponents.MEMO_TAB)}
              style={{
                background: appColor.borderPrimaryColor,
                height: "40px",
                color: appColor.textSecondaryColor,
                borderRadius: 8,
              }}
              value={dataView?.hasAddressTag}
            />
          </CollapseStype>
          <div
            style={{
              backgroundColor: "rgba(241, 196, 15,0.3)",
              padding: 5,
              borderRadius: 5,
              marginBottom: 20,
              fontSize: 12,
            }}
          >
            <span>
              <i className="fas fa-info-circle" style={{ marginRight: 5 }} />
              Most exchange requires MEMO for your XRP to be correctly credited.
              Please ensure that you have inputted the correct MEMO for your
              withdrawal.
            </span>
          </div>
        </Fragment>
      )}
      <Form.Item
        label={
          <span
            style={{
              color: appColor.textSecondaryColor,
              textTransform: "capitalize",
            }}
          >
            {intl.formatMessage(translationsComponents.AMOUNT_TAB)}
          </span>
        }
        name="amount"
        initialValue={0}
      >
        <InputNumber
          type="number"
          style={{
            background: appColor.borderPrimaryColor,
            height: "40px",
            color: appColor.textSecondaryColor,
            borderRadius: 8,
            width: "100%",
            border: "none",
            lineHeight: "40px",
          }}
          min={0}
          max={currentbalance?.amount}
          onChange={handleChangeAmount}
        />
      </Form.Item>
      {isAuthen && (
        <CollapseStype
          label={
            <span
              style={{
                color: appColor.textSecondaryColor,
                textTransform: "capitalize",
              }}
            >
              {intl.formatMessage(translationsComponents.GOOGLE_CODE)}
            </span>
          }
          name="token2fa"
          rules={[
            {
              required: true,
              message: `${intl.formatMessage(
                translationsComponents.WARNING_CODE
              )}`,
            },
          ]}
        >
          <InputWrapper
            type="text"
            style={{
              height: "40px",
              width: "100%",
              borderRadius: 8,
              color: appColor.textSecondaryColor,
              background: appColor.borderPrimaryColor,
            }}
            placeholder={intl.formatMessage(translationsComponents.AUTHORIZE)}
          />
        </CollapseStype>
      )}
      <Form.Item>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <div
            style={{
              color: appColor.textSecondaryColor,
              textTransform: "capitalize",
            }}
          >
            <span
              style={{
                display: "block",
                marginBottom: 7,
                textTransform: "capitalize",
              }}
            >
              {intl.formatMessage(translationsComponents.BALANCE_AVAILABEL)}
            </span>
            <span>{`${currentbalance?.amount} ${currentbalance?.currency}`}</span>
          </div>
          <div
            style={{
              color: appColor.textSecondaryColor,
              textTransform: "capitalize",
            }}
          ></div>
        </div>
      </Form.Item>
      <Form.Item
        style={{
          borderBottom: `1px solid ${appColor.borderPrimaryColor}`,
        }}
      />
      <Form.Item style={{ textAlign: "right", marginBottom: 0 }}>
        <div
          style={{
            color: appColor.textSecondaryColor,
            display: "flex",
            justifyContent: "flex-end",
            textTransform: "capitalize",
          }}
        >
          <span>{`${intl.formatMessage(
            translationsComponents.TRANSACTION_FEE
          )} ${dataView?.feeExternal} ${dataView?.currency}`}</span>
        </div>
      </Form.Item>
      <Form.Item
        name="receiveamount"
        style={{
          textAlign: "right",
        }}
      >
        <div
          style={{
            color: appColor.textSecondaryColor,
            display: "flex",
            justifyContent: "flex-end",
            marginBottom: 7,
            textTransform: "capitalize",
          }}
        >
          <span>{`${intl.formatMessage(
            translationsComponents.RECEIVE_AMOUNT
          )} ${receiveAmount < 0 ? 0 : receiveAmount} ${
            dataView?.currency
          }`}</span>
        </div>
      </Form.Item>
      <Form.Item>
        <ButtonWrapper
          style={{
            maxWidth: "100%",
            width: "100%",
          }}
          type="primary"
          htmlType="submit"
          disabled={isSubmmiting}
        >
          {intl.formatMessage(translationsComponents.WITH_DRAW)}
        </ButtonWrapper>
      </Form.Item>
    </div>
  );
};

export default React.memo(RightColumn);

const CollapseStype = styled(Form.Item)`
  animation: ${() =>
    css`
      ${animateTop} .3s ease-in-out
    `};
  position: relative;
`;

const animateTop = () => {
  return keyframes`
  from {
    max-height:0px;
    height:100%;
    }
    to {
      max-height: 500px;
      height:100%;
    }
  `;
};
