"use client";

import { useAuth } from "@/context/AuthContext";
import { authentication, db } from "@/firebase";
import { handleFirebaseAuthError } from "@/utils/authUtils";
import axios from "axios";
import {
  getFirestoreCollectionLength,
  handleQueryFirestoreSubcollection,
  handleUploadFirestore,
} from "@/utils/firestoreUtils";
import {
  emailWithoutSpace,
  formatTitulatura,
  revertTitulatura,
} from "@/utils/strintText";
import { getCurrentDateTime } from "@/utils/timeUtils";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
} from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { use, useRef, useState } from "react";
import { AlertModal } from "../AlertModal";
import useDataNasterii from "@/hooks/useDataNasterii";
import AutocompleteInput from "../AutocompleteInput";
import { TITLES_AND_SPECIALTIES } from "@/utils/constanteTitulatura";

const LoginSignupUtilizator = () => {
  const { userData, currentUser, setCurrentUser, setUserData, judete } =
    useAuth();
  const {
    dataNasterii,
    handleDayChange,
    handleMonthChange,
    handleYearChange,
    setDataNasterii,
  } = useDataNasterii("");
  const closeButtonRef = useRef(null); // Referință pentru butonul de închidere
  const [localitati, setLocalitati] = useState([]);
  const [judet, setJudet] = useState("");
  const [localitate, setLocalitate] = useState("");
  const [sector, setSector] = useState(userData?.sector || "");
  const [isJudetSelected, setIsJudetSelected] = useState(true);
  const [isLocalitateSelected, setIsLocalitateSelected] = useState(true);
  const [isCateogireSelected, setIsCategorieSelected] = useState(true);
  const [isTermsAccepted, setIsTermsAccepted] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [numeUtilizator, setNumeUtilizator] = useState("");
  const [telefon, setTelefon] = useState("");
  // const [dataNasterii, setDataNasterii] = useState("");
  const [tipEnitate, setTipEnitate] = useState("");
  const [specializare, setSpecializare] = useState("");
  const [cuim, setCuim] = useState("");
  const [cif, setCIF] = useState("");
  const [codParafa, setCodParafa] = useState("");
  const [titulaturaSelectata, setTitulaturaSelectata] = useState("");
  const [alert, setAlert] = useState({ message: "", type: "" });
  const [buttonPressed, setButtonPressed] = useState(false);
  const [isNoCuimCifCodParafa, setIsNoCuimCifCodParafa] = useState(false);
  const [passwordError, setPasswordError] = useState("");
  const [confirmPasswordError, setConfirmPasswordError] = useState("");
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [confirmPasswordVisible, setConfirmPasswordVisible] = useState(false);
  const [inputType, setInputType] = useState("text");
  const [adresaSediu, setAdresaSediu] = useState("");
  const [googleMapsLink, setGoogleMapsLink] = useState("");
  // const [titulatura, setTitulatura] = useState("");
  // const [specialitate, setSpecialitate] = useState("");
  const [titulatura, setTitulatura] = useState([]);
  const [specialitate, setSpecialitate] = useState([]);
  const [specialitati, setSpecialitati] = useState([]);
  const [coordonate, setCoordonate] = useState({});
  const router = useRouter();

  // Noua stare pentru controlul etapelor de înregistrare
  const [registrationStep, setRegistrationStep] = useState(1);

  // Funcțiile existente pentru selectarea din <select> (păstrate, deși nu vor fi folosite acum în checkbox-uri)
  const handleTitleChange = (event) => {
    const selectedTitles = Array.from(event.target.selectedOptions, option => option.value);
    setTitulatura(selectedTitles);
    
    // Agregăm specialitățile pentru toate titulaturile selectate
    const aggregatedSpecialties = Array.from(new Set(
      selectedTitles.reduce((acc, title) => {
        return acc.concat(TITLES_AND_SPECIALTIES[title] || []);
      }, [])
    ));
    
    setSpecialitati(aggregatedSpecialties);
    setSpecialitate([]); // Resetăm selecția de specialități
  };

  const handleSpecialtyChange = (event) => {
    const selectedSpecialties = Array.from(event.target.selectedOptions, option => option.value);
    setSpecialitate(selectedSpecialties);
    setSpecializare(selectedSpecialties); // Dacă dorești aceeași structură
  };

  const showAlert = (message, type) => {
    setAlert({ message, type });
  };

  const closeAlert = () => {
    setAlert({ message: "", type: "" });
  };

  const handleJudetChange = async (e) => {
    const judetSelectedName = e.target.value; // Numele județului selectat, un string
    console.log("judetSelectedName...", judete);
    setJudet(judetSelectedName);
    setIsJudetSelected(!!judetSelectedName);

    // Găsește obiectul județului selectat bazat pe `judet`
    const judetSelected = judete.find(
      (judet) => judet.judet === judetSelectedName
    );

    if (judetSelected) {
      console.log("judetSelected...", judetSelected);
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

  const handleReset = () => {
    setEmail("");
    setPassword("");
    setConfirmPassword("");
    setNumeUtilizator("");
    setTelefon("");
    setDataNasterii("");
    setJudet("");
    setLocalitate("");
    setTitulatura([]);
    setSpecializare("");
    setCuim("");
    setButtonPressed(false);
    setAdresaSediu("");
    setGoogleMapsLink("");
    setCoordonate({});
    // Resetăm și etapa de înregistrare la început
    setRegistrationStep(1);
  };

  const handleLocationSelect = (lat, lng, adresa, urlMaps) => {
    console.log(`Selected location - Lat: ${lat}, Lng: ${lng}`);
    setAdresaSediu(adresa);
    setGoogleMapsLink(urlMaps);
    setCoordonate({ lat, lng });
    // Aici poți actualiza starea sau trimite aceste date către backend
  };

  const handleLogIn = async (event) => {
    console.log(userData);
    event.preventDefault();
    setButtonPressed(true);

    if (!password || !email) {
      return;
    }

    signInWithEmailAndPassword(authentication, email, password)
      .then(async (userCredentials) => {
        setCurrentUser(userCredentials);
        console.log("success login");
        if (closeButtonRef.current) {
          closeButtonRef.current.click();
        }
        // router.push("/panou-utilizator"); // Redirecționează după ce mesajul de succes este afișat și închis
        router.refresh(); // Redirecționează după ce mesajul de succes este afișat și închis
      })
      .catch((error) => {
        const errorMessage = handleFirebaseAuthError(error);
        showAlert(`Eroare la autentificare: ${errorMessage}`, "danger");

        // Aici puteți folosi errorMessage pentru a afișa un snackbar sau un alert
        // setShowSnackback(true);
        // setMessage(errorMessage);

        console.log("error on sign in user...", error.message);
        console.log("error on sign in user...", error.code);
      });
  };

  const handleSignUp = async (event) => {
    event.preventDefault();
    const emailNew = emailWithoutSpace(email);
    setButtonPressed(true);
    // Verifică dacă parola este confirmată corect și apoi creează utilizatorul
    if (password !== confirmPassword) {
      setConfirmPasswordError("Parolele nu corespund.");
      return;
    } else {
      setConfirmPasswordError("");
    }

    if (password.length < 6) {
      setPasswordError("Parola este prea scurtă");
      return;
    } else {
      setPasswordError("");
    }

    if (
      !email ||
      !numeUtilizator ||
      !telefon ||
      !judet ||
      !localitate ||
      !password
    ) {
      console.log("noo...", email);
      console.log("noo...", numeUtilizator);
      console.log("noo...", telefon);
      console.log("noo...", judet);
      console.log("noo...", localitate);
      console.log("noo...", dataNasterii);
      console.log("noo...", adresaSediu);
      console.log("noo...", password);
      console.log("noo...", confirmPassword);
      return;
    }

    try {
      const userCredential = await createUserWithEmailAndPassword(
        authentication,
        emailNew,
        password
      );
      let user_uid = userCredential.user.uid;
      console.log(
        "User created successfully with email: ",
        userCredential.user
      );
      const collectionLength = await getFirestoreCollectionLength("UsersUber");
      let id = collectionLength + 1;
      const dateTime = getCurrentDateTime();
      // Apel către endpoint-ul de creare Stripe Express
      // const stripeResponse = await axios.post("/api/create-account-stripe", {
      //   email, // poți trimite email-ul specialistului
      // });
      // const stripeAccountId = stripeResponse.data.accountId;

      let data = {
        id,
        cuim,
        codParafa,
        cif,
        specialitateQ: specialitate, // dacă nu trebuie formatare suplimentară
        specialitate,
        specializare: specialitate,
        titulaturaQ: titulatura.map((t) => revertTitulatura(t)),
        titulatura: titulatura.map((t) => formatTitulatura(t)),
        tipEnitate,
        localitate: judet === "București" ? "București" : localitate,
        sector: judet === "București" ? sector : "",
        judet,
        dataNasterii,
        telefon,
        numeUtilizator,
        email,
        user_uid,
        userType: "Doctor",
        gradFidelitate: "Silver",
        statusCont: "Inactiv",
        rulajCont: 0,
        firstUploadDate: dateTime.date,
        firstUploadTime: dateTime.time,
        adresaSediu,
        googleMapsLink,
        coordonate,
        // stripeAccountId
      };

      const collectionId = "UsersUber";
      const documentId = user_uid;
      setDoc(doc(db, collectionId, documentId), data).then(() => {
        showAlert("Înregistrare cu succes!", "success");
      });
      setUserData(data);
      handleReset();
      if (closeButtonRef.current) {
        closeButtonRef.current.click();
      }
      setTimeout(() => {
        router.push("/panou-utilizator"); // Redirecționează după ce mesajul de succes este afișat și închis
      }, 3000); // Așteaptă să dispară alerta
    } catch (error) {
      console.error("Error signing up: ", error);
      const message = handleFirebaseAuthError(error);
      showAlert(`Eroare la înregistrare: ${message}`, "danger");
    }
  };

  const handleCheckboxTitleChange = (event) => {
    const { value, checked } = event.target;
    let updatedTitles;
    if (checked) {
      updatedTitles = [...titulatura, value];
    } else {
      updatedTitles = titulatura.filter((t) => t !== value);
    }
    setTitulatura(updatedTitles);

    // Agregăm specialitățile din toate titulaturile selectate
    const aggregatedSpecialties = Array.from(
      new Set(
        updatedTitles.reduce((acc, title) => {
          return acc.concat(TITLES_AND_SPECIALTIES[title] || []);
        }, [])
      )
    );
    setSpecialitati(aggregatedSpecialties);
    setSpecialitate([]); // Resetăm selecția de specialități
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
    setSpecializare(updatedSpecialties); // Dacă vrei aceeași structură
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
                  id="home-tab"
                  data-bs-toggle="tab"
                  href="#home"
                  role="tab"
                  aria-controls="home"
                  aria-selected="true"
                >
                  Autentificare
                </a>
              </li>
              {/* End login tab */}

              <li className="nav-item">
                <a
                  className="nav-link"
                  id="profile-tab"
                  data-bs-toggle="tab"
                  href="#profile"
                  role="tab"
                  aria-controls="profile"
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
            id="home"
            role="tabpanel"
            aria-labelledby="home-tab"
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
                    <h4>Autentificare specialist</h4>
                  </div>
                  {/* End heading */}

                  <hr />

                  <div className="input-group mb-2 mr-sm-2">
                    <input
                      type="text"
                      className={`form-control ${
                        !email && buttonPressed && "border-danger"
                      }`}
                      id="inlineFormInputGroupUsername2"
                      placeholder="Email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                    />
                    <div className="input-group-prepend">
                      <div className="input-group-text">
                        <i className="flaticon-user"></i>
                      </div>
                    </div>
                  </div>
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

                  <button
                    type="submit"
                    className="btn btn-log w-100 btn-thm"
                  >
                    <span
                      style={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                      }}
                    >
                      <Image
                        src="/assets/images/iconite/cadremedicale2.png"
                        alt="Cadre medicale Icon"
                        width={35}
                        height={35}
                        priority
                        className="loginImg"
                      />
                      <span style={{ marginLeft: 8 }}>Autentificare</span>
                    </span>
                  </button>
                  {/* End submit button */}
                </form>
              </div>
              {/* End .col .login_form */}
            </div>
          </div>
          {/* End .tab-pane */}

          <div
            className="row mt25 tab-pane fade justify-content-center"
            id="profile"
            role="tabpanel"
            aria-labelledby="profile-tab"
          >
            <form onSubmit={handleSignUp} action="#" className="row">
              {registrationStep === 1 && (
                <>
                  {/* Etapa 1: Toate câmpurile, cu excepția selectării titulaturilor și specialităților */}
                  <div className="col-lg-6 col-xl-6">
                    <div className="sign_up_form">
                      <div className="heading">
                        <h4>Înregistrare specialist - Pasul 1</h4>
                      </div>
                      <div className="form-group input-group mb-3">
                        <input
                          type="text"
                          className={`form-control ${
                            !numeUtilizator && buttonPressed && "border-danger"
                          }`}
                          id="exampleInputName"
                          placeholder="Nume utilizator"
                          value={numeUtilizator}
                          onChange={(e) => setNumeUtilizator(e.target.value)}
                        />
                        <div className="input-group-prepend">
                          <div className="input-group-text">
                            <i className="flaticon-user"></i>
                          </div>
                        </div>
                      </div>

                      <AutocompleteInput
                        onPlaceChanged={handleLocationSelect}
                        adresaSediu={adresaSediu}
                        buttonPressed={buttonPressed}
                      />

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

                      <div className="form-group input-group mb-3">
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

                      <div className="form-group input-group mb-3">
                        <input
                          type={passwordVisible ? "text" : "password"}
                          className={`form-control ${
                            !confirmPassword && buttonPressed && "border-danger"
                          }`}
                          id="exampleInputPassword3"
                          placeholder="Confirma Parola"
                          value={confirmPassword}
                          onChange={(e) =>
                            setConfirmPassword(e.target.value)
                          }
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

                      {passwordError && (
                        <div
                          style={{
                            color: "red",
                            fontSize: "0.875rem",
                            marginBottom: "1rem",
                          }}
                        >
                          {passwordError}
                        </div>
                      )}

                      {confirmPasswordError && (
                        <div
                          style={{
                            color: "red",
                            fontSize: "0.875rem",
                            marginBottom: "1rem",
                          }}
                        >
                          {confirmPasswordError}
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="col-lg-6 col-xl-6">
                    <div className="sign_up_form">
                      <div className="form-group input-group mb-3">
                        <input
                          type="text"
                          className={`form-control ${
                            !telefon && buttonPressed && "border-danger"
                          }`}
                          id="exampleInputName"
                          placeholder="Număr de telefon"
                          value={telefon}
                          onChange={(e) => setTelefon(e.target.value)}
                        />
                        <div className="input-group-prepend">
                          <div className="input-group-text">
                            <i className="flaticon-user"></i>
                          </div>
                        </div>
                      </div>

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
                          <option data-tokens="SelectRole">Judet</option>
                          {judete &&
                            judete.map((j, index) => (
                              <option key={index} value={j.judet}>
                                {j.judet}
                              </option>
                            ))}
                        </select>
                      </div>

                      <div className="form-group ui_kit_select_search mb-3">
                        <select
                          className={`form-select ${
                            !localitate && buttonPressed && "border-danger"
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
                          <option data-tokens="SelectRole">Localitate</option>
                          {localitati.map((loc, index) => (
                            <option key={index} value={loc.localitate}>
                              {loc.localitate}
                            </option>
                          ))}
                        </select>
                      </div>

                      {/* Buton pentru a trece la pasul 2 */}
                      <button
                        type="button"
                        className="btn btn-log w-100 btn-thm"
                        onClick={() => setRegistrationStep(2)}
                      >
                        Continuă
                      </button>
                    </div>
                  </div>
                </>
              )}

              {registrationStep === 2 && (
                <>
                  {/* Etapa 2: Selectarea titulaturilor și specialităților, afișate în 2 coloane cu scroll vertical */}
                  <div className="col-12">
                    <div className="row">
                      <div className="col-md-6" style={{ maxHeight: "300px", overflowY: "auto" }}>
                        <div className="sign_up_form">
                          <div className="heading">
                            <h4>Înregistrare specialist - Pasul 2</h4>
                          </div>
                          <div className="form-group mb-3">
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
                      </div>
                      <div className="col-md-6" style={{ maxHeight: "300px", overflowY: "auto" }}>
                        <div className="sign_up_form">
                          <div className="form-group mb-3">
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
                  </div>

                  <div className="col-12 mt30">
                    <div className="sign_up_form">
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
                      <div className="d-flex justify-content-between">
                        <button
                          type="button"
                          className="btn btn-secondary"
                          onClick={() => setRegistrationStep(1)}
                        >
                          Înapoi
                        </button>
                        <button
                          type="submit"
                          className="btn btn-log btn-thm"
                          disabled={!isTermsAccepted}
                        >
                          Înregistrare
                        </button>
                      </div>
                    </div>
                  </div>
                </>
              )}
            </form>
          </div>
          {/* End .tab-pane */}
        </div>
      </div>
      <AlertModal message={alert.message} type={alert.type} onClose={closeAlert} />
    </div>
  );
};

export default LoginSignupUtilizator;
