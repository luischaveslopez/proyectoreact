import React, { useState, useEffect, useRef } from 'react';
import { Container, Row, Col, Card, Tab, Form, Button, Nav } from 'react-bootstrap';
import { useNavigate, Link } from 'react-router-dom';
import { getAuth, updatePassword, EmailAuthProvider, reauthenticateWithCredential } from 'firebase/auth';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { db } from '../../../config/firebase';

//image
import img1 from '../../../assets/images/user/11.png';

const UserProfileEdit = () => {
    const [userData, setUserData] = useState({
        firstName: '',
        lastName: '',
        username: '',
        gender: '',
        dob: '',
        country: '',
        aboutMe: '',
        profilePic: '',
        websiteLink: '',
        tiktokLink: '',
        instagramLink: '',
        spotifyLink: ''
    });

    const [passwords, setPasswords] = useState({
        currentPassword: '',
        newPassword: '',
        verifyPassword: ''
    });

    const [imageFile, setImageFile] = useState(null);
    const [imageUploading, setImageUploading] = useState(false);

    const auth = getAuth();
    const user = auth.currentUser;
    const navigate = useNavigate();
    const storage = getStorage();

    // Crear un ref para el input de tipo file
    const fileInputRef = useRef(null);

    useEffect(() => {
        if (user) {
            const fetchUserData = async () => {
                try {
                    const userDoc = await getDoc(doc(db, "users", user.uid));
                    if (userDoc.exists()) {
                        const data = userDoc.data();
                        setUserData(prevState => ({
                            ...prevState,
                            firstName: data.firstName || prevState.firstName,
                            lastName: data.lastName || prevState.lastName,
                            username: data.username || user.displayName || prevState.username,
                            gender: data.gender || prevState.gender,
                            dob: data.dob || prevState.dob,
                            country: data.country || prevState.country,
                            aboutMe: data.aboutMe || prevState.aboutMe,
                            profilePic: data.profilePic || user.photoURL || prevState.profilePic || img1,
                            websiteLink: data.websiteLink || prevState.websiteLink,
                            tiktokLink: data.tiktokLink || prevState.tiktokLink,
                            instagramLink: data.instagramLink || prevState.instagramLink,
                            spotifyLink: data.spotifyLink || prevState.spotifyLink
                        }));
                    } else {
                        // Si no se encuentran datos del usuario, solo se inicializan con los datos del usuario
                        setUserData(prevState => ({
                            ...prevState,
                            username: user.displayName || prevState.username,
                            profilePic: user.photoURL || prevState.profilePic || img1
                        }));
                    }
                } catch (error) {
                    console.error("Error fetching user data: ", error);
                }
            };
            fetchUserData();
        }
    }, [user]);

    const handleChange = (e) => {
        const { id, value } = e.target;
        setUserData(prevState => ({
            ...prevState,
            [id]: value
        }));
    };

    const handlePasswordChange = (e) => {
        const { id, value } = e.target;
        setPasswords(prevState => ({
            ...prevState,
            [id]: value
        }));
    };

    const handleImageChange = (e) => {
        if (e.target.files[0]) {
            setImageFile(e.target.files[0]);
            setUserData(prevState => ({
                ...prevState,
                profilePic: URL.createObjectURL(e.target.files[0])
            }));
        }
    };

    const uploadImageAndGetURL = async (file) => {
        if (file) {
            const storageRef = ref(storage, `profilePics/${user.uid}`);
            await uploadBytes(storageRef, file);
            const downloadURL = await getDownloadURL(storageRef);
            return downloadURL;
        }
        return null;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (user) {
            try {
                let profilePicURL = userData.profilePic;

                if (imageFile) {
                    setImageUploading(true);
                    profilePicURL = await uploadImageAndGetURL(imageFile);
                    setImageUploading(false);
                }

                await setDoc(doc(db, "users", user.uid), {
                    ...userData,
                    profilePic: profilePicURL,
                    uid: user.uid,
                });
                alert("Profile updated successfully!");
            } catch (error) {
                console.error("Error updating profile: ", error);
                setImageUploading(false);
            }
        }
    };

    const handlePasswordSubmit = async (e) => {
        e.preventDefault();
        if (passwords.newPassword !== passwords.verifyPassword) {
            alert("New password and verification password do not match.");
            return;
        }
        if (user) {
            const credential = EmailAuthProvider.credential(
                user.email,
                passwords.currentPassword
            );

            try {
                // Reauthenticate the user
                await reauthenticateWithCredential(user, credential);

                // Update the user's password
                await updatePassword(user, passwords.newPassword);
                alert("Password updated successfully!");
                setPasswords({
                    currentPassword: '',
                    newPassword: '',
                    verifyPassword: ''
                });
            } catch (error) {
                console.error("Error updating password: ", error);
                alert("Error updating password: " + error.message);
            }
        }
    };

    return (
        <>
            <div className='content-inner'>
                <Container>
                    <Tab.Container defaultActiveKey="first">
                        <Row>
                            <Col lg="12">
                                <Card>
                                    <Card.Body className="p-0">
                                        <div>
                                            <Nav as="ul" variant="pills" className="iq-edit-profile row mb-0">
                                                <Nav.Item as="li" className="col-md-3 p-0">
                                                    <Nav.Link eventKey="first" role="button">
                                                        Personal Information
                                                    </Nav.Link>
                                                </Nav.Item>
                                                <Nav.Item as="li" className="col-md-3 p-0">
                                                    <Nav.Link eventKey="second" role="button">
                                                        Change Password
                                                    </Nav.Link>
                                                </Nav.Item>
                            
                                                <Nav.Item as="li" className="col-md-3 p-0">
                                                    <Nav.Link eventKey="fourth" role="button">
                                                        Social Media
                                                    </Nav.Link>
                                                </Nav.Item>
                                            </Nav>
                                        </div>
                                    </Card.Body>
                                </Card>
                            </Col>
                            <Col lg={12}>
                                <Tab.Content>
                                    {/* Personal Information Tab */}
                                    <Tab.Pane eventKey="first" className="fade show">
                                        <Card>
                                            <Card.Header className="d-flex justify-content-between">
                                                <div className="header-title">
                                                    <h4 className="card-title">Personal Information</h4>
                                                </div>
                                            </Card.Header>
                                            <Card.Body>
                                                <Form onSubmit={handleSubmit}>
                                                    <Form.Group className="form-group align-items-center">
                                                        <Col md="12">
                                                            <div className="profile-img-edit">
                                                                <img 
                                                                    className="profile-pic" 
                                                                    src={userData.profilePic || img1} 
                                                                    alt="profile-pic" 
                                                                    style={{
                                                                        width: '150px', // Ajustar al tamaño del contenedor
                                                                        height: '150px', // Ajustar al tamaño del contenedor
                                                                        objectFit: 'cover', // Mantener la proporción de la imagen
                                                                        borderRadius: '50%' // Hacer la imagen circular si es necesario
                                                                    }} 
                                                                />
                                                                <div className="p-image d-flex align-items-center justify-content-center">
                                                                    <span 
                                                                        className="material-symbols-outlined"
                                                                        onClick={() => fileInputRef.current.click()} // Abrir el selector de archivos al hacer clic
                                                                    >
                                                                        edit
                                                                    </span>
                                                                    <input
                                                                        className="file-upload"
                                                                        type="file"
                                                                        accept="image/*"
                                                                        ref={fileInputRef} // Asignar el ref al input
                                                                        onChange={handleImageChange}
                                                                        style={{ display: 'none' }} // Ocultar el input
                                                                    />
                                                                </div>
                                                            </div>
                                                        </Col>
                                                    </Form.Group>
                                                    <Row className="align-items-center">
                                                        <Form.Group className="form-group col-sm-6">
                                                            <Form.Label htmlFor="firstName" className="form-label">First Name:</Form.Label>
                                                            <Form.Control
                                                                type="text"
                                                                className="form-control"
                                                                id="firstName"
                                                                placeholder="First Name"
                                                                value={userData.firstName}
                                                                onChange={handleChange}
                                                            />
                                                        </Form.Group>
                                                        <Form.Group className="form-group col-sm-6">
                                                            <Form.Label htmlFor="lastName" className="form-label">Last Name:</Form.Label>
                                                            <Form.Control
                                                                type="text"
                                                                className="form-control"
                                                                id="lastName"
                                                                placeholder="Last Name"
                                                                value={userData.lastName}
                                                                onChange={handleChange}
                                                            />
                                                        </Form.Group>
                                                        <Form.Group className="form-group col-sm-6">
                                                            <Form.Label htmlFor="username" className="form-label">User Name:</Form.Label>
                                                            <Form.Control
                                                                type="text"
                                                                className="form-control"
                                                                id="username"
                                                                placeholder="Username"
                                                                value={userData.username}
                                                                onChange={handleChange}
                                                            />
                                                        </Form.Group>
                                                        <Form.Group className="form-group col-sm-6">
                                                            <Form.Label className="form-label d-block">Gender:</Form.Label>
                                                            <Form.Check className="form-check form-check-inline">
                                                                <Form.Check.Input
                                                                    className="form-check-input"
                                                                    type="radio"
                                                                    name="gender"
                                                                    id="male"
                                                                    value="Male"
                                                                    checked={userData.gender === "Male"}
                                                                    onChange={handleChange}
                                                                />
                                                                <Form.Check.Label className="form-check-label" htmlFor="male">Male</Form.Check.Label>
                                                            </Form.Check>{" "}
                                                            <Form.Check className="form-check form-check-inline">
                                                                <Form.Check.Input
                                                                    className="form-check-input"
                                                                    type="radio"
                                                                    name="gender"
                                                                    id="female"
                                                                    value="Female"
                                                                    checked={userData.gender === "Female"}
                                                                    onChange={handleChange}
                                                                />
                                                                <Form.Check.Label className="form-check-label" htmlFor="female">Female</Form.Check.Label>
                                                            </Form.Check>
                                                        </Form.Group>
                                                        <Form.Group className="form-group col-sm-6">
                                                            <Form.Label htmlFor="dob" className="form-label">Date Of Birth:</Form.Label>
                                                            <Form.Control
                                                                type="date"
                                                                className="form-control"
                                                                id="dob"
                                                                placeholder="Date of Birth"
                                                                value={userData.dob}
                                                                onChange={handleChange}
                                                            />
                                                        </Form.Group>
                                                        <Form.Group className="form-group col-sm-6">
                                                            <Form.Label htmlFor="country" className="form-label">Country:</Form.Label>
                                                            <Form.Control
                                                                type="text"
                                                                className="form-control"
                                                                id="country"
                                                                placeholder="Country"
                                                                value={userData.country}
                                                                onChange={handleChange}
                                                            />
                                                        </Form.Group>
                                                        <Form.Group className="form-group col-sm-12">
                                                            <Form.Label htmlFor="aboutMe" className="form-label">About me:</Form.Label>
                                                            <Form.Control
                                                                as="textarea"
                                                                rows={5}
                                                                id="aboutMe"
                                                                value={userData.aboutMe}
                                                                onChange={handleChange}
                                                            />
                                                        </Form.Group>
                                                    </Row>
                                                    <Button type="submit" className="btn btn-primary me-2" disabled={imageUploading}>
                                                        {imageUploading ? 'Uploading...' : 'Submit'}
                                                    </Button>{" "}
                                                    <Button type="reset" variant='' className="btn-danger-subtle">Cancel</Button>
                                                </Form>
                                            </Card.Body>
                                        </Card>
                                    </Tab.Pane>

                                    {/* Change Password Tab */}
                                    <Tab.Pane eventKey="second" className="fade show">
                                        <Card>
                                            <Card.Header className="d-flex justify-content-between">
                                                <div className="iq-header-title">
                                                    <h4 className="card-title">Change Password</h4>
                                                </div>
                                            </Card.Header>
                                            <Card.Body>
                                                <Form onSubmit={handlePasswordSubmit}>
                                                    <Form.Group className="form-group">
                                                        <Form.Label htmlFor="currentPassword" className="form-label">Current Password:</Form.Label>
                                                        <Link to="/auth/recoverpw" className="float-end">Forgot Password?</Link>
                                                        <Form.Control
                                                            type="password"
                                                            className="form-control"
                                                            id="currentPassword"
                                                            value={passwords.currentPassword}
                                                            onChange={handlePasswordChange}
                                                        />
                                                    </Form.Group>
                                                    <Form.Group className="form-group">
                                                        <Form.Label htmlFor="newPassword" className="form-label">New Password:</Form.Label>
                                                        <Form.Control
                                                            type="password"
                                                            className="form-control"
                                                            id="newPassword"
                                                            value={passwords.newPassword}
                                                            onChange={handlePasswordChange}
                                                        />
                                                    </Form.Group>
                                                    <Form.Group className="form-group">
                                                        <Form.Label htmlFor="verifyPassword" className="form-label">Verify Password:</Form.Label>
                                                        <Form.Control
                                                            type="password"
                                                            className="form-control"
                                                            id="verifyPassword"
                                                            value={passwords.verifyPassword}
                                                            onChange={handlePasswordChange}
                                                        />
                                                    </Form.Group>
                                                    <Button type="submit" className="btn btn-primary me-2">Submit</Button>{" "}
                                                    <Button type="reset" variant='' className="btn-danger-subtle">Cancel</Button>
                                                </Form>
                                            </Card.Body>
                                        </Card>
                                    </Tab.Pane>

                                    {/* Social Media Tab */}
                                    <Tab.Pane eventKey="fourth" className="fade show">
                                        <Card>
                                            <Card.Header className="d-flex justify-content-between">
                                                <div className="header-title">
                                                    <h4 className="card-title">Social Media Accounts</h4>
                                                </div>
                                            </Card.Header>
                                            <Card.Body>
                                                <Form onSubmit={handleSubmit}>
                                                    <Form.Group className="form-group">
                                                        <Form.Label htmlFor="websiteLink" className="form-label">Website link:</Form.Label>
                                                        <Form.Control
                                                            type="text"
                                                            className="form-control"
                                                            id="websiteLink"
                                                            value={userData.websiteLink}
                                                            onChange={handleChange}
                                                        />
                                                    </Form.Group>
                                                    <Form.Group className="form-group">
                                                        <Form.Label htmlFor="tiktokLink" className="form-label">TikTok profile link:</Form.Label>
                                                        <Form.Control
                                                            type="text"
                                                            className="form-control"
                                                            id="tiktokLink"
                                                            value={userData.tiktokLink}
                                                            onChange={handleChange}
                                                        />
                                                    </Form.Group>
                                                    <Form.Group className="form-group">
                                                        <Form.Label htmlFor="instagramLink" className="form-label">Instagram Profile Link:</Form.Label>
                                                        <Form.Control
                                                            type="text"
                                                            className="form-control"
                                                            id="instagramLink"
                                                            value={userData.instagramLink}
                                                            onChange={handleChange}
                                                        />
                                                    </Form.Group>
                                                    <Form.Group className="form-group">
                                                        <Form.Label htmlFor="spotifyLink" className="form-label">Spotify Profile Link:</Form.Label>
                                                        <Form.Control
                                                            type="text"
                                                            className="form-control"
                                                            id="spotifyLink"
                                                            value={userData.spotifyLink}
                                                            onChange={handleChange}
                                                        />
                                                    </Form.Group>
                                                    <Button type="submit" className="btn btn-primary me-2">Submit</Button>{" "}
                                                    <Button type="reset" variant='' className="btn-danger-subtle">Cancel</Button>
                                                </Form>
                                            </Card.Body>
                                        </Card>
                                    </Tab.Pane>
                                </Tab.Content>
                            </Col>
                        </Row>
                    </Tab.Container>
                </Container>
            </div >
        </>
    );
};

export default UserProfileEdit;
