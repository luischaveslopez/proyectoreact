import React from 'react';
import { Card, Container, Row, Col } from 'react-bootstrap';

const PrivacyPolicy = () => {
    return (
        <>
            <div className='content-inner'>
                <Container fluid className='container'>
                    <Row>
                        <Col lg="12">
                            <Card>
                                <Card.Header className="d-flex justify-content-between pb-0">
                                    <div className="header-title">
                                        <h4 className="card-title">Privacy Policy</h4>
                                    </div>
                                </Card.Header>
                                <Card.Body>
                                    <h5>Introduction</h5>
                                    <p>
                                        Our project is a web application that combines Spotify's music streaming service with social network features, allowing users to share their musical activities and interact with others. The application is developed using React for the user interface and Firebase for data storage. Users can log in using their Spotify accounts, allowing access to their music history, playlists, and favorite artists.
                                    </p>

                                    <h5>Collection and Use of Data</h5>
                                    <p>
                                        We collect authentication data, musical activity, playlists, and user preferences. This information is used to personalize the user experience and offer music recommendations based on friends' activity and the community.
                                    </p>

                                    <h5>Security and Storage</h5>
                                    <p>
                                        All data is securely stored in Firebase, which adheres to security standards to protect user information. We implement secure authentication measures and data protection, following privacy regulations.
                                    </p>

                                    <h5>Social Features</h5>
                                    <p>
                                        Our application allows social interaction through features such as following other users, sharing music, and commenting on posts. These features are designed to enhance users' musical experience and facilitate the discovery of new music.
                                    </p>

                                    <h5>User Rights</h5>
                                    <p>
                                        Users have control over their information and can manage their privacy preferences and share content as they wish. The data collected is used exclusively to improve the user experience within the application.
                                    </p>
                                </Card.Body>
                            </Card>
                            
                        </Col>
                    </Row>
                </Container>
            </div>
        </>
    );
};

export default PrivacyPolicy;
