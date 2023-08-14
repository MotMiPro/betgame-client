import React from "react";
import styled from "styled-components";
import { useSelector } from "react-redux";
import GameLayout from "../view/UI/layout";
import { ContextProvider } from "../contextAPI/Authen";
import { BrowserRouter as Switch, Route } from "react-router-dom";
import { routeManager, authRouteManager } from "../settings/route";
import SocketProvider from "~/customHooks";
import { GameContextProvider } from "~/contextAPI/GameManager";

const WrappApp = styled.div`
  background-color: #272931;
  min-height: calc(100vh);
`;

export default function SubApp() {
  const { userInfos } = useSelector((state) => state.userReducer);
  return (
    <ContextProvider>
      <GameContextProvider>
        <SocketProvider>
          <WrappApp>
            <Switch>
              <GameLayout>
                {(userInfos ? authRouteManager : routeManager).map(
                  ({ exact, path, component }, index) => (
                    <Route
                      key={index}
                      exact={exact}
                      path={`${path}`}
                      component={component}
                    />
                  )
                )}
              </GameLayout>
            </Switch>
          </WrappApp>
        </SocketProvider>
      </GameContextProvider>
    </ContextProvider>
  );
}
