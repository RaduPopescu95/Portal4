"use client";

import { useEffect, useState } from "react";

const CreateList = () => {
  const [profile, setProfile] = useState(null);
  const [fullPrice, setFullPrice] = useState("");
  const [discountedPrice, setDiscountedPrice] = useState("");
  const [discountPercentage, setDiscountPercentage] = useState("");
  const [selectedOfferType, setSelectedOfferType] = useState(
    "Oferta cu discount procentual general"
  ); // Starea pentru select

  // upload profile
  const uploadProfile = (e) => {
    setProfile(e.target.files[0]);
  };

  useEffect(() => {
    if (fullPrice && discountedPrice) {
      const discount = ((fullPrice - discountedPrice) / fullPrice) * 100;
      setDiscountPercentage(discount.toFixed(2)); // Afișează procentul cu două zecimale
    }
  }, [fullPrice, discountedPrice]); // Dependențe: recalculează la schimbarea prețului întreg sau a celui redus

  return (
    <>
      <div className="col-lg-12">
        <div className="my_profile_setting_input form-group">
          <label htmlFor="propertyTitle">Nume doctor</label>
          <input
            type="text"
            className="form-control"
            id="propertyTitle"
            readOnly
            value="Popescu Radu"
          />
        </div>
      </div>

      {/* End .col */}

      <div className="col-lg-12">
        <div className="my_profile_setting_input form-group">
          <label htmlFor="propertyTitle">Denumire oferta</label>
          <input
            type="text"
            className="form-control"
            id="propertyTitle"
            readOnly
            value="Primiti 20% discount la toate produsele noastre"
          />
        </div>
      </div>
      {/* End .col */}

      {/* <div className="col-lg-6 col-xl-6">
        <div className="my_profile_setting_input ui_kit_select_search form-group">
          <label>Type</label>
          <select
            className="selectpicker form-select"
            data-live-search="true"
            data-width="100%"
          >
            <option data-tokens="type1">Type1</option>
            <option data-tokens="Type2">Type2</option>
            <option data-tokens="Type3">Type3</option>
            <option data-tokens="Type4">Type4</option>
            <option data-tokens="Type5">Type5</option>
          </select>
        </div>
      </div> */}
      {/* End .col */}

      <div className="col-lg-12 col-xl-12">
        <div className="my_profile_setting_input form-group">
          <label>Grad de fidelitate</label>
          <div className="row mt-2">
            <div className="col-sm-auto">
              <div className="form-check">
                <input
                  className="form-check-input"
                  type="checkbox"
                  value="Silver"
                  id="fidelityGradeSilver"
                  checked
                  onClick={(e) => e.preventDefault()}
                />
                <label
                  className="form-check-label"
                  htmlFor="fidelityGradeSilver"
                >
                  Silver
                </label>
              </div>
            </div>
            <div className="col-sm-auto">
              <div className="form-check">
                <input
                  className="form-check-input"
                  type="checkbox"
                  value="Gold"
                  id="fidelityGradeGold"
                  onClick={(e) => e.preventDefault()}
                />
                <label className="form-check-label" htmlFor="fidelityGradeGold">
                  Gold
                </label>
              </div>
            </div>
            <div className="col-sm-auto">
              <div className="form-check">
                <input
                  className="form-check-input"
                  type="checkbox"
                  value="Platinum"
                  id="fidelityGradePlatinum"
                  onClick={(e) => e.preventDefault()}
                />
                <label
                  className="form-check-label"
                  htmlFor="fidelityGradePlatinum"
                >
                  Platinum
                </label>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* End .col */}

      <div className="col-lg-12 col-xl-12">
        <div className="my_profile_setting_input ui_kit_select_search form-group">
          <label>Tip oferta</label>
          <select
            className="selectpicker form-select"
            data-live-search="true"
            data-width="100%"
            value={selectedOfferType} // Starea selectată
            onChange={(e) => e.preventDefault()}
          >
            <option data-tokens="Status1">
              Oferta cu discount procentual general
            </option>
            <option data-tokens="Status2">Oferta specifică</option>
          </select>
        </div>
      </div>
      {/* End .col */}

      {/* <div className="col-lg-4 col-xl-4">
        <div className="my_profile_setting_input form-group">
          <label htmlFor="formGroupExamplePrice">Procent</label>
          <input
            type="number"
            className="form-control"
            id="formGroupExamplePrice"
          />
        </div>
      </div> */}
      <div className="col-lg-4 col-xl-4">
        <div className="my_profile_setting_input form-group">
          <label htmlFor="fullPrice">Preț întreg</label>
          <input
            type="number"
            className="form-control"
            id="fullPrice"
            value={fullPrice}
            onChange={(e) => setFullPrice(e.target.value)}
            placeholder="Introdu prețul întreg"
          />
        </div>
      </div>
      {/* End .col */}

      <div className="col-lg-4 col-xl-4">
        <div className="my_profile_setting_input form-group">
          <label htmlFor="discountedPrice">Preț redus</label>
          <input
            type="number"
            className="form-control"
            id="discountedPrice"
            value={discountedPrice}
            onChange={(e) => setDiscountedPrice(e.target.value)}
            placeholder="Introdu prețul redus"
          />
        </div>
      </div>
      {/* End .col */}

      <div className="col-lg-4 col-xl-4">
        <div className="my_profile_setting_input form-group">
          <label htmlFor="discountPercentage">Procent reducere</label>
          <input
            type="text"
            className="form-control"
            id="discountPercentage"
            value={discountPercentage + "%"}
            readOnly
          />
        </div>
      </div>

      <div className="col-lg-6 col-xl-6">
        <div className="my_profile_setting_input form-group">
          <label htmlFor="activationDate">Data de activare</label>
          <input type="date" className="form-control" id="activationDate" />
        </div>
      </div>
      {/* End .col */}

      <div className="col-lg-6 col-xl-6">
        <div className="my_profile_setting_input form-group">
          <label htmlFor="deactivationDate">Data de dezactivare</label>
          <input type="date" className="form-control" id="deactivationDate" />
        </div>
      </div>
      {/* End .col */}

      {/* End .col */}
      {/* <div className="col-lg-4 col-xl-4">
        <div className="my_profile_setting_input form-group">
          <label htmlFor="formGroupExampleArea">Area</label>
          <input
            type="text"
            className="form-control"
            id="formGroupExampleArea"
          />
        </div>
      </div> */}
      {/* End .col */}

      {/* <div className="col-lg-4 col-xl-4">
        <div className="my_profile_setting_input ui_kit_select_search form-group">
          <label>Rooms</label>
          <select
            className="selectpicker form-select"
            data-live-search="true"
            data-width="100%"
          >
            <option data-tokens="Status1">1</option>
            <option data-tokens="Status2">2</option>
            <option data-tokens="Status3">3</option>
            <option data-tokens="Status4">4</option>
            <option data-tokens="Status5">5</option>
            <option data-tokens="Status6">Other</option>
          </select>
        </div>
      </div> */}
      {/* End .col */}

      <div className="col-xl-12">
        <div className="my_profile_setting_input">
          {/* <button className="btn btn1 float-start">Back</button> */}
          <button className="btn btn2 float-end">Salveaza in sistem</button>
        </div>
      </div>
    </>
  );
};

export default CreateList;
