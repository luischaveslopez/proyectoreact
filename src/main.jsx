import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import LoginPage from './components/Login.jsx';
import SignUpPage from './components/SingUp.jsx';
import UserInfo from './components/UserInfo'; 
import SpotifyRedirect from './config/SpotifyRedirect';


ReactDOM.render(
    <React.StrictMode>
        <Router>
            <Routes>
                <Route path="/" element={<Navigate to="/login" />} />
                <Route path="/login" element={<LoginPage />} />
                <Route path="/sign-up" element={<SignUpPage />} />
                <Route path="/spotify-redirect" element={<SpotifyRedirect />} />
                <Route path="/userinfo" element={<UserInfo />} />
            </Routes>
        </Router>
    </React.StrictMode>,
    document.getElementById('root')
);
