import React, { useEffect, useState } from "react";
import { Row, Col, Container } from "react-bootstrap";
import { collection, onSnapshot, query, orderBy } from "firebase/firestore"; 
import { db } from "../../config/firebase"; 
import { FaMapMarkerAlt, FaPlus, FaTimes } from "react-icons/fa"; 
import Card from "../../components/Card";
import CreatePost from "../../components/create-post";
import Post from "../../components/Post";

// Imágenes
import user5 from "../../assets/images/page-img/fun.webp";
import loader from "../../assets/images/page-img/page-load-loader.gif";
import boyImg from "../../assets/images/page-img/boy.webp";
import busImg from "../../assets/images/page-img/bus.webp";
import img11 from "../../assets/images/page-img/fd.webp";
import mountain from "../../assets/images/page-img/mountain.webp";
import pizza from "../../assets/images/page-img/pizza.webp";

// FsLightbox
import ReactFsLightbox from "fslightbox-react";

const FsLightbox = ReactFsLightbox.default
  ? ReactFsLightbox.default
  : ReactFsLightbox;

const SuggestionsList = () => {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    const usersCollection = collection(db, "users");
    const unsubscribe = onSnapshot(usersCollection, (snapshot) => {
      const usersList = snapshot.docs
        .map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }))
        .filter((user) => user.role !== "admin");

      const randomUsers = usersList
        .sort(() => 0.5 - Math.random())
        .slice(0, 3);

      setUsers(randomUsers);
    });

    return () => unsubscribe();
  }, []);

  return (
    <Card>
      <div className="card-header d-flex justify-content-between">
        <div className="header-title">
          <h4 className="card-title">Suggestions for you</h4>
        </div>
      </div>
      <Card.Body className="pt-0">
        <ul className="list-inline m-0 p-0">
          {users.map((user) => (
            <li className="mb-3" key={user.uid}>
              <div className="d-flex align-items-center gap-2 justify-content-between">
                <div className="d-flex align-items-center gap-3">
                  <img
                    src={user.profilePic || "https://via.placeholder.com/60"}
                    alt="profile"
                    className="avatar-60 avatar-borderd object-cover avatar-rounded img-fluid d-inline-block"
                  />
                  <div>
                    <h5>{user.username}</h5>
                    <small className="text-capitalize">
                      Followed by {user.followers} followers
                    </small>
                    <br />
                    <small className="text-muted">
                      <FaMapMarkerAlt /> {user.country} 
                    </small>
                  </div>
                </div>
                <div className="d-flex align-items-center flex-shrink-0 gap-2">
                  <button className="btn btn-primary-subtle p-1 lh-1">
                    <FaPlus className="font-size-14" />
                  </button>
                  <button className="btn btn-danger-subtle p-1 lh-1">
                    <FaTimes className="font-size-14" />
                  </button>
                </div>
              </div>
            </li>
          ))}
        </ul>
      </Card.Body>
    </Card>
  );
};

const Index = () => {
  const [posts, setPosts] = useState([]);
  const [loadContent, setLoadContent] = useState(true);
  const [imageController, setImageController] = useState({
    toggler: false,
    slide: 1,
  });

  // Obtener los posts en tiempo real desde Firebase, ordenados por createdAt
  useEffect(() => {
    const postsCollection = collection(db, "posts");
    const postsQuery = query(postsCollection, orderBy("createdAt", "desc")); // Ordenar por createdAt, descendente

    const unsubscribe = onSnapshot(postsQuery, (snapshot) => {
      const postsList = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setPosts(postsList);
    });

    return () => unsubscribe();
  }, []);

  useEffect(() => {
    function handleScroll() {
      if (window.innerHeight + window.scrollY >= document.body.offsetHeight) {
        setTimeout(() => {
          setLoadContent(false);
        }, 2000);
      }
    }

    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  function imageOnSlide(number) {
    setImageController({
      toggler: !imageController.toggler,
      slide: number,
    });
  }

  const handlePostClick = (postId) => {
    console.log("Post ID:", postId);
  };

  return (
    <>
      <div id="content-page" className="content-inner">
        <FsLightbox
          toggler={imageController.toggler}
          sources={[user5, boyImg, busImg, img11, mountain, pizza]}
          slide={imageController.slide}
        />
        <Container>
          <Row className="gx-4">
            <Col lg={8}>
              <div id="content">
                <Row>
                  <Col sm={12}>
                    <CreatePost className="card-block card-stretch card-height" />
                  </Col>
                </Row>
                <Row className="special-post-container">
                  {posts.map((post) => (
                    <Post
                      key={post.id}
                      postId={post.id}
                      user={post.user}
                      postText={post.postText}
                      selectedItemImage={post.selectedItemImage}
                      selectedItemInfo={post.selectedItemInfo}
                      selectedItemType={post.selectedItemType}
                      createdAt={post.createdAt}
                      comments={post.comments || 0}
                      shares={post.shares || 0}
                      onPostClick={handlePostClick}
                    />
                  ))}

                  {loadContent && (
                    <div className="col-sm-12 text-center">
                      <img src={loader} alt="loader" style={{ height: "100px" }} />
                    </div>
                  )}
                </Row>
              </div>
            </Col>

            <Col lg={4}>
              <div className="fixed-suggestion mb-0 mb-lg-4">
                <SuggestionsList />
              </div>
            </Col>
          </Row>
        </Container>
      </div>
    </>
  );
};

export default Index;
