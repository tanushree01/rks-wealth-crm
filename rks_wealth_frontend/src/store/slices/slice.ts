import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface InvestmentState {
  totalInvestments: number;
  monthlyReturns: number;
}

const initialState: InvestmentState = {
  totalInvestments: 0,
  monthlyReturns: 0,
};

const investmentSlice = createSlice({
  name: "investment",
  initialState,
  reducers: {
    setTotalInvestments: (state, action: PayloadAction<number>) => {
      state.totalInvestments = action.payload;
    },
    setMonthlyReturns: (state, action: PayloadAction<number>) => {
      state.monthlyReturns = action.payload;
    },
  },
});

export const { setTotalInvestments, setMonthlyReturns } =
  investmentSlice.actions;
export default investmentSlice.reducer;
