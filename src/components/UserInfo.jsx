import React, { useEffect, useState } from 'react';
import { signOut, onAuthStateChanged } from 'firebase/auth';
import { auth } from '../config/firebase';
import Swal from 'sweetalert2';
import { useNavigate } from 'react-router-dom';



const UserInfo = () => {
    const [user, setUser] = useState({});
    const [spotifyUser, setSpotifyUser] = useState(null);
    const navigate = useNavigate();

    const logout = async () => {
        Swal.fire({
            title: '¿Estás seguro?',
            text: "¿Quieres cerrar sesión?",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Sí, cerrar sesión'
        }).then(async (result) => {
            if (result.isConfirmed) {
                await signOut(auth);
                sessionStorage.removeItem('spotifyAuthToken');
                setSpotifyUser(null);
                Swal.fire(
                    '¡Cerraste sesión!',
                    'Tu sesión ha sido cerrada exitosamente.',
                    'success'
                );
                navigate('/');
            }
        });
    };

    const fetchSpotifyUser = async (token) => {
        try {
            const response = await fetch('https://api.spotify.com/v1/me', {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            const data = await response.json();
            console.log('Spotify user data:', data); // Depuración
            setSpotifyUser(data);
        } catch (error) {
            console.error('Error fetching Spotify user:', error);
        }
    };

    useEffect(() => {
        const spotifyAuthToken = sessionStorage.getItem('spotifyAuthToken');
        console.log('Spotify Auth Token:', spotifyAuthToken); // Depuración
        if (spotifyAuthToken) {
            fetchSpotifyUser(spotifyAuthToken);
        }

        onAuthStateChanged(auth, (currentUser) => {
            if (!currentUser && !spotifyAuthToken) {
                navigate('/');
            } else {
                setUser(currentUser);
            }
        });
    }, [navigate]);

    return (
        <div className="container mt-5">
            <h4>User Info</h4>
            {user && (
                <>
                    <p>Email (Firebase): {user?.email}</p>
                </>
            )}
            {spotifyUser && (
                <>
                    <p>Spotify Username: {spotifyUser.display_name}</p>
                    <p>Spotify Email: {spotifyUser.email}</p>
                </>
            )}
            <button className="btn btn-danger" onClick={logout}>Logout</button>
        </div>
    );
};

export default UserInfo;
