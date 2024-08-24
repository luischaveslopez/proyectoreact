import React from "react";
import { Row, Col, Container } from "react-bootstrap";
import Card from "../../../components/Card";
import { Link } from "react-router-dom";

// image
import img1 from "../../../assets/images/page-img/profile-bg2.jpg";
import img2 from "../../../assets/images/page-img/profile-bg1.jpg";
import img4 from "../../../assets/images/page-img/profile-bg4.jpg";
import img5 from "../../../assets/images/page-img/profile-bg5.jpg";
import user05 from "../../../assets/images/user/05.jpg";
import user06 from "../../../assets/images/user/06.jpg";
import user07 from "../../../assets/images/user/07.jpg";
import user08 from "../../../assets/images/user/08.jpg";


const FriendList = () => {
  return (
    <>
            <div style={{ textAlign: 'center', marginBottom: '20px' }}>
        <img
          src="https://i.imgur.com/5yyo2uv.png"
          alt="Friend List Header"
          style={{
            maxWidth: '100%', 
          }}

        />
      </div>
      <div id="content-page" className="content-inner">
        <Container>
          <Row>
            <Col md={6}>
              <Card className=" card-block card-stretch card-height">
                <Card.Body className=" profile-page p-0">
                  <div className="profile-header-image">
                    <div className="cover-container">
                      <img
                        loading="lazy"
                        src={img1}
                        alt="profile-bg"
                        className="rounded img-fluid w-100"
                      />
                    </div>
                    <div className="profile-info p-4">
                      <div className="user-detail">
                        <div className="d-flex flex-wrap justify-content-between align-items-start">
                          <div className="profile-detail d-flex">
                            <div className="profile-img pe-lg-4">
                              <img
                                loading="lazy"
                                src={user05}
                                alt="profile-img"
                                className="avatar-130 img-fluid"
                              />
                            </div>
                            <div className="user-data-block mt-md-0 mt-2">
                              <h4>
                                <Link to="/dashboard/app/friend-profile">
                                  Anna Sthesia
                                </Link>
                              </h4>
                              <h6>@designer</h6>
                              <p className="mb-2 mb-lg-0">
                                Lorem Ipsum is simply dummy text of the
                              </p>
                            </div>
                          </div>
                          <button type="submit" className="btn btn-primary">
                            Following
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </Card.Body>
              </Card>
            </Col>
            <Col md={6}>
              <Card className=" card-block card-stretch card-height">
                <Card.Body className="card-body profile-page p-0">
                  <div className="profile-header-image">
                    <div className="cover-container">
                      <img
                        loading="lazy"
                        src={img2}
                        alt="profile-bg"
                        className="rounded img-fluid w-100"
                      />
                    </div>
                    <div className="profile-info p-4">
                      <div className="user-detail">
                        <div className="d-flex flex-wrap justify-content-between align-items-start">
                          <div className="profile-detail d-flex">
                            <div className="profile-img pe-lg-4">
                              <img
                                loading="lazy"
                                src={user06}
                                alt="profile-img"
                                className="avatar-130 img-fluid"
                              />
                            </div>
                            <div className="user-data-block mt-md-0 mt-2">
                              <h4>
                                <Link to="/dashboard/app/friend-profile">
                                  Paul Molive
                                </Link>
                              </h4>
                              <h6>@developer</h6>
                              <p className="mb-2 mb-lg-0">
                                Lorem Ipsum is simply dummy text of the
                              </p>
                            </div>
                          </div>
                          <button type="submit" className="btn btn-primary">
                            Following
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </Card.Body>
              </Card>
            </Col>
            <Col md={6}>
              <Card className=" card-block card-stretch card-height">
                <Card.Body className=" profile-page p-0">
                  <div className="profile-header-image">
                    <div className="cover-container">
                      <img
                        loading="lazy"
                        src={img4}
                        alt="profile-bg"
                        className="rounded img-fluid w-100"
                      />
                    </div>
                    <div className="profile-info p-4">
                      <div className="user-detail">
                        <div className="d-flex flex-wrap justify-content-between align-items-start">
                          <div className="profile-detail d-flex">
                            <div className="profile-img pe-lg-4">
                              <img
                                loading="lazy"
                                src={user07}
                                alt="profile-img"
                                className="avatar-130 img-fluid"
                              />
                            </div>
                            <div className="user-data-block mt-md-0 mt-2">
                              <h4>
                                <Link to="/dashboard/app/friend-profile">
                                  Anna Mull
                                </Link>
                              </h4>
                              <h6>@designer</h6>
                              <p className="mb-2 mb-lg-0">
                                Lorem Ipsum is simply dummy text of the
                              </p>
                            </div>
                          </div>
                          <button type="submit" className="btn btn-primary">
                            Following
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </Card.Body>
              </Card>
            </Col>
            <Col md={6}>
              <Card className=" card-block card-stretch card-height">
                <Card.Body className=" profile-page p-0">
                  <div className="profile-header-image">
                    <div className="cover-container">
                      <img
                        loading="lazy"
                        src={img5}
                        alt="profile-bg"
                        className="rounded img-fluid w-100"
                      />
                    </div>
                    <div className="profile-info p-4">
                      <div className="user-detail">
                        <div className="d-flex flex-wrap justify-content-between align-items-start">
                          <div className="profile-detail d-flex">
                            <div className="profile-img pe-lg-4">
                              <img
                                loading="lazy"
                                src={user08}
                                alt="profile-img"
                                className="avatar-130 img-fluid"
                              />
                            </div>
                            <div className="user-data-block mt-md-0 mt-2">
                              <h4>
                                <Link to="/dashboard/app/friend-profile">
                                  Paige Turner
                                </Link>
                              </h4>
                              <h6>@tester</h6>
                              <p className="mb-2 mb-lg-0">
                                Lorem Ipsum is simply dummy text of the
                              </p>
                            </div>
                          </div>
                          <button type="submit" className="btn btn-primary">
                            Following
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </Card.Body>
              </Card>
            </Col>
          </Row>
        </Container>
      </div>
    </>
  );
};

export default FriendList;
