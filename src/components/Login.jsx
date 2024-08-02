import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { signInWithEmailAndPassword } from 'firebase/auth';
import Swal from 'sweetalert2';
import { auth } from '../config/firebase';
import '../styles/auth.css';
import 'remixicon/fonts/remixicon.css';

const LoginPage = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const navigate = useNavigate();

    const handleEmailChange = (e) => setEmail(e.target.value);
    const handlePasswordChange = (e) => setPassword(e.target.value);
    const togglePasswordVisibility = () => setShowPassword(!showPassword);

    const validateForm = () => {
        if (!email || !password) {
            Swal.fire({
                icon: 'warning',
                title: 'Campos Vacíos',
                text: 'Por favor completa todos los campos.'
            });
            return false;
        }
        return true;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!validateForm()) return;

        try {
            await signInWithEmailAndPassword(auth, email, password);
            Swal.fire({
                icon: 'success',
                title: 'Inicio de Sesión Exitoso',
                text: 'Has iniciado sesión correctamente.'
            });
            navigate('/UserInfo');
        } catch (error) {
            Swal.fire({
                icon: 'error',
                title: 'Error en el Inicio de Sesión',
                text: error.message
            });
        }
    };

    const handleSpotifyLogin = () => {
        const client_id = 'b63e75461faf4c97b7ce8202a3d81d79';
        const redirect_uri = 'http://localhost:5173/spotify-redirect'; // Asegúrate de que esta URI coincida con la configurada en el Spotify Developer Dashboard
        const scope = 'user-read-private user-read-email';
        const auth_url = `https://accounts.spotify.com/authorize?response_type=code&client_id=${client_id}&scope=${encodeURIComponent(scope)}&redirect_uri=${encodeURIComponent(redirect_uri)}`;
        window.location.href = auth_url;
    };

    return (
        <div>
            {/* Header */}
            <header className="spotify-header">
                <nav className="spotify-nav">
                    <img src="/Images/Jammify-logo.png" alt="Jammify Logo" className="logo-img" />
                    <span className="head-txt">JAMMIFY</span>
                </nav>
            </header>

            {/* Main Content */}
            <main className="main-content">
                <div className="login-container">
                    <div className="login-head">
                        <h1>Log into Jammify</h1>
                    </div>

                    <div className="login-options">
                        <div className="google" onClick={handleSpotifyLogin}>
                            <img src="/Images/spotify-logo.png" alt="Jammify" />
                            <h3>Continue with Spotify</h3>
                        </div>
                    </div>

                    <div className="login-content">
                        <form onSubmit={handleSubmit}>
                            <div className="email-input-box">
                                <label htmlFor="email" className="email-label">Email</label>
                                <input
                                    type="email"
                                    className="email-input"
                                    placeholder="Email or username"
                                    value={email}
                                    onChange={handleEmailChange}
                                    required
                                />
                            </div>

                            <div className="password-input-box">
                                <label htmlFor="password" className="password-label">Password</label>
                                <div className="pass-div">
                                    <input
                                        type={showPassword ? "text" : "password"}
                                        className="password-input"
                                        placeholder="Password"
                                        value={password}
                                        onChange={handlePasswordChange}
                                    />
                                    <i
                                        className={`ri-eye${showPassword ? '' : '-off'}-line pass-toggle`}
                                        onClick={togglePasswordVisibility}
                                    ></i>
                                </div>
                            </div>

                            <div className="remember">
                                <input type="checkbox" className="rem-check" defaultChecked />
                                <span className="rem-txt">Remember me</span>
                            </div>

                            <div className="login-button">
                                <button type="submit" className="login-btn">Log In</button>
                            </div>
                        </form>

                        <div className="forgot">
                            <Link to="/forgot-password" className="forgot-txt">Forgot your password?</Link>
                        </div>
                    </div>

                    <div className="signUp">
                        <span className="signUp-txt">Don't have an account? <Link to="/sign-up">Sign up for Jammify</Link></span>
                    </div>
                </div>
            </main>

            {/* Footer */}
            <footer className="footer">
                <span className="footer-txt">This site is protected by reCAPTCHA and the Google <Link to="/privacy-policy">Privacy Policy</Link> and <Link to="/terms-of-service">Terms of Service</Link> apply.</span>
            </footer>
        </div>
    );
};

export default LoginPage;
