import React, { useState, useEffect, useRef } from 'react';
import { Container, Row, Col, Card, Tab, Form, Button, Nav } from 'react-bootstrap';
import { useNavigate, Link } from 'react-router-dom';
import { getAuth, updatePassword, EmailAuthProvider, reauthenticateWithCredential, deleteUser } from 'firebase/auth';
import { doc, getDoc, setDoc, deleteDoc, collection, query, where, getDocs } from 'firebase/firestore';
import { getStorage, ref, uploadBytes, getDownloadURL, deleteObject } from 'firebase/storage';
import Swal from 'sweetalert2'; // Importa SweetAlert2
import { db } from '../../../config/firebase';

//image
import img1 from '../../../assets/images/user/11.png';

const UserProfileEdit = () => {
    const [userData, setUserData] = useState({
        firstName: '',
        lastName: '',
        username: '',
        gender: '', // Esto está bien inicializado
        dob: '',
        country: '',
        aboutMe: '',
        profilePic: img1,
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
                            firstName: data.firstName || '',
                            lastName: data.lastName || '',
                            username: data.username || user.displayName || '',
                            gender: data.gender || '', // Esto también se corrige
                            dob: data.dob || '',
                            country: data.country || '',
                            aboutMe: data.aboutMe || '',
                            profilePic: data.profilePic || user.photoURL || img1,
                            websiteLink: data.websiteLink || '',
                            tiktokLink: data.tiktokLink || '',
                            instagramLink: data.instagramLink || '',
                            spotifyLink: data.spotifyLink || ''
                        }));
                    } else {
                        setUserData(prevState => ({
                            ...prevState,
                            username: user.displayName || '',
                            profilePic: user.photoURL || img1
                        }));
                    }
                } catch (error) {
                    console.error("Error fetching user data: ", error);
                }
            };
            fetchUserData();
        }
    }, [user]);

    const handleDeleteAccount = async () => {
        try {
            const confirmDelete = await Swal.fire({
                title: 'Are you sure?',
                text: "This action will delete your account and all related data. This cannot be undone!",
                icon: 'warning',
                showCancelButton: true,
                confirmButtonText: 'Yes, delete it!',
                cancelButtonText: 'Cancel'
            });

            if (confirmDelete.isConfirmed) {
                // Delete user posts
                const postsQuery = query(collection(db, "posts"), where("user.uid", "==", user.uid));
                const postsSnapshot = await getDocs(postsQuery);
                const deletePostsPromises = postsSnapshot.docs.map(doc => deleteDoc(doc.ref));

                // Delete user profile document
                const userDocRef = doc(db, "users", user.uid);
                const deleteUserDocPromise = deleteDoc(userDocRef);

                // Delete profile picture from storage (if exists)
                const storageRef = ref(storage, `profilePics/${user.uid}`);
                const deleteImagePromise = deleteObject(storageRef).catch(() => console.log("No profile picture to delete."));

                // Wait for all deletions to complete
                await Promise.all([...deletePostsPromises, deleteUserDocPromise, deleteImagePromise]);

                // Delete user authentication
                await deleteUser(user);

                Swal.fire('Deleted!', 'Your account has been deleted.', 'success');
                navigate('/login'); // Redirect to login page or other page
            }
        } catch (error) {
            console.error("Error deleting account:", error);
            Swal.fire('Error!', 'There was an error deleting your account.', 'error');
        }
    };

    const handleChange = (e) => {
        const { id, value } = e.target;
        setUserData(prevState => ({
            ...prevState,
            [id]: value
        }));
    };

    const handleGenderChange = (e) => {
        setUserData(prevState => ({
            ...prevState,
            gender: e.target.value // Actualiza el campo de género correctamente
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
                }, { merge: true });

                Swal.fire({
                    icon: 'success',
                    title: 'Profile Updated',
                    text: 'Your profile has been updated successfully!',
                });
            } catch (error) {
                console.error("Error updating profile: ", error);
                setImageUploading(false);
                Swal.fire({
                    icon: 'error',
                    title: 'Error',
                    text: 'There was an error updating your profile.',
                });
            }
        }
    };

    const handlePasswordSubmit = async (e) => {
        e.preventDefault();
        if (passwords.newPassword !== passwords.verifyPassword) {
            Swal.fire({
                icon: 'warning',
                title: 'Passwords Do Not Match',
                text: 'New password and verification password do not match.',
            });
            return;
        }
        if (user) {
            const credential = EmailAuthProvider.credential(
                user.email,
                passwords.currentPassword
            );

            try {
                await reauthenticateWithCredential(user, credential);
                await updatePassword(user, passwords.newPassword);
                Swal.fire({
                    icon: 'success',
                    title: 'Password Updated',
                    text: 'Your password has been updated successfully!',
                });
                setPasswords({
                    currentPassword: '',
                    newPassword: '',
                    verifyPassword: ''
                });
            } catch (error) {
                console.error("Error updating password: ", error);
                Swal.fire({
                    icon: 'error',
                    title: 'Error',
                    text: `There was an error updating your password: ${error.message}`,
                });
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
                                                                        width: '150px',
                                                                        height: '150px',
                                                                        objectFit: 'cover',
                                                                        borderRadius: '50%'
                                                                    }} 
                                                                />
                                                                <div className="p-image d-flex align-items-center justify-content-center">
                                                                    <span 
                                                                        className="material-symbols-outlined"
                                                                        onClick={() => fileInputRef.current.click()}
                                                                    >
                                                                        edit
                                                                    </span>
                                                                    <input
                                                                        className="file-upload"
                                                                        type="file"
                                                                        accept="image/*"
                                                                        ref={fileInputRef}
                                                                        onChange={handleImageChange}
                                                                        style={{ display: 'none' }}
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
                                                                    value="Male"
                                                                    checked={userData.gender === "Male"}
                                                                    onChange={handleGenderChange} // Corrige el cambio de género
                                                                />
                                                                <Form.Check.Label className="form-check-label" htmlFor="male">Male</Form.Check.Label>
                                                            </Form.Check>{" "}
                                                            <Form.Check className="form-check form-check-inline">
                                                                <Form.Check.Input
                                                                    className="form-check-input"
                                                                    type="radio"
                                                                    name="gender"
                                                                    value="Female"
                                                                    checked={userData.gender === "Female"}
                                                                    onChange={handleGenderChange} // Corrige el cambio de género
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
