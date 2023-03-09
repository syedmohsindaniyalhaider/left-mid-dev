import { createSlice } from '@reduxjs/toolkit';

import { 
  updatePlayerPsychology, 
  editCoachReflection, 
  deleteCoachReflection,
  addCoachReflection,
  getPlayerAssessment,
  getPlayerSkillStat,
  getPlayerSelfImprove,
  getPlayerReflection
} from './thunk';

const initialState = {  
  coachName: '',
  createdAt: '',
  trainingNote: [],
  psychology: {
    attitude: '',
    concentration: '',
    intensity: '',
    coachability: ''
  },
  draft: '',
  reflection: {},
  coachFeedback: [],
  selfImprove: {
    developmentGoal: '',
    actionPlan: '',
    strengths: '',
    wannaImprove: '',
  },
  skill: [],
  fetchPlayerAssessment: '',
  isLoading: false,
  isEditing: false,
  selfImproveLoading: false,
  isLoadingSkill: false
};

const playerSlice = createSlice({
  name: 'player',
  initialState,
  reducers: {
    resetDraft: (state) => {
      state.draft = '';
    },
    fetchAssessment: (state, action) => {
      state.fetchPlayerAssessment = action.payload;
    },
  },
  extraReducers: (builders) => {
    builders.addCase(updatePlayerPsychology.fulfilled, (state, action) => {
      state.psychology[action.payload.key] = action.payload.value;
    });

    builders.addCase(addCoachReflection.pending, (state) => {
      state.isLoading = true;
    });
    builders.addCase(addCoachReflection.fulfilled, (state, action) => {
      state.isLoading = false;
      state.reflection = action.payload.data;
      state.draft = action.payload.data.content;
    });
    builders.addCase(addCoachReflection.rejected, (state) => {
      state.isLoading = false;
    });

    builders.addCase(editCoachReflection.pending, (state) => {
      state.isEditing = true;
    });
    builders.addCase(editCoachReflection.fulfilled, (state, action) => {
      state.isEditing = false;
      state.draft = action.payload.data.content;
      state.reflection = action.payload.data;
    });
    builders.addCase(editCoachReflection.rejected, (state) => {
      state.isEditing = false;
    });

    builders.addCase(deleteCoachReflection.fulfilled, (state) => {
      state.reflection = '';
    });

    builders.addCase(getPlayerReflection.fulfilled, (state, action) => {
      state.reflection = action.payload?.data?.reflection;
      state.psychology.attitude = action.payload.data?.attitude;
      state.psychology.coachability = action.payload.data?.coachability;
      state.psychology.intensity = action.payload.data?.intensity;
      state.psychology.concentration = action.payload.data?.concentration;
    });

    builders.addCase(getPlayerAssessment.pending, (state) => {
      state.isLoading = true;
    });
    builders.addCase(getPlayerAssessment.fulfilled, (state, action) => {
      state.isLoading = false;
      state.trainingNote = action.payload.data?.trainingNote;
      state.coachFeedback = action.payload.data?.feedback;
      state.reflection = action.payload.data?.reflection?.reflection;
      state.selfImprove.developmentGoal = action.payload.data?.playerSelfImprove?.developmentGoal;
      state.selfImprove.actionPlan = action.payload.data?.playerSelfImprove?.actionPlan;
      state.selfImprove.strengths = action.payload.data?.playerSelfImprove?.strengths;
      state.selfImprove.wannaImprove = action.payload.data?.playerSelfImprove?.wannaImprove;
      state.psychology.attitude = action.payload.data?.reflection?.attitude;
      state.psychology.coachability = action.payload.data?.reflection?.coachability;
      state.psychology.intensity = action.payload.data?.reflection?.intensity;
      state.psychology.concentration = action.payload.data?.reflection?.concentration;
    });
    builders.addCase(getPlayerAssessment.rejected, (state) => {
      state.isLoading = false;
    });

    builders.addCase(getPlayerSkillStat.pending, (state) => {
      state.isLoadingSkill = true;
    });
    builders.addCase(getPlayerSkillStat.fulfilled, (state, action) => {
      state.isLoadingSkill = false;
      state.skill = action?.payload?.data;
    });
    builders.addCase(getPlayerSkillStat.rejected, (state) => {
      state.isLoadingSkill = false;
    });

    builders.addCase(getPlayerSelfImprove.pending, (state) => {
      state.selfImproveLoading = true;
    });
    builders.addCase(getPlayerSelfImprove.fulfilled, (state, action) => {
      state.selfImproveLoading = false;
      state.selfImprove.developmentGoal = action.payload.data?.developmentGoal;
      state.selfImprove.actionPlan = action.payload.data?.actionPlan;
      state.selfImprove.strengths = action.payload.data?.strengths;
      state.selfImprove.wannaImprove = action.payload.data?.wannaImprove;
    });
    builders.addCase(getPlayerSelfImprove.rejected, (state) => {
      state.selfImproveLoading = false;
    });
  }
});

export const { fetchAssessment, resetDraft } = playerSlice.actions;
export default playerSlice.reducer;