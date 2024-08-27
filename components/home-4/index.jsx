"use client";

import Blogs from "../common/Blogs";
import GlobalHeroFilter from "../common/GlobalHeroFilter";
import MobileMenu from "../common/header/MobileMenu";
import FeaturedProperties from "./FeaturedProperties";
import Header from "./Header";
import HeroSlider from "./HeroSlider";
import LookingItem from "./LookingItem";
import Team from "./Team";
import CopyrightFooter from "../common/footer/CopyrightFooter";
import Footer from "../common/footer/Footer";
import PopupSignInUp from "../common/PopupSignInUp";
import { Suspense, lazy } from "react";

import FeaturedItemHome from "../listing-grid/grid-v1/FeaturedItemHome";
import ListaAnunturiClinici from "../listing-grid/grid-v1/ListaAnunturiClinici";
import { useAuth } from "@/context/AuthContext";
import SkeletonLoader from "../common/SkeletonLoader";

const FindProperties = lazy(() => import("./FindProperties"));

const index = ({ params }) => {
  const {
    currentUser,
    setSearchQueryPateneri,
    searchQueryParteneri,
    userData,
  } = useAuth();
  return (
    <>
      {/* <!-- Main Header Nav --> */}
      <Header />

      {/* <!--  Mobile Menu --> */}
      <MobileMenu />

      {/* <!-- Modal --> */}
      <PopupSignInUp />

      {/* <!-- 4th Home Slider --> */}
      <div className="home-four ">
        <div className="container-fluid p0 ">
          <div className="main-banner-wrapper">
            <div className="arrow-style-2 banner-style-one ">
              <HeroSlider />
            </div>
          </div>
          {/* <!-- /.main-banner-wrapper --> */}
        </div>
        {/* End .container-fluid */}

        <div className="container home_iconbox_container suplimentar-container-filter">
          <div className="row posr">
            <div className="col-lg-12">
              <div className="home_content home4">
                <div className="home-text text-center">
                  <h2 className="fz55">
                    Portalul potrivit pentru nevoile tale
                  </h2>
                  <p className="fz18 color-white">
                    Gaseste usor operatorul economic cel mai apropiata de tine
                  </p>
                </div>
                <GlobalHeroFilter className="home4" userData={userData} />
              </div>
            </div>
          </div>
          {/* <div className="row">
            <div className="col-lg-12">
              <h4 className="text-center color-white fw600 mb25 mb0-520">
                What are you looking for?
              </h4>
              <ul className="home4_iconbox mb0">
                <LookingItem />
              </ul>
            </div>
          </div> */}
        </div>
      </div>

      {userData?.userType === "Doctor" ? null : (
        <section className="our-listing bgc-f7 pb30-991 md-mt0 pt-0 ">
          <div className="container">
            <div className="row pt30">
              <div className="col-lg-6 offset-lg-3">
                <div className="main-title text-center mb40">
                  <h2>Cadre medicale în apropierea ta</h2>
                </div>
              </div>
            </div>
            <div className="row">
              {/* <div className="col-lg-6">
              <BreadCrumb2 titlu={"Clinici apropiați de tine"} />
            </div> */}
              {/* End .col */}

              {/* <div className="col-lg-6 position-relative">
              <div className="listing_list_style mb20-xsd tal-991">
                <GridListButton />
              </div>

              <div className="dn db-991 mt30 mb0">
                <ShowFilter />
              </div>
            </div> */}
              {/* End .col filter grid list */}
            </div>
            {/* End Page Breadcrumb and Grid,List and filter Button */}

            <div className="row">
              <div className="col-md-12 col-lg-12">
                {/* <div className="grid_list_search_result ">
                <div className="row align-items-center">
                  <FilterTopBar />
                </div>
              </div> */}
                {/* End .row */}

                <div className="row">
                  <FeaturedItemHome params={params} />
                </div>
                {/* End .row */}
              </div>
              {/* End  page conent */}
              {/* <div className="col-lg-4 col-xl-4">
              <div className="sidebar-listing-wrapper">
                <SidebarListing params={params} />
              </div>

              <div
                className="offcanvas offcanvas-start offcanvas-listing-sidebar"
                tabIndex="-1"
                id="sidebarListing"
              >
                <div className="offcanvas-header">
                  <h5 className="offcanvas-title">Advanced Search</h5>
                  <button
                    type="button"
                    className="btn-close text-reset"
                    data-bs-dismiss="offcanvas"
                    aria-label="Close"
                  ></button>
                </div>

                <div className="offcanvas-body">
                  <SidebarListing />
                </div>
              </div>
            </div> */}
              {/* End sidebar conent */}
            </div>
            {/* End .row */}
          </div>
        </section>
      )}

      {/* <!-- Property Cities --> */}
      {/* <section id="best-property" className="best-property bgc-f7">
        <div className="container ovh">
          <div className="row">
            <div className="col-lg-6 offset-lg-3">
              <div className="main-title text-center mb40">
                <h2>Anunturi de angajare în apropierea ta</h2>
              </div>
            </div>
          </div>
          <div className="row">
            <div className="col-lg-12">
              <div className="best_property_slider gutter-x15">
                <FeaturedProperties />
              </div>
            </div>
          </div>
        </div>
      </section> */}

      {/* <!-- Property Cities --> */}
      {/* <section id="property-city" className="property-city pb30">
        <div className="container">
          <div className="row">
            <div className="col-lg-6 offset-lg-3">
              <div className="main-title text-center">
                <h2>Gaseste cadre medicale în aceste orase</h2>
              </div>
            </div>
          </div>
          <div className="row">
            <Suspense fallback={<SkeletonLoader />}>
              <FindProperties />
            </Suspense>
          </div>
        </div>
      </section> */}

      {/* <!-- Our Blog --> */}
      {/* <section className="our-blog bgc-f7 pb30">
        <div className="container">
          <div className="row">
            <div className="col-lg-6 offset-lg-3">
              <div className="main-title text-center">
                <h2>Articole</h2>
              </div>
            </div>
          </div>
          <div className="row">
            <Blogs />
          </div>
        </div>
      </section> */}

      {/* <!-- Our Team --> */}
      {/* <section className="our-team">
        <div className="container">
          <div className="row">
            <div className="col-lg-6 offset-lg-3">
              <div className="main-title text-center">
                <h2>Our Team</h2>
                <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit.</p>
              </div>
            </div>
          </div>
          <div className="row">
            <div className="col-lg-12">
              <div className="team_slider gutter-x15">
                <Team />
              </div>
            </div>
          </div>
        </div>
      </section> */}

      {/* <!-- Our Footer --> */}
      <section className="footer_one">
        <div className="container">
          <div className="row">
            <Footer />
          </div>
        </div>
      </section>

      {/* <!-- Our Footer Bottom Area --> */}
      {/* <section className="footer_middle_area pt40 pb40">
        <div className="container">
          <CopyrightFooter />
        </div>
      </section> */}
    </>
  );
};

export default index;
