import React, { useState, useContext } from 'react'

//router
import { Link, useLocation } from 'react-router-dom'

//react-bootstrap
import { Accordion, useAccordionButton, AccordionContext, Nav, Tooltip, OverlayTrigger } from 'react-bootstrap'



function CustomToggle({ children, eventKey, onClick }) {

    const { activeEventKey } = useContext(AccordionContext);

    const decoratedOnClick = useAccordionButton(eventKey, (active) => onClick({ state: !active, eventKey: eventKey }));

    const isCurrentEventKey = activeEventKey === eventKey;

    return (
        <Link to="#" aria-expanded={isCurrentEventKey ? 'true' : 'false'} className="nav-link" role="button" onClick={(e) => {
            decoratedOnClick(isCurrentEventKey)
        }}>
            {children}
        </Link>
    );
}

const VerticalNav = React.memo(() => {
    const [activeMenu, setActiveMenu] = useState(false)
    const [active, setActive] = useState('')
    //location
    let location = useLocation();
    // console.log(document);


    return (
        <React.Fragment>
            <Accordion as="ul" className="navbar-nav iq-main-menu" id="sidebar-menu">
                <li className="nav-item static-item">
                    <Link className="nav-link static-item disabled" to="#" tabIndex="-1">
                        <span className="default-icon">Main</span>
                        <span className="mini-icon" data-bs-toggle="tooltip" title="Social" data-bs-placement="right">-</span>
                    </Link>
                </li>
                <li className={`${location.pathname === '/' ? 'active' : ''} nav-item `}>
                    <Link className={`${location.pathname === '/' ? 'active' : ''} nav-link `} aria-current="page" to="/">
                        <OverlayTrigger placement="right" overlay={<Tooltip>Newsfeed</Tooltip>}>
                            <i className="icon material-symbols-outlined">
                                newspaper
                            </i>
                        </OverlayTrigger>
                        <span className="item-name">Newsfeed</span>
                    </Link>
                </li>
                <Accordion.Item as="li" eventKey="profile-menu" bsPrefix={`nav-item ${active === 'profile' ? 'active' : ''} `} onClick={() => setActive('profile')} >
                    <CustomToggle eventKey="profile-menu" onClick={(activeKey) => setActiveMenu(activeKey)}>
                        <OverlayTrigger placement="right" overlay={<Tooltip>Profiles</Tooltip>}>
                            <i className="icon material-symbols-outlined">
                                person
                            </i>
                        </OverlayTrigger>
                        <span className="item-name">Profile</span>
                        <i className="right-icon material-symbols-outlined">chevron_right</i>
                    </CustomToggle>
                    <Accordion.Collapse eventKey="profile-menu" >
                        <ul className="sub-nav">
                            <Nav.Item as="li">
                                <Link className={`${location.pathname === '/dashboard/app/profile' ? 'active' : ''} nav-link`} to="/dashboard/app/profile">
                                    <i className="icon material-symbols-outlined filled">
                                        fiber_manual_record
                                    </i>
                                    <OverlayTrigger placement="right" overlay={<Tooltip>Profile</Tooltip>}>
                                        <i className="sidenav-mini-icon"> P </i>
                                    </OverlayTrigger>
                                    <span className="item-name"> Profile </span>
                                </Link>
                            </Nav.Item>
                        </ul>
                    </Accordion.Collapse>
                </Accordion.Item>
                <Accordion.Item as="li" eventKey="friends-menu" bsPrefix="nav-item">
                    <CustomToggle eventKey="friends-menu" onClick={(activeKey) => setActiveMenu(activeKey)}>

                        <OverlayTrigger placement="right" overlay={<Tooltip>Friend</Tooltip>}>
                            <i className="icon material-symbols-outlined">
                                people
                            </i>
                        </OverlayTrigger>
                        <span className="item-name">Friends</span>
                        <i className="right-icon material-symbols-outlined">chevron_right</i>
                    </CustomToggle>
                    <Accordion.Collapse eventKey="friends-menu" >
                        <ul className="sub-nav">
                            <Nav.Item as="li">
                                <Link className={`${location.pathname === '/dashboards/app/friend-list' ? 'active' : ''} nav-link`} to="/dashboards/app/friend-list">
                                    {/* <i className="icon">
                                        <svg xmlns="http://www.w3.org/2000/svg" width="10" viewBox="0 0 24 24" fill="currentColor">
                                            <g> 
                                                <circle cx="12" cy="12" r="8" fill="currentColor"></circle>
                                            </g>
                                        </svg>
                                    </i> */}
                                    <i className="icon material-symbols-outlined filled">
                                        fiber_manual_record
                                    </i>

                                    <OverlayTrigger placement="right" overlay={<Tooltip>Friend List</Tooltip>}>
                                        <i className="sidenav-mini-icon"> FL </i>
                                    </OverlayTrigger>
                                    <span className="item-name">Friend List</span>
                                </Link>
                            </Nav.Item>
                            <Nav.Item as="li">
                                <Link className={`${location.pathname === '/dashboard/app/friend-request' ? 'active' : ''} nav-link`} to="/dashboard/app/friend-request">
                                    <i className="icon material-symbols-outlined filled">
                                        fiber_manual_record
                                    </i>
                                    <OverlayTrigger placement="right" overlay={<Tooltip>Friend Request</Tooltip>}>
                                        <i className="sidenav-mini-icon"> FR </i>
                                    </OverlayTrigger>
                                    <span className="item-name">Friend Request</span>
                                </Link>
                            </Nav.Item>
                        </ul>
                    </Accordion.Collapse>
                </Accordion.Item>
                <Nav.Item as="li">
                    <Link className={`${location.pathname === '/dashboard/app/notification' ? 'active' : ''} nav-link `} aria-current="page" to="/dashboard/app/notification">
                        <OverlayTrigger placement="right" overlay={<Tooltip>Notification</Tooltip>}>
                            <i className="icon material-symbols-outlined">
                                notifications
                            </i>
                        </OverlayTrigger>
                        <span className="item-name">Notification</span>
                    </Link>
                </Nav.Item>
                <li>
                    <hr className="hr-horizontal" />
                </li>
                
               
                <Nav.Item as="li">
                    <Link className={`${location.pathname === '/chat/index' ? 'active' : ''} nav-link `} aria-current="page" to="/chat/index" >
                        <OverlayTrigger placement="right" overlay={<Tooltip>Chat</Tooltip>}>
                            <i className="icon material-symbols-outlined">
                                message
                            </i>
                        </OverlayTrigger>
                        <span className="item-name">Chat</span>
                    </Link>
                </Nav.Item>
                             
                <Nav.Item as="li">
                    <Link className={`${location.pathname === '/dashboards/app/music' ? 'active' : ''} nav-link `} aria-current="page" to="/dashboards/app/music">
                        <OverlayTrigger placement="right" overlay={<Tooltip>Music</Tooltip>}>
                            <i className="icon material-symbols-outlined">
                                play_circle
                            </i>
                        </OverlayTrigger>
                        <span className="item-name">Music</span>
                    </Link>
                </Nav.Item>
                <li>
                    <hr className="hr-horizontal" />
                </li>
              
            </Accordion>
        </React.Fragment >
    )
})

export default VerticalNav
