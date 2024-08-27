"use client";

import { useState } from "react";

import Image from "next/image";

const LogoUpload = ({
  singleImage,
  deleteLogo,
  logoImg,
  isVerifica,
  isNewImage,
  text,
}) => {
  return (
    <div className="row">
      <div className="col-lg-12">
        <ul className="mb-0">
          {logoImg.length > 0
            ? logoImg?.map((item, index) => (
                <li key={index} className="list-inline-item">
                  <div className="portfolio_item">
                    {!isNewImage ? (
                      <Image
                        width={200}
                        height={200}
                        className="img-fluid cover"
                        src={item.finalUri}
                        alt="fp1.jpg"
                      />
                    ) : (
                      <Image
                        width={200}
                        height={200}
                        className="img-fluid cover"
                        src={URL.createObjectURL(item)}
                        alt="fp1.jpg"
                      />
                    )}
                    {
                    isVerifica
                    ?
                    null
                    :
                    <div
                      className="edu_stats_list"
                      data-bs-toggle="tooltip"
                      data-bs-placement="top"
                      title="Delete"
                      data-original-title="Delete"
                    >
                      <a onClick={() => deleteLogo()}>
                        <span className="flaticon-garbage"></span>
                      </a>
                    </div>
                    }
                  </div>
                </li>
              ))
            : undefined}

          {/* End li */}
        </ul>
      </div>
      {/* End .col */}

      {logoImg.length === 0 && (
        <div className="col-lg-12">
          <div className="portfolio_upload">
            <input
              type="file"
              onChange={singleImage}
              multiple
              accept="image/png, image/gif, image/jpeg"
            />
            <div className="icon">
              <span className="flaticon-download"></span>
            </div>
            <p>{text}</p>
          </div>
        </div>
      )}
      {/* End .col */}
    </div>
  );
};

export default LogoUpload;
