import React, { useEffect, useState } from 'react';
import { collection, query, where, onSnapshot } from 'firebase/firestore';
import { db } from '../config/firebase';

function Notifications({ userId }) {
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    const notificationsRef = collection(db, 'users', userId, 'notifications');
    const q = query(notificationsRef, where('isRead', '==', false));
    
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const newNotifications = [];
      querySnapshot.forEach((doc) => {
        newNotifications.push({ id: doc.id, ...doc.data() });
      });
      setNotifications(newNotifications);
    });

    return () => unsubscribe();
  }, [userId]);

  return (
    <div className="notifications">
      <h2>Notificaciones</h2>
      <ul>
        {notifications.map((notification) => (
          <li key={notification.id}>
            <strong>{notification.type}:</strong> {notification.message}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default Notifications;