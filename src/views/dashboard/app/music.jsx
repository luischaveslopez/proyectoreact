import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Container, Row, Col } from "react-bootstrap";
import Card from "../../../components/Card";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay } from "swiper/modules";
import SwiperCore from "swiper";
import "./Music.css";

//img
import imgn1 from "../../../assets/images/page-img/n1.jpg";
import imgn2 from "../../../assets/images/page-img/n2.jpg";
import imgr2 from "../../../assets/images/page-img/r2.jpg";

// install Swiper modules
SwiperCore.use([Autoplay]);

const Music = () => {
  const [playlists, setPlaylists] = useState([]);
  const [newMusic, setNewMusic] = useState([]);
  const [topMusic, setTopMusic] = useState([]);
  const [topTracks, setTopTracks] = useState([]);
  const [currentTrack, setCurrentTrack] = useState(null);
  const [audio, setAudio] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);

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
          const fetchTopMusic = fetch(
            "https://api.spotify.com/v1/browse/categories/toplists/playlists?limit=6",
            { headers }
          );
          const fetchTopTracks = fetch(
            "https://api.spotify.com/v1/me/top/tracks?limit=10&time_range=long_term",
            { headers }
          );

          const [playlistsRes, newMusicRes, topMusicRes, topTracksRes] =
            await Promise.all([
              fetchPlaylists,
              fetchNewMusic,
              fetchTopMusic,
              fetchTopTracks,
            ]);

          const playlistsData = await playlistsRes.json();
          const newMusicData = await newMusicRes.json();
          const topMusicData = await topMusicRes.json();
          const topTracksData = await topTracksRes.json();

          setPlaylists(playlistsData.playlists.items || []);
          setNewMusic(newMusicData.albums.items || []);
          setTopMusic(topMusicData.playlists.items || []);
          setTopTracks(topTracksData.items || []);
        } catch (error) {
          console.error("Error fetching Spotify data", error);
        }
      }
    };

    fetchSpotifyData();
  }, []);

  const handlePlayPause = (trackUrl, trackId) => {
    try {
      if (!trackUrl) {
        console.error("Track URL is invalid or empty");
        return;
      }
  
      if (currentTrack === trackId) {
        if (isPlaying) {
          audio.pause();
        } else {
          audio.play();
        }
        setIsPlaying(!isPlaying);
      } else {
        if (audio) {
          audio.pause();
        }
        const newAudio = new Audio(trackUrl);
        setAudio(newAudio);
        newAudio.play();
        setCurrentTrack(trackId);
        setIsPlaying(true);
      }
    } catch (error) {
      console.error("Error handling play/pause", error);
    }
  };
  

  return (
    <>
      <div id="content-page" className="content-inner mt-4">
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
                            src={playlist.images[0]?.url || imgn1}
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
                      src={
                        "https://dplnews.com/wp-content/uploads/2023/01/dplnews_spotify_mc31123.png"
                      }
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
                          <Link to="#">
                            <img
                              src={album.images[0]?.url || imgn2}
                              alt="album-thumb"
                              className="img-fluid w-100"
                            />
                          </Link>
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
                    {topMusic.map((playlist, index) => (
                      <SwiperSlide key={index} className="text-center">
                        <div className="music-thumbnail position-relative mb-3">
                          <Link to="#">
                            <img
                              src={playlist.images[0]?.url || imgr2}
                              alt="top-playlist-thumb"
                              className="img-fluid w-100"
                            />
                          </Link>
                        </div>
                        <h6>{playlist.name}</h6>
                        <p className="mb-0">{playlist.description}</p>
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
                    <h4 className="card-title">Top Tracks of the Year</h4>
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
                    {topTracks.map((track, index) => (
                      <SwiperSlide key={index} className="text-center">
                        <div className="music-thumbnail position-relative mb-3">
                          <Link to="#">
                            <img
                              src={track.album.images[0]?.url || imgn2}
                              alt="track-thumb"
                              className={`img-fluid w-100 ${
                                currentTrack === track.id && isPlaying
                                  ? "playing-animation"
                                  : ""
                              }`}
                            />
                          </Link>
                          <div className="play-btn">
                            <Link
                              to="#"
                              className="material-symbols-outlined text-white"
                              onClick={() =>
                                handlePlayPause(track.preview_url, track.id)
                              }
                            >
                              {currentTrack === track.id && isPlaying
                                ? "pause"
                                : "play_arrow"}
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
