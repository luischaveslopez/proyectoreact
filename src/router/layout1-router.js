import React from "react";

//pages
import FriendList from "../views/dashboard/app/friend-list";
import Music from "../views/dashboard/app/music";



export const Layout1Router = [

  {
    path: "dashboards/app/friend-list",
    element: <FriendList />,
  },
  {
    path: "dashboards/app/music",
    element: <Music />,
  }
];
