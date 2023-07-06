import { combineReducers, configureStore} from '@reduxjs/toolkit'
import {persistReducer } from 'redux-persist'
import logger from 'redux-logger';
import  userReducer  from './Slices/userSlice'
import  postReducer  from './Slices/postSlice'
import adminReducer from './Slices/adminSlice'
import storage from 'redux-persist/lib/storage'

const persistConfig = {
    key: 'root',
    storage
}

const reducers = combineReducers({
    userReducer,
    postReducer,
    adminReducer
})

const persistedReducer = persistReducer( persistConfig, reducers)

export const store = configureStore ({
    reducer: {
         persistedReducer
    },
    middleware: [logger]
})