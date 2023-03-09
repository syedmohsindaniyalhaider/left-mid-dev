import { 
  collection, 
  getDoc,
  getDocs, 
  query, 
  where, 
  doc, 
  setDoc, 
  serverTimestamp, 
  orderBy,
  updateDoc,
  arrayUnion, 
} from 'firebase/firestore';
import { firebaseDb } from 'services';

const getCoachesInClub = async (clubId) => {
  const coachList = [];
  const ref = collection(firebaseDb, `clubs/${clubId}/club_managers`);
  const data = await getDocs(ref);
  data.forEach(coach => {
    coachList.push(coach.id);
  });
  return coachList;
};

const getClubName = async (clubId) => {
  const clubName = [];
  const ref = collection(firebaseDb, 'clubs');
  const q = query(ref, where('id', 'in', clubId));
  const data = await getDocs(q);
  data.forEach(item => {
    if (item.data().teamName) clubName.push(item.data().teamName);
    //clubName.push(item.data().teamName ? item.data().teamName : item.data().id);
  });
  return clubName.join(' - ');
};

const getEventType = async () => {
  const eventTypes = [];
  const data = await getDocs(collection(firebaseDb, 'leagues'));
  data.forEach(item => {
    eventTypes.push({
      id: item.id,
      name: item.data().name
    });
  });
  return eventTypes;
};

const getEventsByteam = async (clubId) => {
  const eventList = [];
  const eventType = await getEventType();
  const ref = collection(firebaseDb, 'games');
  const q = query(ref, where('teams', 'array-contains', clubId), orderBy('timeToPlay', 'desc'));
  const data = await getDocs(q);
  data.forEach( async (game) => {
    const event = game.data();
    eventList.push({
      id: game.id,
      status: event.status,
      type: eventType.filter(type => type.id === event.event).map(item => item.name)[0],
      time: event.timeToPlay,
      teams: event.teams
    });
  });
  return eventList;
};

const getAssessment = async (teamId) => {
  const assessment = [];
  const ref = collection(firebaseDb, 'assessment');
  const q = query(ref, where('teamID', '==', teamId), orderBy('createdAt', 'desc'));
  const data = await getDocs(q);
  data.forEach(item => {
    assessment.push(item.data());
  });
  return assessment;
};

const getPlayerInEvent = async (eventId, clubId) => {
  const playerList = [];
  for (const i in eventId) {
    const ref = collection(firebaseDb, `games/${eventId[i]}/game_lineups`);
    const q = query(ref, where('clubID', '==', clubId));
    const data = await getDocs(q);
    data.forEach(player => {
      playerList.push(player.data());
    });
  }
  return playerList;
};

const addAssessment = async (coachId, coachName, teamid, assessmentName = 'New assessment', playerId, event) => {
  const ref = doc(collection(firebaseDb, 'assessment'));
  const addData = {
    coachID: coachId,
    coachName: coachName,
    createdAt: serverTimestamp(),
    event: event,
    teamID: teamid,
    id: ref.id,
    name: assessmentName,
  };
  await setDoc(ref, addData, { merge: true });
  playerId.forEach( async (player) => {
    const playerRef = doc(collection(firebaseDb, `assessment/${ref.id}/player_assessment`));
    const addData = {
      userID: player,
      createdAt: serverTimestamp(),
      coachName: coachName,
      id: playerRef.id
    };
    await setDoc(playerRef, addData);
  });
  return ref.id;
};

const getPlayerFromAssessment = async (assessmentId) => {
  const playerList = [];
  const ref = collection(firebaseDb, `assessment/${assessmentId}/player_assessment`);
  const data = await getDocs(ref);
  data.forEach(player => {
    playerList.push(player.data());
  });
  return playerList;
};

const getCurrentAssessment = async (assessmentId) => {
  const ref = doc(firebaseDb, `assessment/${assessmentId}`);
  const res = await getDoc(ref);
  return res.data();
};

//const addNewPlayerToAssessment = async (assessmentId, playerId, coachName) => {
//  playerId.forEach(async (player) => {
//    const ref = doc(firebaseDb, `assessment/${assessmentId}/player_assessment/${player}`);
//    const addData = {
//      userID: player,
//      createdAt: serverTimestamp(),
//      coachName: coachName,
//    };
//    await setDoc(ref, addData);
//  });
//};

const addNewPlayerToAssessment = async (assessmentId, playerId, coachName) => {
  const idList = [];
  playerId.forEach(async (player) => {
    const ref = doc(collection(firebaseDb, `assessment/${assessmentId}/player_assessment`));
    idList.push(ref.id);
    const addData = {
      userID: player,
      createdAt: serverTimestamp(),
      coachName: coachName,
      id: ref.id
    };
    await setDoc(ref, addData);
  });
  return idList; 
};

const addNewEventToAssessment = async (assessmentId, event) => {
  event.forEach(async (info) => {
    const ref = doc(firebaseDb, `assessment/${assessmentId}`);
    await updateDoc(ref, {
      event: arrayUnion({
        eventID: info.eventID,
        eventName: info.eventName
      })
    });
  });
  return assessmentId;
};

export {  
  addAssessment, 
  addNewEventToAssessment, 
  addNewPlayerToAssessment,
  getAssessment,
  getClubName,
  getCoachesInClub,
  getCurrentAssessment,
  getEventType,
  getEventsByteam, 
  getPlayerFromAssessment,
  getPlayerInEvent
};