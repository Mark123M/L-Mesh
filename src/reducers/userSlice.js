import { createSlice } from "@reduxjs/toolkit";
import jwtDecode from "jwt-decode";

export const userSlice = createSlice({
    name: 'user',
    initialState: {
        value: null
    },
    reducers: {
        login: (state, action) => {
            state.value = jwtDecode(action.payload);
        },
        logout: (state) => {
            state.value = null;
        }
    }
})
// action creators used to send type and payload to reducer
export const { login, logout } = userSlice.actions;
export default userSlice.reducer;