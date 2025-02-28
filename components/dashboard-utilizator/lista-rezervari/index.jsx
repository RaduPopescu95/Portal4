// Index.jsx
import { useState } from "react";
import Header from "../../common/header/dashboard-utilizator/Header";
import SidebarMenu from "../../common/header/dashboard-utilizator/SidebarMenu";
import MobileMenu from "../../common/header/MobileMenu";
import SearchBox from "./SearchBox";
import ReservationsData from "./ReservationsData";

const Index = ({ rezervari }) => {
  // Starea pentru textul din SearchBox
  const [searchQuery, setSearchQuery] = useState("");

  return (
    <>
      <Header />
      <MobileMenu />

      <div className="dashboard_sidebar_menu">
        <div
          className="offcanvas offcanvas-dashboard offcanvas-start"
          tabIndex="-1"
          id="DashboardOffcanvasMenu"
          data-bs-scroll="true"
        >
          <SidebarMenu />
        </div>
      </div>
      {/* End sidebar_menu */}

      <section className="our-dashbord dashbord bgc-f7 pb50">
        <div className="container-fluid ovh">
          <div className="row">
            <div className="col-lg-12 maxw100flex-992">
              <div className="row">
                <div className="col-lg-12">
                  <div className="dashboard_navigationbar dn db-1024">
                    <div className="dropdown">
                      <button
                        className="dropbtn"
                        data-bs-toggle="offcanvas"
                        data-bs-target="#DashboardOffcanvasMenu"
                        aria-controls="DashboardOffcanvasMenu"
                      >
                        <i className="fa fa-bars pr10"></i> Navigatie Panou de administrare
                      </button>
                    </div>
                  </div>
                </div>
              </div>
              {/* End .row */}

              <div className="row align-items-center">
                <div className="col-md-8 col-lg-8 col-xl-9 mb20">
                  <div className="breadcrumb_content style2 mb30-991">
                    <h2 className="breadcrumb_title">Lista Rezervărilor</h2>
                  </div>
                </div>
                {/* End .col */}
                <div className="col-md-4 col-lg-4 col-xl-3 mb20">
                  <ul className="sasw_list mb0">
                    <li className="search_area">
                      {/* Transmitem searchQuery și setSearchQuery către SearchBox */}
                      <SearchBox
                        searchQuery={searchQuery}
                        setSearchQuery={setSearchQuery}
                      />
                    </li>
                  </ul>
                </div>
                {/* End .col */}
              </div>
              {/* End .row */}

              <div className="row">
                <div className="col-lg-12">
                  <div className="my_dashboard_review mb40">
                    <div className="col-lg-12">
                      <div className="savesearched_table">
                        <div className="table-responsive mt0">
                          {/*
                            Transmitem searchQuery și către ReservationsData
                            pentru a face filtrarea
                          */}
                          <ReservationsData
                            rezervari={rezervari}
                            searchQuery={searchQuery}
                          />
                        </div>
                      </div>
                      {/* End .savesearched_table */}
                    </div>
                  </div>
                </div>
              </div>
              {/* End .row */}
            </div>
            {/* End .col */}
          </div>
        </div>
      </section>
    </>
  );
};

export default Index;
