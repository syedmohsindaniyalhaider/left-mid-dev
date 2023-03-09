import { createAsyncThunk } from '@reduxjs/toolkit';

import { 
  getCoachesInClub, 
  getEventsByteam,
  getAssessment,
  addAssessment,
  getClubName,
  getPlayerInEvent,
  getPlayerFromAssessment,
  addNewPlayerToAssessment,
  getCurrentAssessment,
  addNewEventToAssessment
} from './request';

import { showNoti } from 'utils/helper';
import { getDataByBatch } from '../auth/request';

const getCoachesMail = createAsyncThunk('assessment/get-coaches-list', async (clubId, {rejectWithValue}) => {
  try {
    const res = await getCoachesInClub(clubId);
    const coachesData = await getDataByBatch(res, 'users');
    return {
      status: true,
      data: coachesData.map(item => item.private.email),
    };
  } catch(err) {
    showNoti('error', err.message);
    return rejectWithValue(err.response.data);
  }
});

const getTeamEventLists = createAsyncThunk('assessment/get-event', async (clubId, {rejectWithValue}) => {
  try {
    const eventList = [];
    const res = await getEventsByteam(clubId);
    for (const event of res) {
      const { teams, type } = event;
      const eventName = await getClubName(teams);
      eventList.push({
        ...event,
        eventName: `${type}: ${eventName}`
      });
    }
    return {
      status: true,
      data: eventList
    };
  } catch(err) {
    showNoti('error', err.message);
    return rejectWithValue(err.response.data);
  }
});

const getPlayerFromSelectedEvents = createAsyncThunk('assessment/get-player-from-events', async (data) => {
  try {
    const res = await getPlayerInEvent(data.eventId, data.clubId);
    return {
      status: true,
      data: await getDataByBatch([...new Set(res.map(item => item.userID))], 'users') 
    };
  } catch (err) {
    showNoti('error', err.message);
  }
});

const getAssessmentRecords = createAsyncThunk('assessment/get-team-assessment', async (data) => {
  try {
    const res = await getAssessment(data);
    return {
      status: true,
      data: res.map(item => {
        return {
          ...item,
          eventName: item?.event?.map(data => data?.eventName),
          eventID: item?.event?.map(data => data.eventID)
        };
      })
    };
  } catch (err) {
    showNoti('error', err.message);
  }
});

const addAssessmentRecord = createAsyncThunk('assessment/add-assessment', async (data) => {
  try {
    // eslint-disable-next-line max-len
    const res = await addAssessment(data.coachID, data.coachName, data.teamID, data.name, data.playerList, data.event);
    const eventName = data.event.map(item => item.eventName);
    const eventID = data.event.map(item => item.eventID);
    return {
      status: true,
      data: {
        ...data,
        eventName,
        eventID,
        id: res,
        createdAt: {
          seconds: Math.round(Date.now() / 1000)
        }
      }
    };
  } catch (err) {
    showNoti('error', err.message);
  }
});

const getAssessmentDetail = createAsyncThunk('player/get-assessment-player', async (data) => {
  try {
    const res = await getPlayerFromAssessment(data.assessmentId);
    const playerId = res.map(item => item.userID);
    const playerList = await getDataByBatch(playerId, 'users');
    return {
      status: true,
      assessmentInfo : await getCurrentAssessment(data.assessmentId),
      data: res.map(item => {
        return {
          ...item,
          userInfo: playerList.filter(info => info.id === item.userID)[0]
        };
      })
    };
  } catch(err) {
    showNoti('error', err.message);
  }
});

const addPlayerToAssessment = createAsyncThunk('assessment/add-player', async (data) => {
  try {
    const res = await addNewPlayerToAssessment(data.assessmentId, data.playerId, data.coachName);
    return {
      status: true,
      data: res.map((item, index) => {
        return {
          playerId: data.playerId[index],
          playerAssessmentId: item
        };
      })
    };
  } catch (err) {
    showNoti('error', err.message);
  }
});

const addEventToAssessment = createAsyncThunk('assessment/add-event', async (data) => {
  try {
    await addNewEventToAssessment(data.assessmentId, data.event);
    return {
      status: true,
      data: data.event
    };
  } catch (err) {
    showNoti('error', err.message);
  }
});

export { 
  addAssessmentRecord, 
  addEventToAssessment,
  addPlayerToAssessment, 
  getAssessmentDetail, 
  getAssessmentRecords, 
  getCoachesMail, 
  getPlayerFromSelectedEvents, 
  getTeamEventLists 
};

