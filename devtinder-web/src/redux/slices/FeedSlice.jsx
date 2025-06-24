import { createSlice } from "@reduxjs/toolkit";

export const feedSlice = createSlice({
    name:"feed" ,
    initialState: null ,
    reducers:{
        setFeed: (state, action) => {
            return action.payload
        },
        clearFeed: (state , action) => {
            const newFeed = state.filter((user) => user._id !== action.payload);
            return newFeed;
        }
    }
});

export default feedSlice.reducer;
export const { setFeed, clearFeed } = feedSlice.actions;