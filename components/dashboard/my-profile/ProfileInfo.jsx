"use client";

import { generateRandomGradient } from "@/utils/commonUtils";
import { useEffect, useState } from "react";
import GradientSelect from "./GradientSelect";
import { useAuth } from "@/context/AuthContext";
import {
  handleQueryFirestoreSubcollection,
  handleUpdateFirestore,
} from "@/utils/firestoreUtils";
import { emailWithoutSpace } from "@/utils/strintText";
import AutocompleteInput from "@/components/common/AutocompleteInput";
import { AlertModal } from "@/components/common/AlertModal";
import GalerieFotoSection from "./GalerieFotoSection";
import { useParams, useRouter } from "next/navigation";
import selectedFiles from "@/utils/selectedFiles";
import { uploadImage, uploadMultipleImages } from "@/utils/storageUtils";
import CommonLoader from "@/components/common/CommonLoader";
import LogoUpload from "./LogoUpload";
import PasswordDialog from "@/components/common/dialogs/PasswordDialog";

const ProfileInfo = () => {
  const { userData, currentUser, setCurrentUser, setUserData, judete } =
    useAuth();
  const [denumireBrand, setDenumireBrand] = useState(
    userData?.denumireBrand || ""
  );
  const [descriere, setDescriere] = useState(userData?.descriere || "");
  const [email, setEmail] = useState(userData?.email || "");
  const [oldEmail, setOldEmail] = useState(userData?.email || "");
  const [password, setPassword] = useState();
  const [confirmPassword, setConfirmPassword] = useState("");
  const [numeContact, setNumeContact] = useState(userData?.numeContact || "");
  const [telefonContact, setTelefonContact] = useState(
    userData?.telefonContact || ""
  );
  const [judet, setJudet] = useState(userData?.judet || "");
  const [localitate, setLocalitate] = useState(userData?.localitate || "");
  const [sector, setSector] = useState(userData?.sector || "");
  const [categorie, setCategorie] = useState(userData?.categorie || "");
  const [cui, setCui] = useState(userData?.cui || "");
  const [oldCui, setOldCui] = useState(userData?.cui || "");
  const [deletedLogo, setDeletedLogo] = useState(null);
  const [isNewLogo, setIsNewLogo] = useState(false);
  const [showModal, setShowModal] = useState(false);

  const [adresaSediu, setAdresaSediu] = useState(userData?.adresaSediu || "");
  const [googleMapsLink, setGoogleMapsLink] = useState(
    userData?.googleMapsLink || ""
  );
  const [coordonate, setCoordonate] = useState(userData?.coordonate || {});

  const [selectedId, setSelectedId] = useState(
    userData?.gradient?.selectedId || null
  ); // Acum stocăm un singur ID
  const [gradientSelected, setGradientSelected] = useState(
    userData?.gradient?.gradientSelected || ""
  );

  const [logo, setLogo] = useState(userData?.logo ? [userData?.logo] : []);
  const [isLoading, setIsLoading] = useState(false);

  const [propertySelectedImgs, setPropertySelectedImgs] = useState(
    userData?.images?.imgs || []
  );

  const [deletedImages, setDeletedImages] = useState([]);
  const [localitati, setLocalitati] = useState([]);
  const [isNewImage, setIsNewImage] = useState(false);
  const [initialData, setInitialData] = useState({});
  const [buttonPressed, setButtonPressed] = useState(false);
  const [cuiAlready, setCuiAlready] = useState(false);

  const [isJudetSelected, setIsJudetSelected] = useState(true);
  const [isLocalitateSelected, setIsLocalitateSelected] = useState(true);
  const [isCateogireSelected, setIsCategorieSelected] = useState(true);

  const params = useParams();
  const router = useRouter();

  // Setează starea inițială
  useEffect(() => {
    setInitialData({
      denumireBrand: userData?.denumireBrand || "",
      descriere: userData?.descriere || "",
      email: userData?.email || "",
      numeContact: userData?.numeContact || "",
      telefonContact: userData?.telefonContact || "",
      judet: userData?.judet || "",
      localitate: userData?.localitate || "",
      sector: userData?.sector || "",
      categorie: userData?.categorie || "",
      cui: userData?.cui || "",
      adresaSediu: userData?.adresaSediu || "",
    });
  }, [userData]);

  const describeChanges = () => {
    let changes = [];
    Object.entries(initialData).forEach(([key, value]) => {
      let currentValue = eval(key);
      if (value !== currentValue) {
        changes.push(`${key} de la '${value}' la '${currentValue}'`);
      }
    });
    if (changes.length > 0) {
      return `${userData.denumireBrand} a actualizat: ${changes.join(", ")}`;
    }
    return null;
  };

  let isEdit = userData?.logo?.finalUri ? true : false;

  const [alert, setAlert] = useState({ message: "", type: "" });

  const showAlert = (message, type) => {
    setAlert({ message, type });
  };

  const closeAlert = () => {
    setAlert({ message: "", type: "" });
  };

  const options = ["Opțiunea 1", "Opțiunea 2", "Opțiunea 3"];

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

  const handleLocationSelect = (lat, lng, adresa, urlMaps) => {
    console.log(`Selected location - Lat: ${lat}, Lng: ${lng}`);
    setAdresaSediu(adresa);
    setGoogleMapsLink(urlMaps);
    setCoordonate({ lat, lng });
    // Aici poți actualiza starea sau trimite aceste date către backend
  };

  // Închide modalul fără a șterge
  const handleCloseModal = () => {
    setShowModal(false);
  };

  // Logica de ștergere a elementului

  const handleConfirm = async () => {
    // setIsLoading(true);

    try {
      // Dacă dorești să aștepți până când router-ul se reîmprospătează înainte de a seta loading-ul la false
    } catch (error) {
      console.error("Error confirm:", error);
      // Aici poți adăuga logica de afișare a unui mesaj de eroare pentru utilizator, dacă este cazul
    } finally {
      // window.location.reload();
      // setIsLoading(false); // Setează isLoading la false indiferent dacă ștergerea a reușit sau a eșuat
      handleCloseModal();
    }
  };

  const handleUpdateProfile = async (event) => {
    setButtonPressed(true);
    setIsLoading(true);
    event.preventDefault();
    const emailNew = emailWithoutSpace(email);
    // Verifică dacă parola este confirmată corect și apoi creează utilizatorul
    try {
      let user_uid = currentUser.uid;
      let lg = {};
      let images = {};

      if (logo.length === 0) {
        setIsLoading(false);
        setButtonPressed(false);
        showAlert("Selelctati poza profil", "danger");
        return;
      }

      if (
        !email ||
        !numeContact ||
        !telefonContact ||
        !judet ||
        !localitate ||
        !adresaSediu
      ) {
        setIsLoading(false);
        return;
      }

      if (isNewLogo) {
        lg = await uploadImage(logo, true, "ProfileLogo", deletedLogo);
      } else {
        if (!logo[0].fileName) {
          lg = await uploadImage(logo, false, "ProfileLogo");
        } else {
          lg = logo[0];
        }
      }

      let data = {
        cui,
        localitate: judet === "Bucuresti" ? "Bucuresti" : localitate,
        sector: judet === "Bucuresti" ? sector : "",
        judet,
        telefonContact,
        numeContact,
        email: emailNew,
        denumireBrand,
        user_uid,
        userType: "Partener",
        adresaSediu,
        gradient: { selectedId, gradientSelected },
        googleMapsLink,
        coordonate,
        logo: lg,
        images,
        descriere,
      };
      setUserData(data);
      const actionText = describeChanges();
      await handleUpdateFirestore(
        `UsersUber/${user_uid}`,
        data,
        actionText
      ).then(() => {
        setIsLoading(false);
        setButtonPressed(false);
        showAlert("Actualizare cu succes!", "success");
      });
    } catch (error) {
      setIsLoading(false);
      setButtonPressed(false);
      showAlert(`Eroare la Actualizare: ${error.message}`, "danger");
      console.error("Error actualizare profil partener: ", error);
    }
  };

  //select multiple images
  const multipleImage = (e) => {
    // checking is same file matched with old stored array
    const isExist = propertySelectedImgs?.some((file1) =>
      selectedFiles(e)?.some((file2) => file1.name === file2.name)
    );

    if (!isExist) {
      setPropertySelectedImgs((old) => [...old, ...selectedFiles(e)]);
      setIsNewImage(true);
    } else {
      alert("You have selected one image already!");
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

  // delete image
  const deleteImage = (item) => {
    console.log("itemmm....", item);
    console.log(item);
    // Filtrăm imaginile rămase
    const deleted = propertySelectedImgs?.filter((file) =>
      file instanceof File ? file.name !== item.name : file !== item
    );

    // Setăm imaginile rămase
    setPropertySelectedImgs(deleted);

    // Verificăm dacă elementul șters nu este o instanță a clasei File și, în caz afirmativ, îl adăugăm la setDeletedImages
    const isDeletedNotFile = propertySelectedImgs?.find(
      (file) =>
        (file instanceof File ? file.name === item.name : file === item) &&
        !(item instanceof File)
    );

    if (isDeletedNotFile) {
      setDeletedImages((prevDeletedImages) => [...prevDeletedImages, item]);
      setIsNewImage(true);
    }
  };

  // Handler pentru schimbarea selectiei de judete
  const handleJudetChange = async (e) => {
    const judetSelectedName = e.target.value; // Numele județului selectat, un string
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

  return (
    <div className="row">
      <div className="col-lg-12">
        <h3 className="mb30">Poza profil</h3>
      </div>
      {/* End .col */}

      <LogoUpload
        singleImage={singleImage}
        deleteLogo={deleteLogo}
        logoImg={logo}
        isEdit={isEdit}
        isNewImage={isNewLogo}
        text={"Drag and drop Logo"}
      />
      {/* End .col */}

      <div className="col-lg-6 col-xl-6">
        <div className="my_profile_setting_input form-group">
          <label htmlFor="formGroupExampleEmail">Email</label>
          <input
            type="email"
            className={`form-control ${
              !email && buttonPressed && "border-danger"
            }`}
            id="formGroupExampleEmail"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>
      </div>
      {/* End .col */}

      <div className="col-lg-6 col-xl-6">
        <div className="my_profile_setting_input form-group">
          <label htmlFor="formGroupExampleInput3">Nume si prenume</label>
          <input
            type="text"
            className={`form-control ${
              !numeContact && buttonPressed && "border-danger"
            }`}
            id="formGroupExampleInput3"
            value={numeContact}
            onChange={(e) => setNumeContact(e.target.value)}
          />
        </div>
      </div>
      {/* End .col */}

      <div className="col-lg-6 col-xl-6">
        <div className="my_profile_setting_input form-group">
          <label htmlFor="formGroupExampleInput4">Numar de telefon</label>
          <input
            type="text"
            className={`form-control ${
              !telefonContact && buttonPressed && "border-danger"
            }`}
            id="formGroupExampleInput4"
            value={telefonContact}
            onChange={(e) => setTelefonContact(e.target.value)}
          />
        </div>
      </div>
      {/* End .col */}

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
            onChange={handleJudetChange}
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
            {localitati.map((location, index) => (
              <option key={index} value={location.localitate}>
                {location.localitate}
              </option>
            ))}
          </select>
        </div>
      </div>
      {/* End .col */}

      {/* 
      <div className="col-lg-6 col-xl-6">
        <div className="my_profile_setting_input ui_kit_select_search form-group">
          <label>Specializare</label>
          <select
            className={`selectpicker form-select ${
              !categorie && buttonPressed && "border-danger"
            }`}
            data-live-search="true"
            data-width="100%"
            value={categorie}
            onChange={(e) => setCategorie(e.target.value)}
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
      </div> */}
      {/* End .col */}

      {/* <div className="col-lg-12 col-xl-12">
        <div className="my_profile_setting_input ui_kit_select_search form-group">
          <label>Alege o culoare pentru cardul de fidelitate</label>
          <GradientSelect
            options={options}
            selectedId={selectedId}
            gradientSelected={gradientSelected}
            setSelectedGradient={setGradientSelected}
            setSelectedId={setSelectedId}
          />
        </div>
      </div> */}
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

      <div className="col-lg-12 col-xl-12">
        <div className="my_profile_setting_input ui_kit_select_search form-group">
          <label>Adresa</label>
        </div>
      </div>
      {/* End .col */}
      <AutocompleteInput
        onPlaceChanged={handleLocationSelect}
        adresa={adresaSediu}
        buttonPressed={buttonPressed}
      />
      {/* End .col */}

      <div className="col-xl-12 text-right mt-4">
        <div className="my_profile_setting_input">
          {/* <button className="btn btn1">Actualizeaza Profil</button> */}
          <button className="btn btn2" onClick={handleUpdateProfile}>
            {isLoading ? <CommonLoader /> : "Actualizeaza Profil"}
          </button>
        </div>
      </div>
      {/* End .col */}

      <AlertModal
        message={alert.message}
        type={alert.type}
        onClose={closeAlert}
      />
      {showModal ? (
        <PasswordDialog
          handleCloseModal={handleCloseModal}
          handleConfirm={handleConfirm}
        />
      ) : null}
    </div>
  );
};

export default ProfileInfo;
