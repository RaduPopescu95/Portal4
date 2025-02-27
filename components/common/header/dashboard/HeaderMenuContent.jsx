"use client";

import Link from "next/link";

import MyAccount from "./MyAccount";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useAuth } from "@/context/AuthContext";

const HeaderMenuContent = ({ float = "" }) => {
  const { userData, currentUser } = useAuth();

  const pathname = usePathname();

  const home = [
    {
      id: 1,
      name: "Home 1",
      routerPath: "/",
    },
  ];

  const listing = [
    {
      id: 1,
      title: "Listing Grid",
      items: [
        {
          name: "Grid v1",
          routerPath: "/parteneri",
        },
      ],
    },
  ];

  const property = [
    {
      id: 1,
      title: "User Admin",
      items: [
        {
          name: "Cont",
          routerPath: "/my-dashboard",
        },
      ],
    },
  ];

  const blog = [{ id: 1, name: "Blog List 1", routerPath: "/blog-list-1" }];

  const pages = [
    { id: 1, name: "Despre noi", routerPath: "/despre-noi" },
    // { id: 2, name: "Faq", routerPath: "/faq" },
    { id: 3, name: "Termeni & Conditii", routerPath: "/termeni-conditii" },
    // { id: 3, name: "Cum functioneaza", routerPath: "/cum-functioneaza" },
  ];

  return (
    <ul
      id="respMenu"
      className="ace-responsive-menu text-end d-lg-block d-none"
      data-menu-style="horizontal"
    >
      <li className="last">
        <Link href="/" className={pathname === "/" ? "ui-active" : undefined}>
          Acasă
        </Link>
      </li>
      {/* End .simpleitem */}

      {/* <li className="last">
        <Link
          href="/parteneri"
          className={pathname === "/parteneri" ? "ui-active" : undefined}
        >
          Parteneri
        </Link>
      </li> */}
      {/* End .simpleitem */}

      {/* <li className="last">
        <Link
          href="/my-dashboard"
          className={pathname === "/my-dashboard" ? "ui-active" : undefined}
        >
          Cont Clinica
        </Link>
      </li> */}
      {/* End .simpleitem */}

      {/* <li className="last">
        <Link
          href="/my-dashboard"
          className={pathname === "/my-dashboard" ? "ui-active" : undefined}
        >
          Cont Doctor
        </Link>
      </li> */}
      {/* End .simpleitem */}

      <li className="dropitem">
        <a
          href="#"
          className={
            pages.some(
              (page) =>
                page.routerPath?.split("/")[1] === pathname?.split("/")[1]
            )
              ? "ui-active"
              : undefined
          }
        >
          <span className="title">Despre noi</span>
          <span className="arrow"></span>
        </a>
        <ul className="sub-menu ">
          {pages.map((item) => (
            <li key={item.id}>
              <Link
                href={item.routerPath}
                className={
                  pathname?.split("/")[1] === item.routerPath?.split("/")[1]
                    ? "ui-active"
                    : undefined
                }
              >
                {item.name}
              </Link>
            </li>
          ))}
        </ul>
      </li>
      {/* End .dropitem */}

      {/* <li className="last">
        <Link
          href="/blog-list-1"
          className={pathname === "/blog-list-1" ? "ui-active" : undefined}
        >
          Blog
        </Link>
      </li> */}
      {/* End .simpleitem */}

      <li className="last">
        <Link
          href="/contact"
          className={pathname === "/contact" ? "ui-active" : undefined}
        >
          Contact
        </Link>
      </li>
      {/* End .simpleitem */}

      {/* <li className="user_setting">
        <div className="dropdown">
          <a className="btn dropdown-toggle" href="#" data-bs-toggle="dropdown">
            <Image
              width={45}
              height={45}
              className="rounded-circle"
              src="/assets/images/team/e1.png"
              alt="e1.png"
            />
            <span className="dn-1199 ms-1">{userData?.denumireBrand}</span>
          </a>
          <div className="dropdown-menu">
            <MyAccount />
          </div>
        </div>
      </li> */}
      {/* End ."user_setting */}

      {/* <li className={`list-inline-item add_listing ${float}`}>
        <Link href="/creaza-discount">
          <span className="flaticon-plus"></span>
          <span className="dn-lg"> Creaza discount</span>
        </Link>
      </li> */}
      {/* End .dropitem */}
    </ul>
  );
};

export default HeaderMenuContent;
