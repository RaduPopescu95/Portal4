"use client";

import Image from "next/image";

export default function ListingOneCadruMedical({ partener, oferta }) {
  return (
    <section className="listing-title-area mt85 md-mt0 pb10">
      <div className="container">
        <div className="row mb30">
          <div className="col-lg-7 col-xl-8">
            <div className="single_property_title mt30-767">
              <h2>{partener?.numeUtilizator}</h2>
              {oferta?.titulatura && (
                <h4>
                  {oferta.titulatura} - {oferta.specialitate}
                </h4>
              )}
              {partener.userType != "Doctor" ? (
                <p>{partener?.adresaSediu}</p>
              ) : (
                <p>
                  {partener?.localitate}, {partener?.judet}
                </p>
              )}
            </div>
          </div>
          <div className="col-lg-5 col-xl-4">
            {/* Placeholder for social share buttons */}
          </div>
        </div>
        {/* Images rendering based on count */}
        {partener.userType === "Doctor" ? null : (
          <div className="row">
            <div className={`col-lg-12 col-md-4 col-sm-4 mb-4`}>
              <Image
                width={752} // Fixed width
                height={450} // Fixed height
                src={partener?.imagineOferta?.finalUri}
                alt={`Property Image`}
                layout="responsive" // Makes the image scale responsively within the fixed dimensions
                objectFit="cover" // Covers the area without distorting the image, may crop
                className="img-fluid"
              />
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
