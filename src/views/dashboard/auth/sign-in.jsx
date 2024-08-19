import React, { useState, useEffect } from "react";
import { Row, Col, Container, Form, Button } from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";
import { signInWithEmailAndPassword, createUserWithEmailAndPassword } from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";
import Swal from "sweetalert2";
import { Swiper, SwiperSlide } from "swiper/react";
import SwiperCore from "swiper";
import { Navigation, Autoplay } from "swiper/modules";
import * as SettingSelector from "../../../store/setting/selectors";
import { useSelector } from "react-redux";
import { auth, db } from "../../../config/firebase";

SwiperCore.use([Navigation, Autoplay]);

const SignIn = () => {
  const appName = useSelector(SettingSelector.app_name);
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const rememberedEmail = localStorage.getItem("rememberMeEmail");
    const rememberedPassword = localStorage.getItem("rememberMePassword");
    if (rememberedEmail && rememberedPassword) {
      setEmail(rememberedEmail);
      setPassword(rememberedPassword);
      setRememberMe(true);
    }
  }, []);

  const saveUserDataToFirestore = async (user, additionalData = {}) => {
    const userData = {
      uid: user.uid,
      email: user.email,
      username: additionalData.username || user.displayName,
      ...additionalData, // Datos adicionales que pueden venir de Spotify
    };

    await setDoc(doc(db, "users", user.uid), userData, { merge: true }); // Usar merge para combinar datos
  };

  const handleSignIn = async () => {
    if (!email || !password) {
      Swal.fire({
        icon: 'warning',
        title: 'Missing Fields',
        text: 'Please fill out all fields.',
      });
      return;
    }

    setLoading(true);

    try {
      await signInWithEmailAndPassword(auth, email, password);

      if (rememberMe) {
        localStorage.setItem("rememberMeEmail", email);
        localStorage.setItem("rememberMePassword", password);
      } else {
        localStorage.removeItem("rememberMeEmail");
        localStorage.removeItem("rememberMePassword");
      }

      Swal.fire({
        icon: 'success',
        title: 'Sign In Successful',
        text: 'Welcome back to Jammify!',
      }).then(() => {
        navigate("/");
      });
    } catch (error) {
      Swal.fire({
        icon: 'error',
        title: 'Sign In Failed',
        text: error.message,
      });
      console.error('Error during sign in:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSpotifySignIn = () => {
    const clientId = 'b63e75461faf4c97b7ce8202a3d81d79';
    const redirectUri = 'http://localhost:3000/auth/sign-in';
    const scopes = [
      'user-read-email',
      'user-read-private',
      'user-library-read', // Permite leer las canciones guardadas
      'user-top-read', // Permite leer los artistas principales
      'playlist-read-private', // Permite leer las playlists privadas
      'playlist-read-collaborative' // Permite leer playlists colaborativas
    ];

    const spotifyAuthUrl = `https://accounts.spotify.com/authorize?client_id=${clientId}&redirect_uri=${encodeURIComponent(redirectUri)}&scope=${scopes.join(
      "%20"
    )}&response_type=token&show_dialog=true`;

    // Redirigir al usuario a la página de autorización de Spotify
    window.location.href = spotifyAuthUrl;
  };

  useEffect(() => {
    const hash = window.location.hash;
    if (hash) {
      const params = new URLSearchParams(hash.replace('#', ''));
      const token = params.get('access_token');
      
      if (token) {
        localStorage.setItem('spotifyToken', token);
        authenticateWithSpotify(token);
      }
    }
  }, []);

  const authenticateWithSpotify = async (token) => {
    setLoading(true);
    
    try {
      const response = await fetch("https://api.spotify.com/v1/me", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      
      const spotifyUser = await response.json();

      if (!spotifyUser.email) {
        throw new Error("Spotify did not provide an email address. Please ensure the required permissions are granted.");
      }

      const email = spotifyUser.email;
      const password = "spotifyUserGeneratedPassword"; // Debes generar una contraseña segura para usuarios de Spotify

      let user;

      try {
        // Intenta iniciar sesión si el usuario ya existe
        const userCredential = await signInWithEmailAndPassword(auth, email, password);
        user = userCredential.user;
      } catch (error) {
        // Si el usuario no existe, créalo
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        user = userCredential.user;
      }

      // Guardar o actualizar los datos del usuario en Firestore
      await saveUserDataToFirestore(user, {
        spotifyId: spotifyUser.id,
        spotifyData: spotifyUser,
        username: spotifyUser.display_name,
        country: spotifyUser.country,
        followers: spotifyUser.followers.total,
        product: spotifyUser.product,
      });

      Swal.fire({
        icon: 'success',
        title: 'Sign In Successful',
        text: 'Welcome to Jammify!',
      }).then(() => {
        navigate("/");
      });
    } catch (error) {
      console.error('Error during Spotify authentication:', error);
      Swal.fire({
        icon: 'error',
        title: 'Spotify Authentication Failed',
        text: error.message,
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <section className="sign-in-page">
        <Container fluid>
          <Row className="align-items-center">
            <Col md={6} className="overflow-hidden position-relative">
              <div className="bg-primary w-100 h-100 position-absolute top-0 bottom-0 start-0 end-0"></div>
              <div className="container-inside z-1">
                <div className="main-circle circle-small"></div>
                <div className="main-circle circle-medium"></div>
                <div className="main-circle circle-large"></div>
                <div className="main-circle circle-xlarge"></div>
                <div className="main-circle circle-xxlarge"></div>
              </div>
              <div className="sign-in-detail container-inside-top">
                <Swiper
                  className="list-inline m-0 p-0 "
                  spaceBetween={30}
                  centeredSlides={true}
                  loop={true}
                  autoplay={{
                    delay: 2000,
                    disableOnInteraction: false,
                  }}
                >
                  <ul className="swiper-wrapper list-inline m-0 p-0 ">
                    <SwiperSlide>
                      <img
                        src="https://64.media.tumblr.com/c03fbb660ca802c151b3e926cbd0110b/16b67b86fac76a5a-7b/s540x810/c8fc1fa086f8003db7dd50cb784ba163691da217.gifv"
                        className="signin-img img-fluid mb-5 rounded-3"
                        alt="images"
                      />
                      <h2 className="mb-3 text-white fw-semibold">
                        Power UP Your Friendship
                      </h2>
                      <p className="font-size-16 text-white mb-0">
                        It is a long established fact that a reader will be
                        <br /> distracted by the readable content.
                      </p>
                    </SwiperSlide>
                    <SwiperSlide>
                      <img
                        src="https://media.tenor.com/yVpcWx-eiIIAAAAM/band-freddie-mercury.gif"
                        className="signin-img img-fluid mb-5 rounded-3"
                        alt="images"
                      />
                      <h2 className="mb-3 text-white fw-semibold">
                        Connect with the world
                      </h2>
                      <p className="font-size-16 text-white mb-0">
                        It is a long established fact that a reader will be
                        <br /> distracted by the readable content.
                      </p>
                    </SwiperSlide>
                    <SwiperSlide>
                      <img
                        src="https://www.icegif.com/wp-content/uploads/icegif-3089.gif"
                        className="signin-img img-fluid mb-5 rounded-3"
                        alt="images"
                      />
                      <h2 className="mb-3 text-white fw-semibold">
                        Together Is better
                      </h2>
                      <p className="font-size-16 text-white mb-0">
                        It is a long established fact that a reader will be
                        <br /> distracted by the readable content.
                      </p>
                    </SwiperSlide>
                  </ul>
                </Swiper>
              </div>
            </Col>
            <Col md={6}>
              <div className="sign-in-from text-center">
                <Link
                  to="/"
                  className="d-inline-flex align-items-center justify-content-center gap-2"
                >
                  <img src="https://i.postimg.cc/C5FqYncS/Untitled-design-3.png" width="50" alt="Jammify Logo" />
                  <h2 className="logo-title" data-setting="app_name">
                    Jammify
                  </h2>
                </Link>
                <p className="mt-3 font-size-16">
                  Welcome to Jammify, a platform to connect with
                  <br /> the social world
                </p>
                <Form className="mt-5">
                  <Form.Group className="form-group text-start">
                    <h6 className="form-label fw-bold">Email Address</h6>
                    <Form.Control
                      type="email"
                      className="form-control mb-0"
                      placeholder="Email Address"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                    />
                  </Form.Group>
                  <Form.Group className="form-group text-start">
                    <h6 className="form-label fw-bold">Your Password</h6>
                    <Form.Control
                      type="password"
                      className="form-control mb-0"
                      placeholder="Password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                    />
                  </Form.Group>
                  <div className="d-flex align-items-center justify-content-between">
                    <Form.Check className="form-check d-inline-block m-0">
                      <Form.Check.Input
                        type="checkbox"
                        className="form-check-input"
                        checked={rememberMe}
                        onChange={(e) => setRememberMe(e.target.checked)}
                      />
                      <h6 className="form-check-label fw-bold">Remember Me</h6>
                    </Form.Check>
                    <Link to="/auth/recoverpw" className="font-italic">
                      Forgot Password?
                    </Link>
                  </div>
                  <Button
                    variant="primary"
                    type="button"
                    className="btn btn-primary mt-4 fw-semibold text-uppercase w-100"
                    onClick={handleSignIn}
                    disabled={loading}
                  >
                    {loading ? 'Signing In...' : 'Sign In'}
                  </Button>
                  <Button
                    variant="outline-light"
                    type="button"
                    className="btn btn-outline-light mt-3 fw-semibold text-uppercase w-100 d-flex align-items-center justify-content-center gap-2"
                    onClick={handleSpotifySignIn}
                  >
                    <img
                      src="https://upload.wikimedia.org/wikipedia/commons/8/84/Spotify_icon.svg"
                      width="20"
                      alt="Spotify Logo"
                    />
                    Sign in with Spotify
                  </Button>
                  <h6 className="mt-5">
                    Don't Have An Account ?{" "}
                    <Link to="/auth/sign-up">Sign Up</Link>
                  </h6>
                </Form>
              </div>
            </Col>
          </Row>
        </Container>
      </section>
    </>
  );
};

export default SignIn;
