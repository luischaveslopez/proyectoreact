import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Button, Modal, Spinner } from "react-bootstrap";
import { getAuth } from "firebase/auth";
import { doc, getDoc, collection, addDoc, Timestamp } from "firebase/firestore";
import { db } from "../config/firebase";

// Images
import defaultUserImage from "../assets/images/user/1.jpg";

const CreatePost = () => {
  const [show, setShow] = useState(false);
  const [userData, setUserData] = useState(null);
  const [modalType, setModalType] = useState(null);
  const [spotifyData, setSpotifyData] = useState({ playlists: [], likedTracks: [], topArtists: [] });
  const [postText, setPostText] = useState("");
  const [currentPreview, setCurrentPreview] = useState(null);
  const [playingTrackId, setPlayingTrackId] = useState(null);
  const [selectedItemImage, setSelectedItemImage] = useState(null);
  const [selectedItemInfo, setSelectedItemInfo] = useState(null);
  const [loading, setLoading] = useState(false);
  const [postSuccess, setPostSuccess] = useState(false);

  const handleClose = () => setShow(false);
  const handleShow = (type) => {
    setModalType(type);
    setShow(true);
  };

  const handleRemoveSelectedItem = () => {
    setSelectedItemImage(null);
    setSelectedItemInfo(null);
    setPlayingTrackId(null);
    if (currentPreview) {
      currentPreview.pause();
      setCurrentPreview(null);
    }
  };

  const handleDiscard = () => {
    handleRemoveSelectedItem();
    setPostText(""); // Limpiar el texto del input
  };

  const handlePost = async () => {
    setLoading(true);
    try {
      const postCollection = collection(db, "posts");
      await addDoc(postCollection, {
        user: {
          uid: userData.uid,
          username: userData.username,
          profilePic: userData.profilePic || defaultUserImage,
        },
        postText,
        selectedItemImage,
        selectedItemInfo,
        createdAt: Timestamp.now(),
      });
      setLoading(false);
      setPostSuccess(true);

      // Ocultar el check después de 2 segundos
      setTimeout(() => {
        setPostSuccess(false);
        handleDiscard(); // Limpiar el formulario
      }, 2000);
    } catch (error) {
      console.error("Error saving post: ", error);
      setLoading(false);
    }
  };

  useEffect(() => {
    const fetchUserData = async () => {
      const auth = getAuth();
      const user = auth.currentUser;

      if (user) {
        const userDoc = await getDoc(doc(db, "users", user.uid));
        if (userDoc.exists()) {
          const userData = userDoc.data();
          setUserData(userData);
          fetchSpotifyData(userData.spotifyData);
        } else {
          console.log("No such document!");
        }
      }
    };

    const fetchAllLikedTracks = async (headers) => {
      let allTracks = [];
      let nextUrl = `https://api.spotify.com/v1/me/tracks?limit=50`;

      try {
        while (nextUrl) {
          const response = await fetch(nextUrl, { headers });
          const data = await response.json();
          allTracks = allTracks.concat(data.items.map(item => item.track));
          nextUrl = data.next;
        }
      } catch (error) {
        console.error("Error fetching all liked tracks: ", error);
      }

      return allTracks;
    };

    const fetchSpotifyData = async (spotifyData) => {
      const token = localStorage.getItem("spotifyToken");
      if (token && spotifyData?.id) {
        try {
          const headers = {
            Authorization: `Bearer ${token}`,
          };

          const [userPlaylistsResponse, likedTracks, topArtistsResponse] = await Promise.all([
            fetch(`https://api.spotify.com/v1/users/${spotifyData.id}/playlists`, { headers }),
            fetchAllLikedTracks(headers),
            fetch(`https://api.spotify.com/v1/me/top/artists`, { headers }),
          ]);

          const userPlaylists = await userPlaylistsResponse.json();
          const topArtists = await topArtistsResponse.json();

          setSpotifyData({
            playlists: userPlaylists.items || [],
            likedTracks: likedTracks || [],
            topArtists: topArtists.items || [],
          });
        } catch (error) {
          console.error("Error fetching Spotify data: ", error);
        }
      } else {
        console.error("Spotify token or ID is missing.");
      }
    };

    fetchUserData();
  }, []);

  const playPreview = async (type, id) => {
    if (currentPreview) {
      currentPreview.pause();
    }

    try {
      const token = localStorage.getItem("spotifyToken");
      const headers = {
        Authorization: `Bearer ${token}`,
      };

      let previewUrl = null;
      let imageUrl = null;
      let itemInfo = {};

      if (type === "track") {
        const track = spotifyData.likedTracks.find(track => track.id === id);
        previewUrl = track.preview_url;
        imageUrl = track.album.images[0]?.url;
        itemInfo = {
          name: track.name,
          description: `Artists: ${track.artists.map(artist => artist.name).join(", ")}`,
          album: track.album.name,
        };
      } else if (type === "playlist") {
        const playlistResponse = await fetch(`https://api.spotify.com/v1/playlists/${id}/tracks?limit=1`, { headers });
        const playlistData = await playlistResponse.json();
        if (playlistData.items.length > 0) {
          previewUrl = playlistData.items[0].track.preview_url;
        }
        const playlist = spotifyData.playlists.find(playlist => playlist.id === id);
        imageUrl = playlist.images[0]?.url;
        itemInfo = {
          name: playlist.name,
          description: playlist.description || "No description available",
          owner: `Owner: ${playlist.owner.display_name}`,
        };
      } else if (type === "artist") {
        const artistResponse = await fetch(`https://api.spotify.com/v1/artists/${id}/top-tracks?market=US`, { headers });
        const artistData = await artistResponse.json();
        if (artistData.tracks.length > 0) {
          previewUrl = artistData.tracks[0].preview_url;
        }
        const artist = spotifyData.topArtists.find(artist => artist.id === id);
        imageUrl = artist.images[0]?.url;
        itemInfo = {
          name: artist.name,
          description: `Genres: ${artist.genres.join(", ")}`,
          popularity: `Popularity: ${artist.popularity}`,
        };
      }

      if (previewUrl) {
        const audio = new Audio(previewUrl);
        audio.play();
        setCurrentPreview(audio);
        setPlayingTrackId(id);
        setSelectedItemImage(imageUrl);
        setSelectedItemInfo(itemInfo);

        audio.onended = () => {
          setPlayingTrackId(null);
        };
      } else {
        console.error("No preview available for this item.");
      }
    } catch (error) {
      console.error("Error playing preview: ", error);
    }
  };

  const renderSpotifyContent = () => {
    switch (modalType) {
      case "playlist":
        return spotifyData.playlists.length > 0 ? (
          spotifyData.playlists.map((playlist) => (
            <li key={playlist.id} className="col-md-6 mb-3">
              <div className="bg-primary-subtle rounded p-2 pointer me-3 d-flex align-items-center">
                <Link
                  to="#"
                  className={`custom-link-color d-inline-block fw-medium text-body ${playingTrackId === playlist.id ? 'playing' : ''}`}
                  onClick={() => playPreview("playlist", playlist.id)}
                >
                  {playlist.name}
                </Link>
                {playingTrackId === playlist.id && (
                  <div className="bars-animation ms-2">
                    <span></span>
                    <span></span>
                    <span></span>
                    <span></span>
                  </div>
                )}
              </div>
            </li>
          ))
        ) : (
          <p>No playlists available</p>
        );
      case "song":
        return spotifyData.likedTracks.length > 0 ? (
          spotifyData.likedTracks.map((track) => (
            <li key={track.id} className="col-md-6 mb-3">
              <div className="bg-primary-subtle rounded p-2 pointer me-3 d-flex align-items-center">
                <Link
                  to="#"
                  className={`custom-link-color d-inline-block fw-medium text-body ${playingTrackId === track.id ? 'playing' : ''}`}
                  onClick={() => playPreview("track", track.id)}
                >
                  {track.name} - {track.artists.map(artist => artist.name).join(", ")}
                </Link>
                {playingTrackId === track.id && (
                  <div className="bars-animation ms-2">
                    <span></span>
                    <span></span>
                    <span></span>
                    <span></span>
                  </div>
                )}
              </div>
            </li>
          ))
        ) : (
          <p>No liked songs available</p>
        );
      case "artist":
        return spotifyData.topArtists.length > 0 ? (
          spotifyData.topArtists.map((artist) => (
            <li key={artist.id} className="col-md-6 mb-3">
              <div className="bg-primary-subtle rounded p-2 pointer me-3 d-flex align-items-center">
                <Link
                  to="#"
                  className={`custom-link-color d-inline-block fw-medium text-body ${playingTrackId === artist.id ? 'playing' : ''}`}
                  onClick={() => playPreview("artist", artist.id)}
                >
                  {artist.name}
                </Link>
                {playingTrackId === artist.id && (
                  <div className="bars-animation ms-2">
                    <span></span>
                    <span></span>
                    <span></span>
                    <span></span>
                  </div>
                )}
              </div>
            </li>
          ))
        ) : (
          <p>No top artists available</p>
        );
      default:
        return <p>Select a type of content to share</p>;
    }
  };

  return (
    <>
      <div id="post-modal-data" className="card">
        <div className="card-header d-flex justify-content-between border-bottom">
          <div className="header-title">
            <h5 className="card-title">Add a Post</h5>
          </div>
        </div>
        <div className="card-body">
          <div className="d-flex align-items-center mb-5">
            <form className="post-text w-100">
              <input
                type="text"
                className="form-control rounded px-0"
                placeholder={`What's on your mind, ${userData?.username || 'User'}?`}
                style={{ border: "none" }}
                value={postText}
                onChange={(e) => setPostText(e.target.value)}
              />
            </form>
          </div>
          {selectedItemImage && selectedItemInfo && (
            <div className="selected-item-details d-flex align-items-center mb-3">
              <div className="selected-item-image">
                <img src={selectedItemImage} alt="Selected Item" className="img-fluid rounded" />
              </div>
              <div className="ms-3 d-flex align-items-center">
                <div>
                  <h6 className="mb-1">{selectedItemInfo.name}</h6>
                  <p className="mb-0">{selectedItemInfo.description}</p>
                  {selectedItemInfo.album && <p className="mb-0">Album: {selectedItemInfo.album}</p>}
                  {selectedItemInfo.owner && <p className="mb-0">{selectedItemInfo.owner}</p>}
                  {selectedItemInfo.popularity && <p className="mb-0">{selectedItemInfo.popularity}</p>}
                </div>
                {playingTrackId && (
                  <div className="d-flex align-items-center ms-2">
                    <div className="bars-animation me-2">
                      <span></span>
                      <span></span>
                      <span></span>
                      <span></span>
                    </div>
                    <button onClick={handleRemoveSelectedItem} className="btn btn-link p-0">
                      <span className="material-symbols-outlined text-danger">close</span>
                    </button>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
        <div className="card-body bg-primary-subtle rounded-bottom-3">
          <div className="d-flex align-items-center justify-content-between flex-wrap gap-3">
            <div>
              <ul className="list-inline m-0 p-0 d-flex align-items-center gap-4">
                <li>
                  <Link to="#" className="text-body fw-medium" onClick={handleDiscard}>
                    Discard
                  </Link>
                </li>
                <li>
                  <button
                    type="button"
                    className="btn btn-primary px-4"
                    onClick={handlePost}
                    disabled={loading || postSuccess}
                  >
                    {loading ? (
                      <Spinner animation="border" size="sm" />
                    ) : postSuccess ? (
                      <i className="fa fa-check text-success"></i>
                    ) : (
                      "Post"
                    )}
                  </button>
                </li>
              </ul>
            </div>
          </div>
        </div>
        <div className="card-footer d-flex justify-content-around border-top">
          <Button variant="outline-primary" onClick={() => handleShow("playlist")}>
            <span className="material-symbols-outlined">queue_music</span> Share Playlist
          </Button>
          <Button variant="outline-primary" onClick={() => handleShow("song")}>
            <span className="material-symbols-outlined">music_note</span> Share Song
          </Button>
          <Button variant="outline-primary" onClick={() => handleShow("artist")}>
            <span className="material-symbols-outlined">person</span> Share Artist
          </Button>
        </div>
        <Modal
          show={show}
          onHide={handleClose}
          centered
          id="custom-post-modal"
        >
          <div className="modal-header d-flex justify-content-between">
            <h5 className="modal-title" id="post-modalLabel">
              Create {modalType === "playlist" ? "Playlist" : modalType === "song" ? "Song" : "Artist"} Post
            </h5>
            <Link to="#" className="lh-1" onClick={handleClose}>
              <span className="material-symbols-outlined">close</span>
            </Link>
          </div>
          <Modal.Body className="modal-body-scroll">
            <div className="d-flex align-items-center">
              <div className="user-img-container">
                <img
                  loading="lazy"
                  src={userData?.profilePic || defaultUserImage}
                  alt="userimg"
                  className="img-fluid"
                />
              </div>
              <form className="post-text ms-3 w-100">
                <input
                  type="text"
                  className="form-control rounded"
                  placeholder={`What's on your mind, ${userData?.username || 'User'}?`}
                  style={{ border: "none" }}
                  value={postText}
                  onChange={(e) => setPostText(e.target.value)}
                />
              </form>
            </div>
            <hr />
            <ul className="d-flex flex-wrap align-items-center list-inline m-0 p-0">
              {renderSpotifyContent()}
            </ul>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="primary" className="d-block w-100" onClick={handlePost}>
              {loading ? (
                <Spinner animation="border" size="sm" />
              ) : postSuccess ? (
                <i className="fa fa-check text-success"></i>
              ) : (
                "Post"
              )}
            </Button>
          </Modal.Footer>
        </Modal>
      </div>
      <div
        className={`modal-backdrop fade ${show ? "show" : "d-none"}`}
        onClick={handleClose}
      ></div>

      <style jsx>{`
        .user-img-container {
          width: 60px;
          height: 60px;
          border-radius: 50%;
          overflow: hidden;
          display: flex;
          justify-content: center;
          align-items: center;
          border: 2px solid #fff;
        }

        .user-img-container img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }

        .selected-item-image img {
          max-width: 100px;
          max-height: 100px;
          object-fit: contain;
        }

        .selected-item-details .ms-3 {
          flex-grow: 1;
        }

        .modal-body-scroll {
          max-height: 400px;
          overflow-y: auto;
        }

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

        .btn-link {
          color: inherit;
          text-decoration: none;
        }

        .btn-link:hover {
          color: inherit;
          text-decoration: none;
        }
      `}</style>
    </>
  );
};

export default CreatePost;
