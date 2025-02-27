"use client";

import Image from "next/image";

export default function ListingOne({ partener }) {
  console.log("partener...", partener);
  return (
    <section className="listing-title-area mt85 md-mt0">
      <div className="container">
        <div className="row mb30">
          <div className="col-lg-7 col-xl-8">
            <div className="single_property_title mt30-767">
              <h2>{partener?.denumireBrand}</h2>
              <p>{partener?.adresaSediu}</p>
            </div>
          </div>
          <div className="col-lg-5 col-xl-4">
            {/* Placeholder for social share buttons */}
          </div>
        </div>
        {/* Images rendering based on count */}
        <div className="row">
          {partener?.images?.imgs.map((val, i) => (
            <div
              key={i}
              className={`col-lg-${
                12 / Math.min(partener.images.imgs.length, 3)
              } col-md-4 col-sm-4 mb-4`}
            >
              <Image
                width={752} // Fixed width
                height={450} // Fixed height
                src={val.finalUri}
                alt={`Property Image ${i + 1}`}
                layout="responsive" // Makes the image scale responsively within the fixed dimensions
                objectFit="cover" // Covers the area without distorting the image, may crop
                className="img-fluid"
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
