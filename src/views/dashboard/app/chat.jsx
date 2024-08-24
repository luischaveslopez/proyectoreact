import React, { useEffect, useState } from "react";
import { Form, Tab, Nav, Button } from "react-bootstrap";
import { db } from "../../../config/firebase"; // Asegúrate de que esta sea la ruta correcta
import {
  collection,
  query,
  where,
  onSnapshot,
  addDoc,
  serverTimestamp,
  getDocs,
} from "firebase/firestore";
import Scrollbar from "smooth-scrollbar";
import user1 from "../../../assets/images/chat/avatar/01.png";
import user2 from "../../../assets/images/chat/avatar/02.png";
import user9 from "../../../assets/images/chat/avatar/09.png";
import user10 from "../../../assets/images/chat/avatar/10.png";
 
const Chat = () => {
  const [activeChat, setActiveChat] = useState(null);
  const [messages, setMessages] = useState([]);
  const [users, setUsers] = useState([]);
  const [onlineUsers, setOnlineUsers] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [newMessage, setNewMessage] = useState("");
 
  useEffect(() => {
    Scrollbar.init(document.querySelector(".data-scrollbar"));
 
    const fetchUsers = () => {
      const q = query(collection(db, "users"));
      onSnapshot(q, (snapshot) => {
        const usersData = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setUsers(usersData);
      });
    };
 
    const fetchOnlineUsers = () => {
      const q = query(collection(db, "users"), where("online", "==", true));
      onSnapshot(q, (snapshot) => {
        const onlineUsersData = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setOnlineUsers(onlineUsersData);
      });
    };
 
    fetchUsers();
    fetchOnlineUsers();
  }, []);
 
  useEffect(() => {
    if (activeChat) {
      const q = query(
        collection(db, "messages"),
        where("chatId", "==", activeChat.id)
      );
      onSnapshot(q, (snapshot) => {
        const messagesData = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setMessages(messagesData);
      });
    }
  }, [activeChat]);
 
  const handleSearch = async (e) => {
    setSearchTerm(e.target.value);
 
    if (e.target.value.trim() !== "") {
      const q = query(
        collection(db, "users"),
        where("uid", "==", e.target.value.trim())
      );
 
      const querySnapshot = await getDocs(q);
      const usersData = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
 
      setUsers(usersData);
    } else {
      // Si no hay término de búsqueda, restablece la lista de usuarios
      const q = query(collection(db, "users"));
      onSnapshot(q, (snapshot) => {
        const usersData = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setUsers(usersData);
      });
    }
  };
 
  const startChat = (user) => {
    const chatExists = users.find((u) => u.id === user.id);
    if (chatExists) {
      setActiveChat(chatExists);
    } else {
      const newChat = {
        participants: [user.id],
        createdAt: serverTimestamp(),
      };
      addDoc(collection(db, "chats"), newChat).then((docRef) => {
        setActiveChat({ ...newChat, id: docRef.id });
      });
    }
  };
 
  const sendMessage = (e) => {
    e.preventDefault();
    if (newMessage.trim() !== "" && activeChat) {
      const message = {
        text: newMessage,
        chatId: activeChat.id,
        createdAt: serverTimestamp(),
        senderId: activeChat.id, // Cambia esto con el ID del usuario actual
      };
      addDoc(collection(db, "messages"), message);
      setNewMessage("");
    }
  };
 
  return (
    <>
      <Tab.Container id="left-tabs-example" defaultActiveKey="first">
        <aside
          className="sidebar sidebar-chat sidebar-base border-end shadow-none"
          data-sidebar="responsive"
        >
          <div className="chat-search pt-4 px-4">
            <div className="d-flex align-items-center">
              <h5 className="fw-500">Chats</h5>
            </div>
            <div className="chat-searchbar mt-3 pt-1 mb-4">
              <Form.Group className="form-group chat-search-data m-0">
                <input
                  type="text"
                  className="form-control round"
                  id="chat-search"
                  placeholder="Search for messages or users..."
                  value={searchTerm}
                  onChange={handleSearch}
                />
                <i className="material-symbols-outlined">search</i>
              </Form.Group>
            </div>
          </div>
 
          <div
            className="sidebar-body pt-0 data-scrollbar mb-5 pb-5 px-4"
            tabIndex="-1"
            style={{ overflow: "hidden", outline: "none" }}
          >
            <div
              className="scroll-content"
              style={{ transform: "translate3d(0px, 0px, 0px)" }}
            >
              <ul
                className="nav navbar-nav iq-main-menu mb-5 pb-5"
                id="sidebar-menu"
                role="tablist"
              >
                <h6 className="mb-3 pb-1">Recent Chats</h6>
                {users.map((user) => (
                  <Nav.Item
                    as="li"
                    className="iq-chat-list mb-3 ps-0"
                    role="presentation"
                    key={user.id}
                    onClick={() => startChat(user)}
                  >
                    <Nav.Link
                      className={`d-flex gap-3 rounded-2 zoom-in ${
                        activeChat && activeChat.id === user.id ? "active" : ""
                      }`}
                      eventKey={user.id}
                    >
                      <div className="position-relative">
                        <img
                          src={user.avatar || user1}
                          alt={`status-${user.id}`}
                          className="avatar-48 object-cover rounded-circle"
                          loading="lazy"
                        />
                        <div
                          className={`iq-profile-badge bg-${
                            onlineUsers.includes(user) ? "success" : "secondary"
                          }`}
                        ></div>
                      </div>
                      <div className="d-flex align-items-top w-100 iq-userlist-data">
                        <div className="d-flex flex-grow-1 flex-column">
                          <div className="d-flex align-items-center gap-1">
                            <h6 className="mb-0 iq-userlist-name font-size-14 fw-semibold mb-0 text-ellipsis short-1 flex-grow-1">
                              {user.name}
                            </h6>
                            <span className="mb-0 font-size-12">03:20 PM</span>
                          </div>
                          <div className="d-flex align-items-center gap-2">
                            <p className="text-ellipsis short-1 flex-grow-1 font-size-14 mb-0">
                              {user.lastMessage || "Start chatting"}
                            </p>
                          </div>
                        </div>
                      </div>
                    </Nav.Link>
                  </Nav.Item>
                ))}
              </ul>
            </div>
          </div>
          <div className="sidebar-footer"></div>
        </aside>
 
        <main className="main-content">
          <div className="container-fluid content-inner p-0" id="page_layout">
            <Tab.Content id="myTabContent">
              <Tab.Pane
                eventKey={activeChat ? activeChat.id : "first"}
                className="card mb-0 fade"
                role="tabpanel"
              >
                <div className="chat-head">
                  <header className="d-flex justify-content-between align-items-center pt-3 ps-3 pe-3 pb-3">
                    <div className="d-flex align-items-center gap-3">
                      <div className="avatar chat-user-profile m-0">
                        <img
                          src={activeChat?.avatar || user1}
                          alt="avatar"
                          className="avatar-50 rounded-pill"
                          loading="lazy"
                        />
                        <div className="iq-profile-badge bg-success"></div>
                      </div>
                      <div>
                        <h5 className="mb-0">{activeChat?.name || "Chat"}</h5>
                        <small className="text-capitalize fw-500">Online</small>
                      </div>
                    </div>
                  </header>
                </div>
 
                <div className="card-body chat-body bg-body">
                  {messages.map((message) => (
                    <div
                      key={message.id}
                      className={`iq-message-body ${
                        message.senderId === activeChat?.id
                          ? "iq-current-user"
                          : "iq-other-user"
                      }`}
                    >
                      <div className="chat-profile text-center">
                        <img
                          src={
                            message.senderId === activeChat?.id
                              ? user10
                              : user1
                          }
                          alt="chat-user"
                          className="avatar-40 rounded-pill"
                          loading="lazy"
                        />
                        <small className="iq-chating p-0 mb-0 d-block">
                          {new Date(
                            message.createdAt?.toDate()
                          ).toLocaleTimeString()}
                        </small>
                      </div>
                      <div className="iq-chat-text">
                        <div
                          className={`d-flex align-items-center justify-content-${
                            message.senderId === activeChat?.id
                              ? "end"
                              : "start"
                          } gap-1 gap-md-2`}
                        >
                          <div className="iq-chating-content d-flex align-items-center">
                            <p className="mr-2 mb-0">{message.text}</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
 
                <div className="card-footer px-3 py-3 border-top rounded-0">
                  <form className="d-flex align-items-center" onSubmit={sendMessage}>
                    <div className="chat-attagement d-flex"></div>
                    <input
                      type="text"
                      className="form-control me-3"
                      placeholder="Type your message"
                      value={newMessage}
                      onChange={(e) => setNewMessage(e.target.value)}
                    />
                    <Button type="submit" className="btn btn-primary d-flex align-items-center">
                      <svg
                        className="icon-20"
                        width="18"
                        viewBox="0 0 20 21"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          d="M13.8325 6.67463L8.10904 12.4592L1.59944 8.38767C0.66675 7.80414 0.860765 6.38744 1.91572 6.07893L17.3712 1.55277C18.3373 1.26963 19.2326 2.17283 18.9456 3.142L14.3731 18.5868C14.0598 19.6432 12.6512 19.832 12.0732 18.8953L8.10601 12.4602"
                          stroke="currentcolor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        ></path>
                      </svg>
                      <span className="d-none d-lg-block ms-1">Send</span>
                    </Button>
                  </form>
                </div>
              </Tab.Pane>
            </Tab.Content>
          </div>
        </main>
      </Tab.Container>
    </>
  );
};
 
export default Chat;