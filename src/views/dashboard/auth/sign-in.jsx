import React from "react";
import { Row, Col, Container, Form, Button } from "react-bootstrap";
import { Link } from "react-router-dom";

//swiper
import { Swiper, SwiperSlide } from "swiper/react";
import SwiperCore from "swiper";
import { Navigation, Autoplay } from "swiper/modules";

// Import selectors & action from setting store
import * as SettingSelector from "../../../store/setting/selectors";
// Redux Selector / Action
import { useSelector } from "react-redux";

//img
// import logo from "../../../assets/images/logo-full.png";
import login1 from "../../../assets/images/login/1.jpg";
import login2 from "../../../assets/images/login/2.jpg";
import login3 from "../../../assets/images/login/3.jpg";

// install Swiper modules
SwiperCore.use([Navigation, Autoplay]);

const SignIn = () => {
  const appName = useSelector(SettingSelector.app_name);

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
                    <h6 className="form-label fw-bold">
                     Email Address
                    </h6>
                    <Form.Control
                      type="email"
                      className="form-control mb-0"
                      placeholder="Your Full Name"
                      defaultValue=""
                    />
                  </Form.Group>
                  <Form.Group className="form-group text-start">
                    <h6 className="form-label fw-bold">Your Password</h6>
                    <Form.Control
                      type="password"
                      className="form-control mb-0"
                      placeholder="Password"
                      defaultValue=""
                    />
                  </Form.Group>
                  <div className="d-flex align-items-center justify-content-between">
                    <Form.Check className="form-check d-inline-block m-0">
                      <Form.Check.Input
                        type="checkbox"
                        className="form-check-input"
                      />
                      <h6 className="form-check-label fw-bold">Remember Me</h6>
                    </Form.Check>
                    <Link to="/auth/recoverpw" className="font-italic">
                      Forgot Password?
                    </Link>
                  </div>
                  {/* <Link type="button" className="btn btn-primary mt-4 fw-semibold text-uppercase w-100" to="#">sign in</Link> */}
                  <Button
                    variant="primary"
                    type="button"
                    className="btn btn-primary mt-4 fw-semibold text-uppercase w-100"
                  >
                    Sign in
                  </Button>
                  <Button
                    variant="outline-light"
                    type="button"
                    className="btn btn-outline-light mt-3 fw-semibold text-uppercase w-100 d-flex align-items-center justify-content-center gap-2"
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
