import Header from "../../common/header/dashboard-master/Header";
import SidebarMenu from "../../common/header/dashboard-master/SidebarMenu";
import MobileMenu from "../../common/header/MobileMenu";
import ChangePassword from "./ChangePassword";
import ProfileInfo from "./ProfileInfo";
import SocialMedia from "./SocialMedia";

const index = () => {
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
                        Administrare
                      </button>
                    </div>
                  </div>
                </div>
                {/* End Dashboard Navigation */}

                <div className="col-lg-12 mb10">
                  <div className="breadcrumb_content style2">
                    <h2 className="breadcrumb_title">Profil</h2>
                    {/* <p>We are glad to see you again!</p> */}
                  </div>
                </div>
                {/* End .col */}

                <div className="col-lg-12">
                  <div className="my_dashboard_review">
                    <div className="row">
                      <div className="col-xl-2">
                        <h4>Informatii</h4>
                      </div>
                      <div className="col-xl-10">
                        <ProfileInfo />
                      </div>
                    </div>
                  </div>
                  {/* End prifle info wrapper end */}

                  {/* <div className="my_dashboard_review mt30">
                    <div className="row">
                      <div className="col-xl-2">
                        <h4>Social Media</h4>
                      </div>
                      <div className="col-xl-10">
                        <SocialMedia />
                      </div>
                    </div>
                  </div> */}
                  {/* End .SocialMedia */}

                  {/* <div className="my_dashboard_review mt30">
                    <div className="row">
                      <div className="col-xl-2">
                        <h4>Schimba parola</h4>
                      </div>
                      <div className="col-xl-10">
                        <ChangePassword />
                      </div>
                    </div>
                  </div> */}
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
