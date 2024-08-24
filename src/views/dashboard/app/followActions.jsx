import { collection, query, where, getDocs, addDoc } from "firebase/firestore";
import { db } from '../../../config/firebase'; 

export const sendFollowRequest = async (fromUid, toUid) => {
  try {
    const followRequestRef = collection(db, 'followRequests');
    const q = query(followRequestRef, where('from', '==', fromUid), where('to', '==', toUid));
    const existingRequest = await getDocs(q);

    if (existingRequest.empty) {
      await addDoc(followRequestRef, {
        from: fromUid,
        to: toUid,
        status: 'pending',
        timestamp: new Date().toISOString(),
      });
      console.log('Follow request sent');
    } else {
      console.log('A follow request already exists between these users');
    }
  } catch (error) {
    console.error('Error sending follow request: ', error);
  }
};
