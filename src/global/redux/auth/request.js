import { firebaseAuth, firebaseDb } from 'services';
import { signInWithEmailAndPassword, sendPasswordResetEmail, signOut } from 'firebase/auth';
import { collection, query, where, getDocs, doc, getDoc, arrayUnion, updateDoc, arrayRemove } from 'firebase/firestore';

const signInWithMail = async (data) => {
  const { email, password } = data;
  const res = await signInWithEmailAndPassword(firebaseAuth, email, password);
  return res.user;
};

const logOut = async () => {
  await signOut(firebaseAuth);
  return true;
};

const resetPassword = async (email) => {
  await sendPasswordResetEmail(firebaseAuth, email);
};

const getDataByBatch = async (idList, path) => {
  let result = [];
  while (idList?.length) {
    const idBatch = idList.splice(0, 10);
    const userRef = collection(firebaseDb, path);
    const q = query(userRef, where('id', 'in', idBatch));
    const res = await getDocs(q);
    res.forEach((doc) => {
      result.push(doc.data());
    });
  }
  return result;
};

const getClubInfo = async (clubId) => {
  const clubRef = doc(firebaseDb, 'clubs', clubId);
  const clubInfo = await getDoc(clubRef);
  return clubInfo.data();
};

const getClubPlayerInfo = async (clubIdList) => {
  let playerList = [];
  await Promise.all(clubIdList.map( async (item) => {
    const data = await getDocs(collection(firebaseDb, `clubs/${item}/club_squads`));
    data.forEach(player => {
      playerList.push({
        clubId: item,
        data: player.data()
      });
    });
  }));
  return playerList;
};

const addUserSentence = async (userId, content) => {
  const userRef = doc(firebaseDb, `users/${userId}`);
  const addData = {
    quickSentence: arrayUnion(content)
  };
  await updateDoc(userRef, addData);
  return userId;
};

const deleteUserSentence = async (userId, content) => {
  const userRef = doc(firebaseDb, `users/${userId}`);
  const removeData = {
    quickSentence: arrayRemove(content)
  };
  await updateDoc(userRef, removeData);
};

// eslint-disable-next-line max-len
export { addUserSentence, deleteUserSentence, getClubInfo, getClubPlayerInfo, getDataByBatch, logOut, resetPassword, signInWithMail };