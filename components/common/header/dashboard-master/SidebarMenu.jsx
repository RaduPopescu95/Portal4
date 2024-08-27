"use client";

import Link from "next/link";

import {
  isParentPageActive,
  isSinglePageActive,
} from "../../../../utils/daynamicNavigation";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import { handleLogout } from "@/utils/authUtils";
import { useAuth } from "@/context/AuthContext";
import { useEffect } from "react";
import { authentication } from "@/firebase";

const SidebarMenu = () => {
  const pathname = usePathname();
  const router = useRouter();
  const { currentUser, userData, loading } = useAuth();
  // const { userData, currentUser, loading } = useAuth();

  const myProperties = [
    { id: 1, name: "General Elements", route: "/my-properties" },
    { id: 2, name: "Advanced Elements", route: "/my-properties" },
    { id: 3, name: "Editors", route: "/my-properties" },
  ];
  const reviews = [
    { id: 1, name: "My Reviews", route: "/my-review" },
    { id: 2, name: "Visitor Reviews", route: "/my-review" },
  ];
  const manageAccount = [
    // {
    //   id: 1,
    //   name: "My Package",
    //   route: "/my-package",
    //   icon: "flaticon-box",
    // },
    // {
    //   id: 2,
    //   name: "Profil",
    //   route: "/profil-partener",
    //   icon: "flaticon-user",
    // },
    { id: 3, name: "Deconectare", route: "/", icon: "flaticon-logout" },
  ];

  useEffect(() => {
    if (!loading) {
      if (!currentUser || currentUser.uid !== "ZUXX9smtXBdxve8dOhk5MTZRU903") {
        console.log("User not authenticated or UID mismatch");
        router.push("/signin");
      }
    }
  }, [loading, currentUser, router]);

  return (
    <>
      <ul className="sidebar-menu">
        <li className="sidebar_header header">
          <Link href="/">
            <Image
              width={220}
              height={225}
              className="logo1 img-fluid"
              src="/assets/images/logo_jobsmd_alb.svg"
              alt="logo_jobsmd.svg"
            />
            {/* <Image
            width={220}
            height={225}
            className="logo2 img-fluid"
            src="/assets/images/logo_jobsmd.svg"
            alt="header-logo2.png"
          /> */}
            {/* <span>Portal</span> */}
          </Link>
        </li>
        {/* End header */}

        <li className="title">
          {/* <span>Main</span> */}
          <ul>
            <li
              className={`treeview ${
                isSinglePageActive("/my-dashboard", pathname) ? "active" : ""
              }`}
            >
              <Link href="/admin">
                <i className="flaticon-layers"></i>
                <span>Activitatea mea</span>
              </Link>
            </li>
            {/* <li
              className={`treeview ${
                isSinglePageActive("/create-listing", pathname)
                  ? "active"
                  : ""
              }`}
            >
              <Link href="/creaza-anunt">
                <i className="flaticon-plus"></i>
                <span>Creaza anunt de angajare</span>
              </Link>
            </li> */}
            <li
              className={`treeview ${
                isSinglePageActive("/lista-doctori", pathname) ? "active" : ""
              }`}
            >
              <Link href="/lista-doctori">
                <i className="flaticon-layers"></i>
                <span>Lista Utilizatori</span>
              </Link>
            </li>
            <li
              className={`treeview ${
                isSinglePageActive("/lista-parteneri", pathname) ? "active" : ""
              }`}
            >
              <Link href="/lista-parteneri">
                <i className="flaticon-layers"></i>
                <span>Lista Clinici</span>
              </Link>
            </li>
            {/* <li
              className={`treeview ${
                isSinglePageActive("/create-listing", pathname)
                  ? "active"
                  : ""
              }`}
            >
              <Link href="/creaza-produs-serviciu">
                <i className="flaticon-plus"></i>
                <span>Creaza Produs/serviciu</span>
              </Link>
            </li> */}

            <li
              className={`treeview ${
                isSinglePageActive("/lista-tranzactii", pathname)
                  ? "active"
                  : ""
              }`}
            >
              <Link href="/lista-tranzactii">
                <i className="flaticon-layers"></i>
                <span>Lista Aplicațiilor</span>
              </Link>
            </li>
            <li
              className={`treeview ${
                isSinglePageActive("/mesaje", pathname) ? "active" : ""
              }`}
            >
              <Link href="/mesaje">
                <i className="flaticon-layers"></i>
                <span>Lista Mesaje</span>
              </Link>
            </li>
            <li
              className={`treeview ${
                isSinglePageActive("/plangeri-admin", pathname) ? "active" : ""
              }`}
            >
              <Link href="/plangeri-admin">
                <i className="flaticon-layers"></i>
                <span>Lista Plangeri</span>
              </Link>
            </li>

            {manageAccount.map((item) => (
              <li
                className={
                  isSinglePageActive(item.route, pathname) ? "active" : ""
                }
                key={item.id}
              >
                <Link
                  href={item.route}
                  onClick={(e) => {
                    // Prevenim comportamentul default al link-ului dacă este necesar
                    if (item.name === "Deconectare") {
                      e.preventDefault();
                      handleLogout();
                      router.push("/");
                    } else {
                      console.log("profile...");
                    }
                  }}
                >
                  <i className={item.icon}></i> <span>{item.name}</span>
                </Link>
              </li>
            ))}
            {/* <li
              className={`treeview ${
                isSinglePageActive("/my-message", pathname)
                  ? "active"
                  : ""
              }`}
            >
              <Link href="/my-message">
                <i className="flaticon-envelope"></i>
                <span> Message</span>
              </Link>
            </li> */}
          </ul>
        </li>
        {/* End Main */}

        {/* <li className="title">
          <span>Manage Listings</span>
          <ul>
            <li
              className={`treeview ${
                isParentPageActive(myProperties, pathname) ? "active" : ""
              }`}
            >
              <a data-bs-toggle="collapse" href="#my-property">
                <i className="flaticon-home"></i> <span>My Properties</span>
                <i className="fa fa-angle-down pull-right"></i>
              </a>
              <ul className="treeview-menu collapse" id="my-property">
                {myProperties.map((item) => (
                  <li key={item.id}>
                    <Link href={item.route}>
                      <i className="fa fa-circle"></i> {item.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </li>

            <li
              className={`treeview ${
                isParentPageActive(reviews, pathname) ? "active" : ""
              }`}
            >
              <a data-bs-toggle="collapse" href="#review">
                <i className="flaticon-chat"></i>
                <span>Reviews</span>
                <i className="fa fa-angle-down pull-right"></i>
              </a>
              <ul className="treeview-menu collapse" id="review">
                {reviews.map((item) => (
                  <li key={item.id}>
                    <Link href={item.route}>
                      <i className="fa fa-circle"></i> {item.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </li>

            <li
              className={`treeview ${
                isSinglePageActive("/my-favourites", pathname)
                  ? "active"
                  : ""
              }`}
            >
              <Link href="/my-favourites">
                <i className="flaticon-magnifying-glass"></i>
                <span> My Favorites</span>
              </Link>
            </li>
            <li
              className={`treeview ${
                isSinglePageActive("/my-saved-search", pathname)
                  ? "active"
                  : ""
              }`}
            >
              <Link href="/my-saved-search">
                <i className="flaticon-magnifying-glass"></i>
                <span> Saved Search</span>
              </Link>
            </li>
          </ul>
        </li> */}

        {/* <li className="title">
          <span>Cont</span>
          <ul>
            {manageAccount.map((item) => (
              <li
                className={
                  isSinglePageActive(item.route, pathname) ? "active" : ""
                }
                key={item.id}
              >
                <Link
                  href={item.route}
                  onClick={(e) => {
                    // Prevenim comportamentul default al link-ului dacă este necesar
                    if (item.name === "Deconectare") {
                      e.preventDefault();
                      handleLogout();
                      router.push("/");
                    } else {
                      console.log("profile...");
                    }
                  }}
                >
                  <i className={item.icon}></i> <span>{item.name}</span>
                </Link>
              </li>
            ))}
          </ul>
        </li> */}
      </ul>
    </>
  );
};

export default SidebarMenu;
