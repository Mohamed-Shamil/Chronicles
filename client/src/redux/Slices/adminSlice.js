import {createSlice} from '@reduxjs/toolkit'

const initialState = {
    id : "",
    email: "",
    accessToken : ""
};

export const adminSlice = createSlice ({
    name: "adminDetails",
    initialState,
    reducers: {
        setDetails : (state,action) => {
            const {id,email,accessToken} = action.payload
            state.id = id !== undefined ? id : state.id;
            state.email = email !== undefined ? email : state.email;
            state.accessToken = accessToken !== undefined ? accessToken : state.accessToken;
        },
        resetDetails:(state) => {
            state.userId = ""
            state.email = ""
            state.accessToken = ""
          }
    }
})




export const {setDetails,resetDetails} = adminSlice.actions;
export default adminSlice.reducer;
export const userReducer = (state) => state.persistedReducer.adminReducer;