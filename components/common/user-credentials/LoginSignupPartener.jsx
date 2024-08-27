"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
} from "firebase/auth";
import { authentication, db } from "@/firebase";
import {
  getFirestoreCollectionLength,
  handleGetFirestore,
  handleQueryFirestoreSubcollection,
  handleUploadFirestore,
} from "@/utils/firestoreUtils";
import { emailWithoutSpace } from "@/utils/strintText";
import { useAuth } from "@/context/AuthContext";
import { handleFirebaseAuthError, handleSignIn } from "@/utils/authUtils";
import { doc, setDoc } from "firebase/firestore";
import AutocompleteInput from "../AutocompleteInput";
import { getCurrentDateTime } from "@/utils/timeUtils";
import { closeSignupModal } from "@/utils/commonUtils";
import { AlertModal } from "../AlertModal";
import { useRouter } from "next/navigation";

const LoginSignupPartener = () => {
  const { userData, currentUser, setCurrentUser, setUserData, judete } =
    useAuth();
  const closeButtonRef = useRef(null); // Referință pentru butonul de închidere
  const [localitati, setLocalitati] = useState([]);
  const [judet, setJudet] = useState("");
  const [localitate, setLocalitate] = useState("");
  const [isJudetSelected, setIsJudetSelected] = useState(true);
  const [isLocalitateSelected, setIsLocalitateSelected] = useState(true);
  const [isCateogireSelected, setIsCategorieSelected] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [cuiAlready, setCuiAlready] = useState(false);
  const router = useRouter();
  const [isTermsAccepted, setIsTermsAccepted] = useState(false);
  const [denumireBrand, setDenumireBrand] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [confirmPasswordError, setConfirmPasswordError] = useState("");
  const [numeContact, setNumeContact] = useState("");
  const [telefonContact, setTelefonContact] = useState("");

  const [categorie, setCategorie] = useState("Autovehicule");
  const [cui, setCui] = useState("");
  const [adresaSediu, setAdresaSediu] = useState("");
  const [googleMapsLink, setGoogleMapsLink] = useState("");
  const [coordonate, setCoordonate] = useState({});
  const [alert, setAlert] = useState({ message: "", type: "" });
  const [buttonPressed, setButtonPressed] = useState(false);

  const [passwordVisible, setPasswordVisible] = useState(false);
  const [confirmPasswordVisible, setConfirmPasswordVisible] = useState(false);

  const showAlert = (message, type) => {
    setAlert({ message, type });
  };

  const closeAlert = () => {
    setAlert({ message: "", type: "" });
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

  const handleLocationSelect = (lat, lng, adresa, urlMaps) => {
    console.log(`Selected location - Lat: ${lat}, Lng: ${lng}`);
    setAdresaSediu(adresa);
    setGoogleMapsLink(urlMaps);
    setCoordonate({ lat, lng });
    // Aici poți actualiza starea sau trimite aceste date către backend
  };

  const handleReset = () => {
    setDenumireBrand("");
    setEmail("");
    setPassword("");
    setConfirmPassword("");
    setNumeContact("");
    setTelefonContact("");
    setJudet("");
    setLocalitate("");
    setCategorie("");
    setCui("");
    setAdresaSediu("");
    setGoogleMapsLink("");
    setCoordonate({});
    setButtonPressed(false);
  };

  const handleLogIn = async (event) => {
    event.preventDefault();
    setButtonPressed(true);
    // console.log(userData);
    // console.log(currentUser);

    if (!password || !email) {
      return;
    }

    // setUserData(utilizator[0]);

    handleSignIn(email, password)
      .then((userCredentials) => {
        console.log("user credentials...", userCredentials);
        setCurrentUser(userCredentials); // Aici trebuie să asiguri că userCredentials este gestionat corect
        if (closeButtonRef.current) {
          closeButtonRef.current.click();
        }
        // router.push("/panou-partener");
        router.refresh();
      })
      .catch((error) => {
        console.error("Error during sign in:", error.message);
        console.error("Error during sign in:", error.code);
        const errorMessage = handleFirebaseAuthError(error);
        showAlert(`Eroare la autentificare: ${errorMessage}`, "danger");
        // setError("Failed to log in. Error message: " + error.message); // Utilizează error.message pentru a oferi feedback utilizatorului
      });
  };

  const handleSignUp = async (event) => {
    setIsLoading(true);
    event.preventDefault();
    setButtonPressed(true);

    setPasswordError("");
    setConfirmPasswordError("");

    if (password.length < 6) {
      setPasswordError("Parola trebuie să fie de cel puțin 6 caractere.");
      setIsLoading(false);
      return;
    } else {
      setPasswordError("");
    }

    if (password !== confirmPassword) {
      setIsLoading(false);
      setConfirmPasswordError("Parolele nu corespund.");
      return;
    } else {
      setConfirmPasswordError("");
    }

    let utilizator = await handleQueryFirestoreSubcollection(
      "UsersUber",
      "cui",
      cui
    );

    if (utilizator?.length > 0) {
      setCuiAlready(true);
      showAlert(
        `Acest CUI este deja înregistrat în baza noastră de date!`,
        "danger"
      );
      return;
    } else {
      setCuiAlready(false);
    }

    if (
      !email ||
      !numeContact ||
      !telefonContact ||
      !judet ||
      !localitate ||
      !password ||
      !adresaSediu ||
      !confirmPassword
    ) {
      setIsLoading(false);
      return;
    }

    try {
      const emailFormatted = emailWithoutSpace(email);
      const userCredential = await createUserWithEmailAndPassword(
        authentication,
        emailFormatted,
        password
      );
      console.log(
        "User created successfully with email: ",
        userCredential.user
      );
      const collectionLength = await getFirestoreCollectionLength("UsersUber");
      let id = collectionLength + 1;
      const dateTime = getCurrentDateTime();
      const user_uid = userCredential.user.uid;
      const userData = {
        id,
        email: emailFormatted,
        denumireBrand,
        numeContact,
        telefonContact,
        judet,
        localitate: judet === "Bucuresti" ? "Bucuresti" : localitate,
        sector: judet === "Bucuresti" ? localitate : "",
        categorie,
        cui,
        adresaSediu,
        googleMapsLink,
        coordonate,
        userType: "Partener",
        statusCont: "Inactiv",
        firstUploadDate: dateTime.date,
        firstUploadTime: dateTime.time,
        user_uid,
        gradFidelitate: "Platinum",
      };

      await setDoc(doc(db, "UsersUber", user_uid), userData).then(() => {
        showAlert("Înregistrare cu succes!", "success");
      });
      setUserData(userData);
      handleReset();
      setIsLoading(false);
      setTimeout(() => {
        if (closeButtonRef.current) {
          closeButtonRef.current.click();
        }
        router.push("/profil-partener");
      }, 3000);
    } catch (error) {
      setIsLoading(false);
      console.error("Eroare la crearea doctorului: ", error);
      const message = handleFirebaseAuthError(error);
      showAlert(`Eroare la înregistrare: ${message}`, "danger");
    }
  };

  return (
    <div className="modal-content">
      <div className="modal-header">
        <button
          type="button"
          data-bs-dismiss="modal"
          aria-label="Close"
          className="btn-close"
          onClick={handleReset}
          ref={closeButtonRef}
        ></button>
      </div>
      {/* End .modal-header */}

      <div className="modal-body container pb20">
        <div className="row">
          <div className="col-lg-12">
            <ul className="sign_up_tab nav nav-tabs" id="myTab" role="tablist">
              <li className="nav-item">
                <a
                  className="nav-link active"
                  id="authpartener-tab"
                  data-bs-toggle="tab"
                  href="#authpartener"
                  role="tab"
                  aria-controls="authpartener"
                  aria-selected="true"
                >
                  Autentificare
                </a>
              </li>
              {/* End login tab */}

              <li className="nav-item">
                <a
                  className="nav-link"
                  id="partener-tab"
                  data-bs-toggle="tab"
                  href="#partener"
                  role="tab"
                  aria-controls="partener"
                  aria-selected="false"
                >
                  Înregistrare
                </a>
              </li>
              {/* End Register tab */}
            </ul>
            {/* End .sign_up_tab */}
          </div>
        </div>
        {/* End .row */}

        <div className="tab-content container" id="myTabContent">
          <div
            className="row mt25 tab-pane fade show active"
            id="authpartener"
            role="tabpanel"
            aria-labelledby="authpartener-tab"
          >
            <div className="col-lg-6 col-xl-6 d-none d-lg-block">
              <div className="login_thumb">
                <Image
                  width={357}
                  height={494}
                  className="img-fluid w100 h-100 cover"
                  src="/assets/images/resource/login.png"
                  alt="login.jpg"
                />
              </div>
            </div>
            {/* End col */}

            <div className="col-lg-6 col-xl-6">
              <div className="login_form">
                <form onSubmit={handleLogIn} action="#">
                  <div className="heading">
                    <h4>Autentificare Pacient</h4>
                  </div>
                  {/* End heading */}
                  {/* <div className="row mt25">
                    <div className="col-lg-12">
                      <button type="submit" className="btn btn-fb w-100">
                        <i className="fa fa-facebook float-start mt5"></i> Login
                        with Facebook
                      </button>
                    </div>
                    <div className="col-lg-12">
                      <button type="submit" className="btn btn-googl w-100">
                        <i className="fa fa-google float-start mt5"></i> Login
                        with Google
                      </button>
                    </div>
                  </div> */}
                  {/* End .row */}
                  <hr />
                  <div className="form-group input-group mb-3">
                    <input
                      type="email"
                      className={`form-control ${
                        !email && buttonPressed && "border-danger"
                      }`}
                      id="exampleInputEmail2"
                      placeholder="Email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                    />
                    <div className="input-group-prepend">
                      <div className="input-group-text">
                        <i className="fa fa-envelope-o"></i>
                      </div>
                    </div>
                  </div>
                  {/* End .row */}
                  {/* <div className="input-group mb-2 mr-sm-2">
                    <input
                      type="text"
                      className={`form-control ${
                        (!cui && buttonPressed) || (cuiAlready && buttonPressed)
                          ? "border-danger"
                          : null
                      }`}
                      id="inlineFormInputGroupUsername2"
                      placeholder="CUI"
                      value={cui}
                      onChange={(e) => setCui(e.target.value)}
                    />
                    <div className="input-group-prepend">
                      <div className="input-group-text">
                        <i className="flaticon-user"></i>
                      </div>
                    </div>
                  </div> */}
                  {/* End input-group */}
                  <div className="input-group form-group">
                    <input
                      type={passwordVisible ? "text" : "password"}
                      className={`form-control ${
                        !password && buttonPressed && "border-danger"
                      }`}
                      id="exampleInputPassword1"
                      placeholder="Parola"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                    />
                    <div className="input-group-prepend">
                      <div
                        className="input-group-text"
                        onClick={() => setPasswordVisible(!passwordVisible)}
                      >
                        <i
                          className={
                            passwordVisible ? "fas fa-eye" : "fas fa-eye-slash"
                          }
                        ></i>
                      </div>
                    </div>
                  </div>
                  {/* End input-group */}
                  {/* 
                  <div className="form-group form-check custom-checkbox mb-3">
                    <input
                      className="form-check-input"
                      type="checkbox"
                      value=""
                      id="remeberMe"
                    />
                    <label
                      className="form-check-label form-check-label"
                      htmlFor="remeberMe"
                    >
                      Rămâi conectat
                    </label>

                    <a className="btn-fpswd float-end" href="#">
                      Ai uitat parola?
                    </a>
                  </div> */}
                  {/* End remember me checkbox */}

                  <button
                    type="submit"
                    className="btn btn-log w-100 btn-thm"
                    // aria-label="Close" // data-bs-dismiss="modal"
                  >
                    <span
                      style={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                      }}
                    >
                      <Image
                        src="/assets/images/iconite/parteneri2.png"
                        alt="Cadre medicale Icon"
                        width={35} // Setează lățimea iconului
                        height={35} // Setează înălțimea iconului
                        priority // Încarcă imaginea cât mai rapid posibil
                      />
                      <span style={{ marginLeft: 8 }}>Autentificare</span>
                    </span>
                  </button>
                  {/* End submit button */}
                  {/* <p className="text-center">
                    Nu ai cont?{" "}
                    <a className="text-thm" href="#">
                      Înregistrează-te
                    </a>
                  </p> */}
                </form>
              </div>
              {/* End .col .login_form */}
            </div>
          </div>
          {/* End .tab-pane */}

          <div
            className="row mt25 tab-pane fade justify-content-center"
            id="partener"
            role="tabpanel"
            aria-labelledby="partener-tab"
          >
            <form onSubmit={handleSignUp} action="#" className="row">
              <div className="col-lg-6 col-xl-6">
                <div className="sign_up_form">
                  <div className="heading">
                    <h4>Înregistrare Pacient</h4>
                  </div>
                  {/* End .heading */}
                  <hr />
                  {/* <div className="row ">
                    <div className="col-lg-12">
                      <button type="submit" className="btn btn-fb w-100">
                        <i className="fa fa-facebook float-start mt5"></i> Login
                        with Facebook
                      </button>
                    </div>
                    <div className="col-lg-12">
                      <button type="submit" className="btn btn-googl w-100">
                        <i className="fa fa-google float-start mt5"></i> Login
                        with Google
                      </button>
                    </div>
                  </div> */}
                  {/* End .row */}

                  <div className="form-group input-group mb-3">
                    <input
                      type="text"
                      className={`form-control ${
                        !numeContact && buttonPressed && "border-danger"
                      }`}
                      id="exampleInputName"
                      placeholder="Nume si prenume"
                      value={numeContact}
                      onChange={(e) => setNumeContact(e.target.value)}
                    />
                    <div className="input-group-prepend">
                      <div className="input-group-text">
                        <i className="flaticon-user"></i>
                      </div>
                    </div>
                  </div>
                  {/* End .row */}

                  {/* <hr /> */}

                  {/* <div className="form-group input-group mb-3">
                    <input
                      type="text"
                      className={`form-control ${
                        !denumireBrand && buttonPressed && "border-danger"
                      }`}
                      id="exampleInputName"
                      placeholder="Denumire institutie"
                      value={denumireBrand}
                      onChange={(e) => setDenumireBrand(e.target.value)}
                    />
                    <div className="input-group-prepend">
                      <div className="input-group-text">
                        <i className="flaticon-user"></i>
                      </div>
                    </div>
                  </div> */}
                  {/* End .row */}

                  <AutocompleteInput
                    onPlaceChanged={handleLocationSelect}
                    adresaSediu={adresaSediu}
                    buttonPressed={buttonPressed}
                  />

                  {/* End .row */}

                  {/* <div className="form-group input-group mb-3">
                    <input
                      type="text"
                      className={`form-control ${
                        !cui && buttonPressed && "border-danger"
                      }`}
                      id="exampleInputName"
                      placeholder="CUI"
                      value={cui}
                      onChange={(e) => setCui(e.target.value)}
                    />
                    <div className="input-group-prepend">
                      <div className="input-group-text">
                        <i className="flaticon-user"></i>
                      </div>
                    </div>
                  </div> */}
                  {/* End .row */}

                  <div className="form-group ui_kit_select_search mb-3">
                    <select
                      className={`form-select ${
                        !judet && buttonPressed && "border-danger"
                      }`}
                      data-live-search="true"
                      data-width="100%"
                      value={judet}
                      onChange={handleJudetChange}
                    >
                      <option value="">Selectează județ</option>
                      {judete &&
                        judete.map((judet, index) => (
                          <option key={index} value={judet.judet}>
                            {judet.judet}
                          </option>
                        ))}
                    </select>
                  </div>
                  {/* End from-group */}

                  <div className="form-group ui_kit_select_search mb-3">
                    <select
                      className={`form-select ${
                        !localitate && buttonPressed && "border-danger"
                      }`}
                      data-live-search="true"
                      data-width="100%"
                      value={localitate}
                      onChange={(e) => setLocalitate(e.target.value)}
                    >
                      <option value="">Selectează localitate</option>
                      {localitati.map((location, index) => (
                        <option key={index} value={location.localitate}>
                          {location.localitate}
                        </option>
                      ))}
                    </select>
                  </div>
                  {/* End from-group */}

                  {/* End .form */}
                </div>
              </div>
              {/* End . left side image for register */}

              <div className="col-lg-6 col-xl-6">
                {/* End .row */}

                <div className="sign_up_form">
                  <div className="form-group input-group mb-3">
                    <input
                      type="text"
                      className={`form-control ${
                        !telefonContact && buttonPressed && "border-danger"
                      }`}
                      id="exampleInputName"
                      placeholder="Număr de telefon persoana de contact"
                      value={telefonContact}
                      onChange={(e) => setTelefonContact(e.target.value)}
                    />
                    <div className="input-group-prepend">
                      <div className="input-group-text">
                        <i className="flaticon-user"></i>
                      </div>
                    </div>
                  </div>
                  {/* End .row */}

                  <div className="form-group input-group mb-3">
                    <input
                      type="email"
                      className={`form-control ${
                        !email && buttonPressed && "border-danger"
                      }`}
                      id="exampleInputEmail2"
                      placeholder="Email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                    />
                    <div className="input-group-prepend">
                      <div className="input-group-text">
                        <i className="fa fa-envelope-o"></i>
                      </div>
                    </div>
                  </div>
                  {/* End .row */}

                  <div className="form-group input-group  mb-3">
                    <input
                      type={passwordVisible ? "text" : "password"}
                      className={`form-control ${
                        !password && buttonPressed && "border-danger"
                      }`}
                      id="exampleInputPassword2"
                      placeholder="Parola"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                    />
                    <div className="input-group-prepend">
                      <div
                        className="input-group-text"
                        onClick={() => setPasswordVisible(!passwordVisible)}
                      >
                        <i
                          className={
                            passwordVisible ? "fas fa-eye" : "fas fa-eye-slash"
                          }
                        ></i>
                      </div>
                    </div>
                  </div>
                  {/* End .row */}

                  {passwordError && (
                    <div
                      style={{
                        color: "red",
                        marginTop: "5px",
                        fontSize: "0.875rem",
                        marginTop: "0px",
                        marginBottom: "1rem",
                      }}
                    >
                      {passwordError}
                    </div>
                  )}

                  <div className="form-group input-group  mb-3">
                    <input
                      type={passwordVisible ? "text" : "password"}
                      className={`form-control ${
                        !confirmPassword && buttonPressed && "border-danger"
                      }`}
                      id="exampleInputPassword3"
                      placeholder="Confirma Parola"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                    />
                    <div className="input-group-prepend">
                      <div
                        className="input-group-text"
                        onClick={() => setPasswordVisible(!passwordVisible)}
                      >
                        <i
                          className={
                            passwordVisible ? "fas fa-eye" : "fas fa-eye-slash"
                          }
                        ></i>
                      </div>
                    </div>
                  </div>
                  {/* End .row */}

                  {confirmPasswordError && (
                    <div
                      style={{
                        color: "red",
                        marginTop: "5px",
                        fontSize: "0.875rem",
                        marginTop: "0px",
                        marginBottom: "1rem",
                      }}
                    >
                      {confirmPasswordError}
                    </div>
                  )}

                  {/* <div className="form-group ui_kit_select_search mb-3">
                    <select
                      className={`form-select ${
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
                  </div> */}
                  {/* End from-group */}

                  {/* <div className="form-group input-group mb-3">
                    <input
                      type="text"
                      className="form-control"
                      id="exampleInputName"
                      placeholder="Adresa sediu"
                      value={adresaSediu}
                      onChange={(e) => setAdresaSediu(e.target.value)}
                    />
                    <div className="input-group-prepend">
                      <div className="input-group-text">
                        <i className="flaticon-user"></i>
                      </div>
                    </div>
                  </div> */}
                  {/* End .row */}

                  {/* End .form */}
                </div>
              </div>
              <div className="form-group form-check custom-checkbox mb-3">
                <input
                  className="form-check-input"
                  type="checkbox"
                  value=""
                  id="terms"
                  onChange={(e) => setIsTermsAccepted(e.target.checked)}
                />
                <label
                  className="form-check-label form-check-label"
                  htmlFor="terms"
                >
                  Accept{" "}
                  <Link href={"/termeni-confidentialitate"}>
                    termenii si conditiile.
                  </Link>
                </label>
              </div>
              {/* End from-group */}

              <button
                type="submit"
                className="btn btn-log w-100 btn-thm"
                // data-bs-dismiss="modal"
                disabled={!isTermsAccepted}
              >
                înregistrare
              </button>
              {/* End btn */}

              {/* <p className="text-center">
                Aveti cont?{" "}
                <a className="text-thm" href="#">
                  Autentificati-va
                </a>
              </p> */}
              {/* End register content */}
            </form>
          </div>
          {/* End .tab-pane */}
        </div>
      </div>

      <AlertModal
        message={alert.message}
        type={alert.type}
        onClose={closeAlert}
      />
    </div>
  );
};

export default LoginSignupPartener;
