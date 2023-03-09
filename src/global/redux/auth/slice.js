import { createSlice } from '@reduxjs/toolkit';
import { 
  login,
  logout,
  getUserInfo,
  getPlayerList,
  addUserQuickSentence,
  deleteUserQuickSentence 
}from './thunk';

const initialState = {
  userInfo: [],
  quickSentence: [],
  clubList: [],
  totalTeam: [],
  isLoading: false,
  isAddingSentence: false,
  fetchData: false,
  isLogin: false
  //playerInClub: [],
  //playerInClubLoading: false
};

const authSlice = createSlice({
  name: 'auth',
  initialState: initialState,
  reducers: {
    resetClubPlayer: (state) => {
      state.playerInClub = [];
    },
  },
  extraReducers: (builder) => {
    builder.addCase(login.fulfilled, (state, action) => {
      state.userInfo = action?.payload?.data;
      state.isLogin = true;
    });

    builder.addCase(getUserInfo.fulfilled, (state, action) => {
      state.userInfo = action?.payload?.data;
      action?.payload?.data.quickSentence 
        ? state.quickSentence =  action?.payload?.data.quickSentence 
        : state.quickSentence = [];
    });

    builder.addCase(getPlayerList.pending, (state) => {
      state.isLoading = true;
    });
    builder.addCase(getPlayerList.fulfilled, (state, action) => {
      state.fetchData = true;
      state.totalTeam = action.payload?.idList;
      state.clubList = action.payload.clubList;
      state.isLoading = false;
    });

    builder.addCase(logout.fulfilled, () => {
      return initialState;
    }); 
		
    //builder.addCase(getPlayerByClub.pending, (state) => {
    //  state.playerInClubLoading = true;
    //  state.playerInClub = [];
    //});
    //builder.addCase(getPlayerByClub.fulfilled, (state, action) => {
    //  state.playerInClubLoading = false;
    //  state.playerInClub = action.payload?.data;
    //});
    //builder.addCase(getPlayerByClub.rejected, (state) => {
    //  state.playerInClubLoading = false;
    //});

    builder.addCase(addUserQuickSentence.pending, (state) => {
      state.isAddingSentence = true;
    });
    builder.addCase(addUserQuickSentence.fulfilled, (state, action) => {
      state.isAddingSentence = false;
      state.quickSentence = [...state.quickSentence, action.payload.data];
    });
    builder.addCase(addUserQuickSentence.rejected, (state) => {
      state.isAddingSentence = false;
    });

    builder.addCase(deleteUserQuickSentence.pending, (state) => {
      state.isAddingSentence = true;
    });
    builder.addCase(deleteUserQuickSentence.fulfilled, (state, action) => {
      state.isAddingSentence = false;
      state.quickSentence = state.quickSentence.filter(item => item !== action.payload.data);
    });
    builder.addCase(deleteUserQuickSentence.rejected, (state) => {
      state.isAddingSentence = false;
    });
  }
});

export const { resetClubPlayer } = authSlice.actions;
export default authSlice.reducer;