import { combineReducers, configureStore } from '@reduxjs/toolkit'
import { persistReducer } from 'redux-persist'
import storage from 'redux-persist/lib/storage'
import walletReducer from '../slices/walletSlice'
import networkReducer from '../slices/networkSlice'
import thunk from 'redux-thunk'

const persistConfig = {
  key: 'root',
  storage,
  blacklist: ['modals', 'networks']
}

const walletPersistConfig = {
  key: 'wallet',
  storage,
  whitelist: ['forceReconnect']
}

const networkPersistConfig = {
  key: 'networks',
  storage,
  whitelist: ['activeNetwork']
}

const reducers = combineReducers({
  wallet: persistReducer(walletPersistConfig, walletReducer),
  networks: persistReducer(networkPersistConfig, networkReducer)
})

const persistedReducer = persistReducer(persistConfig, reducers)

export const store = configureStore({
  reducer: persistedReducer,
  middleware: [thunk]
})
