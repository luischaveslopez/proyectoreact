import React from "react";
import { Row, Col, Container } from "react-bootstrap";
import Card from "../../../components/Card";
import { Link } from "react-router-dom";
// img

import user5 from "../../../assets/images/user/05.jpg";
import user6 from "../../../assets/images/user/06.jpg";
import user7 from "../../../assets/images/user/07.jpg";
//Sweet alert
import Swal from "sweetalert2";

const FriendReqest = () => {
  const questionAlert = () => {
    const swalWithBootstrapButtons = Swal.mixin({
      customClass: {
        cancelButton: "btn btn-outline-primary btn-lg ms-2",
        confirmButton: "btn btn-primary btn-lg",
      },
      buttonsStyling: false,
    });

    swalWithBootstrapButtons
      .fire({
        title: "Are you sure?",
        text: "You won't be able to revert this!",
        icon: "warning",
        showCancelButton: true,
        cancelButtonText: "cancel",
        confirmButtonText: "Yes, delete it!",

        reverseButtons: false,
        showClass: {
          popup: "animate__animated animate__zoomIn",
        },
        hideClass: {
          popup: "animate__animated animate__zoomOut",
        },
      })
      .then((result) => {
        if (result.isConfirmed) {
          swalWithBootstrapButtons.fire({
            title: "Deleted!",
            text: "Your Request has been deleted.",
            icon: "success",
            showClass: {
              popup: "animate__animated animate__zoomIn",
            },
            hideClass: {
              popup: "animate__animated animate__zoomOut",
            },
          });
        } else if (
          /* Read more about handling dismissals below */
          result.dismiss === Swal.DismissReason.cancel
        ) {
          swalWithBootstrapButtons.fire({
            title: "Your Request is safe!",
            showClass: {
              popup: "animate__animated animate__zoomIn",
            },
            hideClass: {
              popup: "animate__animated animate__zoomOut",
            },
          });
        }
      });
  };

  return (
    <>
      <div id="content-page" className="content-inner">
        <Container>
          <Row>
            <Col sm="12">
              <Card>
                <Card.Header>
                  <div className="header-title">
                    <h4 className="card-title">Friend Request</h4>
                  </div>
                </Card.Header>
                <Card.Body className="pt-0">
                  <ul className="request-list list-inline m-0 p-0">
                    <li className="d-flex align-items-center justify-content-between">
                      <div className="d-flex align-items-center">
                        <div className="user-img img-fluid flex-shrink-0">
                          <img
                            src={user5}
                            alt="story-img"
                            className="rounded-circle avatar-40"
                          />
                        </div>
                        <div className="flex-grow-1 ms-3">
                          <h6>Jaques Amole</h6>
                          <p className="mb-0">40 friends</p>
                        </div>
                      </div>
                      <div className="d-flex align-items-center mt-2 mt-md-0">
                        <div className="confirm-click-btn">
                          <Link to="#" className="me-2 btn btn-success-subtle rounded confirm-btn p-1 lh-1">
                            <i className="material-symbols-outlined font-size-14">
                              done
                            </i>
                          </Link>
                          <Link
                            to="#"
                            className="me-3 btn btn-primary rounded request-btn"
                            style={{ display: "none" }}
                          >
                            View All
                          </Link>
                        </div>
                        <Link
                          to="#"
                          onClick={questionAlert}
                          className="btn btn-danger-subtle rounded p-1 lh-1"
                          data-extra-toggle="delete"
                          data-closest-elem=".item"
                        >
                          <i className="material-symbols-outlined font-size-14">
                            close
                          </i>
                        </Link>
                      </div>
                    </li>


                    <li className="d-flex align-items-center justify-content-between">
                      <div className="d-flex align-items-center">
                        <div className="user-img img-fluid flex-shrink-0">
                          <img
                            src={user6}
                            alt="story-img"
                            className="rounded-circle avatar-40"
                          />
                        </div>
                        <div className="flex-grow-1 ms-3">
                          <h6>Lucy Tania</h6>
                          <p className="mb-0">12 friends</p>
                        </div>
                      </div>
                      <div className="d-flex align-items-center mt-2 mt-md-0">
                        <div className="confirm-click-btn">
                          <Link to="#" className="me-2 btn btn-success-subtle rounded confirm-btn p-1 lh-1">
                            <i className="material-symbols-outlined font-size-14">
                              done
                            </i>
                          </Link>
                          <Link
                            to="#"
                            className="me-3 btn btn-primary rounded request-btn"
                            style={{ display: "none" }}
                          >
                            View All
                          </Link>
                        </div>
                        <Link
                          to="#"
                          onClick={questionAlert}
                          className="btn btn-danger-subtle rounded p-1 lh-1"
                          data-extra-toggle="delete"
                          data-closest-elem=".item"
                        >
                          <i className="material-symbols-outlined font-size-14">
                            close
                          </i>
                        </Link>
                      </div>
                    </li>


                    <li className="d-flex align-items-center justify-content-between">
                      <div className="d-flex align-items-center">
                        <div className="user-img img-fluid flex-shrink-0">
                          <img
                            src={user7}
                            alt="story-img"
                            className="rounded-circle avatar-40"
                          />
                        </div>
                        <div className="flex-grow-1 ms-3">
                          <h6>Val Adictorian</h6>
                          <p className="mb-0">0 friends</p>
                        </div>
                      </div>
                      <div className="d-flex align-items-center mt-2 mt-md-0">
                        <div className="confirm-click-btn">
                          <Link to="#" className="me-2 btn btn-success-subtle rounded confirm-btn p-1 lh-1">
                            <i className="material-symbols-outlined font-size-14">
                              done
                            </i>
                          </Link>
                          <Link
                            to="#"
                            className="me-3 btn btn-primary rounded request-btn"
                            style={{ display: "none" }}
                          >
                            View All
                          </Link>
                        </div>
                        <Link
                          to="#"
                          onClick={questionAlert}
                          className="btn btn-danger-subtle rounded p-1 lh-1"
                          data-extra-toggle="delete"
                          data-closest-elem=".item"
                        >
                          <i className="material-symbols-outlined font-size-14">
                            close
                          </i>
                        </Link>
                      </div>
                    </li>
                  </ul>
                </Card.Body>
              </Card>
            </Col>
          </Row>
        </Container>
      </div>
    </>
  );
};

export default FriendReqest;
