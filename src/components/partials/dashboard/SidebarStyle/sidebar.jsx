import React, { useEffect } from "react";
// Import selectors & action from setting store
import * as SettingSelector from "../../../../store/setting/selectors";

// Redux Selector / Action
import { useSelector } from "react-redux";

//components
import Verticalnav from "./verticalnav";
import Scrollbar from "smooth-scrollbar";

import { Link } from "react-router-dom";

const Sidebar = () => {
  const sidebarType = useSelector(SettingSelector.sidebar_type); // array
  const sidebarMenuStyle = useSelector(SettingSelector.sidebar_menu_style);
  const appName = useSelector(SettingSelector.app_name);
  useEffect(() => {
    Scrollbar.init(document.querySelector(".data-scrollbar"));

    window.addEventListener("resize", () => {
      const tabs = document.querySelectorAll(".nav");
      const sidebarResponsive = document.querySelector(
        '[data-sidebar="responsive"]'
      );
      // if (window.innerWidth < 1025) {
      //   Array.from(tabs, (elem) => {
      //     if (
      //       !elem.classList.contains("flex-column") &&
      //       elem.classList.contains("nav-tabs") &&
      //       elem.classList.contains("nav-pills")
      //     ) {
      //       elem.classList.add("flex-column", "on-resize");
      //     }
      //     return elem.classList.add("flex-column", "on-resize");
      //   });
      //   if (sidebarResponsive !== null) {
      //     if (!sidebarResponsive.classList.contains("sidebar-mini")) {
      //       sidebarResponsive.classList.add("sidebar-mini", "on-resize");
      //     }
      //   }
      // } else {
      //   Array.from(tabs, (elem) => {
      //     if (elem.classList.contains("on-resize")) {
      //       elem.classList.remove("flex-column", "on-resize");
      //     }
      //     return elem.classList.remove("flex-column", "on-resize");
      //   });
      //   if (sidebarResponsive !== null) {
      //     if (
      //       sidebarResponsive.classList.contains("sidebar-mini") &&
      //       sidebarResponsive.classList.contains("on-resize")
      //     ) {
      //       sidebarResponsive.classList.remove("sidebar-mini", "on-resize");
      //     }
      //   }
      // }
      if (window.innerWidth < 1025) {

        if (sidebarResponsive !== null) {
          if (!sidebarResponsive.classList.contains("sidebar-mini")) {
            sidebarResponsive.classList.add("sidebar-mini", "on-resize");
          }
        }
      } else {
        if (sidebarResponsive !== null) {
          if (
            sidebarResponsive.classList.contains("sidebar-mini") &&
            sidebarResponsive.classList.contains("on-resize")
          ) {
            sidebarResponsive.classList.remove("sidebar-mini", "on-resize");
          }
        }
      }
    });
  });

  const minisidebar = () => {
    document.getElementsByTagName("ASIDE")[0].classList.toggle("sidebar-mini");
  };

  return (
    <>
      <aside
        className={`${sidebarType.join(
          " "
        )} ${sidebarMenuStyle} sidebar sidebar-default sidebar-base navs-rounded-all`}
        id="first-tour"
        data-toggle="main-sidebar"
        data-sidebar="responsive"
      >
        <div className="sidebar-header d-flex align-items-center justify-content-start position-relative">
          <Link
            to="/"
            className="d-flex align-items-center gap-2 iq-header-logo"
          >
          <img src="https://i.postimg.cc/C5FqYncS/Untitled-design-3.png" width="50" alt="Jammify Logo" />

            <h3 className="logo-title" data-setting="app_name">
              Jammify
            </h3>
          </Link>
          <div
            className="sidebar-toggle"
            data-toggle="sidebar"
            data-active="true"
            onClick={minisidebar}
          >
            <span className="menu-btn d-inline-block is-active">
              <i className="right-icon material-symbols-outlined icon-rtl">
                chevron_left
              </i>
            </span>
          </div>
        </div>
        <div className="sidebar-body pt-0 data-scrollbar">
          <div className="sidebar-list">
            <Verticalnav />
          </div>
        </div>
        <div className="sidebar-footer"></div>
      </aside>
    </>
  );
};

export default Sidebar;
