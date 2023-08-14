import React from "react";
import "../assets/sass/index.scss";
import "../assets/less/custom.less";
import "@fortawesome/fontawesome-free/js/solid";
import "@fortawesome/fontawesome-free/js/regular";
import "@fortawesome/fontawesome-free/js/brands";
import "@fortawesome/fontawesome-free/js/fontawesome";
import { Provider } from "react-redux";
import { PersistGate } from "redux-persist/lib/integration/react";
import { persistor, store } from "../state/store";
import { Router } from "react-router-dom";
import { createBrowserHistory } from "history";
import LanguageProvider from "~/languageProvider";

const history = createBrowserHistory();
import SubApp from "./subApp";

export default function RootApp() {
  return (
    <Provider store={store}>
      <LanguageProvider>
        <PersistGate loading={null} persistor={persistor}>
          <Router history={history}>
            <SubApp />
          </Router>
        </PersistGate>
      </LanguageProvider>
    </Provider>
  );
}
