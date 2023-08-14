// persist version

import rootSaga from "./middlewares";
import { createLogger } from "redux-logger";
import createSagaMiddleware from "redux-saga";
import * as compReducer from "./ducks/reducers";
import storage from "redux-persist/lib/storage/session";
import { persistStore, persistReducer } from "redux-persist";
import { createStore, applyMiddleware, combineReducers, compose } from "redux";
import autoMergeLevel2 from "redux-persist/lib/stateReconciler/autoMergeLevel2";

// create the saga middleware
const sagaMiddleware = createSagaMiddleware();

const persistConfig = {
  key: "_hash_development",
  storage: storage,
  stateReconciler: autoMergeLevel2,
};

const rootReducer = combineReducers(compReducer);
const composeEnhancers =
  process.env.NODE_ENV !== "production" &&
  typeof window === "object" &&
  window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__
    ? window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__({})
    : compose;

const middleWare = [sagaMiddleware];

const enhancer =
  process.env.NODE_ENV !== "production"
    ? composeEnhancers(applyMiddleware(...middleWare, createLogger()))
    : composeEnhancers(applyMiddleware(...middleWare));
const pReducer = persistReducer(persistConfig, rootReducer);
// mount it on the Store
const store = createStore(pReducer, enhancer);
sagaMiddleware.run(rootSaga);
const persistor = persistStore(store);
export { persistor, store };
