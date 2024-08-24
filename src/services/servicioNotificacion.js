import { doc, updateDoc } from './firebase/firestore';
import {db} from './firebase';

// ... createNotification function ...

export async function markAsRead(userId, notificationId) {
  const notificationRef = doc(db, 'users', userId, 'notifications', notificationId);

  try {
    await updateDoc(notificationRef, {
      isRead: true
    });
  } catch (e) {
    console.error('Error updating document: ', e);
  }
}