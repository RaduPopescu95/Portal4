"use client";

import CommonLoader from "@/components/common/CommonLoader";
import { useAuth } from "@/context/AuthContext";
import {
  handleQueryFirestoreSubcollection,
  handleUpdateFirestore,
} from "@/utils/firestoreUtils";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

const ProfileInfo = ({ partener: part }) => {
  const [profile, setProfile] = useState(null);
  const [localitati, setLocalitati] = useState([]);
  const { judete } = useAuth();
  const router = useRouter();

  const handleToggle = async () => {
    console.log(part);

    const newStatus = part.statusCont === "Activ" ? "Inactiv" : "Activ";
    let data = {
      statusCont: newStatus,
    };
    await handleUpdateFirestore(`UsersUber/${part.user_uid}`, data).then(() => {
      router.refresh();
    });
  };

  const handleGetLocalitatiJudet = async () => {
    const judetSelectedName = part?.judet; // Numele județului selectat, un string
    console.log("judetSelectedName...", judetSelectedName);

    // Găsește obiectul județului selectat bazat pe `judet`
    console.log("judete...", judete);
    const judetSelected = judete.find(
      (judet) => judet.judet === judetSelectedName
    );

    console.log("judetSelected...", judetSelected);
    if (judetSelected) {
      try {
        // Utilizăm judet pentru a interoga Firestore
        const localitatiFromFirestore = await handleQueryFirestoreSubcollection(
          "Localitati",
          "judet",
          judetSelected.judet
        );
        console.log("localitatiFromFirestore...", localitatiFromFirestore);
        // Presupunem că localitatiFromFirestore este array-ul corect al localităților
        setLocalitati(localitatiFromFirestore);
      } catch (error) {
        console.error("Failed to fetch locations:", error);
        setLocalitati([]); // Resetează localitățile în caz de eroare
      }
    } else {
      // Dacă nu găsim județul selectat, resetăm localitățile
      setLocalitati([]);
    }
  };

  useEffect(() => {
    handleGetLocalitatiJudet();
  }, []);

  return (
    <div className="row">
      <div className="col-lg-6 col-xl-6">
        <div className="my_profile_setting_input form-group">
          <label htmlFor="formGroupExampleInput1">Denumire Brand</label>
          <input
            type="text"
            className="form-control"
            id="formGroupExampleInput1"
            value={part?.denumireBrand}
            readOnly
          />
        </div>
      </div>
      {/* End .col */}

      <div className="col-lg-6 col-xl-6">
        <div className="my_profile_setting_input form-group">
          <label htmlFor="formGroupExampleEmail">Email</label>
          <input
            type="email"
            className="form-control"
            id="formGroupExampleEmail"
            value={part?.email}
            readOnly
          />
        </div>
      </div>
      {/* End .col */}

      <div className="col-lg-6 col-xl-6">
        <div className="my_profile_setting_input form-group">
          <label htmlFor="formGroupExampleInput3">
            Nume si prenume persoana de contact
          </label>
          <input
            type="text"
            className="form-control"
            id="formGroupExampleInput3"
            value={part?.numeContact}
            readOnly
          />
        </div>
      </div>
      {/* End .col */}

      <div className="col-lg-6 col-xl-6">
        <div className="my_profile_setting_input form-group">
          <label htmlFor="formGroupExampleInput4">
            Numar de telefon persoana de contact
          </label>
          <input
            type="text"
            className="form-control"
            id="formGroupExampleInput4"
            value={part?.telefonContact}
            onChange={(e) => setTelefonContact(e.target.value)}
            readOnly
          />
        </div>
      </div>
      {/* End .col */}

      <div className="col-lg-6 col-xl-6">
        <div className="my_profile_setting_input ui_kit_select_search form-group">
          <label>Judet</label>
          <select
            className="selectpicker form-select"
            data-live-search="true"
            data-width="100%"
            value={part?.judet}
            disabled
          >
            {judete &&
              judete.map((judet, index) => (
                <option key={index} value={judet.judet}>
                  {judet.judet}
                </option>
              ))}
          </select>
        </div>
      </div>
      {/* End .col */}

      <div className="col-lg-6 col-xl-6">
        <div className="my_profile_setting_input ui_kit_select_search form-group">
          <label>Localitate</label>
          <select
            className="selectpicker form-select"
            data-live-search="true"
            data-width="100%"
            value={part?.localitate}
            disabled
          >
            {localitati.map((location, index) => (
              <option key={index} value={location.localitate}>
                {location.localitate}
              </option>
            ))}
          </select>
        </div>
      </div>
      {/* End .col */}

      <div className="col-lg-6 col-xl-6">
        <div className="my_profile_setting_input form-group">
          <label htmlFor="formGroupExampleInput7">CUI</label>
          <input
            type="text"
            className="form-control"
            id="formGroupExampleInput7"
            value={part?.cui}
            readOnly
          />
        </div>
      </div>
      {/* End .col */}

      <div className="col-lg-6 col-xl-6">
        <div className="my_profile_setting_input ui_kit_select_search form-group">
          <label>Categorie</label>
          <select
            className="selectpicker form-select"
            data-live-search="true"
            data-width="100%"
            value={part?.categorie}
            disabled
          >
            <option data-tokens="Autovehicule">Autovehicule</option>
            <option data-tokens="Servicii">Servicii</option>
            <option data-tokens="Cafenele">Cafenele</option>
            <option data-tokens="Restaurante">Restaurante</option>
            <option data-tokens="Hoteluri">Hoteluri</option>
            <option data-tokens="Imobiliare">Imobiliare</option>
            <option data-tokens="Altele">Altele</option>
          </select>
        </div>
      </div>
      {/* End .col */}

      <div className="col-xl-12">
        <div className="my_profile_setting_textarea">
          <label htmlFor="exampleFormControlTextarea1">
            Descriere partener
          </label>
          <textarea
            className="form-control"
            id="exampleFormControlTextarea1"
            rows="7"
            value={part?.descriere}
            readOnly
          ></textarea>
        </div>
      </div>
      {/* End .col */}

      {/* <div className="col-lg-6 col-xl-6">
              <div className="my_profile_setting_input form-group">
                  <label htmlFor="formGroupExampleInput11">Language</label>
                  <input
                      type="text"
                      className="form-control"
                      id="formGroupExampleInput11"
                  />
              </div>
          </div> */}
      {/* End .col */}

      {/* <div className="col-lg-6 col-xl-6">
              <div className="my_profile_setting_input form-group">
                  <label htmlFor="formGroupExampleInput12">
                      Company Name
                  </label>
                  <input
                      type="text"
                      className="form-control"
                      id="formGroupExampleInput12"
                  />
              </div>
          </div> */}
      {/* End .col */}

      <div className="col-lg-6 col-xl-6">
        <div className="my_profile_setting_input form-group">
          <label htmlFor="formGroupExampleInput7">Adresa Sediu</label>
          <input
            type="text"
            className="form-control"
            id="formGroupExampleInput7"
            value={part?.adresaSediu}
            readOnly
          />
        </div>
      </div>
      {/* End .col */}

      <div className="col-xl-12 text-right mt-4">
        <div className="my_profile_setting_input">
          {/* <button className="btn btn1">Actualizeaza Profil</button> */}
          <button className="btn btn2" onClick={handleToggle}>
            {part.statusCont === "Activ"
              ? "Dezactiveaza Cont"
              : "Activeaza Cont"}
          </button>
        </div>
      </div>

      {/* End .col */}

      {/* <div className="col-xl-12">
              <div className="my_profile_setting_textarea">
                  <label htmlFor="exampleFormControlTextarea1">
                      About me
                  </label>
                  <textarea
                      className="form-control"
                      id="exampleFormControlTextarea1"
                      rows="7"
                  ></textarea>
              </div>
          </div> */}
      {/* End .col */}

      {/* <div className="col-xl-12 text-right mt-4">
        <div className="my_profile_setting_input">
          <button className="btn btn1">Actualizeaza Profil</button>
          <button className="btn btn2" onClick={handleUpdateProfile}>
            Actualizeaza Profil
          </button>
        </div>
      </div> */}
      {/* End .col */}
    </div>
  );
};

export default ProfileInfo;
