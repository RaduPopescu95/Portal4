import Image from "next/image";
import CallToAction from "../common/CallToAction";
import CopyrightFooter from "../common/footer/CopyrightFooter";
import Footer from "../common/footer/Footer";
import Header from "../common/header/DefaultHeader";
import MobileMenu from "../common/header/MobileMenu";
import PopupSignInUp from "../common/PopupSignInUp";
import AddressSidebar from "./AddressSidebar";
import BreadCrumbBanner from "./BreadCrumbBanner";
import Form from "./Form";

const index = () => {
  return (
    <>
      {/* <!-- Main Header Nav --> */}
      <Header />

      {/* <!--  Mobile Menu --> */}
      <MobileMenu />

      {/* <!-- Modal --> */}
      <PopupSignInUp />

      {/* <!-- Inner Page Breadcrumb --> */}
      <BreadCrumbBanner />

      {/* <!-- Our Contact --> */}
      <section className="our-contact pb0 bgc-f7">
        <div className="container">
          <div className="row">
            <div className="col-lg-12 col-xl-12">
              <div className="form_grid">
                <h4 className="mb5">Formular de plângeri</h4>
                <p>
                  Acest formular este destinat pentru înregistrarea plângerilor
                  legate de partenerii noștri care nu au răspuns prompt sau nu
                  au respectat contractul. Te rugăm să completezi câmpurile de
                  mai jos cu informațiile relevante.
                </p>
                <p>
                  Prin trimiterea acestui formular, ești de acord cu prelucrarea
                  datelor tale personale în conformitate cu{" "}
                  <a href="/politica-de-confidentialitate">
                    Politica noastră de Confidențialitate
                  </a>
                  .
                </p>

                <Form />
              </div>
            </div>
            {/* End .col */}

            {/* <div className="col-lg-5 col-xl-4">
              <AddressSidebar />
            </div> */}
          </div>
          {/* End .row */}
        </div>
        {/* End .container */}

        <div className="container-fluid p0 mt50">
          <div className="row">
            <div className="col-lg-12">
              <div id="map-canvas">
                <div className="gmap_canvas pe-none">
                  <iframe
                    title="map"
                    className="gmap_iframe"
                    src="https://www.google.com/maps/embed?pb=!1m14!1m12!1m3!1d22595.777846929217!2d25.447559!3d44.930490!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!5e0!3m2!1sen!2sro!4v[timestamp-ul-tau-aici]!5m2!1sen!2sro"
                  ></iframe>
                  {/* End iframe */}

                  <Image
                    width={32}
                    height={50}
                    className="location-finder"
                    src="/assets/images/location.png"
                    alt="location"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* <!-- Start Call to Action --> */}
      <section className="start-partners bgc-thm pt50 pb50">
        <div className="container">
          <CallToAction />
        </div>
      </section>

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
