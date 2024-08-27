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

const SidebarMenu = () => {
  const pathname = usePathname();
  const router = useRouter();
  const { currentUser, userData, loading, setUserData } = useAuth();

  // const myProperties = [
  //   { id: 1, name: "General Elements", route: "/cardurile-mele" },
  //   { id: 2, name: "Advanced Elements", route: "/my-properties" },
  //   { id: 3, name: "Editors", route: "/my-properties" },
  // ];
  // const reviews = [
  //   { id: 1, name: "My Reviews", route: "/my-review" },
  //   { id: 2, name: "Visitor Reviews", route: "/my-review" },
  // ];
  const manageAccount = [
    // {
    //   id: 1,
    //   name: "My Package",
    //   route: "/my-package",
    //   icon: "flaticon-box",
    // },
    {
      id: 2,
      name: "Profil",
      route: "/profil",
      icon: "flaticon-user",
    },
    { id: 3, name: "Deconectare", route: "/", icon: "flaticon-logout" },
  ];

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
                isSinglePageActive("/panou-utilizator", pathname)
                  ? "active"
                  : ""
              }`}
            >
              <Link href="/panou-utilizator">
                <i className="flaticon-layers"></i>
                <span>Activitatea mea</span>
              </Link>
            </li>
            <li
              className={`treeview ${
                isSinglePageActive("/lista-aplicatii-anunturi", pathname)
                  ? "active"
                  : ""
              }`}
            >
              <Link href="/lista-aplicatii-anunturi">
                <i className="flaticon-layers"></i>
                <span>Lista Cererilor</span>
              </Link>
            </li>
            {/* <li
              className={`treeview ${
                isSinglePageActive("/lista-anunturi-cadre-medicale", pathname)
                  ? "active"
                  : ""
              }`}
            >
              <Link href="/lista-anunturi-cadre-medicale">
                <i className="flaticon-layers"></i>
                <span>Lista Anunturi Create</span>
              </Link>
            </li>
            <li
              className={`treeview ${
                isSinglePageActive("/creaza-anunt-cadru-medical", pathname)
                  ? "active"
                  : ""
              }`}
            >
              <Link href="/creaza-anunt-cadru-medical">
                <i className="flaticon-plus"></i>
                <span>Adauga anunt</span>
              </Link>
            </li> */}
            {manageAccount.map((item) => (
              <li
                className={
                  isSinglePageActive(item.route, pathname) ? "active" : ""
                }
                key={item.id}
              >
                <Link
                  href={item.route}
                  onClick={async (e) => {
                    // Prevenim comportamentul default al link-ului dacă este necesar
                    if (item.name === "Deconectare") {
                      e.preventDefault();
                      await handleLogout().then(() => {
                        setUserData({});
                      });
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
                isSinglePageActive("/create-listing", pathname)
                  ? "active"
                  : ""
              }`}
            >
              <Link href="/create-listing">
                <i className="flaticon-plus"></i>
                <span> Create Listing</span>
              </Link>
            </li>
            <li
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
            </li> */}
        {/* end properties */}

        {/* <li
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
            </li> */}
        {/* End Review */}

        {/* <li
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
        {/* End manage listing */}

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
