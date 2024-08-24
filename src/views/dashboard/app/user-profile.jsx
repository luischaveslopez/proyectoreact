import React, { useEffect, useState } from "react";
import { Row, Col, Container, Dropdown, Nav, Tab } from "react-bootstrap";
import { getAuth } from "firebase/auth";
import { doc, getDoc, collection, query, where, onSnapshot } from "firebase/firestore"; 
import { db } from '../../../config/firebase'; 
import Card from "../../../components/Card";
import CreatePost from "../../../components/create-post";
import Post from "../../../components/Post";
import { Link } from "react-router-dom";
import ReactFsLightbox from "fslightbox-react";
import Swal from "sweetalert2";

// images
import img1 from "../../../assets/images/page-img/fun.webp";
import user1 from "../../../assets/images/user/1.jpg";
import user05 from "../../../assets/images/user/05.jpg";
import user06 from "../../../assets/images/user/06.jpg";
import user07 from "../../../assets/images/user/07.jpg";
import user08 from "../../../assets/images/user/08.jpg";
import user09 from "../../../assets/images/user/09.jpg";
import user10 from "../../../assets/images/user/10.jpg";
import g1 from "../../../assets/images/page-img/g1.jpg";
import g2 from "../../../assets/images/page-img/g2.jpg";
import g3 from "../../../assets/images/page-img/g3.jpg";
import g4 from "../../../assets/images/page-img/g4.jpg";
import g5 from "../../../assets/images/page-img/g5.jpg";
import g6 from "../../../assets/images/page-img/g6.jpg";
import g7 from "../../../assets/images/page-img/g7.jpg";
import g8 from "../../../assets/images/page-img/g8.jpg";
import g9 from "../../../assets/images/page-img/g9.jpg";
import img51 from "../../../assets/images/page-img/51.jpg";
import img52 from "../../../assets/images/page-img/52.jpg";
import img53 from "../../../assets/images/page-img/53.jpg";
import img54 from "../../../assets/images/page-img/54.jpg";
import img55 from "../../../assets/images/page-img/55.jpg";
import img56 from "../../../assets/images/page-img/56.jpg";
import img57 from "../../../assets/images/page-img/57.jpg";
import img58 from "../../../assets/images/page-img/58.jpg";
import img59 from "../../../assets/images/page-img/59.jpg";
import img60 from "../../../assets/images/page-img/60.jpg";
import img61 from "../../../assets/images/page-img/61.jpg";
import img62 from "../../../assets/images/page-img/62.jpg";
import img63 from "../../../assets/images/page-img/63.jpg";
import img64 from "../../../assets/images/page-img/64.jpg";
import img65 from "../../../assets/images/page-img/65.jpg";
import mountain from "../../../assets/images/page-img/mountain.webp";
import pizza from "../../../assets/images/page-img/pizza.webp";
import busImg from "../../../assets/images/page-img/bus.webp";
import boyImg from "../../../assets/images/page-img/boy.webp";
import img11 from "../../../assets/images/page-img/fd.webp";

// Fslightbox plugin
const FsLightbox = ReactFsLightbox.default ? ReactFsLightbox.default : ReactFsLightbox;

const UserProfile = () => {
  const [posts, setPosts] = useState(0); // Para el número de posts
  const [followers, setFollowers] = useState(0); // Para el número de seguidores
  const [following, setFollowing] = useState(0); // Para el número de seguidos
  const [userPosts, setUserPosts] = useState([]);
  const [userName, setUserName] = useState(''); 
  const [userCountry, setUserCountry] = useState('');
  const [userWebsite, setUserWebsite] = useState('');
  const [tiktokLink, setTiktokLink] = useState('');
  const [spotifyLink, setSpotifyLink] = useState('');
  const [instagramLink, setInstagramLink] = useState('');
  const [profilePic, setProfilePic] = useState(user1); 
  const [aboutData, setAboutData] = useState([]); 
  const [followingUsers, setFollowingUsers] = useState([]); // Almacena los usuarios que sigue

  const auth = getAuth();
  const user = auth.currentUser;

  const fetchUserPosts = (uid) => {
    const q = query(collection(db, "posts"), where("user.uid", "==", uid));

    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const fetchedPosts = [];
      querySnapshot.forEach((doc) => {
        fetchedPosts.push({ id: doc.id, ...doc.data() });
      });

      const sortedPosts = fetchedPosts.sort(
        (a, b) => b.createdAt.seconds - a.createdAt.seconds
      );
      setUserPosts(sortedPosts);
    });

    return () => unsubscribe();
  };

  useEffect(() => {
    if (user) {
      const unsubscribe = fetchUserPosts(user.uid);
      return () => unsubscribe();
    }
  }, [user]);

  useEffect(() => {
    document.body.classList.add("profile-page");
    return () => {
      document.body.classList.remove("profile-page");
    };
  });

  const [imageController, setImageController] = useState({
    toggler: false,
    slide: 1,
  });

  function imageOnSlide(number) {
    setImageController({
      toggler: !imageController.toggler,
      slide: number,
    });
  }

  useEffect(() => {
    const fetchUserData = async () => {
      if (user) {
        try {
          const userDoc = await getDoc(doc(db, 'users', user.uid));
          if (userDoc.exists()) {
            const data = userDoc.data();
            setUserName(data.username || 'user');
            setUserCountry(data.country || '');
            setUserWebsite(data.websiteLink || '');
            setTiktokLink(data.tiktokLink || '');
            setSpotifyLink(data.spotifyLink || '');
            setInstagramLink(data.instagramLink || '');
            setProfilePic(data.profilePic || user1);

            // Establece los valores de posts, appFollowers y appFollowing
            setPosts(data.posts || 0);
            setFollowers(data.appFollowers?.length || 0); 
            setFollowing(data.appFollowing?.length || 0); 

            const newAboutData = [
              { title: 'About Me:', data: data.aboutMe || 'No data yet' },
              { title: "Email:", data: data.email || 'No data yet' },
              { title: "Country:", data: data.country || 'No data yet' },
              { title: "Birth Date:", data: data.dob || 'No data yet' },
              { title: "Gender:", data: data.gender || 'No data yet' }
            ];
            setAboutData(newAboutData);

            // Fetch the following users
            const followsQuery = query(
              collection(db, "follows"),
              where("from", "==", user.uid)
            );
            const unsubscribe = onSnapshot(followsQuery, async (snapshot) => {
              const followingRefs = snapshot.docs.map((doc) => doc.data().to);

              if (followingRefs.length > 0) {
                const usersQuery = query(
                  collection(db, "users"),
                  where("uid", "in", followingRefs)
                );
                onSnapshot(usersQuery, (userSnapshot) => {
                  const users = userSnapshot.docs.map((doc) => ({
                    id: doc.id,
                    ...doc.data(),
                  }));
                  setFollowingUsers(users); // Guardar los usuarios seguidos
                });
              }
            });

            return () => unsubscribe();
          } else {
            setUserName('User');
            setUserCountry('No country available');
            setUserWebsite('');
            setTiktokLink('');
            setSpotifyLink('');
            setInstagramLink('');
            setProfilePic(user1);

            const newAboutData = [
              { title: 'About Me:', data: 'No data yet' },
              { title: "Email:", data: user.email || 'No data yet' },
              { title: "Country:", data: 'No country available' },
              { title: "Birth Date:", data: 'No data yet' },
              { title: "Gender:", data: 'No data yet' }
            ];
            setAboutData(newAboutData);
          }
        } catch (error) {
          console.error("Error fetching user data: ", error);
          setProfilePic(user1);

          const newAboutData = [
            { title: 'About Me:', data: 'Error loading data' },
            { title: "Email:", data: user.email || 'No data yet' },
            { title: "Country:", data: 'Error loading data' },
            { title: "Birth Date:", data: 'Error loading data' },
            { title: "Gender:", data: 'Error loading data' }
          ];
          setAboutData(newAboutData);

          Swal.fire({
            icon: 'error',
            title: 'Oops...',
            text: 'Error fetching user data!',
          });
        }
      }
    };

    fetchUserData();
  }, [user]);

  return (
    <>
      <div id="content-page" className="content-inner">
        <FsLightbox
          toggler={imageController.toggler}
          sources={[
            g1, g2, g3, g4, g5, g6, g7, g8, g9, img1, boyImg, busImg, img11, mountain, pizza,
            img51, img52, img53, img54, img55, img56, img57, img58, img59, img60, img61, img62, img63, img64, img65
          ]}
          slide={imageController.slide}
        />
        <Container className="position-relative p-0">
          <div className="header-cover-img"
            style={{ backgroundImage: `url(${"https://i.imgur.com/0LORAZB.png"})`, backgroundSize: "cover", backgroundRepeat: "no-repeat" }}>
          </div>
        </Container>
        <Container>
          <Row>
            <Tab.Container id="left-tabs-example" defaultActiveKey="first">
              <Col sm={12}>
                <Card className="profile-box">
                  <Card.Body>
                    <Row className="align-items-center item-header-content">
                      <Col lg={4} className="profile-left">
                        <div className="social-links">
                          <ul className="social-data-block d-flex align-items-center justify-content-center list-inline p-0 m-0">
                            <li className="text-center pe-3">
                              <Link
                                to={tiktokLink || "#"}
                                target={tiktokLink ? "_blank" : "_self"}
                                rel="noopener noreferrer"
                                onClick={() => {
                                  if (!tiktokLink) {
                                    Swal.fire({
                                      icon: 'info',
                                      title: 'TikTok',
                                      text: 'No TikTok link available',
                                    });
                                  }
                                }}
                              >
                                <img
                                  src="https://img.icons8.com/?size=100&id=fdfLpA6fsXN2&format=png&color=000000"
                                  className="img-fluid rounded"
                                  alt="tiktok"
                                  width={32}
                                  height={32}
                                  loading="lazy"
                                />
                                <text name="socialmedia-name">tiktok</text>
                              </Link>
                            </li>
                            <li className="text-center pe-3">
                              <Link
                                to={spotifyLink || "#"}
                                target={spotifyLink ? "_blank" : "_self"}
                                rel="noopener noreferrer"
                                onClick={() => {
                                  if (!spotifyLink) {
                                    Swal.fire({
                                      icon: 'info',
                                      title: 'Spotify',
                                      text: 'No Spotify link available',
                                    });
                                  }
                                }}
                              >
                                <img
                                  src="https://img.icons8.com/?size=100&id=G9XXzb9XaEKX&format=png&color=000000"
                                  width={32}
                                  height={32}
                                  className="img-fluid rounded"
                                  alt="Spotify"
                                  loading="lazy"
                                />
                                <text name="socialmedia-name">spotify</text>
                              </Link>
                            </li>
                            <li className="text-center pe-3">
                              <Link
                                to={instagramLink || "#"}
                                target={instagramLink ? "_blank" : "_self"}
                                rel="noopener noreferrer"
                                onClick={() => {
                                  if (!instagramLink) {
                                    Swal.fire({
                                      icon: 'info',
                                      title: 'Instagram',
                                      text: 'No Instagram link available',
                                    });
                                  }
                                }}
                              >
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
                      </Col>
                      <Col lg={4} className="text-center profile-center">
                        <div className="header-avatar position-relative d-inline-block">
                          <img
                            src={profilePic} 
                            alt="user"
                            className="avatar-150 border border-4 border-white rounded-3"
                          />
                          <span className="badge bg-success fw-500 letter-spacing-1 chat-status">
                            online
                          </span>
                        </div>
                        <h5 className="d-flex align-items-center justify-content-center gap-1 mb-2">
                          {userName}{" "}
                          <span className="badge bg-primary rounded-pill material-symbols-outlined font-size-14 p-0 custom-done">
                            done
                          </span>
                        </h5>
                        <ul className="d-flex align-items-center justify-content-center gap-3 list-inline p-0 m-0">
                          <li className="d-flex align-items-center gap-1">
                            <h6 className="material-symbols-outlined font-size-14">
                              location_on
                            </h6>
                            <span className="font-size-14 text-uppercase fw-500">
                              {userCountry}
                            </span>
                          </li>
                          <li className="d-flex align-items-center gap-1">
                            <h6 className="material-symbols-outlined font-size-14">
                              globe_asia
                            </h6>
                            <Link
                              to={userWebsite ? userWebsite : "#"}
                              className="font-size-14 fw-500 text-body"
                              target={userWebsite ? "_blank" : "_self"}
                              rel="noopener noreferrer"
                            >
                              {userWebsite ? userWebsite : "No website link available"}
                            </Link>
                          </li>
                        </ul>
                      </Col>
                      <Col lg={4} className="profile-right">
                        <ul className="user-meta list-inline p-0 d-flex align-items-center justify-content-center">
                          <li>
                            <h5>{followers}</h5>Followers
                          </li>
                          <li>
                            <h5>{following}</h5>Following
                          </li>
                        </ul>
                      </Col>
                    </Row>
                  </Card.Body>
                </Card>

                <Card>
                  <Card.Body className="p-0">
                    <div className="user-tabing item-list-tabs">
                      <Nav
                        as="ul"
                        variant="pills"
                        className="d-flex align-items-center justify-content-center profile-feed-items p-0 m-0 rounded"
                      >
                        <Nav.Item as="li" className="col-3 col-sm-4">
                          <Nav.Link
                            href="#pills-timeline-tab"
                            eventKey="first"
                            role="button"
                            className="d-flex flex-md-column align-items-center flex-row justify-content-center gap-2"
                          >
                            <span className="icon rounded-3">
                              <span className="material-symbols-outlined">
                                calendar_month
                              </span>
                            </span>
                            <p className="mb-0 mt-0 mt-md-3">Timeline</p>
                          </Nav.Link>
                        </Nav.Item>
                        <Nav.Item as="li" className="col-3 col-sm-4">
                          <Nav.Link
                            href="#pills-about-tab"
                            eventKey="second"
                            role="button"
                            className="d-flex flex-md-column align-items-center flex-row justify-content-center gap-2"
                          >
                            <span className="icon rounded-3">
                              <span className="material-symbols-outlined">
                                person
                              </span>
                            </span>{" "}
                            <p className="mb-0 mt-0 mt-md-3">About</p>
                          </Nav.Link>
                        </Nav.Item>
                        <Nav.Item as="li" className="col-3 col-sm-4 ">
                          <Nav.Link
                            href="#pills-friends-tab"
                            eventKey="third"
                            role="button"
                            className="d-flex flex-md-column align-items-center flex-row justify-content-center gap-2"
                          >
                            <span className="icon rounded-3">
                              <span className="material-symbols-outlined">
                                group
                              </span>
                            </span>
                            <p className="mb-0 mt-0 mt-md-3">Friends</p>
                          </Nav.Link>
                        </Nav.Item>
                      </Nav>
                    </div>
                  </Card.Body>
                </Card>
              </Col>
              <Col sm={12}>
                <Tab.Content>
                  <Tab.Pane eventKey="first">
                    <Card.Body className="p-0">
                      <Row>
                        <Col lg={4}>
                          <div className="fixed-suggestion mb-0 mb-lg-4">
                            <Card>
                              <div className="card-header d-flex justify-content-between border-bottom">
                                <div className="header-title">
                                  <h4 className="card-title">Following</h4>
                                </div>
                              </div>
                              <Card.Body>
                                <div className="row row-cols-xl-3 row-cols-md-2 row-cols-2">
                                  {followingUsers.length > 0 ? (
                                    followingUsers.map((user) => (
                                      <div className="col mt-2 text-center" key={user.uid}>
                                        <Link to={`/dashboard/app/friend-profile/${user.uid}`}>
                                          <img
                                            src={user.profilePic || user1}
                                            alt="gallary-image"
                                            className="img-fluid rounded"
                                            style={{ objectFit: "cover" }}
                                          />
                                        </Link>
                                        <h6 className="mt-2 text-center">{user.username || "Unknown User"}</h6>
                                      </div>
                                    ))
                                  ) : (
                                    <p>No following users found.</p>
                                  )}
                                </div>
                              </Card.Body>
                            </Card>
                          </div>
                        </Col>

                        <Col lg={8}>
                          <Row>
                            <Col sm={12}>
                              <CreatePost />
                            </Col>
                            <Row>
                              {userPosts.length > 0 ? (
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
                                      comments={Array.isArray(post.comments) ? post.comments.length : 0}
                                      shares={post.shares || 0}
                                      onPostClick={() => console.log(`Clicked post: ${post.id}`)}
                                    />
                                  </Col>
                                ))
                              ) : (
                                <p>No posts available</p>
                              )}
                            </Row>
                          </Row>
                        </Col>
                      </Row>
                    </Card.Body>
                  </Tab.Pane>

                  <Tab.Pane eventKey="second">
                    <Tab.Container id="left-tabs-example" defaultActiveKey="about1">
                      <Row>
                        <Col md={4}>
                          <Card>
                            <Card.Body>
                              <Nav
                                variant="pills"
                                className="basic-info-items list-inline d-block p-0 m-0"
                              >
                                <Nav.Item>
                                  <Nav.Link to="#" eventKey="about1">
                                    Basic Info
                                  </Nav.Link>
                                </Nav.Item>
                              </Nav>
                            </Card.Body>
                          </Card>
                        </Col>
                        <Col md={8} className="ps-4">
                          <Card>
                            <Card.Body>
                              <Tab.Content>
                                <Tab.Pane eventKey="about1">
                                  <h4>Personal Info</h4>
                                  <hr />
                                  <div className="table-responsive">
                                    <table className="table profile-table">
                                      <tbody>
                                        {aboutData.map((item, index) => {
                                          return (
                                            <tr key={index}>
                                              <td><h6>{item.title}</h6></td>
                                              <td><p className="mb-0">{item.data}</p></td>
                                            </tr>
                                          );
                                        })}
                                      </tbody>
                                    </table>
                                  </div>
                                </Tab.Pane>
                              </Tab.Content>
                            </Card.Body>
                          </Card>
                        </Col>
                      </Row>
                    </Tab.Container>
                  </Tab.Pane>
                </Tab.Content>
              </Col>
            </Tab.Container>
          </Row>
        </Container>
      </div>
    </>
  );
};

export default UserProfile;
