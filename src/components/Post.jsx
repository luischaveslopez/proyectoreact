import React, { useState } from "react";
import { Col, Dropdown, Collapse, OverlayTrigger, Tooltip } from "react-bootstrap";
import { Link } from "react-router-dom";

const Post = ({
  user = {}, // Valor predeterminado para evitar que sea undefined
  postText,
  hashtags = [],
  selectedItemImage,
  selectedItemInfo,
  previewUrl, // Añadir la URL de la previa
  createdAt, // Marca de tiempo
  likes = 0,
  comments = 0,
  shares = 0,
  likedBy = [],
  onLike,
  onComment,
  onShare,
}) => {
  const [open, setOpen] = useState(false);
  const [modalShow, setModalShow] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [audio, setAudio] = useState(null);

  const handleImageClick = () => {
    if (audio) {
      audio.pause();
      setIsPlaying(false);
      setAudio(null);
    }

    if (previewUrl) {
      const newAudio = new Audio(previewUrl);
      newAudio.play();
      setAudio(newAudio);
      setIsPlaying(true);

      newAudio.onended = () => {
        setIsPlaying(false);
        setAudio(null);
      };
    } else {
      console.error("No preview URL available.");
    }
  };

  return (
    <Col sm={12} className="special-post">
      <div className="card card-block card-stretch card-height">
        <div className="card-body">
          <div className="user-post-data">
            <div className="d-flex justify-content-between align-items-center">
              <div className="me-3 flex-shrink-0">
                <img
                  className="border border-2 rounded-circle user-post-profile"
                  src={user?.profilePic || "defaultUserImage"}
                  alt={user?.username || "User"}
                  style={{ width: "50px", height: "50px" }} // Ajusta el tamaño de la imagen
                />
              </div>
              <div className="w-100">
                <div className="d-flex align-items-center justify-content-between">
                  <div>
                    <h6 className="mb-0 d-inline-block">
                      {user?.username || "User"}
                    </h6>{" "}
                    <p className="mb-0 d-inline-block text-capitalize fw-medium">
                      Shared This Post
                    </p>
                    <p className="mb-0">{new Date(createdAt?.seconds * 1000).toLocaleString()}</p>
                  </div>
                  <div className="card-post-toolbar">
                    <Dropdown>
                      <Dropdown.Toggle
                        variant="lh-1"
                        id="post-option"
                        as="span"
                        bsPrefix=" "
                      >
                        <span className="material-symbols-outlined">more_horiz</span>
                      </Dropdown.Toggle>
                      <Dropdown.Menu className="dropdown-menu m-0 p-0">
                        <Dropdown.Item className="p-3">
                          <div className="d-flex align-items-top">
                            <span className="material-symbols-outlined">save</span>
                            <div className="data ms-2">
                              <h6>Save Post</h6>
                              <p className="mb-0">Add this to your saved items</p>
                            </div>
                          </div>
                        </Dropdown.Item>
                        <Dropdown.Item className="p-3">
                          <div className="d-flex align-items-top">
                            <span className="material-symbols-outlined">cancel</span>
                            <div className="data ms-2">
                              <h6>Hide Post</h6>
                              <p className="mb-0">See fewer posts like this.</p>
                            </div>
                          </div>
                        </Dropdown.Item>
                        <Dropdown.Item className="p-3">
                          <div className="d-flex align-items-top">
                            <span className="material-symbols-outlined">person_remove</span>
                            <div className="data ms-2">
                              <h6>Unfollow User</h6>
                              <p className="mb-0">Stop seeing posts but stay friends.</p>
                            </div>
                          </div>
                        </Dropdown.Item>
                        <Dropdown.Item className="p-3">
                          <div className="d-flex align-items-top">
                            <span className="material-symbols-outlined">notifications</span>
                            <div className="data ms-2">
                              <h6>Notifications</h6>
                              <p className="mb-0">Turn on notifications for this post</p>
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
          <div className="mt-4">
            <p className="mb-0">{postText}</p>
            <ul className="list-inline m-0 p-0 d-flex flex-wrap gap-1">
              {hashtags.map((hashtag, index) => (
                <li key={index}>
                  <Link to="#" style={{ cursor: "pointer" }}>
                    #{hashtag}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          {selectedItemImage && selectedItemInfo && (
            <div className="user-post mt-4">
              <div className="p-3 rounded-3 bg-light-subtle">
                <div className="d-flex gap-3">
                  <div className="flex-shrink-0" onClick={handleImageClick} style={{ cursor: "pointer" }}>
                    <img
                      src={selectedItemImage}
                      alt={selectedItemInfo.name}
                      className="img-fluid"
                      style={{ width: "100px", height: "100px", objectFit: "contain" }} // Ajuste del tamaño de la imagen
                    />
                    {isPlaying && (
                      <div className="bars-animation ms-2">
                        <span></span>
                        <span></span>
                        <span></span>
                        <span></span>
                      </div>
                    )}
                  </div>
                  <div>
                    <h5 className="mb-2">{selectedItemInfo.name}</h5>
                    <p className="m-0 text-body font-size-12 fw-medium">
                      {selectedItemInfo.description}
                    </p>
                    {selectedItemInfo.album && <p>Album: {selectedItemInfo.album}</p>}
                    {selectedItemInfo.popularity && <p>Popularity: {selectedItemInfo.popularity}</p>}
                    {selectedItemInfo.owner && <p>Owner: {selectedItemInfo.owner}</p>}
                  </div>
                </div>
              </div>
            </div>
          )}
          <div className="post-meta-likes mt-4">
            <div className="d-flex align-items-center gap-2 flex-wrap">
              <ul className="list-inline m-0 p-0 post-user-liked-list">
                {likedBy.map((user, index) => (
                  <li key={index}>
                    <img
                      src={user.profilePic}
                      alt={user.name}
                      className="rounded-circle img-fluid userimg"
                      loading="lazy"
                      style={{ width: "30px", height: "30px" }} // Ajuste del tamaño de la imagen de los usuarios que dieron like
                    />
                  </li>
                ))}
              </ul>
              <div className="d-inline-flex align-items-center gap-1">
                <h6 className="m-0 font-size-14">{user.username}</h6>
                <span
                  className="text-capitalize font-size-14 fw-medium"
                  type="button"
                  data-bs-toggle="modal"
                  data-bs-target="#likemodal"
                >
                  and {likes} others liked this
                </span>
              </div>
            </div>
          </div>
          <div className="comment-area mt-4 pt-4 border-top">
            <div className="d-flex justify-content-between align-items-center flex-wrap">
              <div className="like-block position-relative d-flex align-items-center flex-shrink-0">
                <div className="like-data">
                  <div className="dropdown">
                    <span
                      className="dropdown-toggle"
                      data-bs-toggle="dropdown"
                      aria-haspopup="true"
                      aria-expanded="false"
                      role="button"
                    >
                      <span className="material-symbols-outlined align-text-top font-size-20">
                        thumb_up
                      </span>{" "}
                      <span className="fw-medium">{likes} Likes</span>
                    </span>
                    <div className="dropdown-menu py-2 shadow">
                      <OverlayTrigger
                        placement="top"
                        overlay={<Tooltip>Like</Tooltip>}
                        className="ms-2 me-2"
                      >
                        <img src="icon1.png" className="img-fluid me-2" alt="" />
                      </OverlayTrigger>
                      {/* More icons */}
                    </div>
                  </div>
                </div>
              </div>
              <div className="d-flex align-items-center gap-3 flex-shrink-0">
                <div
                  className="total-comment-block"
                  type="button"
                  aria-controls="commentcollapes"
                  aria-expanded={open}
                  onClick={() => setOpen(!open)}
                >
                  <span className="material-symbols-outlined align-text-top font-size-20">
                    comment
                  </span>{" "}
                  <span className="fw-medium">{comments} Comments</span>
                </div>

                <div className="share-block d-flex align-items-center feather-icon">
                  <Link
                    to="#"
                    data-bs-toggle="modal"
                    data-bs-target="#share-btn"
                    onClick={() => setModalShow(true)}
                    aria-controls="share-btn"
                    className="d-flex align-items-center"
                  >
                    <span className="material-symbols-outlined align-text-top font-size-20">
                      share
                    </span>
                    <span className="ms-1 fw-medium">{shares} Shares</span>
                  </Link>
                </div>
                {/* Share Modal Component */}
              </div>
            </div>

            <Collapse in={open}>
              <div id="commentcollapes" className="border-top mt-4 pt-4">
                <ul className="list-inline m-o p-0 comment-list">
                  {/* Map through comments */}
                </ul>
                <div className="add-comment-form-block">
                  <div className="d-flex align-items-center gap-3">
                    <div className="flex-shrink-0">
                      <img
                        src="user1.png"
                        alt="userimg"
                        className="avatar-48 rounded-circle img-fluid"
                        loading="lazy"
                      />
                    </div>
                    <div className="add-comment-form">
                      <form>
                        <input
                          type="text"
                          className="form-control"
                          placeholder="Write a Comment..."
                        />
                        <button
                          type="submit"
                          className="btn btn-primary font-size-12 text-capitalize px-5"
                        >
                          post
                        </button>
                      </form>
                    </div>
                  </div>
                </div>
              </div>
            </Collapse>
          </div>
        </div>
      </div>

      <style jsx>{`
        .bars-animation {
          display: inline-block;
          width: 16px;
          height: 16px;
          margin-left: 8px;
          position: relative;
          top: 4px;
        }

        .bars-animation span {
          display: block;
          background: #1db954;
          width: 2px;
          height: 100%;
          position: absolute;
          bottom: 0;
          animation: bar 1s infinite ease-in-out;
        }

        .bars-animation span:nth-child(1) {
          left: 1px;
          animation-delay: -0.4s;
        }

        .bars-animation span:nth-child(2) {
          left: 5px;
          animation-delay: -0.2s;
        }

        .bars-animation span:nth-child(3) {
          left: 9px;
          animation-delay: -0.3s;
        }

        .bars-animation span:nth-child(4) {
          left: 13px;
          animation-delay: -0.1s;
        }

        @keyframes bar {
          0%,
          40%,
          100% {
            transform: scaleY(0.1);
          }
          20% {
            transform: scaleY(1);
          }
        }
      `}</style>
    </Col>
  );
};

export default Post;
