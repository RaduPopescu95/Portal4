import "photoswipe/dist/photoswipe.css";
import CopyrightFooter from "@/components/common/footer/CopyrightFooter";
import Footer from "@/components/common/footer/Footer";
import Header from "@/components/common/header/DefaultHeader";
import MobileMenu from "@/components/common/header/MobileMenu";
import PopupSignInUp from "@/components/common/PopupSignInUp";
import properties from "@/data/properties";
import DetailsContent from "@/components/listing-details-v1/DetailsContentCadruMedical";
import Sidebar from "@/components/listing-details-v1/Sidebar";
import ListingOne from "@/components/listing-single/ListingOneCadruMedical";
import TabDetailsContent from "@/components/agency-details/TabDetailsContent";
import {
  handleGetFirestore,
  handleQueryFirestore,
  handleQueryFirestoreSubcollection,
} from "@/utils/firestoreUtils";
import PropertyHeaderCadruMedical from "@/components/listing-details-v1/PropertyHeaderCadruMedical";
import { unstable_noStore as noStore } from "next/cache";

const ListingDynamicDetailsV1 = async ({ params, searchParams }) => {
  noStore();
  console.log("searchParamssssswwww", params);
  if (params.id === "favicon.ico") {
    return null; // Returnează null sau orice alt component care indică că pagina nu trebuie să proceseze acest id.
  }
  const id = params.id;

  const number = parseFloat(searchParams.slug);

  let partenerId = number;
  console.log("searchParamssssswwwwssss", searchParams);
  console.log("id.parts..", partenerId);
  let partener = await handleQueryFirestore("UsersUber", "id", partenerId);
  console.log("id.parts..", partener);

  let oferte = await handleQueryFirestoreSubcollection(
    `Anunturi`,
    "collectionId",
    partener[0].user_uid
  );

  console.log("test oferte...ss", oferte);

  return (
    <>
      {/* <!-- Main Header Nav --> */}
      <Header />

      {/* <!--  Mobile Menu --> */}
      <MobileMenu />

      {/* <!-- Modal --> */}
      <PopupSignInUp />

      {/* <!-- Listing Single Property --> */}
      <ListingOne partener={partener[0]} oferta={oferte[0]} />
      {/* <!-- Agent Single Grid View --> */}
      <section className="our-agent-single bgc-f7 pb30-991">
        <div className="container">
          <div className="row">
            <div className="col-lg-12 p-0">
              <PropertyHeaderCadruMedical
                partener={partener[0]}
                oferta={partener[0]}
                titulatura={partener[0].titulatura}
              />
            </div>
            <div className="col-md-12 col-lg-12">
              <DetailsContent
                partener={partener[0]}
                oferta={partener[0]}
                titulatura={partener[0].titulatura}
              />
            </div>

            {/* End details content .col-lg-8 */}

            {/* <div className="col-lg-4 col-xl-4">
              <Sidebar />
            </div> */}
            {/* End sidebar content .col-lg-4 */}
          </div>
          {/* End .row */}
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

export default ListingDynamicDetailsV1;
