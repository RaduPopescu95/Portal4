"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import HeaderMenuContent from "./HeaderMenuContent";
import Image from "next/image";
import { usePathname } from "next/navigation";

const Header = () => {
  const [navbar, setNavbar] = useState(false);
  const pathname = usePathname();

  const changeBackground = () => {
    if (window.scrollY >= 95) {
      setNavbar(true);
    } else {
      setNavbar(false);
    }
  };

  useEffect(() => {
    window.addEventListener("scroll", changeBackground);
  }, []);

  return (
    <header
      className={`header-nav menu_style_home_one style2 navbar-scrolltofixed stricky main-menu  ${
        navbar ? "stricky-fixed " : ""
      }`}
    >
      <div className="container-fluid p0">
        {/* <!-- Menu Toggle btn--> */}
        <Link href="/" className="navbar_brand float-start dn-smd">
          <Image
            width={220}
            height={225}
            className="logo1 img-fluid"
            src={
              pathname === "/"
                ? "/assets/images/logo_jobsmd_alb.svg"
                : "/assets/images/logo_jobsmd.svg"
            }
            alt="logo_jobsmd.svg"
          />
          <Image
            width={220}
            height={225}
            className="logo2 img-fluid"
            src="/assets/images/logo_jobsmd.svg"
            alt="header-logo2.png"
          />
        </Link>
        {/* site logo brand */}

        <nav>
          <HeaderMenuContent />
        </nav>
        {/* End .navbar */}
      </div>
    </header>
    // {/* <!-- /.theme-main-menu --> */}
  );
};

export default Header;
