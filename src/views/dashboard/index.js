import React, { useEffect, useState } from "react";
import { Row, Col, Container } from "react-bootstrap";
import { collection, onSnapshot } from "firebase/firestore"; 
import { db } from "../../config/firebase"; 
import Card from "../../components/Card";
import CreatePost from "../../components/create-post";
import Post from "../../components/Post"; // Importa el componente Post

// Imágenes
import user14 from "../../assets/images/user/06.jpg";
import user15 from "../../assets/images/user/07.jpg";
import user16 from "../../assets/images/user/08.jpg";
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

const Index = () => {
  const [posts, setPosts] = useState([]);
  const [loadContent, setLoadContent] = useState(true);
  const [imageController, setImageController] = useState({
    toggler: false,
    slide: 1,
  });

  // Obtener los posts en tiempo real desde Firebase
  useEffect(() => {
    const postsCollection = collection(db, "posts");
    
    const unsubscribe = onSnapshot(postsCollection, (snapshot) => {
      const postsList = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setPosts(postsList);
    });

    // Limpiar la suscripción al desmontar el componente
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

  // Manejador de clics para los posts
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
                  {/* Aquí van los posts */}
                  {posts.map((post) => (
                    <Post
                      key={post.id}
                      postId={post.id}  // Pasar el ID del post
                      user={post.user}
                      postText={post.postText}
                      selectedItemImage={post.selectedItemImage}
                      selectedItemInfo={post.selectedItemInfo}
                      selectedItemType={post.selectedItemType}
                      createdAt={post.createdAt}
                      comments={post.comments || 0}
                      shares={post.shares || 0}
                      onPostClick={handlePostClick}  // Pasar la función de clic
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
                <Card>
                  <div className="card-header d-flex justify-content-between">
                    <div className="header-title">
                      <h4 className="card-title">Suggestions for you</h4>
                    </div>
                  </div>
                  <Card.Body className="pt-0">
                    <ul className="list-inline m-0 p-0">
                      <li className="mb-3">
                        <div className="d-flex align-items-center gap-2 justify-content-between">
                          <div className="d-flex align-items-center gap-3">
                            <img
                              src={user14}
                              alt="story-img"
                              className="avatar-60 avatar-borderd object-cover avatar-rounded img-fluid d-inline-block"
                            />
                            <div>
                              <h5>David Arce</h5>
                              <small className="text-capitalize">
                                Followed by Jhon J + 2 more
                              </small>
                            </div>
                          </div>
                          <div className="d-flex align-items-center flex-shrink-0 gap-2">
                            <button className="btn btn-primary-subtle p-1 lh-1">
                              <i className="material-symbols-outlined font-size-14">
                                add
                              </i>
                            </button>
                            <button className="btn btn-danger-subtle p-1 lh-1">
                              <i className="material-symbols-outlined font-size-14">
                                close
                              </i>
                            </button>
                          </div>
                        </div>
                      </li>
                      <li className="mb-3">
                        <div className="d-flex align-items-center gap-2 justify-content-between">
                          <div className="d-flex align-items-center gap-3">
                            <img
                              src={user15}
                              alt="story-img"
                              className="avatar-60 avatar-borderd object-cover avatar-rounded img-fluid d-inline-block"
                            />
                            <div>
                              <div className="d-flex align-items-center justify-content-between gap-2">
                                <div>
                                  <h5>Edward Arce</h5>
                                  <small className="text-capitalize">
                                    Followed by Warner Castillo + 2 more
                                  </small>
                                </div>
                              </div>
                            </div>
                          </div>
                          <div className="d-flex align-items-center flex-shrink-0 gap-2">
                            <button className="btn btn-primary-subtle p-1 lh-1">
                              <i className="material-symbols-outlined font-size-14">
                                add
                              </i>
                            </button>
                            <button className="btn btn-danger-subtle p-1 lh-1">
                              <i className="material-symbols-outlined font-size-14">
                                close
                              </i>
                            </button>
                          </div>
                        </div>
                      </li>
                      <li className="">
                        <div className="d-flex align-items-center gap-2 justify-content-between">
                          <div className="d-flex align-items-center gap-3">
                            <img
                              src={user16}
                              alt="story-img"
                              className="avatar-60 avatar-borderd object-cover avatar-rounded img-fluid d-inline-block"
                            />
                            <div>
                              <h5>Luis Chaves</h5>
                              <small className="text-capitalize">
                                Followed by Messi + 2 more
                              </small>
                            </div>
                          </div>
                          <div className="d-flex align-items-center flex-shrink-0 gap-2">
                            <button className="btn btn-primary-subtle p-1 lh-1">
                              <i className="material-symbols-outlined font-size-14">
                                add
                              </i>
                            </button>
                            <button className="btn btn-danger-subtle p-1 lh-1">
                              <i className="material-symbols-outlined font-size-14">
                                close
                              </i>
                            </button>
                          </div>
                        </div>
                      </li>
                    </ul>
                  </Card.Body>
                </Card>
              </div>
            </Col>
          </Row>
        </Container>
      </div>
    </>
  );
};

export default Index;
