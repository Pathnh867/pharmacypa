import { combineReducers, configureStore } from '@reduxjs/toolkit'
import { 
  persistStore, 
  persistReducer,
  FLUSH, 
  REHYDRATE, 
  PAUSE, 
  PERSIST, 
  PURGE, 
  REGISTER 
} from 'redux-persist'
import productReducer from './slide/productSlide'
import userReducer from './slide/userSlide'
import orderReducer from './slide/orderSlide'
import storage from 'redux-persist/lib/storage'

const persistConfig = {
  key: 'root',
  version:1,
  storage,
  blacklist: ['product']
}

const rootReducer = combineReducers({
    product: productReducer,
    user: userReducer,
    order: orderReducer
})

const persistedReducer = persistReducer(persistConfig, rootReducer)

export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [
          FLUSH,
          REHYDRATE,
          PAUSE,
          PERSIST,
          PURGE,
          REGISTER
        ]
      }
    })
});
export let persistor = persistStore(store)