import React, { useState, useEffect } from "react";
import { Col, Dropdown, Collapse, Modal, Button, Form } from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";
import { getAuth } from "firebase/auth";
import { doc, updateDoc, deleteDoc, getDoc, Timestamp } from "firebase/firestore";
import { db } from "../config/firebase"; 
import Swal from 'sweetalert2';

const Post = ({
  postId,
  user = {},
  postText,
  hashtags = [],
  selectedItemImage,
  selectedItemInfo,
  selectedItemType,
  createdAt,
  comments = 0,
  shares = 0,
  onPostClick,
}) => {
  const [open, setOpen] = useState(false);
  const [starRating, setStarRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [averageRating, setAverageRating] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [audio, setAudio] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [editedText, setEditedText] = useState(postText);
  const [isOwner, setIsOwner] = useState(false);
  const [newComment, setNewComment] = useState("");
  const [commentsList, setCommentsList] = useState([]);
  const [showCommentsModal, setShowCommentsModal] = useState(false);
  const [userProfilePic, setUserProfilePic] = useState("defaultUserImage");
  const [editCommentText, setEditCommentText] = useState("");
  const [selectedComment, setSelectedComment] = useState(null);
  const [showEditCommentModal, setShowEditCommentModal] = useState(false);

  const auth = getAuth();
  const currentUser = auth.currentUser;
  const navigate = useNavigate();

  useEffect(() => {
    const fetchPostData = async () => {
      const postDoc = await getDoc(doc(db, "posts", postId));
      if (postDoc.exists()) {
        const postData = postDoc.data();
        const ratings = postData.ratings || {};
        if (currentUser?.uid in ratings) {
          setStarRating(ratings[currentUser.uid]);
        }
        setAverageRating(postData.averageRating || 0);
        setPreviewUrl(postData.previewUrl || null);
        setCommentsList(postData.comments || []);
        setIsOwner(currentUser?.uid === postData.user.uid);
      }
    };

    fetchPostData();
  }, [postId, currentUser]);

  useEffect(() => {
    const fetchUserProfile = async () => {
      if (currentUser) {
        const userDocRef = doc(db, "users", currentUser.uid);
        const userDoc = await getDoc(userDocRef);

        if (userDoc.exists()) {
          const userData = userDoc.data();
          setUserProfilePic(userData.profilePic || "defaultUserImage");
        }
      }
    };

    fetchUserProfile();
  }, [currentUser]);

  const handleRating = async (rating) => {
    if (!currentUser) {
      console.error("Debes iniciar sesión para calificar.");
      return;
    }

    const postDocRef = doc(db, "posts", postId);
    const postDoc = await getDoc(postDocRef);

    if (postDoc.exists()) {
      const postData = postDoc.data();
      const ratings = postData.ratings || {};

      ratings[currentUser.uid] = rating;

      const totalRatings = Object.values(ratings).reduce((a, b) => a + b, 0);
      const newAverageRating = totalRatings / Object.keys(ratings).length;

      await updateDoc(postDocRef, {
        ratings,
        averageRating: newAverageRating,
      });

      setStarRating(rating);
      setAverageRating(newAverageRating);
    }
  };

  const handleMouseEnter = (rating) => {
    setHoverRating(rating);
  };

  const handleMouseLeave = () => {
    setHoverRating(0);
  };

  const handleItemClick = () => {
    if (audio) {
      audio.pause();
      setIsPlaying(false);
      setAudio(null);
    } else if (previewUrl) {
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

  const handleEditPost = async () => {
    try {
      const postDocRef = doc(db, "posts", postId);
      await updateDoc(postDocRef, {
        postText: editedText,
      });
      setShowEditModal(false);
      Swal.fire({
        icon: 'success',
        title: 'Post updated',
        text: 'Your post has been successfully updated!',
        timer: 2000,
        showConfirmButton: false,
      });
    } catch (error) {
      console.error("Error updating post:", error);
    }
  };

  const handleDeletePost = async () => {
    try {
      const postDocRef = doc(db, "posts", postId);
      await deleteDoc(postDocRef);
      setShowDeleteModal(false);
      Swal.fire({
        icon: 'success',
        title: 'Post deleted',
        text: 'Your post has been successfully deleted!',
        timer: 2000,
        showConfirmButton: false,
      });
    } catch (error) {
      console.error("Error deleting post:", error);
    }
  };

  const handleAddComment = async (e) => {
    e.preventDefault();
    if (!newComment.trim()) return;

    try {
      const userDocRef = doc(db, "users", currentUser.uid);
      const userDoc = await getDoc(userDocRef);

      if (!userDoc.exists()) {
        console.error("User document not found.");
        return;
      }

      const userData = userDoc.data();

      const commentData = {
        id: Timestamp.now().toMillis(), // Unique ID for the comment
        user: {
          uid: currentUser.uid,
          username: userData.username || "Anonymous",
          profilePic: userData.profilePic || "defaultUserImage",
        },
        text: newComment,
        createdAt: Timestamp.now(),
      };

      const postDocRef = doc(db, "posts", postId);
      const postDoc = await getDoc(postDocRef);

      if (postDoc.exists()) {
        const postData = postDoc.data();
        const updatedComments = [...(postData.comments || []), commentData];

        await updateDoc(postDocRef, {
          comments: updatedComments,
        });

        setCommentsList(updatedComments);
        setNewComment("");
      }
    } catch (error) {
      console.error("Error adding comment:", error);
    }
  };

  const handleEditComment = (comment) => {
    setSelectedComment(comment);
    setEditCommentText(comment.text);
    setShowEditCommentModal(true);
  };

  const handleSaveEditedComment = async () => {
    if (!editCommentText.trim()) return;

    try {
      const postDocRef = doc(db, "posts", postId);
      const postDoc = await getDoc(postDocRef);

      if (postDoc.exists()) {
        const postData = postDoc.data();
        const updatedComments = postData.comments.map((comment) =>
          comment.id === selectedComment.id
            ? { ...comment, text: editCommentText }
            : comment
        );

        await updateDoc(postDocRef, {
          comments: updatedComments,
        });

        setCommentsList(updatedComments);
        setShowEditCommentModal(false);
      }
    } catch (error) {
      console.error("Error editing comment:", error);
    }
  };

  const handleDeleteComment = async (comment) => {
    try {
      const postDocRef = doc(db, "posts", postId);
      const postDoc = await getDoc(postDocRef);

      if (postDoc.exists()) {
        const postData = postDoc.data();
        const updatedComments = postData.comments.filter(
          (c) => c.id !== comment.id
        );

        await updateDoc(postDocRef, {
          comments: updatedComments,
        });

        setCommentsList(updatedComments);
      }
    } catch (error) {
      console.error("Error deleting comment:", error);
    }
  };

  const handleUserClick = () => {
    navigate(`/dashboard/app/friend-profile/${encodeURIComponent(user.uid)}`);
  };

  return (
    <>
      <Col sm={12} className="special-post" onClick={() => onPostClick(postId)}>
        <div className="card card-block card-stretch card-height">
          <div className="card-body">
            <div className="user-post-data">
              <div className="d-flex justify-content-between align-items-center">
                <div className="me-3 flex-shrink-0">
                  <img
                    className="border border-2 rounded-circle user-post-profile"
                    src={user?.profilePic || "defaultUserImage"}
                    alt={user?.username || "User"}
                    style={{ width: "50px", height: "50px", cursor: "pointer" }}
                    onClick={handleUserClick}
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
                    {isOwner && (
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
                            <Dropdown.Item className="p-3" onClick={() => setShowEditModal(true)}>
                              <div className="d-flex align-items-top">
                                <span className="material-symbols-outlined">edit</span>
                                <div className="data ms-2">
                                  <h6>Edit Post</h6>
                                  <p className="mb-0">Edit the text of this post</p>
                                </div>
                              </div>
                            </Dropdown.Item>
                            <Dropdown.Item className="p-3" onClick={() => setShowDeleteModal(true)}>
                              <div className="d-flex align-items-top">
                                <span className="material-symbols-outlined">delete</span>
                                <div className="data ms-2">
                                  <h6>Delete Post</h6>
                                  <p className="mb-0">Permanently remove this post</p>
                                </div>
                              </div>
                            </Dropdown.Item>
                          </Dropdown.Menu>
                        </Dropdown>
                      </div>
                    )}
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
                <div
                  className="p-3 rounded-3 bg-light-subtle"
                  style={{ cursor: "pointer" }}
                  onClick={handleItemClick}
                >
                  <div className="d-flex gap-3">
                    <div className="flex-shrink-0">
                      <img
                        src={selectedItemImage}
                        alt={selectedItemInfo.name}
                        className="img-fluid"
                        style={{ width: "100px", height: "100px", objectFit: "contain" }} 
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
                    </div>
                  </div>
                </div>
              </div>
            )}
            <div className="post-meta-likes mt-4 d-flex align-items-center justify-content-between">
              <div className="d-flex align-items-center gap-2">
                {[1, 2, 3, 4, 5].map((star) => (
                  <span
                    key={star}
                    className={`material-symbols-outlined cursor-pointer ${star <= (hoverRating || starRating) ? "text-warning" : "text-muted"}`}
                    onClick={() => handleRating(star)}
                    onMouseEnter={() => handleMouseEnter(star)}
                    onMouseLeave={handleMouseLeave}
                  >
                    star
                  </span>
                ))}
                <span className="ms-2">Promedio: {averageRating.toFixed(1)}</span>
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
                  <span className="fw-medium">{commentsList.length} Comments</span>
                </div>
                <div className="share-block d-flex align-items-center feather-icon">
                  <Link
                    to="#"
                    data-bs-toggle="modal"
                    data-bs-target="#share-btn"
                    className="d-flex align-items-center"
                  >
                    <span className="material-symbols-outlined align-text-top font-size-20">
                      share
                    </span>
                    <span className="ms-1 fw-medium">{shares} Shares</span>
                  </Link>
                </div>
              </div>
            </div>
            <Collapse in={open}>
              <div id="commentcollapes" className="border-top mt-4 pt-4">
                <ul className="list-inline m-o p-0 comment-list">
                  {commentsList.slice(0, 2).map((comment, index) => (
                    <li key={index} className="d-flex gap-3 mb-3">
                      <div className="flex-shrink-0">
                        <img
                          src={comment.user.profilePic}
                          alt={comment.user.username}
                          className="avatar-48 rounded-circle img-fluid"
                          loading="lazy"
                        />
                      </div>
                      <div className="w-100">
                        <div className="d-flex justify-content-between align-items-center">
                          <h6 className="mb-0">
                            {comment.user.username}
                            <small className="text-muted ms-2">
                              {new Date(comment.createdAt.seconds * 1000).toLocaleString()}
                            </small>
                          </h6>
                          {currentUser?.uid === comment.user.uid && (
                            <div className="d-flex align-items-top">
                              <Dropdown>
                                <Dropdown.Toggle
                                  variant="lh-1"
                                  id="comment-option"
                                  as="span"
                                  bsPrefix=" "
                                >
                                  <span className="material-symbols-outlined">more_horiz</span>
                                </Dropdown.Toggle>
                                <Dropdown.Menu className="dropdown-menu m-0 p-0">
                                  <Dropdown.Item
                                    className="p-3"
                                    onClick={() => handleEditComment(comment)}
                                  >
                                    <div className="d-flex align-items-top">
                                      <span className="material-symbols-outlined">edit</span>
                                      <div className="data ms-2">
                                        <h6>Edit Comment</h6>
                                        <p className="mb-0">Edit this comment</p>
                                      </div>
                                    </div>
                                  </Dropdown.Item>
                                  <Dropdown.Item
                                    className="p-3"
                                    onClick={() => handleDeleteComment(comment)}
                                  >
                                    <div className="d-flex align-items-top">
                                      <span className="material-symbols-outlined">delete</span>
                                      <div className="data ms-2">
                                        <h6>Delete Comment</h6>
                                        <p className="mb-0">Permanently remove this comment</p>
                                      </div>
                                    </div>
                                  </Dropdown.Item>
                                </Dropdown.Menu>
                              </Dropdown>
                            </div>
                          )}
                        </div>
                        <p className="text-body">{comment.text}</p>
                      </div>
                    </li>
                  ))}
                  {commentsList.length > 2 && (
                    <Button
                      variant="link"
                      onClick={() => setShowCommentsModal(true)}
                    >
                      View all comments
                    </Button>
                  )}
                </ul>
                <div className="add-comment-form-block mt-4">
                  <div className="d-flex align-items-center gap-3">
                    <div className="flex-shrink-0">
                      <img
                        src={userProfilePic}
                        alt="User"
                        className="avatar-48 rounded-circle img-fluid"
                        loading="lazy"
                      />
                    </div>
                    <div className="add-comment-form w-100">
                      <form onSubmit={handleAddComment}>
                        <input
                          type="text"
                          className="form-control"
                          placeholder="Write a Comment..."
                          value={newComment}
                          onChange={(e) => setNewComment(e.target.value)}
                        />
                        <button
                          type="submit"
                          className="btn btn-primary font-size-12 text-capitalize px-5 mt-2"
                        >
                          Post
                        </button>
                      </form>
                    </div>
                  </div>
                </div>
              </div>
            </Collapse>
          </div>
        </div>
      </Col>

      {/* Modal para editar post */}
      <Modal show={showEditModal} onHide={() => setShowEditModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Edit Post</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group controlId="formEditPostText">
              <Form.Label>Edit your post text</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                value={editedText}
                onChange={(e) => setEditedText(e.target.value)}
              />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowEditModal(false)}>
            Cancel
          </Button>
          <Button variant="primary" onClick={handleEditPost}>
            Save Changes
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Modal para eliminar post */}
      <Modal show={showDeleteModal} onHide={() => setShowDeleteModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Delete Post</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          Are you sure you want to delete this post? This action cannot be undone.
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowDeleteModal(false)}>
            Cancel
          </Button>
          <Button variant="danger" onClick={handleDeletePost}>
            Delete
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Modal para editar comentario */}
      <Modal show={showEditCommentModal} onHide={() => setShowEditCommentModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Edit Comment</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group controlId="formEditCommentText">
              <Form.Label>Edit your comment text</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                value={editCommentText}
                onChange={(e) => setEditCommentText(e.target.value)}
              />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowEditCommentModal(false)}>
            Cancel
          </Button>
          <Button variant="primary" onClick={handleSaveEditedComment}>
            Save Changes
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Modal para ver todos los comentarios */}
      <Modal show={showCommentsModal} onHide={() => setShowCommentsModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>All Comments</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <ul className="list-inline m-o p-0 comment-list">
            {commentsList.map((comment, index) => (
              <li key={index} className="d-flex gap-3 mb-3">
                <div className="flex-shrink-0">
                  <img
                    src={comment.user.profilePic}
                    alt={comment.user.username}
                    className="avatar-48 rounded-circle img-fluid"
                    loading="lazy"
                  />
                </div>
                <div className="w-100">
                  <div className="d-flex justify-content-between align-items-center">
                    <h6 className="mb-0">
                      {comment.user.username}
                      <small className="text-muted ms-2">
                        {new Date(comment.createdAt.seconds * 1000).toLocaleString()}
                      </small>
                    </h6>
                    {currentUser?.uid === comment.user.uid && (
                      <div className="d-flex align-items-top">
                        <Dropdown>
                          <Dropdown.Toggle
                            variant="lh-1"
                            id="comment-option"
                            as="span"
                            bsPrefix=" "
                          >
                            <span className="material-symbols-outlined">more_horiz</span>
                          </Dropdown.Toggle>
                          <Dropdown.Menu className="dropdown-menu m-0 p-0">
                            <Dropdown.Item
                              className="p-3"
                              onClick={() => handleEditComment(comment)}
                            >
                              <div className="d-flex align-items-top">
                                <span className="material-symbols-outlined">edit</span>
                                <div className="data ms-2">
                                  <h6>Edit Comment</h6>
                                  <p className="mb-0">Edit this comment</p>
                                </div>
                              </div>
                            </Dropdown.Item>
                            <Dropdown.Item
                              className="p-3"
                              onClick={() => handleDeleteComment(comment)}
                            >
                              <div className="d-flex align-items-top">
                                <span className="material-symbols-outlined">delete</span>
                                <div className="data ms-2">
                                  <h6>Delete Comment</h6>
                                  <p className="mb-0">Permanently remove this comment</p>
                                </div>
                              </div>
                            </Dropdown.Item>
                          </Dropdown.Menu>
                        </Dropdown>
                      </div>
                    )}
                  </div>
                  <p className="text-body">{comment.text}</p>
                </div>
              </li>
            ))}
          </ul>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowCommentsModal(false)}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>

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

        .material-symbols-outlined.cursor-pointer {
          cursor: pointer;
          transition: color 0.2s ease-in-out;
        }

        .material-symbols-outlined.text-warning {
          color: #ffc107;
        }
      `}</style>
    </>
  );
};

export default Post;
