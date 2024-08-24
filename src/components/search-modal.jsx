import React, { useState } from 'react';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { db } from '../config/firebase';
import { useNavigate } from 'react-router-dom';

const SearchComponent = () => {
  const [username, setUsername] = useState('');
  const [users, setUsers] = useState([]);
  const [err, setErr] = useState(false);
  const navigate = useNavigate();

  const handleSearch = async (searchValue) => {
    setErr(false);
    const usersCollection = collection(db, 'users');
    const q = query(
      usersCollection,
      where('username', '>=', searchValue),
      where('username', '<=', searchValue + '\uf8ff')
    );

    try {
      const querySnapshot = await getDocs(q);
      if (querySnapshot.empty) {
        setErr(true);
        setUsers([]);
      } else {
        const usersList = querySnapshot.docs.map(doc => doc.data());
        setUsers(usersList);
      }
    } catch (error) {
      console.error('Error fetching users:', error);
      setErr(true);
    }
  };

  const handleUserClick = (uid) => {
    navigate(`/dashboard/app/friend-profile/${encodeURIComponent(uid)}`);
  };

  const handleChange = (e) => {
    const searchValue = e.target.value;
    setUsername(searchValue);
    if (searchValue) {
      handleSearch(searchValue);
    } else {
      setUsers([]);
      setErr(false);
    }
  };

  return (
    <div style={{ position: 'relative', maxWidth: '400px', margin: '0 auto' }}>
      <input
        type="text"
        style={{
          width: '100%',
          padding: '10px',
          fontSize: '12px',
          borderRadius: '5px',
          border: '1px solid #ccc',
          marginBottom: '10px'
        }}
        placeholder="Search for people"
        onChange={handleChange}
        value={username}
      />
      {username && (
        <div style={{
          position: 'absolute',
          top: '100%',
          left: '0',
          right: '0',
          maxHeight: '300px',
          overflowY: 'auto',
          backgroundColor: 'white',
          border: '1px solid #ddd',
          borderRadius: '5px',
          zIndex: 10
        }}>
          {err && <div style={{ padding: '10px' }}>No user found</div>}
          {!err && users.length === 0 && <div style={{ padding: '10px' }}>No results to display</div>}
          {!err && users.length > 0 && users.map(user => (
            <div
              key={user.uid}
              style={{
                display: 'flex',
                alignItems: 'center',
                padding: '10px',
                cursor: 'pointer'
              }}
              onClick={() => handleUserClick(user.uid)}  // Cambiado para usar uid
            >
              <img
                src={user.profilePic}
                alt={user.username}
                style={{
                  width: '40px',
                  height: '40px',
                  borderRadius: '50%',
                  marginRight: '10px'
                }}
              />
              <div>
                <div>{user.username}</div>
                <div>{user.email}</div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default SearchComponent;
