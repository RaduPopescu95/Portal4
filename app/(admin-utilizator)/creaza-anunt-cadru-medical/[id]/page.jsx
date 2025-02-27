import {
  handleGetSubcollections,
  handleQueryFirestoreSubcollection,
} from "@/utils/firestoreUtils";
import Header from "@/components/common/header/dashboard-utilizator/Header";
import SidebarMenu from "@/components/common/header/dashboard-utilizator/SidebarMenu";
import MobileMenu from "@/components/common/header/MobileMenu";
import CreateList from "@/components/dashboard-utilizator/creaza-anunt-cadru-medical/CreateList";
import { unstable_noStore as noStore } from "next/cache";
import { isSameOrAfter, isSameOrBefore } from "@/utils/commonUtils";

const index = async ({ params }) => {
  noStore();
  const parts = params.id.split("-");
  const id = parseFloat(parts[0]);
  const partenerId = parts[1];
  const oferta = await handleQueryFirestoreSubcollection(
    "Anunturi",
    "id",
    id,
    "collectionId",
    partenerId
  );

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
                        <i className="fa fa-bars pr10"></i> Navigatie cont
                      </button>
                    </div>
                  </div>
                </div>
                {/* End Dashboard Navigation */}

                <div className="col-lg-12 mb10">
                  <div className="breadcrumb_content style2">
                    <h2 className="breadcrumb_title">
                      {" "}
                      {oferta[0].dataDezactivare
                        ? "Actualizeaza anunt"
                        : "Creaza anunt angajare"}
                    </h2>
                    {/* <p>We are glad to see you again!</p> */}
                  </div>
                </div>
                {/* End .col */}

                <div className="col-lg-12">
                  <div className="my_dashboard_review">
                    <div className="row">
                      <div className="col-lg-10">
                        <h3 className="mb30">
                          {oferta[0].dataDezactivare
                            ? "Actualizeaza anunt"
                            : "Creaza anunt angajare"}
                        </h3>
                      </div>
                      {(() => {
                        const today = new Date();

                        const endDate = new Date(oferta[0].dataDezactivare);

                        const isActive = isSameOrBefore(today, endDate);

                        if (isActive) {
                          return (
                            <div className="col-lg-2">
                              <h3 className="mb30 status_tag badge">
                                Anunt activ
                              </h3>
                            </div>
                          );
                        } else {
                          return (
                            <div className="col-lg-2">
                              <h3 className="mb30 status_tag redbadge">
                                Anunt inactiv
                              </h3>
                            </div>
                          );
                        }
                      })()}

                      <CreateList oferta={oferta[0]} />
                    </div>
                  </div>
                  {/* <div className="my_dashboard_review mt30">
                      <div className="row">
                        <div className="col-lg-12">
                          <h3 className="mb30">Location</h3>
                        </div>
  
                        <LocationField />
                      </div>
                    </div>
                    <div className="my_dashboard_review mt30">
                      <div className="col-lg-12">
                        <h3 className="mb30">Detailed Information</h3>
                      </div>
                      <DetailedInfo />
                    </div>
                    <div className="my_dashboard_review mt30">
                      <div className="col-lg-12">
                        <h3 className="mb30">Property media</h3>
                      </div>
                      <PropertyMediaUploader />
                    </div>
                    <div className="my_dashboard_review mt30">
                      <div className="col-lg-12">
                        <h3 className="mb30">Floor Plans</h3>
                        <button className="btn admore_btn mb30">Add More</button>
                      </div>
                      <FloorPlans />
                    </div> */}
                </div>
                {/* End .col */}
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
