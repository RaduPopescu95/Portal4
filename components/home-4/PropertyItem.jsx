import { toUrlSlug } from "@/utils/commonUtils";
import Image from "next/image";
import Link from "next/link";
import React from "react";

const PropertyItem = ({ item, isActive }) => {
  return (
    <div className="item" key={item?.id}>
      <div className="feat_property home3">
        <div
          className="thumb"
          style={{ backgroundImage: item?.gradient?.gradientSelected }}
        >
          <Image
            // width={343}
            // height={220}
            className="img-fluid"
            src={item?.images?.imgs[0]?.finalUri}
            alt="fp1.jpg"
            layout="fill" // Important for Next.js Image to use the parent dimensions
          />
          {/* <Image
              onLoad={() => setImageLoaded(true)}
              onError={() => setImageLoaded(false)}
              className="img-fluid"
              src={item?.images?.imgs[0]?.finalUri}
              alt="Property Image"
              layout="fill" // Important for Next.js Image to use the parent dimensions
            /> */}
          <div className="thmb_cntnt">
            <div
              style={{
                position: "absolute",
                top: "1px",
                left: "10px",
                zIndex: 10,
              }}
            >
              <Image
                src={item?.logo?.finalUri}
                alt="Logo"
                width={50}
                height={50}
                className="logo"
              />
            </div>

            {/* <ul className="icon mb0">
          <li className="list-inline-item">
            <a href="#">
              <span className="flaticon-transfer-1"></span>
            </a>
          </li>
          <li className="list-inline-item">
            <a href="#">
              <span className="flaticon-heart"></span>
            </a>
          </li>
        </ul> */}

            <Link
              href={`/partener/${item?.id}-${toUrlSlug(item?.denumireBrand)}`}
              className="fp_price"
            >
              {item?.denumireBrand}
            </Link>
          </div>
        </div>
        <div className="details">
          <div className="tc_content">
            {/* <p className="text-thm">{item?.type}</p> */}
            {/* <h4>
            <Link href={`/partener/${item?.id}`}>3 oferte</Link>
          </h4> */}
            <p>
              <span className="flaticon-placeholder"></span>
              {item?.adresaSediu}
            </p>
            {item?.distanta && <p>{item?.distanta} metri</p>}

            {/* <ul className="prop_details mb0">
          {item?.itemDetails.map((val, i) => (
            <li className="list-inline-item" key={i}>
              <a href="#">
                {val.name}: {val.number}
              </a>
            </li>
          ))}
        </ul> */}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PropertyItem;
