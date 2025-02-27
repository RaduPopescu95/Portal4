"use client";

import { useDataWithPaginationAndSearch } from "@/hooks/useDataWithPaginationAndSearch";
import Header from "../../common/header/dashboard-master/Header";
import SidebarMenu from "../../common/header/dashboard-master/SidebarMenu";
import MobileMenu from "../../common/header/MobileMenu";
import Pagination from "../lista-doctori/Pagination";
import SearchData from "../plangeri/SearchData";
import SearchBox from "./SearchBox";

const index = ({ plangeriInregistrate }) => {
  const {
    currentData,
    setCurrentPage,
    totalPages,
    setSearchTerm,
    currentPage,
  } = useDataWithPaginationAndSearch(plangeriInregistrate, "form_name");

  return (
    <>
      {/* <!-- Main Header Nav --> */}
      <Header />

      {/* <!--  Mobile Menu --> */}
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

      {/* <!-- Our Dashbord --> */}
      <section className="our-dashbord dashbord bgc-f7 pb50">
        <div className="container-fluid ovh">
          <div className="row">
            <div className="col-lg-12 maxw100flex-992">
              <div className="row">
                {/* Start Dashboard Navigation */}
                <div className="col-lg-12">
                  <div className="dashboard_navigationbar dn db-1024">
                    <div className="dropdown">
                      <button
                        className="dropbtn"
                        data-bs-toggle="offcanvas"
                        data-bs-target="#DashboardOffcanvasMenu"
                        aria-controls="DashboardOffcanvasMenu"
                      >
                        <i className="fa fa-bars pr10"></i> Navigatie Panou de
                        administrare
                      </button>
                    </div>
                  </div>
                </div>
                {/* End Dashboard Navigation */}
              </div>
              {/* End .row */}

              <div className="row align-items-center">
                <div className="col-md-8 col-lg-8 col-xl-9 mb20">
                  <div className="breadcrumb_content style2 mb30-991">
                    <h2 className="breadcrumb_title">Lista Aplicațiilor</h2>
                    {/* <p>We are glad to see you again!</p> */}
                  </div>
                </div>
                {/* End .col */}
                <div className="col-md-4 col-lg-4 col-xl-3 mb20">
                  <ul className="sasw_list mb0">
                    <li className="search_area">
                      <SearchBox onSearch={setSearchTerm} />
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
                          <SearchData plangeriInregistrate={currentData} />
                        </div>
                      </div>
                      {/* End .packages_table */}
                      <div className="mbp_pagination">
                        <Pagination
                          currentPage={currentPage}
                          totalPages={totalPages}
                          setCurrentPage={setCurrentPage}
                        />
                      </div>
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

export default index;
