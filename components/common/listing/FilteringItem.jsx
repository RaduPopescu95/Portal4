"use client";

import { useEffect } from "react";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  addFeatured,
  addStatusType,
} from "../../../features/filter/filterSlice";

import PricingRangeSlider from "../../common/PricingRangeSlider";
import { v4 as uuidv4 } from "uuid";
import { useRouter, useSearchParams } from "next/navigation";
import { handleQueryFirestoreSubcollection } from "@/utils/firestoreUtils";
import { useAuth } from "@/context/AuthContext";
import {
  TITLES_AND_SPECIALTIES,
  WORK_SCHEDULES,
} from "@/utils/constanteTitulatura";
import { formatTitulatura } from "@/utils/strintText";

const FilteringItem = ({ params }) => {
  const { judete, userData } = useAuth();
  const router = useRouter();

  const searchParams = useSearchParams();

  const [selectedCategorie, setSelectedCategorie] = useState("");
  const [localitati, setLocalitati] = useState([]);
  const [isJudetSelected, setIsJudetSelected] = useState(true);
  const [isLocalitateSelected, setIsLocalitateSelected] = useState(true);
  const [isCateogireSelected, setIsCategorieSelected] = useState(true);

  const [searchQueryParteneri, setSearchQueryParteneri] = useState("");
  const [judet, setJudet] = useState("");
  const [localitate, setLocalitate] = useState("");
  const [specialitate, setSpecialitate] = useState("");
  const [titulatura, setTitulatura] = useState("");
  const [tipAnunt, setTipAnunt] = useState("");
  const [tipProgram, setTipProgram] = useState("");

  // Handler pentru schimbarea selectiei de judete
  const handleCategoryChange = (event) => {
    setTitulatura(event.target.value);
    setSpecialitate(""); // Resetăm specialitatea atunci când schimbăm categoria
  };

  // Funcție pentru gestionarea schimbărilor pe selectul de specialități
  const handleSpecialtyChange = (event) => {
    setSpecialitate(event.target.value);
  };

  // Handler pentru schimbarea selectiei de judete
  const handleJudetChange = async (e) => {
    const judetSelectedName = e; // Numele județului selectat, un string

    setJudet(judetSelectedName);
    setIsJudetSelected(!!judetSelectedName);

    // Găsește obiectul județului selectat bazat pe `judet`
    const judetSelected = judete.find(
      (judet) => judet.judet === judetSelectedName
    );

    if (judetSelected != "Bucuresti") {
      setLocalitate("");
    }

    if (judetSelected) {
      try {
        // Utilizăm judet pentru a interoga Firestore
        const localitatiFromFirestore = await handleQueryFirestoreSubcollection(
          "Localitati",
          "judet",
          judetSelected.judet
        );
        // Presupunem că localitatiFromFirestore este array-ul corect al localităților
        setLocalitati(localitatiFromFirestore);
      } catch (error) {
        console.error("Failed to fetch locations:", error);
        setLocalitati([]);
        setLocalitate("");
        setJudet("");
      }
    } else {
      // Dacă nu găsim județul selectat, resetăm localitățile
      setLocalitati([]);
      setLocalitate("");
      setJudet("");
    }
  };

  const handleLocalitateChange = (e) => {
    // Acesta ar trebui să arate numele localității ca string
    setLocalitate(e.target.value);
    setIsLocalitateSelected(!!e.target.value);
  };
  const handleCategorieChange = (e) => {
    setTitulatura(e.target.value);
    setIsCategorieSelected(!!e.target.value);
  };

  // submit handler
  const submitHandler = (event) => {
    event.preventDefault();
    let path = "/";
    let query = "";
    let defaultPathSegment;

    defaultPathSegment = "cadre-medicale";
    // Build the URL path based on the provided params
    if (titulatura) {
      path += `${titulatura.toLocaleLowerCase()}`;
      if (judet) path += `-${judet.toLocaleLowerCase()}`;
    } else {
      if (judet) {
        path += `${defaultPathSegment.toLocaleLowerCase()}-${judet.toLocaleLowerCase()}`;
      } else {
        path += `${defaultPathSegment.toLocaleLowerCase()}`;
      }
    }

    // Remove trailing slash if there are no query parameters
    path = path.replace(/\/$/, "");

    // Build query parameters string
    // if (tipAnunt) query += `?tipAnunt=${tipAnunt}`;
    // if (tipProgram) {
    //   query += query
    //     ? `&tipProgram=${tipProgram}`
    //     : `?tipProgram=${tipProgram}`;
    // }
    if (searchQueryParteneri) {
      query += query
        ? `&searchQueryParteneri=${searchQueryParteneri}`
        : `?searchQueryParteneri=${searchQueryParteneri}`;
    }
    if (specialitate) {
      query += query
        ? `&specialitate=${specialitate}`
        : `?specialitate=${specialitate}`;
    }
    if (localitate) {
      query += query
        ? `&localitate=${localitate}`
        : `?localitate=${localitate}`;
    }
    if (judet) {
      query += query ? `&judet=${judet}` : `?judet=${judet}`;
    }
    if (titulatura) {
      query += query
        ? `&titulatura=${titulatura}`
        : `?titulatura=${titulatura}`;
    }

    // Use Next.js Router to navigate with the path and query parameters
    router.replace(`${path}${query}`, undefined, { shallow: true });
  };

  const handleGetAnunturi = async () => {
    let tipProgram = searchParams.get("tipProgram");
    let tipAnunt = searchParams.get("tipAnunt");
    let searchQueryParteneri = searchParams.get("searchQueryParteneri");
    let localitate = searchParams.get("localitate");
    let specialitate = searchParams.get("specialitate");
    let titulatura = searchParams.get("titulatura");
    let judet = searchParams.get("judet");

    // const parts = params[0].split("__");
    // let judet = (parts[1] || "")
    //   .split("-") // Împarte șirul în părți folosind `-` ca separator
    //   .map((word) => word.charAt(0).toUpperCase() + word.slice(1)) // Transformă prima literă a fiecărui cuvânt în majusculă
    //   .join("-"); // Reunește părțile într-un singur șir, cu `-` între ele
    // let titulatura = parts[0] || "";

    setTipProgram(tipProgram);
    setTipAnunt(tipAnunt);
    setSearchQueryParteneri(searchQueryParteneri);
    setJudet(judet);
    await handleJudetChange(judet).then(() => {
      setLocalitate(localitate);
    });
    setSpecialitate(specialitate);
    setTitulatura(titulatura);
    console.log("----------test...aici...filters...----------");
    console.log("test...aici...filters...", tipProgram);
    console.log("test...aici...filters...", tipAnunt);
    console.log("test...aici...filters...", searchQueryParteneri);
    console.log("test...aici...filters...", localitate);
    console.log("test...aici...filters...", specialitate);
    console.log("test...aici...filters...", judet);
    console.log("test...aici...filters...", titulatura);
  };

  useEffect(() => {
    handleGetAnunturi();
  }, []);

  return (
    <ul className="sasw_list mb0">
      <li className="search_area">
        <div className="form-group mb-3">
          <input
            type="text"
            className="form-control"
            placeholder="Cauta dupa cuvant..."
            value={searchQueryParteneri}
            onChange={(e) => setSearchQueryParteneri(e.target.value)}
          />
          <label>
            <span className="flaticon-magnifying-glass"></span>
          </label>
        </div>
      </li>
      {/* End li */}

      {/* <li className="search_area">
        <div className="form-group mb-3">
          <input
            type="search"
            className="form-control"
            id="exampleInputEmail"
            placeholder="Location"
            value={getLocation}
            onChange={(e) => setLocation(e.target.value)}
          />
          <label htmlFor="exampleInputEmail">
            <span className="flaticon-maps-and-flags"></span>
          </label>
        </div>
      </li> */}
      {/* End li */}

      {/* <li>
        <div className="search_option_two">
          <div className="candidate_revew_select">
            <select
              className={`selectpicker w100 form-select show-tick`}
              onChange={(e) => setTipAnunt(e.target.value)}
              value={tipAnunt}
            >
              {!userData?.userType && (
                <>
                  <option value="">Tip Anunt</option>
                  <option data-tokens="Anunturi Cadre Medicale">
                    Anunturi Cadre Medicale
                  </option>
                  <option data-tokens="Anunturi Clinici">
                    Anunturi Clinici
                  </option>
                </>
              )}
              {userData?.userType === "Doctor" && (
                <option data-tokens="Anunturi Clinici">Anunturi Clinici</option>
              )}
              {userData?.userType === "Partener" && (
                <option data-tokens="Anunturi Cadre Medicale">
                  Anunturi Cadre Medicale
                </option>
              )}
            </select>
          </div>
        </div>
      </li> */}
      {/* End li */}
      {/* <li>
        <div className="search_option_two">
          <div className="candidate_revew_select">
            <select
              className={`selectpicker w100 form-select show-tick`}
              onChange={(e) => setTipProgram(e.target.value)}
              value={tipProgram}
            >
              <option value="">Tip Program</option>
              {WORK_SCHEDULES.map((title) => (
                <option key={title} value={title}>
                  {title}
                </option>
              ))}
            </select>
          </div>
        </div>
      </li> */}
      {/* End li */}

      <li>
        <div className="search_option_two">
          <div className="candidate_revew_select">
            <select
              className={`selectpicker w100 form-select show-tick`}
              onChange={handleCategoryChange}
              value={titulatura}
            >
              {" "}
              <option value="">Selectați Titulatura</option>
              {Object.keys(TITLES_AND_SPECIALTIES).map((key) => (
                <option key={key} value={key}>
                  {formatTitulatura(key)}
                </option>
              ))}
            </select>
          </div>
        </div>
      </li>
      {/* End li */}
      <li>
        <div className="search_option_two">
          <div className="candidate_revew_select">
            <select
              className={`selectpicker w100 form-select show-tick`}
              onChange={handleSpecialtyChange}
              value={specialitate}
            >
              <option value="">Selectați specialitatea</option>
              {titulatura &&
                TITLES_AND_SPECIALTIES[titulatura] &&
                TITLES_AND_SPECIALTIES[titulatura].map((specialty, index) => (
                  <option key={index} value={specialty}>
                    {specialty}
                  </option>
                ))}
            </select>
          </div>
        </div>
      </li>
      {/* End li */}

      <li>
        <div className="search_option_two">
          <div className="candidate_revew_select">
            <select
              className={`selectpicker w100 form-select show-tick`}
              onChange={(e) => handleJudetChange(e.target.value)}
              value={judet}
            >
              <option value="">Toate judetele</option>
              {judete &&
                judete.map((judet, index) => (
                  <option key={index} value={judet.judet}>
                    {judet.judet}
                  </option>
                ))}
            </select>
          </div>
        </div>
      </li>
      {/* End li */}

      {judet === "Bucuresti" && (
        <li>
          <div className="search_option_two">
            <div className="candidate_revew_select">
              <select
                className={`selectpicker w100 form-select show-tick ${
                  !isLocalitateSelected ? "border-danger" : ""
                }`}
                onChange={handleLocalitateChange}
                value={localitate}
              >
                <option value="">Toate Sectorele</option>
                {localitati.map((location, index) => (
                  <option key={index} value={location.localitate}>
                    {location.localitate}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </li>
      )}
      {/* End li */}

      <li>
        <div className="search_option_button">
          <button
            onClick={submitHandler}
            type="button"
            className="btn btn-block btn-thm w-100"
            data-bs-dismiss="offcanvas"
            aria-label="Close"
          >
            Cauta
          </button>
        </div>
      </li>
      {/* End li */}
    </ul>
  );
};

export default FilteringItem;
