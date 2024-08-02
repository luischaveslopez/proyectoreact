import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import queryString from 'query-string';

const SpotifyRedirect = () => {
    const navigate = useNavigate();

    useEffect(() => {
        const fetchAccessToken = async (code) => {
            try {
                const response = await fetch('https://accounts.spotify.com/api/token', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/x-www-form-urlencoded',
                        'Authorization': 'Basic ' + btoa('b63e75461faf4c97b7ce8202a3d81d79:ecac3f08ca754a448f191010b32e0110')
                    },
                    body: new URLSearchParams({
                        grant_type: 'authorization_code',
                        code: code,
                        redirect_uri: 'http://localhost:5173/spotify-redirect'
                    })
                });

                const data = await response.json();
                console.log('Token response data:', data); // Depuración
                if (data.access_token) {
                    sessionStorage.setItem('spotifyAuthToken', data.access_token);
                    navigate('/UserInfo');
                } else {
                    console.error('Error fetching access token:', data);
                }
            } catch (error) {
                console.error('Error during token exchange:', error);
            }
        };

        const { code } = queryString.parse(window.location.search);
        console.log('Authorization code:', code); // Depuración
        if (code) {
            fetchAccessToken(code);
        } else {
            console.error('No code found in URL');
        }
    }, [navigate]);

    return (
        <div>
            <h1>Redirecting...</h1>
        </div>
    );
};

export default SpotifyRedirect;
