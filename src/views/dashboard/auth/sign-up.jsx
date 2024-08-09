import React, { useState, useEffect } from "react";
import { Row, Col, Container, Form, Button } from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";
import { createUserWithEmailAndPassword, fetchSignInMethodsForEmail, signInWithEmailAndPassword } from "firebase/auth";
import { collection, addDoc, setDoc, doc } from "firebase/firestore";
import Swal from "sweetalert2";

//swiper
import { Swiper, SwiperSlide } from "swiper/react";
import SwiperCore from "swiper";
import { Navigation, Autoplay } from "swiper/modules";

// Import selectors & action from setting store
import * as SettingSelector from "../../../store/setting/selectors";
// Redux Selector / Action
import { useSelector } from "react-redux";

// Import Firebase configuration
import { auth, db } from "../../../config/firebase";

// Install Swiper modules
SwiperCore.use([Navigation, Autoplay]);

const SignUp = () => {
  const appName = useSelector(SettingSelector.app_name);
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);

  // Manejar la redirección de Spotify y extraer el token de acceso
  useEffect(() => {
    const hash = window.location.hash;
    if (hash) {
      const params = new URLSearchParams(hash.replace('#', ''));
      const token = params.get('access_token');
      
      if (token) {
        // Guardar el token en localStorage o manejarlo según sea necesario
        localStorage.setItem('spotifyToken', token);
        authenticateWithSpotify(token);
      }
    }
  }, []);

  const authenticateWithSpotify = async (token) => {
    setLoading(true);
    
    try {
      // Aquí puedes usar el token de Spotify para obtener datos del usuario
      const response = await fetch("https://api.spotify.com/v1/me", {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      
      const spotifyUser = await response.json();

      // Buscar o crear el usuario en Firebase
      const email = spotifyUser.email;
      const password = "spotifyUserGeneratedPassword"; // Debes generar una contraseña segura para los usuarios de Spotify

      try {
        // Intenta iniciar sesión si el usuario ya existe
        await signInWithEmailAndPassword(auth, email, password);
      } catch (error) {
        // Si el usuario no existe, créalo
        await createUserWithEmailAndPassword(auth, email, password);
      }

      const user = auth.currentUser;

      // Guardar o actualizar los datos del usuario en Firestore
      await setDoc(doc(db, "users", user.uid), {
        uid: user.uid,
        username: name || spotifyUser.display_name,
        email: email,
        spotifyToken: token,
        spotifyId: spotifyUser.id,
        spotifyData: spotifyUser,
      });

      Swal.fire({
        icon: 'success',
        title: 'Registration Successful',
        text: 'Welcome to Jammify!',
      }).then(() => {
        navigate("/auth/sign-in");
      });
    } catch (error) {
      Swal.fire({
        icon: 'error',
        title: 'Spotify Authentication Failed',
        text: error.message,
      });
      console.error('Error during Spotify authentication:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSignUp = async () => {
    if (!name || !email || !password) {
      Swal.fire({
        icon: 'warning',
        title: 'Missing Fields',
        text: 'Please fill out all fields.',
      });
      return;
    }

    if (password.length < 6) {
      Swal.fire({
        icon: 'warning',
        title: 'Weak Password',
        text: 'Password should be at least 6 characters long.',
      });
      return;
    }

    setLoading(true);

    try {
      // Verificar si el correo ya está registrado
      const signInMethods = await fetchSignInMethodsForEmail(auth, email);
      if (signInMethods.length > 0) {
        Swal.fire({
          icon: 'error',
          title: 'Email Already in Use',
          text: 'This email is already associated with an account.',
        });
        setLoading(false);
        return;
      }

      // Crear el nuevo usuario
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      await addDoc(collection(db, "users"), {
        uid: user.uid,
        username: name,
        email: email,
      });

      Swal.fire({
        icon: 'success',
        title: 'Registration Successful',
        text: 'Welcome to Jammify!',
      }).then(() => {
        navigate("/auth/sign-in");
      });
    } catch (error) {
      Swal.fire({
        icon: 'error',
        title: 'Registration Failed',
        text: error.message,
      });
      console.error('Error during sign up:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSpotifySignUp = () => {
    const clientId = 'b63e75461faf4c97b7ce8202a3d81d79';
    const redirectUri = 'http://localhost:3000/auth/sign-up'; // Mismo componente para manejar el callback
    const scopes = [
      'user-read-email',
      'user-read-private',
    ];

    const spotifyAuthUrl = `https://accounts.spotify.com/authorize?client_id=${clientId}&redirect_uri=${encodeURIComponent(redirectUri)}&scope=${scopes.join(
      '%20'
    )}&response_type=token&show_dialog=true`;

    // Redirigir al usuario a la página de autorización de Spotify
    window.location.href = spotifyAuthUrl;
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
                  className="list-inline m-0 p-0"
                  spaceBetween={30}
                  centeredSlides={true}
                  loop={true}
                  autoplay={{
                    delay: 2000,
                    disableOnInteraction: false,
                  }}
                >
                  <ul className="swiper-wrapper list-inline m-0 p-0">
                    <SwiperSlide>
                      <img
                        src="https://31.media.tumblr.com/8ceef31f2791cc61882ca4ea2a0f559f/tumblr_nhelub15rI1rtpvcro1_500.gif"
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
                        src="https://media2.giphy.com/media/5O0NJ5MOVdLKjor2Z5/200.gif?cid=6c09b952u4ee8cpcqzt63yoxflricm74iuqaqruj4w7t7l5l&ep=v1_internal_gif_by_id&rid=200.gif&ct=g"
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
                        src="https://i.pinimg.com/originals/6f/64/da/6f64da80bc6792e200f943fdf90b253b.gif"
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
                  <img
                    src="https://i.postimg.cc/C5FqYncS/Untitled-design-3.png"
                    width="50"
                    alt="Jammify Logo"
                  />
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
                    <h6 className="form-label fw-bold">Your Full Name</h6>
                    <Form.Control
                      type="text"
                      className="form-control mb-0"
                      placeholder="Your Full Name"
                      defaultValue=""
                      onChange={(e) => setName(e.target.value)}
                    />
                  </Form.Group>
                  <Form.Group className="form-group text-start">
                    <h6 className="form-label fw-bold">Email Address</h6>
                    <Form.Control
                      type="email"
                      className="form-control mb-0"
                      placeholder="Email Address"
                      onChange={(e) => setEmail(e.target.value)}
                    />
                  </Form.Group>
                  <Form.Group className="form-group text-start">
                    <h6 className="form-label fw-bold">Your Password</h6>
                    <Form.Control
                      type="password"
                      className="form-control mb-0"
                      placeholder="Password"
                      defaultValue=""
                      onChange={(e) => setPassword(e.target.value)}
                    />
                  </Form.Group>
                  <div className="d-flex align-items-center justify-content-between">
                    <Form.Check className="form-check d-inline-block m-0">
                      <Form.Check.Input
                        type="checkbox"
                        className="form-check-input"
                      />
                      <h6 className="form-check-label fw-500 font-size-14">
                        I accept{" "}
                        <Link className="fw-light ms-1" to="/dashboard/extrapages/terms-of-service">
                          Terms and Conditions
                        </Link>
                      </h6>
                    </Form.Check>
                  </div>
                  <Button
                    variant="primary"
                    type="button"
                    className="btn btn-primary mt-4 fw-semibold text-uppercase w-100"
                    onClick={handleSignUp}
                    disabled={loading}
                  >
                    {loading ? 'Signing Up...' : 'Sign Up'}
                  </Button>
                  <Button
                    variant="outline-light"
                    type="button"
                    className="btn btn-outline-light mt-3 fw-semibold text-uppercase w-100 d-flex align-items-center justify-content-center gap-2"
                    onClick={handleSpotifySignUp} // Llama a la función que maneja la autenticación con Spotify
                  >
                    <img
                      src="https://upload.wikimedia.org/wikipedia/commons/8/84/Spotify_icon.svg"
                      width="20"
                      alt="Spotify Logo"
                    />
                    Sign up with Spotify
                  </Button>
                  <h6 className="mt-5">
                    Already Have An Account ?{" "}
                    <Link to={"/auth/sign-in"}>Login</Link>
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

export default SignUp;
