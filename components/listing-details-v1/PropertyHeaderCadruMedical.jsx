import Image from "next/image";
import FormularContact from "./FormularContact";
// import FormularContact from "./FormularContact";

const PropertyHeaderCadruMedical = ({ titulatura, oferta, partener }) => {
  return (
    <div className="feat_property list agency">
      <div className="details ">
        <div className="tc_content pt10 d-flex flex-column justify-content-center align-items-center">
        <Image
  src={partener?.logo?.finalUri}
  alt="Logo"
  width={200}
  height={200}
  objectFit="cover" // imaginea se va adapta complet în container
  className="logo1 profil-image-logo img-fluid"
/>

          {/* <div className="d-flex flex-column justify-content-center align-items-center">
            <h3 className="m-0 fw-bold fz20">{partener?.numeUtilizator}</h3>
          </div> */}
        </div>
      </div>

      {/* <a
        href={`tel:${partener?.telefonUnu}`}
        className="details"
        style={{ cursor: "pointer" }}
      >
        <div className="tc_content">
          <h3>Contactează!</h3>
          <div className="d-flex justify-content-start align-items-center w-100">
            <span className="flaticon-smartphone-call"></span>
            <p className="m0">{partener?.telefon}</p>
          </div>
        </div>
      </a>

      <a
        href={`https://wa.me/4${partener?.telefon}`}
        className="details"
        style={{ cursor: "pointer" }}
        target="_blank"
        rel="noopener noreferrer"
      >
        <div className="tc_content">
          <h3>Contactează pe WhatsApp</h3>
        </div>
      </a> */}

      {/* <FormularContact docCV={oferta?.docsUrls[0]} /> */}
    </div>
  );
};

export default PropertyHeaderCadruMedical;
