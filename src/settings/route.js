import React from "react";
import { pathName } from "./constants";
import OpenerPage from "../view/containers/openingPage";
import {
  LoginUI,
  SignUpUI,
  SettingAccount,
  WalletSetting,
  SwapCurrency,
  BettingHistory,
} from "../view/containers/authen";
import {
  DiceGame,
  MoonGame,
  SlotsGame,
  NewDice,
} from "../view/containers/games";
import Affiliate from "~/view/containers/Affiliate";
import WithdrawTransaction from "~/view/containers/authen/Wallets/Withdraw";
import DepositeTransaction from "~/view/containers/authen/Wallets/Deposite";
import EmailVerification from "../view/containers/authen/VerifyComponents/EmailVerify";
import FundWithdraw from "../view/containers/authen/VerifyComponents/FundWithdraw";
import PasswordResetter from "../view/containers/authen/VerifyComponents/ResetPassword";
import { Redirect } from "react-router";

export const routeManager = [
  {
    exact: true,
    path: "/",
    component: () => <OpenerPage />,
  },
  {
    exact: true,
    path: `${pathName._MOON}`,
    component: () => <MoonGame />,
  },
  {
    exact: true,
    path: `${pathName._DICE}`,
    component: () => <DiceGame />,
  },
  {
    exact: true,
    path: `${pathName._NEW_DICE}`,
    component: () => <NewDice />,
  },
  {
    exact: true,
    path: `${pathName._SLOTS}`,
    component: () => <SlotsGame />,
  },
  {
    exact: true,
    path: `${pathName._LOGIN}`,
    component: () => <LoginUI />,
  },
  {
    exact: true,
    path: `${pathName._SIGNUP}`,
    component: () => <SignUpUI />,
  },
  // {
  //   exact: true,
  //   path: `${pathName._SETTING}`,
  //   component: () => <SettingAccount />,
  // },
  {
    exact: true,
    path: `${pathName._VERIFY}/:verifyCode`,
    component: () => <EmailVerification />,
  },
  {
    exact: true,
    path: `${pathName._FUNDWIHDRAW}/:withdrawToken`,
    component: () => <FundWithdraw />,
  },
  {
    exact: true,
    path: `${pathName._RESETPASSWORD}/:hash`,
    component: () => <PasswordResetter />,
  },
  // {
  //   path: "*",
  //   component: () => <NotFound />,
  // },
  <Redirect to="/" />,
];
export const authRouteManager = [
  {
    exact: true,
    path: "/",
    component: () => <OpenerPage />,
  },
  {
    exact: true,
    path: `${pathName._MOON}`,
    component: () => <MoonGame />,
  },
  {
    exact: true,
    path: `${pathName._DICE}`,
    component: () => <DiceGame />,
  },
  {
    exact: true,
    path: `${pathName._NEW_DICE}`,
    component: () => <NewDice />,
  },
  {
    exact: true,
    path: `${pathName._SLOTS}`,
    component: () => <SlotsGame />,
  },
  {
    exact: true,
    path: `${pathName._SETTING}`,
    component: () => <SettingAccount />,
  },
  {
    exact: true,
    path: `${pathName._BETTING_HISTORY}`,
    component: () => <BettingHistory />,
  },
  {
    exact: true,
    path: `${pathName._SWAP}`,
    component: () => <SwapCurrency />,
  },
  {
    exact: true,
    path: `${pathName._WITHDRAW}`,
    component: () => <WithdrawTransaction />,
  },
  {
    exact: true,
    path: `${pathName._BALANCE}`,
    component: () => <WalletSetting />,
  },
  {
    exact: true,
    path: `${pathName._DEPOSITE}`,
    component: () => <DepositeTransaction />,
  },
  {
    exact: true,
    path: `${pathName._AFFILIATE}`,
    component: () => <Affiliate />,
  },
  {
    exact: true,
    path: `${pathName._VERIFY}/:verifyCode`,
    component: () => <EmailVerification />,
  },
  {
    exact: true,
    path: `${pathName._FUNDWIHDRAW}/:withdrawToken`,
    component: () => <FundWithdraw />,
  },
  {
    exact: true,
    path: `${pathName._RESETPASSWORD}/:hash`,
    component: () => <PasswordResetter />,
  },
  // {
  //   path: "*",
  //   component: () => <NotFound />,
  // },
  <Redirect to="/" />,
];
