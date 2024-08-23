import React, { useState, useEffect } from "react";
import { Row, Col, Container, Dropdown } from "react-bootstrap";
import { collection, query, where, getDocs } from "firebase/firestore";
import { db } from '../../../config/firebase';
import Card from "../../../components/Card";

import CreatePostNew from "../../../components/create-post-new";

import CustomToggle from "../../../components/dropdowns";
import { Link, useParams } from "react-router-dom";
import ReactFsLightbox from "fslightbox-react";
import ShareOffcanvas from "../../../components/share-offcanvas";

// images
import img1 from "../../../assets/images/page-img/fun.webp";
// images
import user1 from "../../../assets/images/user/11.png";
import user05 from "../../../assets/images/user/05.jpg";
import user02 from "../../../assets/images/user/02.jpg";
import user03 from "../../../assets/images/user/03.jpg";
import user08 from "../../../assets/images/user/08.jpg";
import user09 from "../../../assets/images/user/09.jpg";
import user11 from "../../../assets/images/user/1.jpg";
import icon1 from "../../../assets/images/icon/01.png";
import icon2 from "../../../assets/images/icon/02.png";
import icon3 from "../../../assets/images/icon/03.png";
import icon4 from "../../../assets/images/icon/04.png";
import icon5 from "../../../assets/images/icon/05.png";
import icon6 from "../../../assets/images/icon/06.png";
import icon7 from "../../../assets/images/icon/07.png";
import g1 from "../../../assets/images/page-img/g1.jpg";
import g2 from "../../../assets/images/page-img/g2.jpg";
import g3 from "../../../assets/images/page-img/g3.jpg";
import g4 from "../../../assets/images/page-img/g4.jpg";
import g5 from "../../../assets/images/page-img/g5.jpg";
import g6 from "../../../assets/images/page-img/g6.jpg";
import g7 from "../../../assets/images/page-img/g7.jpg";
import g8 from "../../../assets/images/page-img/g8.jpg";
import g9 from "../../../assets/images/page-img/g9.jpg";
import img56 from "../../../assets/images/page-img/p2.jpg";
import img58 from "../../../assets/images/page-img/p1.jpg";
import img57 from "../../../assets/images/page-img/p3.jpg";
import img59 from "../../../assets/images/page-img/59.jpg";

// Fslightbox plugin
const FsLightbox = ReactFsLightbox.default
  ? ReactFsLightbox.default
  : ReactFsLightbox;

const FriendProfile = () => {
  const { username } = useParams(); // Obtiene el username desde la URL
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [imageController, setImageController] = useState({
    toggler: false,
    slide: 1,
  });

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        // Crear una consulta para obtener el documento donde el campo "username" coincide
        const q = query(collection(db, "users"), where("username", "==", username));
        const querySnapshot = await getDocs(q);

        if (!querySnapshot.empty) {
          // Tomamos el primer documento que coincida
          const doc = querySnapshot.docs[0];
          setUserData(doc.data());
        } else {
          console.error("No user found with the username:", username);
        }
      } catch (error) {
        console.error("Error fetching user data: ", error);
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, [username]);

  if (loading) {
    return <div>Loading...</div>; // Muestra un indicador de carga mientras se obtienen los datos
  }

  if (!userData) {
    return <div>No user found</div>; // Muestra un mensaje si no se encontró el usuario
  }

  function imageOnSlide(number) {
    setImageController({
      toggler: !imageController.toggler,
      slide: number,
    });
  }

  return (
    <>
      <FsLightbox
        toggler={imageController.toggler}
        sources={[g1, g2, g3, g4, g5, g6, g7, g8, g9]}
        slide={imageController.slide}
      />
      <div id="content-page" className="content-inner">
        <Container>
          <Row>
            <Col sm={12}>
              <Card>
                <Card.Body className="profile-page p-0">
                  <div className="profile-header profile-info">
                    <Container className="position-relative p-0">
                      <div
                        className="header-cover-img"
                        style={{
                          backgroundImage: `url(${"https://i.imgur.com/0LORAZB.png" || img1})`,
                          backgroundSize: "cover",
                          backgroundRepeat: "no-repeat",
                        }}
                      >
                        <ul className="header-nav d-flex flex-wrap justify-end p-0 m-0">
                          <li>
                            <Link to="#" className="material-symbols-outlined">
                              personadd
                            </Link>
                          </li>
                          <li>
                            <Link to="#" className="material-symbols-outlined">
                              mail
                            </Link>
                          </li>
                        </ul> 
                      </div>
                    </Container>
                    <div className="user-detail text-center mb-3">
                      <div className="profile-img">
                        <img
                          loading="lazy"
                          src={userData.profilePic || user1}
                          alt="profile-img"
                          className="avatar-130 img-fluid"
                        />
                      </div>
                      <div className="profile-detail">
                        <h3>{userData.username || "User Name"}</h3>
                      </div>
                    </div>
                    <div className="profile-info py-5 px-md-5 px-3 d-flex align-items-center justify-content-between position-relative">
                      <div className="social-links">
                        <ul className="social-data-block d-flex align-items-center justify-content-between list-inline p-0 m-0">
                          <li className="text-center pe-3">
                            <Link to={userData.tiktokLink || "#"}>
                              <img
                                src="https://img.icons8.com/?size=100&id=fdfLpA6fsXN2&format=png&color=000000"
                                className="img-fluid rounded"
                                alt="tiktok"
                                width={32}
                                height={32}
                                loading="lazy"
                              />
                              <text name="socialmedia-name">TikTok</text>
                            </Link>
                          </li>
                          <li className="text-center pe-3">
                            <Link to={userData.spotifyLink || "#"}>
                              <img
                                src="https://img.icons8.com/?size=100&id=G9XXzb9XaEKX&format=png&color=000000"
                                width={32}
                                height={32}
                                className="img-fluid rounded"
                                alt="Spotify"
                                loading="lazy"
                              />
                              <text name="socialmedia-name">Spotify</text>
                            </Link>
                          </li>
                          <li className="text-center pe-3">
                            <Link to={userData.instagramLink || "#"}>
                              <img
                                src="https://img.icons8.com/?size=100&id=BrU2BBoRXiWq&format=png&color=000000"
                                width={32}
                                height={32}
                                className="img-fluid rounded"
                                alt="Instagram"
                                loading="lazy"
                              />
                              <text name="socialmedia-name">Instagram</text>
                            </Link>
                          </li>
                        </ul>
                      </div>
                      <div className="social-info">
                        <ul className="social-data-block social-user-meta-list d-flex align-items-center justify-content-center list-inline p-0 m-0 gap-1">
                          <li className="text-center">
                            <p className="mb-0">{userData.posts || 0}</p>
                            <h6>Posts</h6>
                          </li>
                          <li className="text-center">
                            <p className="mb-0">{userData.followers || 0}</p>
                            <h6>Followers</h6>
                          </li>
                          <li className="text-center">
                            <p className="mb-0">{userData.following || 0}</p>
                            <h6>Following</h6>
                          </li>
                        </ul>
                      </div>
                    </div>
                  </div>
                </Card.Body>
              </Card>
            </Col>
            <Row>
              <Col lg={4}>
                <Card>
                  <Card.Header className="border-bottom">
                    <div className="header-title">
                      <h4 className="card-title">About</h4>
                    </div>
                  </Card.Header>
                  <Card.Body>
                    <ul className="list-inline p-0 m-0">
                      <li className="mb-2 d-flex align-items-center">
                        <span className="material-symbols-outlined md-18">
                          face
                        </span>
                        <p className="mb-0 ms-2">{userData.aboutMe || "Web Developer"}</p>
                      </li>
                      <li className="mb-2 d-flex align-items-center">
                        <span className="material-symbols-outlined md-18">
                          celebration
                        </span>
                        <p className="mb-0 ms-2">{userData.dob || "07/05/2000"}</p>
                      </li>
                      <li className="mb-2 d-flex align-items-center">
                        <span className="material-symbols-outlined md-18">
                          place
                        </span>
                        <p className="mb-0 ms-2">{userData.country || "CR"}</p>
                      </li>
                      <li className="d-flex align-items-center">
                        <span className="material-symbols-outlined md-18">
                          wc
                        </span>
                        <p className="mb-0 ms-2">{userData.gender || "Male"}</p>
                      </li>
                    </ul>
                  </Card.Body>
                </Card>

                
                <div className="fixed-suggestion mb-0 mb-lg-4">
                </div>
              </Col>
              <Col lg={8}>
                <CreatePostNew />
                <Card>
                  <Card.Body>
                    <div className="post-item">
                      <div className="user-post-data pb-3">
                        <div className="d-flex justify-content-between">
                          <div className="me-3">
                            <img
                              loading="lazy"
                              className="rounded-circle  avatar-60"
                              src={user05}
                              alt=""
                            />
                          </div>
                          <div className="w-100">
                            <div className="d-flex justify-content-between flex-wrap">
                              <div>
                                <h5 className="mb-0 d-inline-block">
                                  <Link to="#">Anna Sthesia</Link>
                                </h5>

                                <p className="mb-0">8 hour ago</p>
                              </div>
                              <div className="card-post-toolbar">
                                <Dropdown>
                                  <Dropdown.Toggle as="span">
                                    <span
                                      className="dropdown-toggle material-symbols-outlined"
                                      data-bs-toggle="dropdown"
                                      aria-haspopup="true"
                                      aria-expanded="false"
                                      role="button"
                                    >
                                      more_horiz
                                    </span>
                                  </Dropdown.Toggle>
                                  <Dropdown.Menu className=" m-0 p-0">
                                    <Dropdown.Item className="p-3" to="#">
                                      <div className="d-flex align-items-top">
                                        <span className="material-symbols-outlined">
                                          save
                                        </span>
                                        <div className="data ms-2">
                                          <h6>Save Post</h6>
                                          <p className="mb-0">
                                            Add this to your saved items
                                          </p>
                                        </div>
                                      </div>
                                    </Dropdown.Item>
                                    <Dropdown.Item className="p-3" to="#">
                                      <div className="d-flex align-items-top">
                                        <span className="material-symbols-outlined">
                                          cancel
                                        </span>
                                        <div className="data ms-2">
                                          <h6>Hide Post</h6>
                                          <p className="mb-0">
                                            See fewer posts like this.
                                          </p>
                                        </div>
                                      </div>
                                    </Dropdown.Item>
                                    <Dropdown.Item className=" p-3" to="#">
                                      <div className="d-flex align-items-top">
                                        <span className="material-symbols-outlined">
                                          person_remove
                                        </span>
                                        <div className="data ms-2">
                                          <h6>Unfollow User</h6>
                                          <p className="mb-0">
                                            Stop seeing posts but stay friends.
                                          </p>
                                        </div>
                                      </div>
                                    </Dropdown.Item>
                                    <Dropdown.Item className=" p-3" to="#">
                                      <div className="d-flex align-items-top">
                                        <span className="material-symbols-outlined">
                                          notifications
                                        </span>
                                        <div className="data ms-2">
                                          <h6>Notifications</h6>
                                          <p className="mb-0">
                                            Turn on notifications for this post
                                          </p>
                                        </div>
                                      </div>
                                    </Dropdown.Item>
                                  </Dropdown.Menu>
                                </Dropdown>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="user-post">
                        <Link to="#">
                          <img
                            loading="lazy"
                            src={img59}
                            alt="post"
                            className="img-fluid w-100"
                          />
                        </Link>
                      </div>
                      <div className="comment-area mt-3">
                        <div className="d-flex justify-content-between align-items-center">
                          <div className="like-block position-relative d-flex align-items-center">
                            <div className="d-flex align-items-center">
                              <div className="like-data">
                                <Dropdown>
                                  <Dropdown.Toggle
                                    as={CustomToggle}
                                    role="button"
                                  >
                                    <img
                                      loading="lazy"
                                      src={icon1}
                                      className="img-fluid"
                                      alt=""
                                    />
                                  </Dropdown.Toggle>
                                  <div className="dropdown-menu">
                                    <Link
                                      className="ml-2 mr-2"
                                      to="#"
                                      data-toggle="tooltip"
                                      data-placement="top"
                                      title=""
                                      data-original-title="Like"
                                    >
                                      <img
                                        loading="lazy"
                                        src={icon1}
                                        className="img-fluid me-2"
                                        alt=""
                                      />
                                    </Link>
                                    <Link
                                      className="mr-2"
                                      to="#"
                                      data-toggle="tooltip"
                                      data-placement="top"
                                      title=""
                                      data-original-title="Love"
                                    >
                                      <img
                                        loading="lazy"
                                        src={icon2}
                                        className="img-fluid me-2"
                                        alt=""
                                      />
                                    </Link>
                                    <Link
                                      className="mr-2"
                                      to="#"
                                      data-toggle="tooltip"
                                      data-placement="top"
                                      title=""
                                      data-original-title="Happy"
                                    >
                                      <img
                                        loading="lazy"
                                        src={icon3}
                                        className="img-fluid me-2"
                                        alt=""
                                      />
                                    </Link>
                                    <Link
                                      className="mr-2"
                                      to="#"
                                      data-toggle="tooltip"
                                      data-placement="top"
                                      title=""
                                      data-original-title="HaHa"
                                    >
                                      <img
                                        loading="lazy"
                                        src={icon4}
                                        className="img-fluid me-2"
                                        alt=""
                                      />
                                    </Link>
                                    <Link
                                      className="mr-2"
                                      to="#"
                                      data-toggle="tooltip"
                                      data-placement="top"
                                      title=""
                                      data-original-title="Think"
                                    >
                                      <img
                                        loading="lazy"
                                        src={icon5}
                                        className="img-fluid me-2"
                                        alt=""
                                      />
                                    </Link>
                                    <Link
                                      className="mr-2"
                                      to="#"
                                      data-toggle="tooltip"
                                      data-placement="top"
                                      title=""
                                      data-original-title="Sade"
                                    >
                                      <img
                                        loading="lazy"
                                        src={icon6}
                                        className="img-fluid me-2"
                                        alt=""
                                      />
                                    </Link>
                                    <Link
                                      className="mr-2"
                                      to="#"
                                      data-toggle="tooltip"
                                      data-placement="top"
                                      title=""
                                      data-original-title="Lovely"
                                    >
                                      <img
                                        loading="lazy"
                                        src={icon7}
                                        className="img-fluid me-2"
                                        alt=""
                                      />
                                    </Link>
                                  </div>
                                </Dropdown>
                              </div>
                              <div className="total-like-block ms-2 me-3">
                                <span className="dropdown-toggle" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false" role="button">
                                  140 Likes
                                </span>
                              </div>
                            </div>
                            <div className="total-comment-block">
                              <span className="dropdown-toggle" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false" role="button">
                                20 Comment
                              </span>
                            </div>
                          </div>
                          <ShareOffcanvas />
                        </div>
                        <hr />
                        <ul className="post-comments p-0 m-0">
                          <li className="mb-2">
                            <div className="d-flex flex-wrap">
                              <div className="user-img">
                                <img
                                  loading="lazy"
                                  src={user09}
                                  alt="userimg"
                                  className="avatar-35 rounded-circle img-fluid"
                                />
                              </div>
                              <div className="comment-data-block ms-3">
                                <h6>Moe Fugga</h6>
                                <p className="mb-0">
                                  Lorem ipsum dolor sit amet
                                </p>
                                <div className="d-flex flex-wrap align-items-center comment-activity">
                                  <Link to="#">like</Link>
                                  <Link to="#">reply</Link>
                                  <Link to="#">translate</Link>
                                  <span> 3 min </span>
                                </div>
                              </div>
                            </div>
                          </li>
                          <li>
                            <div className="d-flex flex-wrap">
                              <div className="user-img">
                                <img
                                  loading="lazy"
                                  src={user08}
                                  alt="userimg"
                                  className="avatar-35 rounded-circle img-fluid"
                                />
                              </div>
                              <div className="comment-data-block ms-3">
                                <h6>Bill Emia</h6>
                                <p className="mb-0">
                                  Lorem ipsum dolor sit amet
                                </p>
                                <div className="d-flex flex-wrap align-items-center comment-activity">
                                  <Link to="#">like</Link>
                                  <Link to="#">reply</Link>
                                  <Link to="#">translate</Link>
                                  <span> 5 min </span>
                                </div>
                              </div>
                            </div>
                          </li>
                        </ul>
                        <form className="comment-text d-flex align-items-center mt-3">
                          <input type="text" className="form-control rounded" />
                          <div className="comment-attagement d-flex">
                            <Link
                              to="#"
                              className="material-symbols-outlined me-3 link"
                            >
                              insert_link
                            </Link>
                            <Link
                              to="#"
                              className="material-symbols-outlined  me-3"
                            >
                              sentiment_satisfied
                            </Link>
                            <Link
                              to="#"
                              className="material-symbols-outlined  me-3"
                            >
                              photo_camera
                            </Link>
                          </div>
                        </form>
                      </div>
                    </div>
                  </Card.Body>
                </Card>
                <Card>
                  <Card.Body>
                    <div className="post-item">
                      <div className="user-post-data pb-3">
                        <div className="d-flex justify-content-between">
                          <div className="me-3">
                            <img
                              loading="lazy"
                              className="rounded-circle  avatar-60"
                              src={user11}
                              alt=""
                            />
                          </div>
                          <div className="w-100">
                            <div className="d-flex justify-content-between flex-wrap">
                              <div>
                                <h5 className="mb-0 d-inline-block">
                                  <Link to="#">Bni Cyst</Link>
                                </h5>{" "}
                                <p className="ms-1 mb-0 d-inline-block">
                                  Update his Status
                                </p>
                                <p className="mb-0">7 hour ago</p>
                              </div>
                              <div className="card-post-toolbar">
                                <Dropdown>
                                  <Dropdown.Toggle as="span">
                                    <span
                                      className="dropdown-toggle material-symbols-outlined"
                                      data-bs-toggle="dropdown"
                                      aria-haspopup="true"
                                      aria-expanded="false"
                                      role="button"
                                    >
                                      more_horiz
                                    </span>
                                  </Dropdown.Toggle>
                                  <Dropdown.Menu className=" m-0 p-0">
                                    <Dropdown.Item className=" p-3" to="#">
                                      <div className="d-flex align-items-top">
                                        <span className="material-symbols-outlined">
                                          save
                                        </span>
                                        <div className="data ms-2">
                                          <h6>Save Post</h6>
                                          <p className="mb-0">
                                            Add this to your saved items
                                          </p>
                                        </div>
                                      </div>
                                    </Dropdown.Item>
                                    <Dropdown.Item className=" p-3" to="#">
                                      <div className="d-flex align-items-top">
                                        <span className="material-symbols-outlined">
                                          cancel
                                        </span>
                                        <div className="data ms-2">
                                          <h6>Hide Post</h6>
                                          <p className="mb-0">
                                            See fewer posts like this.
                                          </p>
                                        </div>
                                      </div>
                                    </Dropdown.Item>
                                    <Dropdown.Item className="p-3" to="#">
                                      <div className="d-flex align-items-top">
                                        <span className="material-symbols-outlined">
                                          person_remove
                                        </span>
                                        <div className="data ms-2">
                                          <h6>Unfollow User</h6>
                                          <p className="mb-0">
                                            Stop seeing posts but stay friends.
                                          </p>
                                        </div>
                                      </div>
                                    </Dropdown.Item>
                                    <Dropdown.Item className=" p-3" to="#">
                                      <div className="d-flex align-items-top">
                                        <span className="material-symbols-outlined">
                                          notifications
                                        </span>
                                        <div className="data ms-2">
                                          <h6>Notifications</h6>
                                          <p className="mb-0">
                                            Turn on notifications for this post
                                          </p>
                                        </div>
                                      </div>
                                    </Dropdown.Item>
                                  </Dropdown.Menu>
                                </Dropdown>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="user-post">
                        <p>
                          Lorem Ipsum is simply dummy text of the printing and
                          typesetting industry. Lorem Ipsum has been the
                          industry's standard dummy text ever since the 1500s,
                          when an unknown printer took a galley of type and
                          scrambled it to make a type specimen book. It has
                          survived not only five centuries,
                        </p>
                      </div>
                      <div className="comment-area mt-3">
                        <div className="d-flex justify-content-between align-items-center">
                          <div className="like-block position-relative d-flex align-items-center">
                            <div className="d-flex align-items-center">
                              <div className="like-data">
                                <Dropdown>
                                  <Dropdown.Toggle
                                    as={CustomToggle}
                                    aria-haspopup="true"
                                    aria-expanded="false"
                                    role="button"
                                  >
                                    <img
                                      loading="lazy"
                                      src={icon1}
                                      className="img-fluid"
                                      alt=""
                                    />
                                  </Dropdown.Toggle>
                                  <Dropdown.Menu>
                                    <Link
                                      className="ms-2 me-2"
                                      to="#"
                                      data-toggle="tooltip"
                                      data-placement="top"
                                      title=""
                                      data-original-title="Like"
                                    >
                                      <img
                                        loading="lazy"
                                        src={icon1}
                                        className="img-fluid me-2"
                                        alt=""
                                      />
                                    </Link>
                                    <Link
                                      className="mr-2"
                                      to="#"
                                      data-toggle="tooltip"
                                      data-placement="top"
                                      title=""
                                      data-original-title="Love"
                                    >
                                      <img
                                        loading="lazy"
                                        src={icon2}
                                        className="img-fluid me-2"
                                        alt=""
                                      />
                                    </Link>
                                    <Link
                                      className="mr-2"
                                      to="#"
                                      data-toggle="tooltip"
                                      data-placement="top"
                                      title=""
                                      data-original-title="Happy"
                                    >
                                      <img
                                        loading="lazy"
                                        src={icon3}
                                        className="img-fluid me-2"
                                        alt=""
                                      />
                                    </Link>
                                    <Link
                                      className="mr-2"
                                      to="#"
                                      data-toggle="tooltip"
                                      data-placement="top"
                                      title=""
                                      data-original-title="HaHa"
                                    >
                                      <img
                                        loading="lazy"
                                        src={icon4}
                                        className="img-fluid me-2"
                                        alt=""
                                      />
                                    </Link>
                                    <Link
                                      className="mr-2"
                                      to="#"
                                      data-toggle="tooltip"
                                      data-placement="top"
                                      title=""
                                      data-original-title="Think"
                                    >
                                      <img
                                        loading="lazy"
                                        src={icon5}
                                        className="img-fluid me-2"
                                        alt=""
                                      />
                                    </Link>
                                    <Link
                                      className="mr-2"
                                      to="#"
                                      data-toggle="tooltip"
                                      data-placement="top"
                                      title=""
                                      data-original-title="Sade"
                                    >
                                      <img
                                        loading="lazy"
                                        src={icon6}
                                        className="img-fluid me-2"
                                        alt=""
                                      />
                                    </Link>
                                    <Link
                                      className="mr-2"
                                      to="#"
                                      data-toggle="tooltip"
                                      data-placement="top"
                                      title=""
                                      data-original-title="Lovely"
                                    >
                                      <img
                                        loading="lazy"
                                        src={icon7}
                                        className="img-fluid me-2"
                                        alt=""
                                      />
                                    </Link>
                                  </Dropdown.Menu>
                                </Dropdown>
                              </div>
                              <div className="total-like-block ms-2 me-3">
                                <span className="dropdown-toggle" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false" role="button">
                                  140 Likes
                                </span>
                              </div>
                            </div>
                            <div className="total-comment-block">
                              <span className="dropdown-toggle" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false" role="button">
                                20 Comment
                              </span>
                            </div>
                          </div>
                          <ShareOffcanvas />
                        </div>
                        <hr />
                        <ul className="post-comments p-0 m-0">
                          <li className="mb-2">
                            <div className="d-flex flex-wrap">
                              <div className="user-img">
                                <img
                                  loading="lazy"
                                  src={user02}
                                  alt="userimg"
                                  className="avatar-35 rounded-circle img-fluid"
                                />
                              </div>
                              <div className="comment-data-block ms-3">
                                <h6>Monty Carlo</h6>
                                <p className="mb-0">
                                  Lorem ipsum dolor sit amet
                                </p>
                                <div className="d-flex flex-wrap align-items-center comment-activity">
                                  <Link to="#">like</Link>
                                  <Link to="#">reply</Link>
                                  <Link to="#">translate</Link>
                                  <span> 5 min </span>
                                </div>
                              </div>
                            </div>
                          </li>
                          <li>
                            <div className="d-flex flex-wrap">
                              <div className="user-img">
                                <img
                                  loading="lazy"
                                  src={user03}
                                  alt="user"
                                  className="avatar-35 rounded-circle img-fluid"
                                />
                              </div>
                              <div className="comment-data-block ms-3">
                                <h6>Paul Molive</h6>
                                <p className="mb-0">
                                  Lorem ipsum dolor sit amet
                                </p>
                                <div className="d-flex flex-wrap align-items-center comment-activity">
                                  <Link to="#">like</Link>
                                  <Link to="#">reply</Link>
                                  <Link to="#">translate</Link>
                                  <span> 5 min </span>
                                </div>
                              </div>
                            </div>
                          </li>
                        </ul>
                        <form className="comment-text d-flex align-items-center mt-3">
                          <input type="text" className="form-control rounded" />
                          <div className="comment-attagement d-flex">
                            <Link
                              to="#"
                              className="material-symbols-outlined me-3 link"
                            >
                              insert_link
                            </Link>
                            <Link
                              to="#"
                              className="material-symbols-outlined  me-3"
                            >
                              sentiment_satisfied
                            </Link>
                            <Link
                              to="#"
                              className="material-symbols-outlined  me-3"
                            >
                              photo_camera
                            </Link>
                          </div>
                        </form>
                      </div>
                    </div>
                  </Card.Body>
                </Card>
                <Card>
                  <Card.Body>
                    <div className="post-item">
                      <div className="user-post-data pb-3">
                        <div className="d-flex justify-content-between">
                          <div className="me-3">
                            <img
                              loading="lazy"
                              className="rounded-circle  avatar-60"
                              src={user05}
                              alt=""
                            />
                          </div>
                          <div className="w-100">
                            <div className="d-flex justify-content-between flex-wrap">
                              <div>
                                <h5 className="mb-0 d-inline-block">
                                  <Link to="#">Bni Cyst</Link>
                                </h5>{" "}
                                <p className="ms-1 mb-0 d-inline-block">
                                  Update his Status
                                </p>
                                <p className="mb-0">7 hour ago</p>
                              </div>
                              <div className="card-post-toolbar">
                                <Dropdown>
                                  <Dropdown.Toggle as="span">
                                    <span
                                      className="dropdown-toggle material-symbols-outlined"
                                      data-bs-toggle="dropdown"
                                      aria-haspopup="true"
                                      aria-expanded="false"
                                      role="button"
                                    >
                                      more_horiz
                                    </span>
                                  </Dropdown.Toggle>
                                  <Dropdown.Menu className="m-0 p-0">
                                    <Dropdown.Item className=" p-3" to="#">
                                      <div className="d-flex align-items-top">
                                        <span className="material-symbols-outlined">
                                          save
                                        </span>
                                        <div className="data ms-2">
                                          <h6>Save Post</h6>
                                          <p className="mb-0">
                                            Add this to your saved items
                                          </p>
                                        </div>
                                      </div>
                                    </Dropdown.Item>
                                    <Dropdown.Item className="p-3" to="#">
                                      <div className="d-flex align-items-top">
                                        <span className="material-symbols-outlined">
                                          cancel
                                        </span>
                                        <div className="data ms-2">
                                          <h6>Hide Post</h6>
                                          <p className="mb-0">
                                            See fewer posts like this.
                                          </p>
                                        </div>
                                      </div>
                                    </Dropdown.Item>
                                    <Link className="dropdown-item p-3" to="#">
                                      <div className="d-flex align-items-top">
                                        <span className="material-symbols-outlined">
                                          person_remove
                                        </span>
                                        <div className="data ms-2">
                                          <h6>Unfollow User</h6>
                                          <p className="mb-0">
                                            Stop seeing posts but stay friends.
                                          </p>
                                        </div>
                                      </div>
                                    </Link>
                                    <Dropdown.Item className="p-3" to="#">
                                      <div className="d-flex align-items-top">
                                        <span className="material-symbols-outlined">
                                          notifications
                                        </span>
                                        <div className="data ms-2">
                                          <h6>Notifications</h6>
                                          <p className="mb-0">
                                            Turn on notifications for this post
                                          </p>
                                        </div>
                                      </div>
                                    </Dropdown.Item>
                                  </Dropdown.Menu>
                                </Dropdown>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="user-post">
                        <div className=" d-grid grid-rows-2 grid-flow-col gap-3">
                          <div className="row-span-2 row-span-md-1">
                            <Link to="#">
                              <img
                                loading="lazy"
                                src={img56}
                                alt="post"
                                className="img-fluid w-100"
                              />
                            </Link>
                          </div>
                          <div className="row-span-1">
                            <Link to="#">
                              <img
                                loading="lazy"
                                src={img58}
                                alt="post"
                                className="img-fluid w-100"
                              />
                            </Link>
                          </div>
                          <div className="row-span-1 ">
                            <Link to="#">
                              <img
                                loading="lazy"
                                src={img57}
                                alt="post"
                                className="img-fluid w-100"
                              />
                            </Link>
                          </div>
                        </div>
                      </div>
                      <div className="comment-area mt-3">
                        <div className="d-flex justify-content-between align-items-center">
                          <div className="like-block position-relative d-flex align-items-center">
                            <div className="d-flex align-items-center">
                              <div className="like-data">
                                <Dropdown>
                                  <Dropdown.Toggle
                                    as={CustomToggle}
                                    role="button"
                                  >
                                    <img
                                      loading="lazy"
                                      src={icon1}
                                      className="img-fluid"
                                      alt=""
                                    />
                                  </Dropdown.Toggle>
                                  <Dropdown.Menu>
                                    <Link
                                      className="ml-2 mr-2"
                                      to="#"
                                      data-toggle="tooltip"
                                      data-placement="top"
                                      title=""
                                      data-original-title="Like"
                                    >
                                      <img
                                        loading="lazy"
                                        src={icon1}
                                        className="img-fluid me-2"
                                        alt=""
                                      />
                                    </Link>
                                    <Link
                                      className="mr-2"
                                      to="#"
                                      data-toggle="tooltip"
                                      data-placement="top"
                                      title=""
                                      data-original-title="Love"
                                    >
                                      <img
                                        loading="lazy"
                                        src={icon2}
                                        className="img-fluid me-2"
                                        alt=""
                                      />
                                    </Link>
                                    <Link
                                      className="mr-2"
                                      to="#"
                                      data-toggle="tooltip"
                                      data-placement="top"
                                      title=""
                                      data-original-title="Happy"
                                    >
                                      <img
                                        loading="lazy"
                                        src={icon3}
                                        className="img-fluid me-2"
                                        alt=""
                                      />
                                    </Link>
                                    <Link
                                      className="mr-2"
                                      to="#"
                                      data-toggle="tooltip"
                                      data-placement="top"
                                      title=""
                                      data-original-title="HaHa"
                                    >
                                      <img
                                        loading="lazy"
                                        src={icon4}
                                        className="img-fluid me-2"
                                        alt=""
                                      />
                                    </Link>
                                    <Link
                                      className="mr-2"
                                      to="#"
                                      data-toggle="tooltip"
                                      data-placement="top"
                                      title=""
                                      data-original-title="Think"
                                    >
                                      <img
                                        loading="lazy"
                                        src={icon5}
                                        className="img-fluid me-2"
                                        alt=""
                                      />
                                    </Link>
                                    <Link
                                      className="mr-2"
                                      to="#"
                                      data-toggle="tooltip"
                                      data-placement="top"
                                      title=""
                                      data-original-title="Sade"
                                    >
                                      <img
                                        loading="lazy"
                                        src={icon6}
                                        className="img-fluid me-2"
                                        alt=""
                                      />
                                    </Link>
                                    <Link
                                      className="mr-2"
                                      to="#"
                                      data-toggle="tooltip"
                                      data-placement="top"
                                      title=""
                                      data-original-title="Lovely"
                                    >
                                      <img
                                        loading="lazy"
                                        src={icon7}
                                        className="img-fluid me-2"
                                        alt=""
                                      />
                                    </Link>
                                  </Dropdown.Menu>
                                </Dropdown>
                              </div>
                              <div className="total-like-block ms-2 me-3">
                                <span className="dropdown-toggle" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false" role="button">
                                  140 Likes
                                </span>
                              </div>
                            </div>
                            <div className="total-comment-block">
                              <span className="dropdown-toggle" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false" role="button">
                                20 Comment
                              </span>
                            </div>
                          </div>
                          <ShareOffcanvas />
                        </div>
                        <hr />
                        <ul className="post-comments p-0 m-0">
                          <li className="mb-2">
                            <div className="d-flex flex-wrap">
                              <div className="user-img">
                                <img
                                  loading="lazy"
                                  src={user02}
                                  alt="userimg"
                                  className="avatar-35 rounded-circle img-fluid"
                                />
                              </div>
                              <div className="comment-data-block ms-3">
                                <h6>Monty Carlo</h6>
                                <p className="mb-0">
                                  Lorem ipsum dolor sit amet
                                </p>
                                <div className="d-flex flex-wrap align-items-center comment-activity">
                                  <Link to="#">like</Link>
                                  <Link to="#">reply</Link>
                                  <Link to="#">translate</Link>
                                  <span> 5 min </span>
                                </div>
                              </div>
                            </div>
                          </li>
                          <li>
                            <div className="d-flex flex-wrap">
                              <div className="user-img">
                                <img
                                  loading="lazy"
                                  src={user03}
                                  alt="userimg"
                                  className="avatar-35 rounded-circle img-fluid"
                                />
                              </div>
                              <div className="comment-data-block ms-3">
                                <h6>Paul Molive</h6>
                                <p className="mb-0">
                                  Lorem ipsum dolor sit amet
                                </p>
                                <div className="d-flex flex-wrap align-items-center comment-activity">
                                  <Link to="#">like</Link>
                                  <Link to="#">reply</Link>
                                  <Link to="#">translate</Link>
                                  <span> 5 min </span>
                                </div>
                              </div>
                            </div>
                          </li>
                        </ul>
                        <form className="comment-text d-flex align-items-center mt-3">
                          <input type="text" className="form-control rounded" />
                          <div className="comment-attagement d-flex">
                            <Link
                              to="#"
                              className="material-symbols-outlined me-3 link"
                            >
                              insert_link
                            </Link>
                            <Link
                              to="#"
                              className="material-symbols-outlined  me-3"
                            >
                              sentiment_satisfied
                            </Link>
                            <Link
                              to="#"
                              className="material-symbols-outlined  me-3"
                            >
                              photo_camera
                            </Link>
                          </div>
                        </form>
                      </div>
                    </div>
                  </Card.Body>
                </Card>
              </Col>
            </Row>
          </Row>
        </Container>
      </div>
    </>
  );
};

export default FriendProfile;
