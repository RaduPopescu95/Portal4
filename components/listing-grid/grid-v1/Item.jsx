import React from "react";
import Link from "next/link";
import Image from "next/image";
import { toUrlSlug } from "@/utils/commonUtils"; // Ensure this util is correctly imported for slugification

const FeaturedProperty = ({ item, isGridOrList }) => {
  return (
    <div
      className={`feat_property home7 style4 ${
        isGridOrList ? "d-flex align-items-center" : undefined
      }`}
    >
      <div
        className="thumb"
        // style={{ backgroundImage: item?.gradient?.gradientSelected }}
      >
        {item.tipAnunt === "Clinica" ? (
          <Image
            width={342}
            height={220}
            className="img-whp w-100 h-100 cover"
            src={item?.logo?.finalUri}
            alt="fp1.jpg"
          />
        ) : (
          <Image
            width={342}
            height={220}
            className="img-whp w-100 h-100 cover"
            src={item?.logo?.finalUri}
            alt="fp1.jpg"
          />
        )}

        <div className="thmb_cntnt">
          {/* {item.tipAnunt === "Clinica" && (
            <div
              style={{
                position: "absolute",
                top: "1px",
                left: "10px",
                zIndex: 10,
              }}
            >
              <Image
                src={item?.clinica?.logo?.finalUri}
                alt="Logo"
                width={50}
                height={50}
                className="logo"
              />
            </div>
          )} */}

          {/* {item.tipAnunt === "Clinica" ? (
            <Link
              href={{
                pathname: `/partener/${toUrlSlug(item?.titluOferta)}_${
                  item?.clinica?.id
                }`,
                query: { slug: item?.clinica?.id },
              }}
              className="fp_price"
            >
              {item?.clinica?.denumireBrand}
            </Link>
          ) : ( */}
          <Link
            href={{
              pathname: `/cadru-medical/${toUrlSlug(
                item?.localitate
              )}-${toUrlSlug(item?.titulatura)}`,
              query: { slug: item?.id },
            }}
            className="fp_price"
          >
            {item?.numeUtilizator}
          </Link>
          {/* )} */}
        </div>
      </div>
      {/* {item.distanta ? (
        <div className="details">
          <div className="tc_content">
            <p className="text-thm">{item?.titluOferta}</p>
            <p>
              <span className="flaticon-placeholder"></span>
              {item?.partener?.adresaSediu}
            </p>
            {item?.distanta && <p>{item?.distanta} metri</p>}
          </div>
        </div>
      ) : ( */}
      <div className="details">
        <div className="tc_content">
          <p className="text-thm">
            {item?.titulatura} {`(${item?.specializare})` || ""} -{" "}
            {item?.localitate}
          </p>
          <p>
            <span className="flaticon-placeholder zona-interes mr-5"></span>
            {item?.adresaSediu && `Zona de interes: ${item?.adresaSediu}`}
          </p>
          {item?.distanta && <p>{item?.distanta} metri</p>}
        </div>
      </div>
      {/* )} */}
    </div>
  );
};

export default FeaturedProperty;
