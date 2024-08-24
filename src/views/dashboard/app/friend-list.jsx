import React, { useEffect, useState } from "react";
import { Row, Col, Container } from "react-bootstrap";
import { collection, query, where, onSnapshot } from "firebase/firestore";
import { db, auth } from "../../../config/firebase"; // Asegúrate de que la ruta sea correcta
import Card from "../../../components/Card";
import { Link } from "react-router-dom";

// image placeholder
import userPlaceholder from "../../../assets/images/user/11.png";

const FriendList = () => {
  const [followingUsers, setFollowingUsers] = useState([]); // Almacena los usuarios que sigues
  const currentUserUid = auth.currentUser?.uid; // Obtener el UID del usuario autenticado

  useEffect(() => {
    if (!currentUserUid) return; // Si no hay usuario autenticado, no hacemos nada

    const fetchFollowingUsers = async () => {
      try {
        // Consulta a la colección "follows" donde "from" es el usuario actual (el que sigue)
        const followsQuery = query(
          collection(db, "follows"),
          where("from", "==", currentUserUid)
        );

        const unsubscribe = onSnapshot(followsQuery, async (snapshot) => {
          const followingRefs = snapshot.docs.map((doc) => doc.data().to); // Extraer los UIDs de los usuarios seguidos

          if (followingRefs.length === 0) {
            setFollowingUsers([]); // Si no sigue a nadie
            return;
          }

          // Obtener los datos de los usuarios seguidos desde la colección "users"
          const usersQuery = query(
            collection(db, "users"),
            where("uid", "in", followingRefs)
          );

          const unsubscribeUsers = onSnapshot(usersQuery, (userSnapshot) => {
            const users = userSnapshot.docs.map((doc) => ({
              id: doc.id,
              ...doc.data(),
            }));
            setFollowingUsers(users); // Guardar los usuarios seguidos
          });

          return () => unsubscribeUsers(); // Limpiar la suscripción a usuarios
        });

        return () => unsubscribe(); // Limpiar la suscripción a follows
      } catch (error) {
        console.error("Error fetching following users: ", error);
      }
    };

    fetchFollowingUsers();
  }, [currentUserUid]);

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
            {followingUsers.length > 0 ? (
              followingUsers.map((user) => (
                <Col md={6} key={user.uid}>
                  <Card className="card-block card-stretch card-height">
                    <Card.Body className="profile-page p-0">
                      <div className="profile-header-image">
                        <div className="cover-container">
                          <img
                            loading="lazy"
                            src={"https://i.imgur.com/LtWiiMn.png"}
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
                                    src={user.profilePic || userPlaceholder}
                                    alt="profile-img"
                                    className="avatar-130 img-fluid"
                                  />
                                </div>
                                <div className="user-data-block mt-md-0 mt-2">
                                  <h4>
                                    <Link to={`/dashboard/app/friend-profile/${user.uid}`}>
                                      {user.username || "Unknown User"}
                                    </Link>
                                  </h4>
                                  <h6>{user.country || "No country"}</h6>
                                  <p className="mb-2 mb-lg-0">
                                    {user.aboutMe || "No about info available."}
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
              ))
            ) : (
              <p>No users are being followed.</p>
            )}
          </Row>
        </Container>
      </div>
    </>
  );
};

export default FriendList;
