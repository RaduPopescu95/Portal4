"use client";

import { useAuth } from "@/context/AuthContext";
import {
  handleQueryFirestoreSubcollection,
  handleUpdateFirestoreSubcollection,
  handleUploadFirestoreSubcollection,
} from "@/utils/firestoreUtils";
import { uploadImage } from "@/utils/storageUtils";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import LogoUpload from "../my-profile/LogoUpload";
import CommonLoader from "@/components/common/CommonLoader";
import {
  TITLES_AND_SPECIALTIES,
  WORK_SCHEDULES,
} from "@/utils/constanteTitulatura";
import { formatTitulatura } from "@/utils/strintText";
import AutocompleteInput from "@/components/common/AutocompleteInput";
import { isSameOrBefore } from "@/utils/commonUtils";

const CreateList = ({ oferta }) => {
  const { currentUser, userData, judete } = useAuth();
  const router = useRouter();
  const [image, setImage] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [pretIntreg, setPretIntreg] = useState(oferta?.pretIntreg || "");
  const [pretRedus, setPretRedus] = useState(oferta?.pretRedus || "");
  const [procentReducere, setProcentReducere] = useState(
    oferta?.procentReducere || ""
  );
  const [titluOferta, setTitluOferta] = useState(oferta?.titluOferta || "");
  const [descriereOferta, setDescriereOferta] = useState(
    oferta?.descriereOferta || ""
  );
  const [cerintePost, setCerintePost] = useState(oferta?.cerintePost || "");
  const [gradeFidelitate, setGradeFidelitate] = useState(
    oferta?.gradeFidelitate || []
  );
  const [fidelitySilver, setFidelitySilver] = useState(
    oferta?.gradeFidelitate?.includes("Silver") ? true : false
  );
  const [fidelityGold, setFidelityGold] = useState(
    oferta?.gradeFidelitate?.includes("Gold") ? true : false
  );
  const [fidelityPlatinum, setFidelityPlatinum] = useState(
    oferta?.gradeFidelitate?.includes("Platinum") ? true : false
  );

  const [tipOferta, setTipOferta] = useState(oferta?.tipOferta || "");
  const [dataActivare, setDataActivare] = useState(oferta?.dataActivare || "");
  const [dataDezactivare, setDataDezactivare] = useState(
    oferta?.dataDezactivare || ""
  );

  const [alert, setAlert] = useState({ show: false, message: "", type: "" });

  const [logo, setLogo] = useState(
    oferta?.imagineOferta ? [oferta?.imagineOferta] : []
  );
  const [deletedLogo, setDeletedLogo] = useState(null);
  const [isNewLogo, setIsNewLogo] = useState(false);

  const [initialData, setInitialData] = useState({});

  const [titulatura, setTitulatura] = useState(oferta?.titulatura || "");
  const [specialitate, setSpecialitate] = useState(oferta?.specialitate || "");
  const [specialitati, setSpecialitati] = useState(
    oferta?.titulatura ? TITLES_AND_SPECIALTIES[oferta?.titulatura] : []
  );
  const [tipProgram, setTipProgram] = useState(oferta?.tipProgram || "");

  let isEdit = oferta?.imagineOferta?.finalUri ? true : false;

  const [adresaSediu, setAdresaSediu] = useState(oferta?.adresaSediu || "");

  const [googleMapsLink, setGoogleMapsLink] = useState(
    oferta?.googleMapsLink || ""
  );
  const [coordonate, setCoordonate] = useState(oferta?.coordonate || {});
  const [buttonPressed, setButtonPressed] = useState(false);

  const [judet, setJudet] = useState(oferta?.judet || "");
  const [localitate, setLocalitate] = useState(oferta?.localitate || "");
  const [sector, setSector] = useState(oferta?.sector || "");
  const [localitati, setLocalitati] = useState([]);
  const [isJudetSelected, setIsJudetSelected] = useState(true);
  const [isLocalitateSelected, setIsLocalitateSelected] = useState(true);
  const [isCateogireSelected, setIsCategorieSelected] = useState(true);

  const handleLocationSelect = (lat, lng, adresa, urlMaps) => {
    console.log(`Selected location - Lat: ${lat}, Lng: ${lng}`);
    setAdresaSediu(adresa);
    setGoogleMapsLink(urlMaps);
    setCoordonate({ lat, lng });
    // Aici poți actualiza starea sau trimite aceste date către backend
  };

  const handleTitleChange = (event) => {
    const title = event.target.value;
    setTitulatura(title);
    setSpecialitati(TITLES_AND_SPECIALTIES[title] || []);
    setSpecialitate(""); // Reset specialty when title changes
  };

  const handleSpecialtyChange = (event) => {
    setSpecialitate(event.target.value);
  };

  const handlePutLocalitat = async (judet) => {
    await handleJudetChange(judet).then(() => {
      setLocalitate(oferta?.sector);
    });
  };

  useEffect(() => {
    if (oferta) {
      handlePutLocalitat(oferta?.judet);
      setInitialData({
        titluOferta: oferta.titluOferta || "",
        descriereOferta: oferta.descriereOferta || "",
        dataDezactivare: oferta.dataDezactivare || "",
        logo: oferta.imagineOferta ? [oferta.imagineOferta] : [],
        titulatura: oferta.titulatura || "",
        specialitate: oferta.specialitate || "",
        tipProgram: oferta.tipProgram || "",
        cerintePost: oferta.cerintePost || "",
        adresaSediu: oferta?.adresaSediu || "",
        googleMapsLink: oferta?.googleMapsLink || "",
        coordonate: oferta?.coordonate || {},
        judet: oferta?.judet || "",
        localitate: oferta?.localitate || "",
        sector: oferta?.sector || "",
      });
    }
  }, [oferta]);

  const describeChanges = () => {
    let changes = [];
    Object.entries(initialData).forEach(([key, value]) => {
      let currentValue = eval(key); // Utilizează eval cu precauție sau consideră o alternativă mai sigură
      if (JSON.stringify(value) !== JSON.stringify(currentValue)) {
        changes.push(
          `${key} de la '${JSON.stringify(value)}' la '${JSON.stringify(
            currentValue
          )}'`
        );
      }
    });
    if (changes.length > 0) {
      return `${userData?.denumireBrand} a actualizat anuntul ${
        oferta?.titluOferta
      }: ${changes.join(", ")}`;
    }
    return null;
  };

  // Funcție pentru a afișa alerta
  const showAlert = (message, type) => {
    setAlert({ show: true, message, type });
    setTimeout(() => {
      setAlert({ show: false, message: "", type: "" });
      router.push("/lista-anunturi");
    }, 3000); // Alerta va dispărea după 3 secunde
  };

  const handleFidelityChange = (event) => {
    const { id, checked } = event.target;
    switch (id) {
      case "Silver":
        setFidelitySilver(checked);
        break;
      case "Gold":
        setFidelityGold(checked);
        break;
      case "Platinum":
        setFidelityPlatinum(checked);
        break;
    }
    setGradeFidelitate((prev) => {
      if (checked) {
        return [...prev, id];
      } else {
        return prev.filter((gradeId) => gradeId !== id);
      }
    });
  };

  useEffect(() => {
    if (pretIntreg && pretRedus) {
      const discount = ((pretIntreg - pretRedus) / pretIntreg) * 100;
      setProcentReducere(discount.toFixed(2)); // Afișează procentul cu două zecimale
    }
  }, [pretIntreg, pretRedus]); // Recalculează la schimbarea prețului întreg sau a celui redus

  const resetState = () => {
    setImage(null);
    setTitluOferta("");
    setDescriereOferta("");
    setDataDezactivare("");
    setTitulatura("");
    setSpecialitate("");
    setTipProgram("");
    setCerintePost("");
    setCoordonate({});
    setAdresaSediu("");
    setGoogleMapsLink("");
    setLocalitate("");
    setJudet("");
    setSector("");
  };

  const handleUpdateOffer = async () => {
    setIsLoading(true);
    setButtonPressed(true);
    console.log("currentUser...", currentUser.uid);
    console.log("userData...", userData);
    let lg = {};

    if (isNewLogo) {
      lg = await uploadImage(logo, true, "PozeOferte", deletedLogo);
    } else {
      lg = oferta.imagineOferta;
    }

    let data = {
      descriereOferta,
      titluOferta,
      cerintePost,
      status: "Activa",
      imagineOferta: lg,
      coordonate,
      googleMapsLink,
      adresaSediu,
      titulatura,
      specialitate,
      judet,
      localitate: judet === "Bucuresti" ? "Bucuresti" : localitate,
      sector: judet === "Bucuresti" ? sector : "",
      tipProgram,
      //QUERY STRINGS
      tipProgramQ: tipProgram.toLowerCase(),
      titulaturaQ: titulatura.toLowerCase(),
      specialitateQ: specialitate.toLowerCase(),
      judetQ: judet.toLowerCase(),
      localitateQ:
        judet === "Bucuresti" ? "bucuresti" : localitate.toLowerCase(),
      sectorQ: judet === "Bucuresti" ? localitate.toLowerCase() : "",
    };

    try {
      const actionText = describeChanges();
      await handleUpdateFirestoreSubcollection(
        data,
        `UsersUber/${currentUser.uid}/Anunturi/${oferta.documentId}`,
        actionText
      );
      setIsLoading(false);
      setButtonPressed(false);
      showAlert("Anunt actualizat cu succes!", "success");
    } catch (error) {
      setIsLoading(false);
      setButtonPressed(false);
      console.error("Eroare la actualizarea anuntului: ", error);
      showAlert("Eroare la actualizarea anuntului.", "danger");
    }
  };

  const handleAddOffer = async () => {
    setIsLoading(true);
    setButtonPressed(true);
    console.log("currentUser...", currentUser.uid);
    console.log("userData...", userData);
    let lg = {};
    try {
      if (!logo[0].fileName) {
        lg = await uploadImage(logo, false, "PozeOferte");
      } else {
        lg = logo[0];
      }

      const currentDate = new Date();
      const deactivationDate = new Date(
        currentDate.setDate(currentDate.getDate() + 30)
      );
      const formattedDeactivationDate = deactivationDate
        .toISOString()
        .split("T")[0]; // Formatează data în formatul "YYYY-MM-DD"

      let data = {
        dataDezactivare: formattedDeactivationDate,
        descriereOferta,
        titluOferta,
        status: "Activa",
        imagineOferta: lg,
        tipAnunt: "Clinica",
        cerintePost,
        coordonate,
        googleMapsLink,
        adresaSediu,
        titulatura,
        specialitate,
        judet,
        localitate: judet === "Bucuresti" ? "Bucuresti" : localitate,
        sector: judet === "Bucuresti" ? sector : "",
        tipProgram,
        //QUERY STRINGS
        tipProgramQ: tipProgram.toLowerCase(),
        titulaturaQ: titulatura.toLowerCase(),
        specialitateQ: specialitate.toLowerCase(),
        judetQ: judet.toLowerCase(),
        localitateQ:
          judet === "Bucuresti" ? "bucuresti" : localitate.toLowerCase(),
        sectorQ: judet === "Bucuresti" ? localitate.toLowerCase() : "",
      };

      const actionText = `${userData.denumireBrand} a creat anuntul de angajare ${titluOferta}`;

      await handleUploadFirestoreSubcollection(
        data,
        `UsersUber/${currentUser.uid}/Anunturi`,
        currentUser.uid,
        actionText
      );
      resetState();
      setIsLoading(false);
      setButtonPressed(false);
      showAlert("Anunt creat cu succes!", "success");
    } catch (error) {
      setIsLoading(false);
      setButtonPressed(false);
      console.error("Eroare la adaugarea anuntului: ", error);
      showAlert(`Eroare la crearea anuntului: ${error.message}`, "danger");
    }
  };

  const handleActivateOffer = async () => {
    setIsLoadingActivare(true);
    setButtonPressed(true);
    console.log("currentUser...", currentUser.uid);
    console.log("userData...", userData);
    console.log("files...", files);
    let lg = {};
    try {
      const currentDate = new Date();
      const deactivationDate = new Date(
        currentDate.setDate(currentDate.getDate() + 30)
      );
      const formattedDeactivationDate = deactivationDate
        .toISOString()
        .split("T")[0]; // Formatează data în formatul "YYYY-MM-DD"

      let data = {
        dataDezactivare: formattedDeactivationDate,
      };
      console.log("activare data....", data);
      const actionText = `${userData.numeUtilizator} a reactivat anuntul de angajare ${titluOferta}, acum avand data de dezactivare ${formattedDeactivationDate}`;

      await handleUpdateFirestoreSubcollection(
        data,
        `UsersUber/${currentUser.uid}/Anunturi/${oferta.documentId}`,
        actionText
      );
      resetState();
      setIsLoadingActivare(false);
      showAlert("Anunt a fost reactivat cu succes!", "success");
      setButtonPressed(false);
    } catch (error) {
      setButtonPressed(false);
      setIsLoadingActivare(false);
      console.error("Eroare la reactivarea anuntului: ", error);
      showAlert(`Eroare la reactivarea anuntului: ${error.message}`, "danger");
    }
  };

  // delete logo
  const deleteLogo = (name) => {
    if (logo[0].fileName) {
      setLogo([]); // Clear the selection when deleting
      setDeletedLogo(logo[0].fileName);
    } else {
      setLogo([]); // Clear the selection when deleting
    }
  };

  // upload Logo
  // Handle single image selection
  const singleImage = (e) => {
    const file = e.target.files[0]; // Get the selected file
    console.log("test..here...", file.name);
    if (file) {
      // Check if the file is already selected
      const isExist = logo.some(
        (existingFile) => existingFile.name === file.name
      );

      if (!isExist) {
        setLogo([file]); // Replace the current file
        setIsNewLogo(true);
      } else {
        alert("This image is already selected!");
      }
    }
  };

  const handleJudetChange = async (e) => {
    const judetSelectedName = e; // Numele județului selectat, un string
    console.log("judetSelectedName...", judetSelectedName);
    setJudet(judetSelectedName);
    setIsJudetSelected(!!judetSelectedName);

    // Găsește obiectul județului selectat bazat pe `judet`
    const judetSelected = judete.find(
      (judet) => judet.judet === judetSelectedName
    );

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
        setLocalitati([]); // Resetează localitățile în caz de eroare
      }
    } else {
      // Dacă nu găsim județul selectat, resetăm localitățile
      setLocalitati([]);
    }
  };
  const handleGetLocalitatiJudet = async () => {
    const judetSelectedName = judet; // Numele județului selectat, un string
    console.log("judetSelectedName...", judetSelectedName);
    setJudet(judetSelectedName);
    setIsJudetSelected(!!judetSelectedName);

    // Găsește obiectul județului selectat bazat pe `judet`
    const judetSelected = judete.find(
      (judet) => judet.judet === judetSelectedName
    );

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
        setLocalitati([]); // Resetează localitățile în caz de eroare
      }
    } else {
      // Dacă nu găsim județul selectat, resetăm localitățile
      setLocalitati([]);
    }
  };

  useEffect(() => {
    if (judet.length > 0) {
      handleGetLocalitatiJudet();
    }
  }, []);

  const today = new Date();

  const endDate = new Date(oferta?.dataDezactivare);

  const isActive = isSameOrBefore(today, endDate);

  return (
    <>
      {/* <div className="col-lg-12 col-xl-12">
        <div className="my_profile_setting_input ui_kit_select_search form-group">
          <label>Tip oferta</label>
          <select
            className="selectpicker form-select"
            data-live-search="true"
            data-width="100%"
            value={tipOferta}
            onChange={(e) => setTipOferta(e.target.value)}
          >
            <option data-tokens="Status1">Selecteaza tip oferta</option>
            <option data-tokens="Oferta cu discount procentual general">
              Oferta cu discount procentual general
            </option>
            <option data-tokens="Oferta specifică">Oferta specifică</option>
          </select>
        </div>
      </div> */}
      {/* End .col */}
      {/* {tipOferta === "Oferta specifică" && ( */}
      <LogoUpload
        singleImage={singleImage}
        deleteLogo={deleteLogo}
        logoImg={logo}
        isEdit={isEdit}
        isNewImage={isNewLogo}
        text={"Adauga imagine"}
      />
      {/* )} */}
      {/* End .col */}
      <div className="col-lg-12">
        <div className="my_profile_setting_input form-group">
          <label htmlFor="propertyTitle">Titlu anunt angajare</label>
          <input
            type="text"
            className="form-control"
            id="propertyTitle"
            value={titluOferta}
            onChange={(e) => setTitluOferta(e.target.value)}
          />
        </div>
      </div>
      {/* End .col */}

      <div className="col-lg-6 col-xl-6">
        <div className="my_profile_setting_input ui_kit_select_search form-group">
          <label>Titulatura</label>
          <select
            className={`selectpicker form-select ${
              !titulatura && "border-danger"
            }`}
            data-live-search="true"
            data-width="100%"
            value={titulatura}
            onChange={handleTitleChange}
          >
            <option value="">Selectează o titulatură</option>
            {Object.keys(TITLES_AND_SPECIALTIES).map((title) => (
              <option key={title} value={title}>
                {formatTitulatura(title)}
              </option>
            ))}
          </select>
        </div>
      </div>
      {/* End .col */}
      <div className="col-lg-6 col-xl-6">
        <div className="my_profile_setting_input ui_kit_select_search form-group">
          <label>Specialitate</label>
          <select
            className={`selectpicker form-select ${
              !specialitate && "border-danger"
            }`}
            data-live-search="true"
            data-width="100%"
            value={specialitate}
            onChange={handleSpecialtyChange}
            // disabled={!titulatura} // Disable if no title is selected
          >
            <option value="">Selectează o specialitate</option>
            {specialitati.map((specialty) => (
              <option key={specialty} value={specialty}>
                {specialty}
              </option>
            ))}
          </select>
        </div>
      </div>
      {/* End .col */}

      <div className="col-lg-12">
        <div className="my_profile_setting_textarea">
          <label htmlFor="propertyDescription">Descriere post</label>
          <textarea
            className="form-control"
            id="propertyDescription"
            rows="7"
            value={descriereOferta}
            onChange={(e) => setDescriereOferta(e.target.value)}
          ></textarea>
        </div>
      </div>
      {/* End .col */}

      <div className="col-lg-12">
        <div className="my_profile_setting_textarea">
          <label htmlFor="propertyDescription">Cerinte post</label>
          <textarea
            className="form-control"
            id="propertyDescription"
            rows="7"
            value={cerintePost}
            onChange={(e) => setCerintePost(e.target.value)}
          ></textarea>
        </div>
      </div>
      {/* End .col */}

      <div className="col-lg-12 col-xl-12">
        <div className="my_profile_setting_input ui_kit_select_search form-group">
          <label>Tip Program</label>
          <select
            className={`selectpicker form-select ${
              !tipProgram && "border-danger"
            }`}
            data-live-search="true"
            data-width="100%"
            value={tipProgram}
            onChange={(e) => setTipProgram(e.target.value)}
          >
            <option value="">Selectează tip program</option>
            {WORK_SCHEDULES.map((title) => (
              <option key={title} value={title}>
                {title}
              </option>
            ))}
          </select>
        </div>
      </div>
      {/* End .col */}

      <div className="col-lg-12">
        <h3 className="mb30">Camp zona de interes</h3>
      </div>

      <div className="col-lg-6 col-xl-6">
        <div className="my_profile_setting_input ui_kit_select_search form-group">
          <label>Judet</label>
          <select
            className={`selectpicker form-select ${
              !judet && buttonPressed && "border-danger"
            }`}
            data-live-search="true"
            data-width="100%"
            value={judet}
            onChange={(e) => handleJudetChange(e.target.value)}
          >
            <option value="">Selectează judet</option>
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
            className={`selectpicker form-select ${
              !localitate && buttonPressed && "border-danger"
            }`}
            data-live-search="true"
            data-width="100%"
            value={localitate}
            onChange={(e) => {
              console.log("Test...");
              if (e.target.value.includes("Sector")) {
                setLocalitate(e.target.value);
                setSector(e.target.value);
              } else {
                setLocalitate(e.target.value);
              }
            }}
          >
            <option value="">
              {judet === "Bucuresti"
                ? "Selecteaza Sector"
                : "Selecteaza localitate"}
            </option>
            {localitati.map((location, index) => (
              <option key={index} value={location.localitate}>
                {location.localitate}
              </option>
            ))}
          </select>
        </div>
      </div>
      {/* End .col */}

      <AutocompleteInput
        onPlaceChanged={handleLocationSelect}
        adresa={adresaSediu}
        buttonPressed={buttonPressed}
      />
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

      {/* {tipOferta === "Oferta specifică" && ( */}
      <>
        {/* <div className="col-lg-6 col-xl-6">
          <div className="my_profile_setting_input form-group">
            <label htmlFor="activationDate">Data de activare</label>
            <input
              type="date"
              className="form-control"
              id="activationDate"
              value={dataActivare}
              onChange={(e) => setDataActivare(e.target.value)}
            />
          </div>
        </div> */}
        {/* End .col */}

        {/* <div className="col-lg-6 col-xl-6">
          <div className="my_profile_setting_input form-group">
            <label htmlFor="deactivationDate">Data de dezactivare</label>
            <input
              type="date"
              className="form-control"
              id="deactivationDate"
              value={dataDezactivare}
              onChange={(e) => setDataDezactivare(e.target.value)}
            />
          </div>
        </div> */}
        {/* End .col */}
      </>
      {/* )} */}

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

      {oferta &&
        (() => {
          const today = new Date();

          const endDate = new Date(oferta?.dataDezactivare);

          const isActive = isSameOrBefore(today, endDate);

          if (isActive) {
            return null;
          } else {
            return (
              <div className="col-xl-6">
                <div className="my_profile_setting_input">
                  <button
                    onClick={handleActivateOffer}
                    className="btn btn2 float-start"
                  >
                    {isLoadingActivare ? <CommonLoader /> : "Activează anunț"}
                  </button>
                </div>
              </div>
            );
          }
        })()}

      <div className={isActive ? "col-xl-12" : "col-xl-6"}>
        <div className="my_profile_setting_input">
          {alert.show && (
            <div className={`alert alert-${alert.type} mb-0`}>
              {alert.message}
            </div>
          )}
          {oferta?.titluOferta?.length > 0 ? (
            <button onClick={handleUpdateOffer} className="btn btn2 float-end">
              {isLoading ? <CommonLoader /> : "Actualizeaza"}
            </button>
          ) : (
            <button onClick={handleAddOffer} className="btn btn2 float-end">
              {isLoading ? <CommonLoader /> : "Adauga"}
            </button>
          )}
        </div>
      </div>
    </>
  );
};

export default CreateList;
