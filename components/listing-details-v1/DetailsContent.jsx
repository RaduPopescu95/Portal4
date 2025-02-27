"use client";

import { useState } from "react";
import TabDetailsContent from "../agency-details/TabDetailsContent";
import Comments from "../blog-details/Comments";
import Ratings from "../blog-details/Ratings";
import ReviewBox from "../blog-details/ReviewBox";
import AdditionalDetails from "../common/listing-details/AdditionalDetails";
import Attachments from "../common/listing-details/Attachments";
import CerintePost from "../common/listing-details/CerintePost";
import FloorPlans from "../common/listing-details/FloorPlans";
import PropertyDescriptions from "../common/listing-details/PropertyDescriptions";
import PropertyDetails from "../common/listing-details/PropertyDetails";
import PropertyFeatures from "../common/listing-details/PropertyFeatures";
import PropertyItem from "../common/listing-details/PropertyItem";
import PropertyLocation from "../common/listing-details/PropertyLocation";
import PropertyVideo from "../common/listing-details/PropertyVideo";
import WalkScore from "../common/listing-details/WalkScore";
import WhatsNearby from "../common/listing-details/WhatsNearby";

const isMobile =
  /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
    navigator.userAgent
  );

const DetailsContent = ({ partener, oferta, titluOferta }) => {
  console.log("oferta...primita...", oferta);
  console.log("oferta...primita...partener", partener);
  const handleNavigare = () => {
    if (partener && partener.coordonate) {
      const { lat, lng } = partener.coordonate;
      // Creăm URL-ul pentru Google Maps
      const googleMapsUrl = `https://www.google.com/maps/search/?api=1&query=${lat},${lng}`;
      // Creăm URL-ul pentru Waze
      const wazeUrl = `https://waze.com/ul?ll=${lat},${lng}&navigate=yes`;

      // Detectăm dacă dispozitivul este mobil

      if (isMobile) {
        // Încercăm să deschidem Waze, dacă nu este instalat, browserul va reveni la Google Maps
        window.open(wazeUrl, "_blank");
      } else {
        // Pentru PC-uri, deschidem Google Maps
        window.open(googleMapsUrl, "_blank");
      }
    } else {
      console.log("Coordonatele nu sunt disponibile");
    }
  };

  return (
    <>
      <div className="listing_single_description">
        {/* <div className="lsd_list">
          <PropertyItem />
        </div> */}
        {/* End .lsd_list */}

        <h4 className="mb30">Desriere Post</h4>
        <PropertyDescriptions oferta={oferta} />
      </div>
      <div className="listing_single_description mt30">
        {/* <div className="lsd_list">
          <PropertyItem />
        </div> */}
        {/* End .lsd_list */}

        <h4 className="mb30">Cerinte Post</h4>
        <CerintePost oferta={oferta} />
      </div>
      {/* End .listing_single_description */}

      {/* <div className="additional_details">
        <div className="row">
          <div className="col-lg-12">
            <h4 className="mb15">Property Details</h4>
          </div>
          <PropertyDetails />
        </div>
      </div> */}
      {/* End .additional_details */}

      {/* <div className="additional_details">
        <div className="row">
          <div className="col-lg-12">
            <h4 className="mb15">Additional details</h4>
          </div>
          <AdditionalDetails />
        </div>
      </div> */}
      {/* End .additional_details */}

      {/* <div className="property_attachment_area">
        <h4 className="mb30">Property Attachments</h4>
        <div className="iba_container style2">
          <Attachments />
        </div>
      </div> */}
      {/* End .property_attachment_area */}

      {/* <div className="application_statics mt30">
        <div className="row">
          <div className="col-lg-12">
            <h4 className="mb10">Features</h4>
          </div>


          <PropertyFeatures />
        </div>
      </div> */}
      {/* End .feature_area */}

      <div className="application_statics mt30">
        <h4 className="mb30">
          Locatie{" "}
          <small className={`${!isMobile ? "float-end" : null}`}>
            {partener?.adresaSediu}
          </small>
        </h4>
        <div className="property_video p0">
          <PropertyLocation coordonate={partener?.coordonate} />
        </div>
        <div className="search_option_button mt20">
          <button
            onClick={handleNavigare}
            type="submit"
            className="btn btn-thm"
          >
            Navighează la partener
          </button>
        </div>
      </div>
      {/* End .location_area */}

      {/* <div className="application_statics mt30">
        <h4 className="mb30">Floor plans</h4>
        <div className="faq_according style2">
          <FloorPlans />
        </div>
      </div> */}
      {/* End .floor_plane */}

      {/* <div className="shop_single_tab_content style2 mt30">
        <PropertyVideo />
      </div> */}
      {/* End property-video  */}

      {/* <div className="walkscore_area mt30">
        <WalkScore />
      </div> */}
      {/* End walkscore_area */}

      {/* <div className="whats_nearby mt30 row">
        <WhatsNearby oferta={oferta} isMobile={isMobile} />
      </div> */}

      {/* End what's nearby area */}

      <div className="product_single_content">
        <div className="mbp_pagination_comments mt30">
          {/* <div className="total_review">
            <h4>896 Reviews</h4>
            <ul className="review_star_list mb0 pl10">
              <Ratings />
            </ul>
            <a className="tr_outoff pl10" href="#">
              ( 4.5 out of 5 )
            </a>
            <a className="write_review float-end fn-xsd" href="#">
              Write a Review
            </a>
          </div>

          <Comments />
          <div className="custom_hr"></div> */}

          <div className="mbp_comment_form style2">
            <h4>Aplica pentru post</h4>
            {/* <ul className="review_star">
              <li className="list-inline-item">
                <span className="sspd_review">
                  <ul>
                    <Ratings />
                  </ul>
                </span>
              </li>
              <li className="list-inline-item pr15">
                <p>Your Rating & Review</p>
              </li>
            </ul> */}
            <ReviewBox
              partener={partener}
              oferta={oferta}
              titluOferta={titluOferta}
            />
          </div>
        </div>
      </div>
      {/* End review and comment area area */}
    </>
  );
};

export default DetailsContent;
