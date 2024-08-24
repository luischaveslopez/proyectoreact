import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Container, Row, Col } from "react-bootstrap";
import Card from "../../../components/Card";

//img
import profilebg8 from "../../../assets/images/page-img/profile-bg8.jpg";
import imgn1 from "../../../assets/images/page-img/n1.jpg";
import imgn2 from "../../../assets/images/page-img/n2.jpg";
import imgn3 from "../../../assets/images/page-img/n3.jpg";
import imgn4 from "../../../assets/images/page-img/n4.jpg";
import imgn5 from "../../../assets/images/page-img/n5.jpg";
import imgn6 from "../../../assets/images/page-img/n6.jpg";
import imgn7 from "../../../assets/images/page-img/n7.jpg";
import imgn8 from "../../../assets/images/page-img/n8.jpg";
import imgr1 from "../../../assets/images/page-img/r1.jpg";
import imgr2 from "../../../assets/images/page-img/r2.jpg";
import imgr3 from "../../../assets/images/page-img/r3.jpg";
import imgr4 from "../../../assets/images/page-img/r4.jpg";
import imgr5 from "../../../assets/images/page-img/r5.jpg";
import imgr6 from "../../../assets/images/page-img/r6.jpg";
import imgr7 from "../../../assets/images/page-img/r7.jpg";
import imgr8 from "../../../assets/images/page-img/r8.jpg";
import imgl1 from "../../../assets/images/page-img/l1.jpg";
import imgl2 from "../../../assets/images/page-img/l2.jpg";
import imgl3 from "../../../assets/images/page-img/l3.jpg";
import imgl4 from "../../../assets/images/page-img/l4.jpg";
import imgl5 from "../../../assets/images/page-img/l5.jpg";
import imgl6 from "../../../assets/images/page-img/l6.jpg";
import img48 from "../../../assets/images/page-img/48.jpg";

//profile-header
import ProfileHeader from "../../../components/profile-header";

//swiper
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay } from "swiper/modules";
import SwiperCore from "swiper";

// Import Swiper styles
// import 'swiper/swiper-bundle.min.css'

// install Swiper modules
SwiperCore.use([Autoplay]);

const Music = () => {
  const [playlists, setPlaylists] = useState([]);
  const [newMusic, setNewMusic] = useState([]);
  const [recentAdded, setRecentAdded] = useState([]);
  const [topMusic, setTopMusic] = useState([]);
  const [currentPreview, setCurrentPreview] = useState(null);
  const [playingTrackId, setPlayingTrackId] = useState(null);

  useEffect(() => {
    const fetchSpotifyData = async () => {
      const token = localStorage.getItem("spotifyToken");
      if (token) {
        try {
          const headers = {
            Authorization: `Bearer ${token}`,
          };

          const fetchPlaylists = fetch(
            "https://api.spotify.com/v1/browse/featured-playlists?limit=6",
            { headers }
          );
          const fetchNewMusic = fetch(
            "https://api.spotify.com/v1/browse/new-releases?limit=6",
            { headers }
          );
          const fetchRecentAdded = fetch(
            "https://api.spotify.com/v1/me/tracks?limit=6",
            { headers }
          );
          const fetchTopMusic = fetch(
            "https://api.spotify.com/v1/me/top/tracks?limit=6",
            { headers }
          );

          const [playlistsRes, newMusicRes, recentAddedRes, topMusicRes] =
            await Promise.all([
              fetchPlaylists,
              fetchNewMusic,
              fetchRecentAdded,
              fetchTopMusic,
            ]);

          const playlistsData = await playlistsRes.json();
          const newMusicData = await newMusicRes.json();
          const recentAddedData = await recentAddedRes.json();
          const topMusicData = await topMusicRes.json();

          setPlaylists(playlistsData.playlists.items);
          setNewMusic(newMusicData.albums.items);
          setRecentAdded(recentAddedData.items.map((item) => item.track));
          setTopMusic(topMusicData.items);
        } catch (error) {
          console.error("Error fetching Spotify data", error);
        }
      }
    };

    fetchSpotifyData();
  }, []);

  const playPreview = (previewUrl, trackId) => {
    if (currentPreview) {
      currentPreview.pause();
    }

    if (previewUrl) {
      const audio = new Audio(previewUrl);
      audio.play();
      setCurrentPreview(audio);
      setPlayingTrackId(trackId);

      audio.onended = () => {
        setPlayingTrackId(null);
      };
    } else {
      console.error("No preview available for this track.");
    }
  };

  return (
    <>
    
      <div id="content-page" className="content-inner">
        <Container>
          <Row>
            <Col md="4">
              <Card className="card-block card-stretch card-height">
                <Card.Header className="d-flex justify-content-between">
                  <div className="header-title">
                    <h4 className="card-title">Play Lists</h4>
                  </div>
                </Card.Header>
                <Card.Body className="pt-0">
                  <ul className="music-lists m-0 p-0">
                    {playlists.map((playlist, index) => (
                      <li key={index} className="d-flex mb-4 align-items-center">
                        <div className="user-img img-fluid">
                          <img
                            src={playlist.images[0]?.url || imgl1}
                            alt="playlist-img"
                            className="rounded-circle avatar-40"
                          />
                        </div>
                        <div className="d-flex justify-content-between w-100">
                          <div className="ms-3">
                            <h6>{playlist.name}</h6>
                          </div>
                          <div className="music-time">3:00</div>
                        </div>
                      </li>
                    ))}
                  </ul>
                </Card.Body>
              </Card>
            </Col>
            <Col md="8">
              <Card className="card-block card-stretch card-height">
                <Card.Body className="p-0">
                  <Link to="#">
                    <img
                      src={"https://dplnews.com/wp-content/uploads/2023/01/dplnews_spotify_mc31123.png"}
                      alt="story-img"
                      className="img-fluid rounded h-100 w-100"
                    />
                  </Link>
                </Card.Body>
              </Card>
            </Col>
            <Col sm="12">
              <Card className="card-block card-stretch card-height">
                <Card.Header className="d-flex justify-content-between">
                  <div className="header-title">
                    <h4 className="card-title">New Music</h4>
                  </div>
                  <div className="card-header-toolbar d-flex align-items-center">
                    <Link to="#">View All</Link>
                  </div>
                </Card.Header>
                <Card.Body className="pt-0">
                  <Swiper
                    spaceBetween={15}
                    slidesPerView={5}
                    autoplay={{
                      delay: 2000,
                      disableOnInteraction: false,
                    }}
                    breakpoints={{
                      0: {
                        slidesPerView: 1,
                      },
                      576: {
                        slidesPerView: 2,
                      },
                      768: {
                        slidesPerView: 3,
                      },
                      1025: {
                        slidesPerView: 4,
                      },
                      1500: {
                        slidesPerView: 5,
                      },
                    }}
                  >
                    {newMusic.map((album, index) => (
                      <SwiperSlide key={index} className="text-center">
                        <div className="music-thumbnail position-relative mb-3">
                          <Link
                            to="#"
                            onClick={() => playPreview(album.preview_url, album.id)}
                          >
                            <img
                              src={album.images[0]?.url || imgn1}
                              alt="album-thumb"
                              className="img-fluid w-100"
                            />
                          </Link>
                          <div className="play-btn">
                            <Link
                              to="#"
                              className="material-symbols-outlined text-white"
                            >
                              play_arrow
                            </Link>
                          </div>
                        </div>
                        <h6>{album.name}</h6>
                        <p className="mb-0">{album.artists[0].name}</p>
                      </SwiperSlide>
                    ))}
                  </Swiper>
                </Card.Body>
              </Card>
            </Col>
            <Col sm="12">
              <Card className="card-block card-stretch card-height">
                <Card.Header className="d-flex justify-content-between">
                  <div className="header-title">
                    <h4 className="card-title">Recent Added</h4>
                  </div>
                  <div className="card-header-toolbar d-flex align-items-center">
                    <Link to="#">View All</Link>
                  </div>
                </Card.Header>
                <Card.Body className="pt-0">
                  <Swiper
                    spaceBetween={15}
                    slidesPerView={5}
                    autoplay={{
                      delay: 2000,
                      disableOnInteraction: false,
                    }}
                    breakpoints={{
                      0: {
                        slidesPerView: 1,
                      },
                      576: {
                        slidesPerView: 2,
                      },
                      768: {
                        slidesPerView: 3,
                      },
                      1025: {
                        slidesPerView: 4,
                      },
                      1500: {
                        slidesPerView: 5,
                      },
                    }}
                  >
                    {recentAdded.map((track, index) => (
                      <SwiperSlide key={index} className="text-center">
                        <div className="music-thumbnail position-relative mb-3">
                          <Link
                            to="#"
                            onClick={() => playPreview(track.preview_url, track.id)}
                          >
                            <img
                              src={track.album.images[0]?.url || imgr1}
                              alt="track-thumb"
                              className="img-fluid w-100"
                            />
                          </Link>
                          <div className="play-btn">
                            <Link
                              to="#"
                              className="material-symbols-outlined text-white"
                            >
                              play_arrow
                            </Link>
                          </div>
                        </div>
                        <h6>{track.name}</h6>
                        <p className="mb-0">{track.artists[0].name}</p>
                      </SwiperSlide>
                    ))}
                  </Swiper>
                </Card.Body>
              </Card>
            </Col>
            <Col sm="12">
              <Card className="card-block card-stretch card-height">
                <Card.Header className="d-flex justify-content-between">
                  <div className="header-title">
                    <h4 className="card-title">Top Music</h4>
                  </div>
                  <div className="card-header-toolbar d-flex align-items-center">
                    <Link to="#">View All</Link>
                  </div>
                </Card.Header>
                <Card.Body className="pt-0">
                  <Swiper
                    spaceBetween={15}
                    slidesPerView={5}
                    autoplay={{
                      delay: 2000,
                      disableOnInteraction: false,
                    }}
                    breakpoints={{
                      0: {
                        slidesPerView: 1,
                      },
                      576: {
                        slidesPerView: 2,
                      },
                      768: {
                        slidesPerView: 3,
                      },
                      1025: {
                        slidesPerView: 4,
                      },
                      1500: {
                        slidesPerView: 5,
                      },
                    }}
                  >
                    {topMusic.map((track, index) => (
                      <SwiperSlide key={index} className="text-center">
                        <div className="music-thumbnail position-relative mb-3">
                          <Link
                            to="#"
                            onClick={() => playPreview(track.preview_url, track.id)}
                          >
                            <img
                              src={track.album.images[0]?.url || imgr1}
                              alt="top-track-thumb"
                              className="img-fluid w-100"
                            />
                          </Link>
                          <div className="play-btn">
                            <Link
                              to="#"
                              className="material-symbols-outlined text-white"
                            >
                              play_arrow
                            </Link>
                          </div>
                        </div>
                        <h6>{track.name}</h6>
                        <p className="mb-0">{track.artists[0].name}</p>
                      </SwiperSlide>
                    ))}
                  </Swiper>
                </Card.Body>
              </Card>
            </Col>
          </Row>
        </Container>
      </div>
    </>
  );
};

export default Music;
