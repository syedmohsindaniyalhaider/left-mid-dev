import { createSlice, current } from '@reduxjs/toolkit';

import { 
  getCoachesMail, 
  getTeamEventLists, 
  getAssessmentRecords,
  getPlayerFromSelectedEvents, 
  addAssessmentRecord,
  getAssessmentDetail,
  addPlayerToAssessment,
  addEventToAssessment
} from './thunk';

import {
  getPlayerByClub
} from '../auth/thunk';

const initialState = {
  eventList: [],
  clubCoachesEmail: [],
  currentTeam: {
    organize: '',
    club: '',
    clubName: '',
    players: []
  },
  assessmentInfo: {},
  assessment: [],
  playerInEvent: [],
  selectedPlayerInfo: [],
  playerInAssessment: [],
  playerInClub: [],
  playerInClubLoading: false,
  fetchPlayerInAssessment: false,
  isLoading: false,
  isPlayerLoading: false,
  fetchedEvent: false,
  isAdding: false,
  currentView: false,
  addingEvent: false,
};

const assessmentSlice = createSlice({
  name: 'assessment',
  initialState,
  reducers: {
    chooseTeam: (state, action) => {
      state.currentTeam.organize = action.payload?.team;
      state.currentTeam.club = action.payload?.club;
      state.currentTeam.players = action.payload?.players;
      state.currentTeam.clubName = action.payload?.teamName;
    },
    selectPlayerToNotify: (state, action) => {
      state.selectedPlayerInfo = action.payload;
    },
    resetAssessment: (state) => {
      state.assessment = [];
    },
    resetEventList: (state) => {
      state.eventList = [];
    },
    toggleCurrentView: (state) => {
      state.currentView = !state.currentView;
    },
    toggleAddEvent: (state) => {
      state.addingEvent = !state.addingEvent;
    },
    reset: () => initialState,
  },
  extraReducers: (builders) => {
    builders.addCase(getTeamEventLists.pending, (state) => {
      state.eventList = [];
      state.fetchedEvent = true;
    });
    builders.addCase(getTeamEventLists.fulfilled, (state, action) => {
      state.fetchedEvent = false;
      state.eventList = action.payload.data;
    });
    builders.addCase(getTeamEventLists.rejected, (state) => {
      state.fetchedEvent = false;
    });

    builders.addCase(getPlayerByClub.pending, (state) => {
      state.playerInClubLoading = true;
      state.playerInClub = [];
    });
    builders.addCase(getPlayerByClub.fulfilled, (state, action) => {
      state.playerInClubLoading = false;
      state.playerInClub = action.payload?.data;
    });
    builders.addCase(getPlayerByClub.rejected, (state) => {
      state.playerInClubLoading = false;
    });

    builders.addCase(getCoachesMail.fulfilled, (state, action) => {
      state.clubCoachesEmail = action.payload.data;
    });

    builders.addCase(getAssessmentRecords.pending, (state) => {
      state.isLoading = true;
    });
    builders.addCase(getAssessmentRecords.fulfilled, (state, action) => {
      state.isLoading = false;
      state.assessment = action.payload.data;
    });
    builders.addCase(getAssessmentRecords.rejected, (state) => {
      state.isLoading = false;
    });

    builders.addCase(getPlayerFromSelectedEvents.pending, (state) => {
      state.isPlayerLoading = true;
    });
    builders.addCase(getPlayerFromSelectedEvents.fulfilled, (state, action) => {
      state.isPlayerLoading = false;
      state.playerInEvent = action.payload.data;
    });
    builders.addCase(getPlayerFromSelectedEvents.rejected, (state) => {
      state.isPlayerLoading = false;
    });

    builders.addCase(addAssessmentRecord.pending, (state) => {
      state.isAdding = true;
    });
    builders.addCase(addAssessmentRecord.fulfilled, (state, action) => {
      state.isAdding = false;
      state.assessment = [action.payload.data, ...state.assessment];
    });
    builders.addCase(addAssessmentRecord.rejected, (state) => {
      state.isAdding = false;
    });

    builders.addCase(getAssessmentDetail.pending, (state) => {
      state.fetchPlayerInAssessment = true;
    });
    builders.addCase(getAssessmentDetail.fulfilled, (state, action) => {
      state.fetchPlayerInAssessment = false;
      state.playerInAssessment = action.payload.data;
      state.assessmentInfo = action.payload.assessmentInfo;
    });
    builders.addCase(getAssessmentDetail.rejected, (state) => {
      state.fetchPlayerInAssessment = false;
    });

    builders.addCase(addPlayerToAssessment.fulfilled, (state, action) => {
      const playerInEvent = current(state.playerInEvent);
      const addPlayer = action.payload.data.map(item => {
        return {
          userID: item.playerId,
          id: item.playerAssessmentId,
          userInfo: playerInEvent.filter(player => player.id === item.playerId)[0]
        };
      });
      addPlayer.forEach(item => {
        state.playerInAssessment = [...state.playerInAssessment, item];
      });
    });

    builders.addCase(addEventToAssessment.fulfilled, (state, action) => {
      state.assessmentInfo.event = [...state.assessmentInfo.event, ...action.payload.data];
    });
  }
});

export const { 
  chooseTeam, 
  selectPlayerToNotify, 
  resetAssessment, 
  resetEventList, 
  toggleCurrentView,
  toggleAddEvent, 
  reset,
} = assessmentSlice.actions;
export default assessmentSlice.reducer;