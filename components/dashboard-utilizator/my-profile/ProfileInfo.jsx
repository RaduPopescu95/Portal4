"use client";

import { AlertModal } from "@/components/common/AlertModal";
import AutocompleteInput from "@/components/common/AutocompleteInput";
import CommonLoader from "@/components/common/CommonLoader";
import { useAuth } from "@/context/AuthContext";
import useDataNasterii from "@/hooks/useDataNasterii";
import {
  handleQueryFirestoreSubcollection,
  handleUpdateFirestore,
} from "@/utils/firestoreUtils";
import {
  emailWithoutSpace,
  formatTitulatura,
  revertTitulatura,
} from "@/utils/strintText";
import { uploadImage } from "@/utils/storageUtils";
import { TITLES_AND_SPECIALTIES } from "@/utils/constanteTitulatura";
import { useEffect, useState } from "react";
import LogoUpload from "./LogoUpload";

const ProfileInfo = () => {
  const { userData, currentUser, setUserData, judete } = useAuth();
  const { dataNasterii, setDataNasterii } = useDataNasterii(userData?.dataNasterii || "");

  // ─────────────────────────────────────────────────────────────────────────────
  // STĂRI PRIVIND UTILIZATORUL ŞI FORMULARUL
  // ─────────────────────────────────────────────────────────────────────────────
  const [email, setEmail] = useState(userData?.email || "");
  const [numeUtilizator, setNumeUtilizator] = useState(userData?.numeUtilizator || "");
  const [telefon, setTelefon] = useState(userData?.telefon || "");
  const [judet, setJudet] = useState(userData?.judet || "");
  const [localitate, setLocalitate] = useState(userData?.localitate || "");
  const [sector, setSector] = useState(userData?.sector || "");
  const [descriere, setDescriere] = useState(userData?.descriere || "");
  const [adresaSediu, setAdresaSediu] = useState(userData?.adresaSediu || "");
  const [googleMapsLink, setGoogleMapsLink] = useState(userData?.googleMapsLink || "");
  const [coordonate, setCoordonate] = useState(userData?.coordonate || {});

  // Noul model: Titulatura și Specialitate ca array-uri
  const [titulatura, setTitulatura] = useState(
    Array.isArray(userData?.titulaturaQ) ? userData?.titulaturaQ : []
  );
  const [specialitate, setSpecialitate] = useState(
    Array.isArray(userData?.specialitate) ? userData?.specialitate : []
  );

  // Lista de specialități agregate pe baza titulaturilor curente
  const [specialitati, setSpecialitati] = useState([]);

  // Alte stări
  const [tipEnitate, setTipEnitate] = useState(userData?.tipEnitate || "");
  const [cuim, setCuim] = useState(userData?.cuim || "");
  const [cif, setCIF] = useState(userData?.cif || "");
  const [codParafa, setCodParafa] = useState(userData?.codParafa || "");
  const [buttonPressed, setButtonPressed] = useState(false);
  const [alert, setAlert] = useState({ message: "", type: "" });
  const [isLoading, setIsLoading] = useState(false);

  // Logo, încărcare imagine
  const [logo, setLogo] = useState(userData?.logo ? [userData?.logo] : []);
  const [isNewLogo, setIsNewLogo] = useState(false);
  const [deletedLogo, setDeletedLogo] = useState(null);

  // Localități încărcate din Firestore
  const [localitati, setLocalitati] = useState([]);

  // ─────────────────────────────────────────────────────────────────────────────
  // EFECTE & HOOKS
  // ─────────────────────────────────────────────────────────────────────────────

  // La montarea componentei (sau când se schimbă titulatura), recalculăm specialitățile disponibile
  useEffect(() => {
    const aggregatedSpecialties = Array.from(
      new Set(
        (titulatura || []).reduce((acc, title) => {
          return acc.concat(TITLES_AND_SPECIALTIES[title] || []);
        }, [])
      )
    );
    setSpecialitati(aggregatedSpecialties);
  }, [titulatura]);

  // Dacă există deja un județ, încărcăm localitățile aferente
  useEffect(() => {
    if (judet?.length > 0) {
      handleGetLocalitatiJudet();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // ─────────────────────────────────────────────────────────────────────────────
  // HANDLERS PENTRU TITULATURI ȘI SPECIALITĂȚI (CHECKBOX-URI)
  // ─────────────────────────────────────────────────────────────────────────────

  const handleCheckboxTitleChange = (event) => {
    const { value, checked } = event.target;
    let updatedTitles;
    if (checked) {
      updatedTitles = [...titulatura, value];
    } else {
      updatedTitles = titulatura.filter((t) => t !== value);
    }
    setTitulatura(updatedTitles);
  };

  const handleCheckboxSpecialityChange = (event) => {
    const { value, checked } = event.target;
    let updatedSpecialties;
    if (checked) {
      updatedSpecialties = [...specialitate, value];
    } else {
      updatedSpecialties = specialitate.filter((s) => s !== value);
    }
    setSpecialitate(updatedSpecialties);
    setSpecializare(updatedSpecialties); // dacă vrei să păstrezi același array la "specializare"
  };

  // ─────────────────────────────────────────────────────────────────────────────
  // HANDLERS PENTRU JUDER / LOCALITATE / MAP
  // ─────────────────────────────────────────────────────────────────────────────

  const handleLocationSelect = (lat, lng, adresa, urlMaps) => {
    setAdresaSediu(adresa);
    setGoogleMapsLink(urlMaps);
    setCoordonate({ lat, lng });
  };

  const handleJudetChange = async (e) => {
    const judetSelectedName = e.target.value;
    setJudet(judetSelectedName);

    // Găsim obiectul județului
    const judetSelected = judete.find((jud) => jud.judet === judetSelectedName);
    if (judetSelected) {
      try {
        const localitatiFromFirestore = await handleQueryFirestoreSubcollection(
          "Localitati",
          "judet",
          judetSelected.judet
        );
        setLocalitati(localitatiFromFirestore);
      } catch (error) {
        console.error("Failed to fetch locations:", error);
        setLocalitati([]);
      }
    } else {
      setLocalitati([]);
    }
  };

  const handleGetLocalitatiJudet = async () => {
    const judetSelectedName = judet;
    const judetSelected = judete.find((jud) => jud.judet === judetSelectedName);
    if (judetSelected) {
      try {
        const localitatiFromFirestore = await handleQueryFirestoreSubcollection(
          "Localitati",
          "judet",
          judetSelected.judet
        );
        setLocalitati(localitatiFromFirestore);
        if (!userData?.localitate) {
          // Dacă userData nu are localitate, setăm un fallback
          setLocalitate(localitatiFromFirestore[0]?.localitate || "");
        } else {
          setLocalitate(userData.localitate);
        }
      } catch (error) {
        console.error("Failed to fetch locations:", error);
        setLocalitati([]);
      }
    } else {
      setLocalitati([]);
    }
  };

  // ─────────────────────────────────────────────────────────────────────────────
  // HANDLERS PENTRU LOGO
  // ─────────────────────────────────────────────────────────────────────────────

  const singleImage = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Verificăm dacă fișierul este deja selectat
      const isExist = logo.some(
        (existingFile) => existingFile.name === file.name
      );
      if (!isExist) {
        setLogo([file]);
        setIsNewLogo(true);
      } else {
        alert("Această imagine este deja selectată!");
      }
    }
  };

  const deleteLogo = () => {
    if (logo[0]?.fileName) {
      // Dacă e fișier încărcat pe storage
      setDeletedLogo(logo[0].fileName);
    }
    setLogo([]);
  };

  // ─────────────────────────────────────────────────────────────────────────────
  // HANDLE UPDATE PROFILE
  // ─────────────────────────────────────────────────────────────────────────────

  const handleUpdateProfile = async (event) => {
    event.preventDefault();
    setButtonPressed(true);
    setIsLoading(true);

    // Validări de bază
    if (!email || !numeUtilizator || !telefon || !judet || !localitate || !adresaSediu) {
      setIsLoading(false);
      return;
    }

    if (logo.length === 0) {
      showAlert("Selectați imaginea de profil!", "danger");
      setIsLoading(false);
      setButtonPressed(false);
      return;
    }

    try {
      // Upload / menținere logo
      let lg = {};
      if (isNewLogo) {
        // Aici se face uploadImage cu imagine nouă, plus eventual se șterge cea veche
        lg = await uploadImage(logo, true, "ProfileImage", deletedLogo);
      } else {
        // Dacă user are deja un logo existent
        if (!logo[0]?.fileName) {
          // Dacă e fișier local, încărcăm
          lg = await uploadImage(logo, false, "ProfileImage");
        } else {
          // Dacă e deja stocat
          lg = logo[0];
        }
      }

      // Construim obiectul final
      let updatedData = {
        ...userData,
        email,
        numeUtilizator,
        telefon,
        judet,
        localitate: judet === "Bucuresti" ? "Bucuresti" : localitate,
        sector: judet === "Bucuresti" ? sector : "",
        descriere,
        adresaSediu,
        googleMapsLink,
        coordonate,
        tipEnitate,
        cuim,
        cif,
        codParafa,
        // Titulatură și Specialitate sub formă de array
        titulaturaQ: titulatura,
        titulatura: titulatura.map((t) => formatTitulatura(t)),
        specialitate,
        specialitateQ: specialitate,
        specializare: specialitate,
        logo: lg,
      };

      // Apel Firestore
      await handleUpdateFirestore(`UsersUber/${currentUser.uid}`, updatedData);
      setUserData(updatedData);
      showAlert("Actualizare cu succes!", "success");
      setIsLoading(false);
    } catch (error) {
      showAlert(`Eroare la Actualizare: ${error.message}`, "danger");
      setIsLoading(false);
      console.error("Error updating profile: ", error);
    }
  };

  const showAlert = (message, type) => {
    setAlert({ message, type });
  };

  const closeAlert = () => {
    setAlert({ message: "", type: "" });
  };

  // ─────────────────────────────────────────────────────────────────────────────
  // RENDER
  // ─────────────────────────────────────────────────────────────────────────────

  // Determină dacă profilul este deja setat cu un logo (flag)
  const isEdit = !!userData?.logo?.finalUri;

  return (
    <div className="row">
      <div className="col-lg-12">
        <h3 className="mb30">Imagine Profil</h3>
      </div>

      <LogoUpload
        singleImage={singleImage}
        deleteLogo={deleteLogo}
        logoImg={logo}
        isEdit={isEdit}
        isNewImage={isNewLogo}
        text="Adauga imagine profil"
      />

      {/* Nume Utilizator */}
      <div className="col-lg-6 col-xl-6">
        <div className="my_profile_setting_input form-group">
          <label htmlFor="formGroupExampleInput1">Nume utilizator</label>
          <input
            type="text"
            className={`form-control ${
              !numeUtilizator && buttonPressed && "border-danger"
            }`}
            id="formGroupExampleInput1"
            placeholder="Nume Utilizator"
            value={numeUtilizator}
            onChange={(e) => setNumeUtilizator(e.target.value)}
          />
        </div>
      </div>

      {/* Email */}
      <div className="col-lg-6 col-xl-6">
        <div className="my_profile_setting_input form-group">
          <label htmlFor="formGroupExampleEmail">Email</label>
          <input
            type="email"
            className={`form-control ${!email && buttonPressed && "border-danger"}`}
            id="formGroupExampleEmail"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>
      </div>

      {/* Două coloane pentru TITUATLURI (stânga) și SPECIALITĂȚI (dreapta) */}
      <div className="col-12 mt-4">
        <div className="row">
          {/* TITULATURI */}
          <div className="col-md-6" style={{ maxHeight: "300px", overflowY: "auto" }}>
            <div className="my_profile_setting_input form-group">
              <label>Selectează una sau mai multe titulaturi:</label>
              {Object.keys(TITLES_AND_SPECIALTIES).map((title) => (
                <div key={title} className="form-check">
                  <input
                    className="form-check-input"
                    type="checkbox"
                    id={`titulatura-${title}`}
                    value={title}
                    checked={titulatura.includes(title)}
                    onChange={handleCheckboxTitleChange}
                  />
                  <label
                    className="form-check-label"
                    htmlFor={`titulatura-${title}`}
                  >
                    {formatTitulatura(title)}
                  </label>
                </div>
              ))}
            </div>
          </div>

          {/* SPECIALITĂȚI */}
          <div className="col-md-6" style={{ maxHeight: "300px", overflowY: "auto" }}>
            <div className="my_profile_setting_input form-group">
              <label>Selectează una sau mai multe specialități:</label>
              {specialitati.map((spec) => (
                <div key={spec} className="form-check">
                  <input
                    className="form-check-input"
                    type="checkbox"
                    id={`specialitate-${spec}`}
                    value={spec}
                    checked={specialitate.includes(spec)}
                    onChange={handleCheckboxSpecialityChange}
                  />
                  <label
                    className="form-check-label"
                    htmlFor={`specialitate-${spec}`}
                  >
                    {spec}
                  </label>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Judet */}
      <div className="col-lg-6 col-xl-6">
        <div className="my_profile_setting_input ui_kit_select_search form-group mt-2">
          <label>Județ</label>
          <select
            className={`selectpicker form-select ${
              !judet && buttonPressed ? "border-danger" : ""
            }`}
            data-live-search="true"
            data-width="100%"
            value={judet}
            onChange={handleJudetChange}
          >
            <option data-tokens="SelectRole">Judet</option>
            {judete?.map((judObj, index) => (
              <option key={index} value={judObj.judet}>
                {judObj.judet}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Localitate */}
      <div className="col-lg-6 col-xl-6">
        <div className="my_profile_setting_input ui_kit_select_search form-group mt-2">
          <label>Localitate</label>
          <select
            className={`selectpicker form-select ${
              !localitate && buttonPressed ? "border-danger" : ""
            }`}
            data-live-search="true"
            data-width="100%"
            value={localitate}
            onChange={(e) => {
              if (e.target.value.includes("Sector")) {
                setLocalitate(e.target.value);
                setSector(e.target.value);
              } else {
                setLocalitate(e.target.value);
              }
            }}
          >
            {localitati.map((location, index) => (
              <option key={index} value={location.localitate}>
                {location.localitate}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Telefon */}
      <div className="col-lg-6 col-xl-6">
        <div className="my_profile_setting_input form-group mt-2">
          <label htmlFor="formGroupExampleInput5">Telefon</label>
          <input
            type="text"
            className={`form-control ${!telefon && buttonPressed && "border-danger"}`}
            id="formGroupExampleInput5"
            placeholder="Telefon"
            value={telefon}
            onChange={(e) => setTelefon(e.target.value)}
          />
        </div>
      </div>

      {/* Cuim / Cif / CodParafa etc. - dacă e nevoie */}
      <div className="col-lg-6 col-xl-6">
        <div className="my_profile_setting_input form-group mt-2">
          <label htmlFor="formGroupInputCUIM">CUIM</label>
          <input
            type="text"
            className="form-control"
            id="formGroupInputCUIM"
            placeholder="CUIM"
            value={cuim}
            onChange={(e) => setCuim(e.target.value)}
          />
        </div>
      </div>
      <div className="col-lg-6 col-xl-6">
        <div className="my_profile_setting_input form-group mt-2">
          <label htmlFor="formGroupInputCIF">CIF</label>
          <input
            type="text"
            className="form-control"
            id="formGroupInputCIF"
            placeholder="CIF"
            value={cif}
            onChange={(e) => setCIF(e.target.value)}
          />
        </div>
      </div>
      <div className="col-lg-6 col-xl-6">
        <div className="my_profile_setting_input form-group mt-2">
          <label htmlFor="formGroupInputParafa">Cod Parafa</label>
          <input
            type="text"
            className="form-control"
            id="formGroupInputParafa"
            placeholder="Cod Parafa"
            value={codParafa}
            onChange={(e) => setCodParafa(e.target.value)}
          />
        </div>
      </div>

      {/* Descriere */}
      <div className="col-lg-12 mt-2">
        <div className="my_profile_setting_textarea">
          <label htmlFor="propertyDescription">Despre mine</label>
          <textarea
            className="form-control"
            id="propertyDescription"
            rows="5"
            value={descriere}
            onChange={(e) => setDescriere(e.target.value)}
          />
        </div>
      </div>

      {/* Zonă de interes */}
      <div className="col-lg-12 mt-4">
        <h4 className="mb-3">Introduceti zona de interes</h4>
        <AutocompleteInput
          onPlaceChanged={handleLocationSelect}
          adresa={adresaSediu}
          buttonPressed={buttonPressed}
        />
      </div>

      {/* Buton final de update */}
      <div className="col-xl-12 text-right mt-3">
        <div className="my_profile_setting_input">
          <button className="btn btn2" onClick={handleUpdateProfile}>
            {isLoading ? "Se actualizează..." : "Actualizează Profil"}
          </button>
        </div>
      </div>

      <AlertModal message={alert.message} type={alert.type} onClose={closeAlert} />
    </div>
  );
};

export default ProfileInfo;
