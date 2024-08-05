import React from "react";
import { Row, Col, Form, Container } from "react-bootstrap";
import { Link } from "react-router-dom";

//swiper
import { Swiper, SwiperSlide } from "swiper/react";
import SwiperCore from "swiper";
import { Navigation, Autoplay } from "swiper/modules";

// img
// import logo from "../../../assets/images/logo-full.png";
import login1 from "../../../assets/images/login/1.jpg";
import login2 from "../../../assets/images/login/2.jpg";
import login3 from "../../../assets/images/login/3.jpg";

// Import selectors & action from setting store
import * as SettingSelector from "../../../store/setting/selectors";
// Redux Selector / Action
import { useSelector } from "react-redux";

// install Swiper modules
SwiperCore.use([Navigation, Autoplay]);

const Recoverpw = () => {
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
                        src="https://gifdb.com/images/high/will-smith-singing-29c3i3cwmozcl9lh.gif"
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
                        src="https://i.pinimg.com/originals/b7/be/15/b7be152541c6b3c2f8f55b5debccba62.gif"
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
                        src="https://media3.giphy.com/media/Zc5TO26EfXDM5dXL5W/giphy.gif?cid=6c09b9524o0jhmo81yestjtujzqcdue8fo9mkw9fn97o44zv&ep=v1_gifs_search&rid=giphy.gif&ct=g"
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
              <div className="sign-in-from">
                <Link
                  to={"/"}
                  className="d-inline-flex align-items-center justify-content-center gap-2"
                >
                <img src="https://i.postimg.cc/C5FqYncS/Untitled-design-3.png" width="50" alt="Jammify Logo" />
                  <h2 className="logo-title" data-setting="app_name">
                    Jammify
                  </h2>
                </Link>
                <p className="mt-3 font-size-16">
                  Enter your email address and we'll send you an email with
                  instructions to reset your password.
                </p>
                <Form className="mt-5">
                  <Form.Group className="form-group text-start mb-0">
                    <h6 className="form-label fw-bold">Email Address</h6>
                    <Form.Control
                      type="email"
                      className="form-control mb-0"
                      placeholder="Your Full Name"
                      defaultValue="Enter email"
                    />
                  </Form.Group>
                  <button
                    type="button"
                    className="btn btn-primary mt-4 fw-semibold text-uppercase letter-spacing-1"
                  >
                    reset password
                  </button>
                </Form>
              </div>
            </Col>
          </Row>
        </Container>
      </section>
    </>
  );
};

export default Recoverpw;
