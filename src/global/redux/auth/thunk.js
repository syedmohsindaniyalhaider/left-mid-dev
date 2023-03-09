import { getDoc, doc, getDocs, collectionGroup, query, where } from 'firebase/firestore';
import { createAsyncThunk } from '@reduxjs/toolkit';

import { firebaseDb } from 'services';
import { showNoti } from 'utils/helper';
import { signInWithMail, logOut, getClubInfo, getClubPlayerInfo, addUserSentence, deleteUserSentence } from './request';
import { getDataByBatch } from './request';

const login = createAsyncThunk('auth/login', async(data, thunkAPI) => {
  try {
    const res = await signInWithMail(data);
    const userRef = doc(firebaseDb, 'users', res.uid);
    const userInfo = await getDoc(userRef);
    if (userInfo.data().userType === 'player') {
      return thunkAPI.rejectWithValue("Player can't access this web");
    } 
    return {
      status: true,
      data: userInfo.data()
    };
  } catch(err) {
    showNoti('error', err.message);
  }
});

const getUserInfo = createAsyncThunk('auth/get-user', async(uid) => {
  try {
    const userRef = doc(firebaseDb, 'users', uid);
    const userInfo = await getDoc(userRef);
    return {
      status: true,
      data: userInfo.data()
    };
  } catch(err) {
    showNoti('error', err.message);
  }
});

const getPlayerList = createAsyncThunk('auth/get-player-list', async(data) => {
  try {
    let userClubID = [];
    const clubManagerQuery = query(collectionGroup(firebaseDb, 'club_managers'), where('userID', '==', data));
    const clubManagerInfo = await getDocs(clubManagerQuery);
    clubManagerInfo.forEach(item => {
      userClubID.push(item.data().clubID);
    });
    const totalPlayerInClub = await getClubPlayerInfo(userClubID);
    const clubPlayerIdList = totalPlayerInClub.reduce((acc, item) => {
      const found = acc.find(a => a.clubId === item.clubId);
      if (!found) {
        acc.push({clubId:item.clubId, data: [item.data]}); 
      }
      else {
        found.data.push(item.data); 
      }
      return acc;
    }, []);
    const newIdlist = clubPlayerIdList.map(item => {
      return {
        clubId: item.clubId,
        playerId: item.data.map(item2 => item2.userID)
      };
    });
    let coreData = [];
    let i = 0;
    while (i < newIdlist.length) {
      coreData.push(
        {
          clubId: await getClubInfo(newIdlist[i].clubId),
        }
      );
      i++;
    }
    const organizeId = coreData.map(item => {
      return {
        organizeId: item.clubId.organizeID,
        clubId: item.clubId.id
      };
    }).reduce((res, item) => {
      const duplicate = res.find(a => a.organizeId === item.organizeId);
      if (!duplicate) {
        res.push({organizeId:item.organizeId, clubId: [item.clubId]}); 
      }
      else {
        duplicate.clubId.push(item.clubId); 
      }
      return res;
    }, []);
    const organizeInfo = await getDataByBatch(organizeId.map(item => item.organizeId), 'organizes');
    const idList = organizeId.map(item => {
      return {
        organizeId: organizeInfo.filter(item4 => item4.id === item.organizeId)[0],
        clubInfo: item.clubId
          .map(item2 => newIdlist.filter(item3 => item3.clubId === item2))
          .map(item2 => item2[0])
      };
    });
    return {
      idList: idList,
      clubList: coreData.map(item => item.clubId),
    };
  } catch(err) {
    showNoti('error', err.message);
  }
});

const getPlayerByClub = createAsyncThunk('assessment/get-club-player', async (data) => {
  try {
    return {
      data: await getDataByBatch(data, 'users')
    };
  } catch(err) {
    showNoti('error', err.message);
  }
});

const logout = createAsyncThunk('auth/logout', async () => {
  try {
    await logOut();
    return true;
  } catch(err) {
    showNoti('error', err.message);
  }
});

const addUserQuickSentence = createAsyncThunk('auth/add-sentence', async (data) => {
  try {
    await addUserSentence(data.userId, data.content);
    return {
      status: true,
      data: data.content
    };
  } catch (err) {
    showNoti('error', err.message);
  }
});

const deleteUserQuickSentence = createAsyncThunk('auth/delete-sentence', async (data) => {
  try {
    await deleteUserSentence(data.userId, data.content);
    return {
      status: true,
      data: data.content
    };
  } catch (err) {
    showNoti('error', err.message);
  }
});

export { addUserQuickSentence, deleteUserQuickSentence, getPlayerByClub, getPlayerList, getUserInfo, login, logout };