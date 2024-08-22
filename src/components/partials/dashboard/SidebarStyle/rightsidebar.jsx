import React, { useEffect } from "react";
import { Button, Card, Form, Image, Nav, Tab, Tabs } from "react-bootstrap";

//image
import user1 from "../../../../assets/images/user/01.jpg";
import user7 from "../../../../assets/images/user/13.jpg";


import { Link, useNavigate } from "react-router-dom";

const RightSidebar = () => {
  const minirightsidebar = () => {
    document.getElementById("rightSidebar").classList.toggle("right-sidebar");
    document.body.classList.toggle("right-sidebar-close");
  };

  const history = useNavigate();

  useEffect(() => {
    let clickableElements = document.querySelectorAll(
      '[data-target="chat-popup-modal"]'
    );

    clickableElements.forEach(function (clickableElement) {
      clickableElement.addEventListener("click", function () {
        let targetId = clickableElement.getAttribute("data-target");
        let targetElement = document.getElementById(targetId);
        if (targetElement) {
          targetElement.classList.add("show");
        }
      });
    });

    let closeBtn = document.querySelector(".chat-popup-modal-close");

    if (closeBtn) {
      closeBtn.addEventListener("click", function () {
        let chatModal = document.getElementById("chat-popup-modal");
        if (chatModal.classList.contains("show")) {
          chatModal.classList.remove("show");
        }
      });
    }
  });
  return (
    <>
      <div className="right-sidebar-mini" id="rightSidebar">
        <div className="right-sidebar-panel p-0">
          <Card className="shadow-none m-0 h-100">
            <Card.Body className="px-0 pt-0">
              <div className="p-4">
                <h6 className="fw-semibold m-0">Chats</h6>
                <div className="mt-4 iq-search-bar device-search "> {/*Chat search bar */}
                  <Form action="#" className="searchbox position-relative">
                    <Link className="search-link" to="#">
                      <svg
                        width="16"
                        height="17"
                        viewBox="0 0 16 17"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <circle
                          cx="7.82491"
                          cy="7.82495"
                          r="6.74142"
                          stroke="currentColor"
                          strokeWidth="1.5"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                        <path
                          d="M12.5137 12.8638L15.1567 15.5"
                          stroke="currentColor"
                          strokeWidth="1.5"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                    </Link>
                    <Form.Control
                      type="text"
                      className="text search-input  bg-light-subtle"
                      placeholder="Search for people or groups..."
                    />
                  </Form>
                </div>
              </div>
              <Tab.Container defaultActiveKey="first">
                {/* </div> */}
                <div className="media-height" data-scrollbar="init">
                  <Tab.Content className="right-sidebar-tabs-content">
                    <Tab.Pane eventKey="first">
                      <div
                        className="d-flex align-items-center justify-content-between chat-tabs-content border-bottom"
                        data-target="chat-popup-modal"
                      >
                        <div className="d-flex align-items-center gap-3">
                          <div className="iq-profile-avatar status-online">
                            <img
                              className="rounded-circle avatar-50"
                              src={user1}
                              alt="user-img"
                              loading="lazy"
                            />
                          </div>
                          <div>
                            <h6 className="font-size-14 mb-0 fw-semibold">
                              Usuario
                            </h6>
                            <p className="mb-0 font-size-12 fw-medium">
                              Hola cómo estás?
                            </p>
                          </div>
                        </div>
                        <span className="font-size-12 fw-medium">2min</span>
                      </div>
                    </Tab.Pane>
                  </Tab.Content>
                </div>
              </Tab.Container>

              <div className="conversion-button">
                <Button
                  onClick={() => history("/chat/index")}
                  as="a"
                  className="btn btn-primary w-100 py-3 d-block rounded-0"
                >
                  View all Conversions
                </Button>
              </div>


              <div
                className="right-sidebar-toggle bg-primary text-white mt-3 d-flex"
                onClick={minirightsidebar}
              >
                <span className="material-symbols-outlined">chat</span>
              </div>
            </Card.Body>
          </Card>
        </div>
      </div>

      <div className="chat-popup-modal" id="chat-popup-modal"> {/*Chat pop up */}
        {" "}
       
        <div className="bg-primary p-3 d-flex align-items-center justify-content-between gap-3">
          <div className="d-flex align-items-center gap-3">
            <div className="image flex-shrink-0">
              <img
                src={user7}
                alt="img"
                className="img-fluid avatar-45 rounded-circle object-cover"
              />
            </div>
            <div className="content">
              <h6 className="mb-0 font-size-14 text-white">Usuario</h6>
              <span className="d-inline-block lh-1 font-size-12 text-white">
                <span className="d-inline-block rounded-circle bg-success border-5 p-1 align-baseline me-1"></span>
                Avaliable
              </span>
            </div>
          </div>
          <div className="chat-popup-modal-close lh-1" type="button">
            <span className="material-symbols-outlined font-size-18 text-white">
              close
            </span>
          </div>
        </div>
        <div className="chat-popup-body p-3 border-bottom">
          <ul className="list-inline p-0 mb-0 chat">
            <li>
              <div className="text-center">
                <span className="time font-size-12 text-primary">Today</span>
              </div>
            </li>
            <li className="mt-2">
              <div className="text-start">
                <div className="d-inline-block py-2 px-3 bg-gray-subtle chat-popup-message font-size-12 fw-medium">
                  Mensaje
                </div>
                <span className="mt-1 d-block time font-size-10 fst-italic">
                  03:41 PM
                </span>
              </div>
            </li>
            <li className="mt-3">
              <div className="text-end">
                <div className="d-inline-block py-2 px-3 bg-primary-subtle chat-popup-message message-right font-size-12 fw-medium">
                  Mensaje.
                </div>
                <span className="mt-1 d-block time font-size-10 fst-italic">
                  03:42 PM
                </span>
              </div>
            </li>
          </ul>
        </div>
        <div className="chat-popup-footer p-3">
          <div className="chat-popup-form">
            <form>
              <input
                type="text"
                className="form-control"
                placeholder="Start Typing..."
              />
              <button
                type="submit"
                className="chat-popup-form-button btn btn-primary"
              >
                <span className="material-symbols-outlined font-size-18 icon-rtl">
                  send
                </span>
              </button>
            </form>
          </div>
        </div>
      </div>
    </>
  );
};

export default RightSidebar;