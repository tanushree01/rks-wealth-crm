import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface User {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  gender: string;
  address: string;
  maritalStatus: string;
  userType: string;
  createdAt: string;
  updatedAt: string;
}

interface AuthState {
  token: string | null;
  userType: string | null;
  user: User | null;
}

const initialState: AuthState = {
  token: null,
  userType: null,
  user: null,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    loginSuccess: (
      state,
      action: PayloadAction<{ token: string; userType: string; user: User }>
    ) => {
      state.token = action.payload.token;
      state.userType = action.payload.userType;
      state.user = action.payload.user;
    },
    logout: (state) => {
      state.token = null;
      state.userType = null;
      state.user = null;
    },
  },
});

export const { loginSuccess, logout } = authSlice.actions;
export default authSlice.reducer;
