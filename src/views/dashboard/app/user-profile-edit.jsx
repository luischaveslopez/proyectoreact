import React from 'react'
import { Container, Row, Col, Card, Tab, Form, Button, Nav } from 'react-bootstrap'
import { Link } from 'react-router-dom'

//image
import img1 from '../../../assets/images/user/11.png'

const UserProfileEdit = () => {
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
                                {/* <div className="iq-edit-list-data"> */}
                                <Tab.Content>
                                    <Tab.Pane eventKey="first" className="fade show">
                                        <Card>
                                            <Card.Header className="d-flex justify-content-between">
                                                <div className="header-title">
                                                    <h4 className="card-title">Personal Information</h4>
                                                </div>
                                            </Card.Header>
                                            <Card.Body>
                                                <Form>
                                                    <Form.Group className="form-group align-items-center">
                                                        <Col md="12">
                                                            <div className="profile-img-edit">
                                                                <img className="profile-pic" src={img1} alt="profile-pic" />
                                                                <div className="p-image d-flex align-items-center justify-content-center">
                                                                    <span className="material-symbols-outlined">edit</span>
                                                                    <input className="file-upload" type="file" accept="image/*" />
                                                                </div>
                                                            </div>
                                                        </Col>
                                                    </Form.Group>
                                                    <Row className="align-items-center">
                                                        <Form.Group className="form-group col-sm-6">
                                                            <Form.Label htmlFor="fname" className="form-label">First Name:</Form.Label>
                                                            <Form.Control type="text" className="form-control" id="fname" placeholder="Bni" />
                                                        </Form.Group>
                                                        <Form.Group className="form-group col-sm-6">
                                                            <Form.Label htmlFor="lname" className="form-label">Last Name:</Form.Label>
                                                            <Form.Control type="text" className="form-control" id="lname" placeholder="Jhon" />
                                                        </Form.Group>
                                                        <Form.Group className="form-group col-sm-6">
                                                            <Form.Label htmlFor="uname" className="form-label">User Name:</Form.Label>
                                                            <Form.Control type="text" className="form-control" id="uname" placeholder="Bni@01" />
                                                        </Form.Group>

                                                        <Form.Group className="form-group col-sm-6">
                                                            <Form.Label className="form-label d-block">Gender:</Form.Label>
                                                            <Form.Check className="form-check form-check-inline">
                                                                <Form.Check.Input className="form-check-input" type="radio" name="inlineRadioOptions" id="inlineRadio10" defaultValue="option1" />
                                                                <Form.Check.Label className="form-check-label" htmlFor="inlineRadio10"> Male</Form.Check.Label>
                                                            </Form.Check>{" "}
                                                            <Form.Check className="form-check form-check-inline">
                                                                <Form.Check.Input className="form-check-input" type="radio" name="inlineRadioOptions" id="inlineRadio11" defaultValue="option1" />
                                                                <Form.Check.Label className="form-check-label" htmlFor="inlineRadio11"> Female</Form.Check.Label>
                                                            </Form.Check>
                                                        </Form.Group>
                                                        <Form.Group className="form-group col-sm-6">
                                                            <Form.Label htmlFor="dob" className="form-label">Date Of Birth:</Form.Label>
                                                            <Form.Control className="form-control" id="dob" placeholder="1984-01-24" />
                                                        </Form.Group>

                                                        <Form.Group className="form-group col-sm-6">
                                                            <Form.Label className="form-label">Country:</Form.Label>
                                                            <Form.Select defaultValue="USA" className="form-select" aria-label="Default select example 3">
                                                                <option>Caneda</option>
                                                                <option>Noida</option>
                                                                <option>USA</option>
                                                                <option>India</option>
                                                                <option>Africa</option>
                                                            </Form.Select>
                                                        </Form.Group>

                                                        <Form.Group className="form-group col-sm-12">
                                                            <Form.Label className="form-label">About me:</Form.Label>
                                                            <textarea className="form-control" rows={5} style={{ lineHeight: "22px" }} >
                                                            Hi, I’m James, I’m 36 and I work as a Digital Designer for the “Daydreams” Agency in Pier 56
                                                            </textarea>
                                                        </Form.Group>
                                                    </Row>
                                                    <Button type="submit" className="btn btn-primary me-2">Submit</Button>{" "}
                                                    <Button type="reset" variant='' className="btn-danger-subtle">Cancel</Button>
                                                </Form>
                                            </Card.Body>
                                        </Card>
                                    </Tab.Pane>
                                    <Tab.Pane eventKey="second" className="fade show">
                                        <Card>
                                            <Card.Header className="d-flex justify-content-between">
                                                <div className="iq-header-title">
                                                    <h4 className="card-title">Change Password</h4>
                                                </div>
                                            </Card.Header>
                                            <Card.Body>
                                                <Form>
                                                    <Form.Group className="form-group">
                                                        <Form.Label htmlFor="cpass" className="form-label">Current Password:</Form.Label>
                                                        <Link to="/auth/recoverpw" className="float-end">Forgot Password</Link>
                                                        <Form.Control type="Password" className="form-control" id="cpass" defaultValue="" />
                                                    </Form.Group>
                                                    <Form.Group className="form-group">
                                                        <Form.Label htmlFor="npass" className="form-label">New Password:</Form.Label>
                                                        <Form.Control type="Password" className="form-control" id="npass" defaultValue="" />
                                                    </Form.Group>
                                                    <Form.Group className="form-group">
                                                        <Form.Label htmlFor="vpass" className="form-label">Verify Password:</Form.Label>
                                                        <Form.Control type="Password" className="form-control" id="vpass" defaultValue="" />
                                                    </Form.Group>
                                                    <Button type="submit" className="btn btn-primary me-2">Submit</Button>{" "}
                                                    <button type="reset" className="btn btn-danger-subtle">Cancel</button>
                                                </Form>
                                            </Card.Body>
                                        </Card>
                                    </Tab.Pane>
                                 
                                    <Tab.Pane eventKey="fourth" className="fade show">
                                        <Card>
                                            <Card.Header className="d-flex justify-content-between">
                                                <div className="header-title">
                                                    <h4 className="card-title">Social Media Accounts</h4>
                                                </div>
                                            </Card.Header>
                                            <Card.Body>
                                                <Form>
                                                <Form.Group className="form-group">
                                                        <Form.Label htmlFor="cno" className="form-label">Website link:</Form.Label>
                                                        <Form.Control type="text" className="form-control" id="cno" defaultValue="smartinvestmentoff.com/" />
                                                    </Form.Group>
                                                    <Form.Group className="form-group">
                                                        <Form.Label htmlFor="cno" className="form-label">TikTok profile link:</Form.Label>
                                                        <Form.Control type="text" className="form-control" id="cno" defaultValue="https://www.tiktok.com/@thenomad.t4r" />
                                                    </Form.Group>
                                                    <Form.Group className="form-group">
                                                        <Form.Label htmlFor="email" className="form-label">Instagram Profile Link:</Form.Label>
                                                        <Form.Control type="text" className="form-control" id="email" defaultValue="https://www.instagram.com/edwardgonzalz/" />
                                                    </Form.Group>
                                                    <Form.Group className="form-group">
                                                        <Form.Label htmlFor="url" className="form-label">Spotify Profile Link:</Form.Label>
                                                        <Form.Control type="text" className="form-control" id="url" defaultValue="https://open.spotify.com/user/edwuardarce" />
                                                    </Form.Group>
                                                    <Button type="submit" className="btn btn-primary me-2">Submit</Button>{" "}
                                                    <button type="reset" className="btn btn-danger-subtle">Cancel</button>
                                                </Form>
                                            </Card.Body>
                                        </Card>
                                    </Tab.Pane>
                                </Tab.Content>
                                {/* </div> */}
                            </Col>
                        </Row>
                    </Tab.Container>
                </Container>
            </div >
        </>
    )

}

export default UserProfileEdit;