import React, { useState, useEffect } from "react";
import { Row, Col, Container } from "react-bootstrap";
import { collection, query, where, onSnapshot, getDocs } from "firebase/firestore";
import { auth, db } from '../../../config/firebase';
import Card from "../../../components/Card";
import { sendFollowRequest } from "../../../views/dashboard/app/followActions"; // Asegúrate de que la ruta sea correcta
import Swal from "sweetalert2"; // Importamos SweetAlert2

import { Link, useParams } from "react-router-dom";
import ReactFsLightbox from "fslightbox-react";
import Post from "../../../components/Post";

// images
import img1 from "../../../assets/images/page-img/fun.webp";
import user1 from "../../../assets/images/user/11.png";
import g1 from "../../../assets/images/page-img/g1.jpg";
import g2 from "../../../assets/images/page-img/g2.jpg";
import g3 from "../../../assets/images/page-img/g3.jpg";
import g4 from "../../../assets/images/page-img/g4.jpg";
import g5 from "../../../assets/images/page-img/g5.jpg";
import g6 from "../../../assets/images/page-img/g6.jpg";
import g7 from "../../../assets/images/page-img/g7.jpg";
import g8 from "../../../assets/images/page-img/g8.jpg";
import g9 from "../../../assets/images/page-img/g9.jpg";

// Fslightbox plugin
const FsLightbox = ReactFsLightbox.default
  ? ReactFsLightbox.default
  : ReactFsLightbox;

const FriendProfile = () => {
  const { uid } = useParams(); // Obtén el UID del usuario desde la URL
  const [userPosts, setUserPosts] = useState([]);
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [imageController, setImageController] = useState({
    toggler: false,
    slide: 1,
  });

  const currentUserUid = auth.currentUser?.uid; // UID del usuario autenticado actual

  // Función para obtener los datos del amigo
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const q = query(collection(db, "users"), where("uid", "==", uid));
        const querySnapshot = await getDocs(q);

        if (!querySnapshot.empty) {
          const doc = querySnapshot.docs[0];
          const data = doc.data();
          setUserData({
            ...data,
            // Manejar los campos appFollowers y appFollowing correctamente
            followers: data.appFollowers?.length || 0,
            following: data.appFollowing?.length || 0,
          });

          // Ahora que tienes el UID del amigo, obtén sus posts
          fetchUserPosts(data.uid);
        } else {
          console.error("No user found with the UID:", uid);
        }
      } catch (error) {
        console.error("Error fetching user data: ", error);
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, [uid]);

  // Función para obtener los posts del amigo en tiempo real
  const fetchUserPosts = (uid) => {
    const q = query(collection(db, "posts"), where("user.uid", "==", uid));

    // Usamos onSnapshot para escuchar cambios en tiempo real
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const fetchedPosts = [];
      querySnapshot.forEach((doc) => {
        fetchedPosts.push({ id: doc.id, ...doc.data() });
      });

      // Ordenar los posts por fecha de creación (de más reciente a más antiguo)
      const sortedPosts = fetchedPosts.sort(
        (a, b) => b.createdAt.seconds - a.createdAt.seconds
      );
      setUserPosts(sortedPosts); // Guarda los posts en el estado
    });

    // Retorna la función para detener la suscripción cuando el componente se desmonte
    return unsubscribe;
  };

  // useEffect para escuchar los cambios en tiempo real
  useEffect(() => {
    const unsubscribe = fetchUserPosts(uid);
    return () => unsubscribe(); // Limpiar suscripción cuando se desmonte el componente
  }, [uid]);

  const handleSendFollowRequest = async () => {
    if (!currentUserUid) {
      Swal.fire({
        title: "Error",
        text: "User is not authenticated",
        icon: "error",
        confirmButtonText: "OK",
      });
      return;
    }

    // Verificar si el usuario intenta seguirse a sí mismo
    if (currentUserUid === userData.uid) {
      Swal.fire({
        title: "Error",
        text: "You cannot follow yourself",
        icon: "error",
        confirmButtonText: "OK",
      });
      return; // Evita que el usuario se siga a sí mismo
    }

    try {
      // Verificar si ya existe una solicitud de seguimiento pendiente
      const followRequestQuery = query(
        collection(db, "followRequests"),
        where("from", "==", currentUserUid),
        where("to", "==", userData.uid),
        where("status", "==", "pending")
      );
      const followRequestSnapshot = await getDocs(followRequestQuery);

      if (!followRequestSnapshot.empty) {
        Swal.fire({
          title: "Request already sent",
          text: "A follow request has already been sent to this user.",
          icon: "info",
          confirmButtonText: "OK",
        });
        return; // Si ya existe una solicitud, no enviamos otra
      }

      // Si no existe una solicitud, enviarla
      await sendFollowRequest(currentUserUid, userData.uid);
      Swal.fire({
        title: "Success",
        text: "Follow request sent successfully",
        icon: "success",
        confirmButtonText: "OK",
      });
    } catch (error) {
      Swal.fire({
        title: "Error",
        text: "There was an error sending the follow request.",
        icon: "error",
        confirmButtonText: "OK",
      });
      console.error("Error sending follow request:", error);
    }
  };

  // Mientras cargan los datos
  if (loading) {
    return <div>Loading...</div>;
  }

  // Si no se encuentra el usuario
  if (!userData) {
    return <div>No user found</div>;
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
                        <button
                          onClick={(e) => {
                            e.preventDefault();
                            handleSendFollowRequest();
                          }}
                        >
                          send follow request
                        </button>
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
                        <ul className="social-data-block social-user-meta-list d-flex align-items-center justify-content-center list-inline p-0 m-0 gap-1" >
                          {/*<li className="text-center">
                            <p className="mb-0">{userData.posts || 0}</p>
                            <h6>Posts</h6>
                          </li>*/}
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
              </Col>
              <Col lg={8}>
                <Row>
                  {userPosts && userPosts.length > 0 ? (
                    userPosts.map((post) => (
                      <Col sm={12} className="special-post" key={post.id}>
                        <Post
                          postId={post.id}
                          user={post.user}
                          postText={post.postText}
                          hashtags={post.hashtags}
                          selectedItemImage={post.selectedItemImage}
                          selectedItemInfo={post.selectedItemInfo}
                          selectedItemType={post.selectedItemType}
                          createdAt={post.createdAt}
                          comments={post.comments ? post.comments.length : 0}
                          shares={post.shares || 0}
                          onPostClick={() => console.log(`Clicked post: ${post.id}`)}
                        />
                      </Col>
                    ))
                  ) : (
                    <p>No posts available</p>
                  )}
                </Row>
              </Col>
            </Row>
          </Row>
        </Container>
      </div>
    </>
  );
};

export default FriendProfile;
