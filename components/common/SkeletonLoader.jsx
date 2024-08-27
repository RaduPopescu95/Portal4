// components/common/SkeletonLoader.js
import React from "react";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";

const SkeletonLoader = () => {
  return (
    <>
      {Array(3)
        .fill()
        .map((_, index) => (
          <div className="col-sm-6 col-lg-4 col-xl-4" key={index}>
            <div className="properti_city style2 d-block">
              <div className="thumb">
                <Skeleton width={342} height={241} />
              </div>
              <div className="details">
                <h4>
                  <Skeleton width={150} />
                </h4>
                <p>
                  <Skeleton width={100} />
                </p>
              </div>
            </div>
          </div>
        ))}
    </>
  );
};

export default SkeletonLoader;
