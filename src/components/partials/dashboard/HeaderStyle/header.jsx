import React, { useState, useEffect } from "react";
import { Nav, Form, Card, Container, Image, Dropdown, Navbar } from "react-bootstrap";
import { Link } from "react-router-dom";
import { getAuth } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";

// Import default user image
import defaultUserImage from "../../../../assets/images/user/1.jpg";
import user3 from "../../../../assets/images/user/03.jpg";

// Import selectors & action from setting store
import * as SettingSelector from "../../../../store/setting/selectors";

// Redux Selector / Action
import { useSelector } from "react-redux";
import { db } from "../../../../config/firebase";
import SearchModal from "../../../search-modal";

const Header = () => {
  const appName = useSelector(SettingSelector.app_name);
  const [active, setActive] = useState("home");
  const [userData, setUserData] = useState(null);

  const minisidebar = () => {
    const sidebarMini = document.getElementsByTagName("ASIDE")[0];
    if (sidebarMini.classList.contains('sidebar-mini')) {
      sidebarMini.classList.remove('sidebar-mini')
    } else {
      sidebarMini.classList.add('sidebar-mini')
    }
  };

  useEffect(() => {
    const fetchUserData = async () => {
      const auth = getAuth();
      const user = auth.currentUser;

      if (user) {
        const userDoc = await getDoc(doc(db, "users", user.uid));
        if (userDoc.exists()) {
          setUserData(userDoc.data());
        } else {
          console.log("No such document!");
        }
      }
    };

    fetchUserData();
  }, []);

  const dropdownContent = document.querySelectorAll(".sub-drop");
  if (dropdownContent) {
    dropdownContent.forEach((element) => {
      setTimeout(() => {
        element.style = "";
      }, 100);
    });
  }

  return (
    <>
      <div className="iq-top-navbar border-bottom">
        <Navbar
          expand="lg"
          variant="light"
          className="nav navbar navbar-expand-lg navbar-light iq-navbar p-lg-0"
        >
          <Container fluid className="navbar-inner">
            <div className="d-flex align-items-center pb-2 pb-lg-0 d-xl-none">
              <Link
                to="/"
                className="d-flex align-items-center iq-header-logo navbar-brand d-block d-xl-none"
              >
                <img src="https://i.postimg.cc/C5FqYncS/Untitled-design-3.png" width="50" alt="Jammify Logo" />
                <h3
                  className="logo-title d-none d-sm-block"
                  data-setting="app_name"
                >
                  {"Jammify"}
                </h3>
              </Link>
              <Link
                className="sidebar-toggle"
                data-toggle="sidebar"
                data-active="true"
                onClick={minisidebar}
                to="#"
              >
                <div className="icon material-symbols-outlined iq-burger-menu">
                  {" "}
                  menu{" "}
                </div>
              </Link>
            </div>

            <div className="d-flex align-items-center">
              <div className="d-flex align-items-center justify-content-between product-offcanvas">
                <div
                  className="offcanvas offcanvas-end shadow-none iq-product-menu-responsive d-none d-xl-block"
                  tabIndex="-1"
                  id="offcanvasBottomNav"
                >
                  <div className="offcanvas-body">
                    <ul className="iq-nav-menu list-unstyled">
                      <li className="nav-item">
                        <Link
                          className={`nav-link menu-arrow justify-content-start ${active === "home" ? 'active' : ''}`}
                          to="/"
                          onClick={() => setActive("home")}
                        >
                          <span className="nav-text">Home</span>
                        </Link>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
              <Dropdown bsPrefix=" "
                className="iq-search-bar device-search position-relative d-none d-lg-block"
              >
                <Dropdown.Toggle as="form" bsPrefix=" "
                  action="#"
                  className="searchbox open-modal-search"
                >
                  <Link className="search-link" to="#">
                    <svg width="16" height="17" viewBox="0 0 16 17" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <circle cx="7.82491" cy="7.82495" r="6.74142" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"></circle>
                      <path d="M12.5137 12.8638L15.1567 15.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"></path>
                    </svg>
                  </Link>
                  <Form.Control
                    type="text"
                    className="text search-input form-control bg-light-subtle"
                    placeholder="Search for people"
                  />
                  <Link
                    className="d-lg-none d-flex d-none d-lg-block"
                    to="/"
                  >
                    <span className="material-symbols-outlined">search12</span>
                  </Link>
                </Dropdown.Toggle>
                <SearchModal />
              </Dropdown>
            </div>

            <ul className="navbar-nav navbar-list">
              <Dropdown as="li" className="nav-item">
                <Dropdown.Toggle as="a"
                  className="search-toggle d-flex align-items-center"
                  id="notification-drop"
                >
                  <span className="material-symbols-outlined position-relative">
                    notifications
                    <span className="bg-primary text-white notification-badge"></span>
                  </span>
                </Dropdown.Toggle>
                <Dropdown.Menu
                  className={`sub-drop header-notification `}
                  aria-labelledby="notification-drop"
                  data-bs-popper="static"
                >
                  <Card className="m-0 shadow">
                    <div className="card-header d-flex justify-content-between px-0 pb-4 mx-5 border-bottom">
                      <div className="header-title">
                        <h5 className="fw-semibold">Notifications</h5>
                      </div>
                      <h6 className="material-symbols-outlined">settings</h6>
                    </div>
                    <Card.Body>
                      <div className="item-header-scroll">
                        <Link to="#">
                          <div className="d-flex gap-3 mb-4">
                            <img
                              className="avatar-32 rounded-pill"
                              src={user3}
                              alt=""
                              loading="lazy"
                            />
                            <div>
                              <h6 className="font-size-14">
                                NombreUsuario{" "}
                                <span className="text-body fw-normal">
                                  reaccionó a un comentario en tu{" "}
                                </span>
                                <span className="text-primary fw-semibold">
                                  publicación
                                </span>
                                .
                              </h6>
                              <small className="text-body fw-500">
                                HaceXMinutos
                              </small>
                            </div>
                          </div>
                        </Link>
                      </div>
                      <button
                        type="button"
                        className="btn btn-primary fw-500 w-100"
                      >
                        View All Notifications
                      </button>
                    </Card.Body>
                  </Card>
                </Dropdown.Menu>
              </Dropdown>

              <Dropdown as="li" className="nav-item user-dropdown">
                <Dropdown.Toggle as="a"
                  to="#"
                  className="d-flex align-items-center"
                  id="drop-down-arrow"
                >
                  <div className="user-avatar-container me-3">
                    <Image
                      src={userData?.profilePic || defaultUserImage}
                      className="img-fluid"
                      alt="user"
                      loading="lazy"
                    />
                  </div>
                  <span className="d-none d-lg-block">
                    {userData?.username || 'User'}
                  </span>
                </Dropdown.Toggle>
                <Dropdown.Menu
                  className={`sub-drop caption-menu `}
                >
                  <Card className="shadow-none m-0">
                    <Card.Header>
                      <div className="header-title">
                        <h5 className="mb-0">Hello {userData?.username || 'User'}</h5>
                      </div>
                    </Card.Header>
                    <Card.Body className="p-0">
                      <div className="d-flex align-items-center iq-sub-card border-0">
                        <span className="material-symbols-outlined">
                          line_style
                        </span>
                        <div className="ms-3">
                          <Link
                            to="/dashboard/app/profile"
                            className="mb-0 h6"
                          >
                            My Profile
                          </Link>
                        </div>
                      </div>
                      <div className="d-flex align-items-center iq-sub-card border-0">
                        <span className="material-symbols-outlined">
                          edit_note
                        </span>
                        <div className="ms-3">
                          <Link to="/dashboard/app/user-profile-edit" className="mb-0 h6">
                            Edit Profile
                          </Link>
                        </div>
                      </div>
                      <div className="d-flex align-items-center iq-sub-card">
                        <span className="material-symbols-outlined">
                          login
                        </span>
                        <div className="ms-3">
                          <Link to="/auth/sign-in" className="mb-0 h6">
                            Sign out
                          </Link>
                        </div>
                      </div>
                      <div className="iq-sub-card">
                        <h5>Chat Settings</h5>
                      </div>
                      <div className="d-flex align-items-center iq-sub-card border-0">
                        <i className="material-symbols-outlined text-success md-14">
                          circle
                        </i>
                        <div className="ms-3">Online</div>
                      </div>
                      <div className="d-flex align-items-center iq-sub-card border-0">
                        <i className="material-symbols-outlined text-warning md-14">
                          circle
                        </i>
                        <div className="ms-3">Away</div>
                      </div>
                      <div className="d-flex align-items-center iq-sub-card border-0">
                        <i className="material-symbols-outlined text-danger md-14">
                          circle
                        </i>
                        <div className="ms-3">Disconnected</div>
                      </div>
                      <div className="d-flex align-items-center iq-sub-card border-0">
                        <i className="material-symbols-outlined text-gray md-14">
                          circle
                        </i>
                        <div className="ms-3">Invisible</div>
                      </div>
                    </Card.Body>
                  </Card>
                </Dropdown.Menu>
              </Dropdown>
            </ul>
          </Container>
        </Navbar>
      </div>

      <style jsx>{`
        .user-avatar-container {
          width: 48px;
          height: 48px;
          border-radius: 50%;
          overflow: hidden;
          display: flex;
          justify-content: center;
          align-items: center;
          border: 2px solid #fff; /* Optional: add a border for better visibility */
        }

        .user-avatar-container img {
          width: 100%;
          height: 100%;
          object-fit: cover; /* Ensures the image covers the container without distortion */
        }
      `}</style>
    </>
  );
};

export default Header;
