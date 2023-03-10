import { firebaseDb } from 'services';
import {
  doc,
  getDoc,
  updateDoc,
  getDocs,
  collection,
  orderBy,
  query,
  deleteField,
  serverTimestamp,
  where,
  collectionGroup,
} from 'firebase/firestore';

const getSelfImprove = async (playerAssessmentId) => {
  const selfImprove = [];
  const ref = collection(firebaseDb, 'player_reflection');
  const q = query(ref, where('assessmentID', '==', playerAssessmentId));
  const res = await getDocs(q);
  res.forEach((item) => {
    selfImprove.push(item.data());
  });
  return selfImprove[0];
};

const getCoachFeedback = async (playerAssessmentId) => {
  const feedbacks = [];
  const ref = collection(firebaseDb, 'coach_feedback');
  const q = query(ref, where('assessmentID', '==', playerAssessmentId));
  const res = await getDocs(q);
  res.forEach((item) => {
    feedbacks.push(item.data());
  });
  return feedbacks;
};

const getCoachInEvent = async (eventId) => {
  const coachList = [];
  const ref = collection(firebaseDb, `games/${eventId}/coach_id`);
  const res = await getDocs(ref);
  res.forEach((item) => {
    coachList.push(item.id);
  });
  return coachList;
};

// No use currently
const getNote = async (eventId, coachId, playerId) => {
  const ref = doc(
    firebaseDb,
    `games/${eventId}/coach_id/${coachId}/training_note/${playerId}`
  );
  const res = await getDoc(ref);
  return res.data();
};

const getNotev2 = async (playerId, eventId) => {
  const training_note = [];
  const ref = collectionGroup(firebaseDb, 'training_note');
  const q = query(
    ref,
    where('id', '==', playerId),
    where('eventID', '==', eventId)
  );
  const res = await getDocs(q);
  res.forEach((item) => {
    training_note.push(item.data());
  });
  return training_note;
};

const getPlayerAssessmentInfo = async (assessmentId, playerAssessmentId) => {
  const ref = doc(
    firebaseDb,
    `assessment/${assessmentId}/player_assessment/${playerAssessmentId}`
  );
  const data = await getDoc(ref);
  return data.data();
};

const updatePsychology = async (
  assessmentId,
  playerAssessmentId,
  label,
  value
) => {
  const updateData = {
    [label]: value,
  };
  const userRef = doc(
    firebaseDb,
    `assessment/${assessmentId}/player_assessment/${playerAssessmentId}`
  );
  await updateDoc(userRef, updateData);
};

const addReflection = async (
  assessmentId,
  playerAssessmentId,
  content,
  coachId,
  coachName
) => {
  const userRef = doc(
    firebaseDb,
    `assessment/${assessmentId}/player_assessment/${playerAssessmentId}`
  );
  await updateDoc(
    userRef,
    {
      reflection: {
        coachId: coachId,
        coachName: coachName,
        content: content,
        createdAt: serverTimestamp(),
      },
    },
    { merge: true }
  );
  return assessmentId;
};

const editReflection = async (
  assessmentId,
  playerAssessmentId,
  content,
  coachId,
  coachName
) => {
  const userRef = doc(
    firebaseDb,
    `assessment/${assessmentId}/player_assessment/${playerAssessmentId}`
  );
  await updateDoc(
    userRef,
    {
      reflection: {
        coachId: coachId,
        coachName: coachName,
        content: content,
        createdAt: serverTimestamp(),
      },
    },
    { merge: true }
  );
};

const deleteReflection = async (assessmentId, playerAssessmentId) => {
  const userRef = doc(
    firebaseDb,
    `assessment/${assessmentId}/player_assessment/${playerAssessmentId}`
  );
  await updateDoc(userRef, {
    reflection: deleteField(),
  });
};

const getPlayerSkill = async (teamId, playerId) => {
  const data = [];
  const userRef = collection(firebaseDb, `players/${playerId}/player_stats`);
  const q = query(
    userRef,
    where('organizeId', '==', teamId),
    orderBy('createAt', 'desc')
  );
  const res = await getDocs(q);
  res.forEach((item) => {
    data.push(item.data());
  });
  return data[0];
};

const updatePlayerSkillsRating = async (
  updatedRating,
  assessmentId,
  playerAssessmentId
) => {
  const userRef = doc(
    firebaseDb,
    `assessment/${assessmentId}/player_assessment/${playerAssessmentId}`
  );
  await updateDoc(
    userRef,
    {
      rating: updatedRating,
    },
    { merge: true }
  );
};

export {
  addReflection,
  deleteReflection,
  editReflection,
  getCoachFeedback,
  getCoachInEvent,
  getNote,
  getNotev2,
  getPlayerAssessmentInfo,
  getPlayerSkill,
  getSelfImprove,
  updatePlayerSkillsRating,
  updatePsychology,
};
