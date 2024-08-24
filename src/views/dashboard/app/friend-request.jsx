import React, { useState, useEffect } from 'react';
import { Row, Col, Container } from 'react-bootstrap';
import Card from '../../../components/Card';
import { Link } from 'react-router-dom';
import { db, auth } from '../../../config/firebase'; 
import { collection, query, where, onSnapshot, updateDoc, doc, getDoc, addDoc, arrayUnion, setDoc } from 'firebase/firestore'; 
import Swal from 'sweetalert2';

const FriendRequest = () => {
  const [followRequests, setFollowRequests] = useState([]);
  const [requestSenders, setRequestSenders] = useState({});

  const currentUserUid = auth.currentUser?.uid;

  useEffect(() => {
    if (!currentUserUid) return;

    const fetchFollowRequests = async () => {
      const q = query(
        collection(db, 'followRequests'), 
        where('to', '==', currentUserUid), 
        where('status', '==', 'pending')
      );

      const unsubscribe = onSnapshot(q, async (querySnapshot) => {
        const requests = [];
        const senders = {};

        for (const requestDoc of querySnapshot.docs) {
          const requestData = { id: requestDoc.id, ...requestDoc.data() };
          requests.push(requestData);

          const senderRef = doc(db, 'users', requestData.from);
          const senderDoc = await getDoc(senderRef);
          if (senderDoc.exists()) {
            senders[requestData.from] = senderDoc.data();
          }
        }

        setFollowRequests(requests);
        setRequestSenders(senders);
      });

      return () => unsubscribe();
    };

    fetchFollowRequests();
  }, [currentUserUid]);

  const handleFollowRequest = async (requestId, action) => {
    try {
      const requestRef = doc(db, 'followRequests', requestId);
      const requestDoc = await getDoc(requestRef);
      const { from, to } = requestDoc.data();

      if (action === 'accepted') {
        // Registrar que "from" sigue a "to" en la colección "follows"
        await addDoc(collection(db, 'follows'), {
          from,
          to,
          timestamp: new Date()
        });

        // Actualizar los campos `appFollowing` y `appFollowers` en los documentos de usuario
        const fromUserRef = doc(db, 'users', from); // Usuario que envía la solicitud
        const toUserRef = doc(db, 'users', to); // Usuario que recibe la solicitud

        // Actualizar appFollowing para "from" y appFollowers para "to"
        await updateDoc(fromUserRef, {
          appFollowing: arrayUnion(to) // Añade el UID del usuario seguido
        });

        await updateDoc(toUserRef, {
          appFollowers: arrayUnion(from) // Añade el UID del usuario que sigue
        });

        // Mostrar mensaje de éxito
        Swal.fire({
          title: 'Request accepted',
          text: 'You are now following this user.',
          icon: 'success',
          confirmButtonText: 'OK',
        });
      } else if (action === 'rejected') {
        // Mostrar mensaje de rechazo
        Swal.fire({
          title: 'Request rejected',
          text: 'The follow request has been rejected.',
          icon: 'success',
          confirmButtonText: 'OK',
        });
      }

      // Actualizar el estado de la solicitud a "accepted" o "rejected"
      await updateDoc(requestRef, { status: action });

    } catch (error) {
      console.error(`Error ${action === 'accepted' ? 'accepting' : 'rejecting'} the request: `, error);
      Swal.fire({
        title: 'Error',
        text: 'There was an error processing the follow request. Please try again.',
        icon: 'error',
        confirmButtonText: 'OK',
      });
    }
  };

  const confirmDeleteAlert = (requestId) => {
    const swalWithBootstrapButtons = Swal.mixin({
      customClass: {
        cancelButton: 'btn btn-outline-primary btn-lg ms-2',
        confirmButton: 'btn btn-primary btn-lg',
      },
      buttonsStyling: false,
    });

    swalWithBootstrapButtons
      .fire({
        title: 'Are you sure?',
        text: 'You won\'t be able to revert this!',
        icon: 'warning',
        showCancelButton: true,
        cancelButtonText: 'Cancel',
        confirmButtonText: 'Yes, reject it!',
        reverseButtons: false,
      })
      .then((result) => {
        if (result.isConfirmed) {
          handleFollowRequest(requestId, 'rejected');
        }
      });
  };

  const acceptRequest = (requestId) => {
    handleFollowRequest(requestId, 'accepted');
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
                    <h4 className="card-title">Follow Requests</h4>
                  </div>
                </Card.Header>
                <Card.Body className="pt-0">
                  <ul className="request-list list-inline m-0 p-0">
                    {followRequests.length > 0 ? (
                      followRequests.map((request) => {
                        const sender = requestSenders[request.from];

                        return (
                          <li
                            key={request.id}
                            className="d-flex align-items-center justify-content-between"
                          >
                            <div className="d-flex align-items-center">
                              <div className="user-img img-fluid flex-shrink-0">
                                <img
                                  src={sender?.profilePic || "https://via.placeholder.com/40"}
                                  alt="user-img"
                                  className="rounded-circle avatar-40"
                                />
                              </div>
                              <div className="flex-grow-1 ms-3">
                                <h6>{sender?.username || "Unknown User"}</h6>
                                <p className="mb-0">Pending request</p>
                              </div>
                            </div>
                            <div className="d-flex align-items-center mt-2 mt-md-0">
                              <div className="confirm-click-btn">
                                <Link
                                  to="#"
                                  className="me-2 btn btn-success-subtle rounded confirm-btn p-1 lh-1"
                                  onClick={() => acceptRequest(request.id)}
                                >
                                  <i className="material-symbols-outlined font-size-14">done</i>
                                </Link>
                                <Link
                                  to="#"
                                  onClick={() => confirmDeleteAlert(request.id)}
                                  className="btn btn-danger-subtle rounded p-1 lh-1"
                                  data-extra-toggle="delete"
                                  data-closest-elem=".item"
                                >
                                  <i className="material-symbols-outlined font-size-14">close</i>
                                </Link>
                              </div>
                            </div>
                          </li>
                        );
                      })
                    ) : (
                      <p>No pending follow requests</p>
                    )}
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

export default FriendRequest;
