import {configureStore}  from '@reduxjs/toolkit';
import userReducer from './slices/UserSlice';
import feedReducer from './slices/FeedSlice';
import connectionReducer from './slices/ConnectionSlice';
import requestReducer from './slices/RequestSlice';

export const store = configureStore({
    reducer: {
        user: userReducer,        
        feed: feedReducer,
        connection:connectionReducer,
        request: requestReducer,
    },
});