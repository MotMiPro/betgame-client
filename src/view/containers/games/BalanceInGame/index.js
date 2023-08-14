import React from "react";
// import { parseCurrency } from "~/ultils/currency";
import { isMobile } from "react-device-detect";
import { CardWrapper } from "../../../UI/components";
import { appColor } from "../../../../settings/constants";
import {
  // BadgeWrap,
  ColWrapper,
  RowWrapper,
} from "~/view/UI/components/antComponents";
import { GameIcon } from "~/view/UI/components/GameIcons";
import styled from "styled-components";
// import { RootContext } from "~/contextAPI/Authen";
// import { useIntl } from "react-intl";
// import translationsComponents from "~/languageProvider/translateKeys";

function AccountBalance({ title }) {
  // const intl = useIntl();
  // const { currentBalance } = useContext(RootContext);
  // const balanceSetting =
  //   [...currentBalance].find((item) => item.currency === USDT) || false;
  return (
    <CustomWrapper
      bordered={false}
      title={
        <RowWrapper
          gutter={[16, { xs: 8, sm: 16, md: 24, lg: 32 }]}
          align="middle"
          justify="space-between"
          style={{ color: appColor.textWhiteColor }}
        >
          <ColWrapper
            xs={24}
            md={8}
            xl={8}
            style={{
              width: "100%",
              overflow: "hidden",
            }}
          >
            <div
              style={{
                display: "flex",
                justifyContent: isMobile ? "center" : "flex-start",
                padding: "0 5px",
                flexDirection: isMobile ? "column" : "row",
                alignItems: "center",
              }}
            >
              <GameIcon iconSize={22} labelSize={24} name={title} />
            </div>
          </ColWrapper>
        </RowWrapper>
      }
      style={{ backgroundColor: "transparent" }}
    ></CustomWrapper>
  );
}

export default React.memo(AccountBalance);

const CustomWrapper = styled(CardWrapper)`
  .ant-card-body {
    padding: 0 !important;
  }
`;

// const BalanceNumber = ({ number }) => {
//   const arrNumber = Array.from(number.toString());
//   return (
//     <div style={balanceStyle}>
//       {arrNumber.map((num, idx) => {
//         const parseNum = num === "." ? "." : parseInt(num);
//         return (
//           <BadgeWrap
//             showZero
//             key={idx}
//             style={
//               isMobile
//                 ? { ...mobileStyle, ...mutualStyle(idx) }
//                 : { ...pcStyle, ...mutualStyle(idx) }
//             }
//             count={parseNum}
//           />
//         );
//       })}
//     </div>
//   );
// };

// const unitMutualStyle = {
//   border: `1px solid ${appColor.gray11}`,
//   borderTopRightRadius: 5,
//   borderBottomRightRadius: 5,
//   marginLeft: -1,
//   width: "auto",
//   fontWeight: 600,
// };
// const pcStyleUnit = {
//   fontSize: 32,
//   height: 60,
//   lineHeight: "60px",
//   padding: "0 10px",
// };
// const mobileUnitStyle = {
//   height: 42,
//   lineHeight: "42px",
//   padding: "0 5px",
// };

const mutualStyle = (idx) => {
  return {
    backgroundColor: "transparent",
    boxShadow: "none",
    fontWeight: 600,
    border: `1px solid ${appColor.gray11}`,
    borderRadius: 0,
    borderTopLeftRadius: idx === 0 ? 5 : 0,
    borderBottomLeftRadius: idx === 0 ? 5 : 0,
    marginLeft: idx === 0 ? 0 : -1,
    display: "flex",
    justifyContent: "center",
    flexDirection: "column",
    alignItems: "center",
    width: "auto",
  };
};

const mobileStyle = {
  height: 42,
  lineHeight: "42px",
  width: "auto",
  padding: "0 8px",
  fontSize: 18,
};

const pcStyle = {
  fontSize: 42,
  height: 60,
  lineHeight: "60px",
  padding: "0 10px",
};

const balanceStyle = {
  fontWeight: 600,
  overflow: "hidden",
  display: "flex",
  flexWrap: "nowrap",
};
