import React from "react";
import Index from "../views/dashboard/index";

//app
import UserProfile from "../views/dashboard/app/user-profile";
import FriendProfile from "../views/dashboard/app/friend-profile";
import Notification from "../views/dashboard/app/notification";
import FriendRequest from "../views/dashboard/app/friend-request";
import UserAccountSetting from "../views/dashboard/app/user-account-setting";
import UserProfileEdit from "../views/dashboard/app/user-profile-edit";

// icon
import Remixicon from "../views/dashboard/icons/icon-remixicon";
import Lineawesome from "../views/dashboard/icons/icon-lineawesome";
import Fontawesome from "../views/dashboard/icons/icon-fontawesome-5";
import Material from "../views/dashboard/icons/icon-material";



// extrapages


import PrivacyPolicy from "../views/dashboard/extrapages/privacy-policy";
import TermsofService from "../views/dashboard/extrapages/terms-of-service";


export const DefaultRouter = [
  {
    path: "/",
    element: <Index />,
  },
  {
    path: "dashboard/app/profile",
    element: <UserProfile />,
  },
  {
    path: "dashboard/app/friend-profile/:username", // Aquí se añade el parámetro :username
    element: <FriendProfile />,
  },
  {
    path: "dashboard/app/notification",
    element: <Notification />,
  },
  {
    path: "dashboard/app/friend-request",
    element: <FriendRequest />,
  },
  {
    path: "dashboard/app/user-account-setting",
    element: <UserAccountSetting />,
  },
  {
    path: "dashboard/app/user-profile-edit",
    element: <UserProfileEdit />,
  },
  {
    path: "dashboard/icon/fontawesome-5",
    element: <Fontawesome />,
  },
  {
    path: "dashboard/icon/remixicon",
    element: <Remixicon />,
  },
  {
    path: "dashboard/icon/lineawesome",
    element: <Lineawesome />,
  },
  {
    path: "dashboard/icon/material",
    element: <Material />,
  },
  {
    path: "dashboard/extrapages/privacy-policy",
    element: <PrivacyPolicy />,
  },
  {
    path: "dashboard/extrapages/terms-of-service",
    element: <TermsofService />,
  },
 


];
