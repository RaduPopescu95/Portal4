"use client";

import { useAuth } from "@/context/AuthContext";
import { handleUploadFirestoreSubcollection } from "@/utils/firestoreUtils";
import { handleUploadDocs } from "@/utils/storageUtils";
import React, { useState } from "react";
import { AlertModal } from "../common/AlertModal";
import CommonLoader from "../common/CommonLoader";

const ReviewBox = ({ partener, oferta, titluOferta }) => {
  const { userData } = useAuth();
  const [files, setFiles] = useState([]);
  const [name, setName] = useState(userData?.numeUtilizator || "");
  const [contactNumber, setContactNumber] = useState(userData?.telefon || "");
  const [email, setEmail] = useState(userData?.email || "");
  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const utilizator = userData;

  const [alert, setAlert] = useState({ message: "", type: "" });

  const showAlert = (message, type) => {
    setAlert({ message, type });
  };

  const closeAlert = () => {
    setAlert({ message: "", type: "" });
  };

  // Funcția de reset
  const resetForm = () => {
    setFiles([]);
    setName(userData?.numeUtilizator || "");
    setContactNumber(userData?.telefon || "");
    setEmail(userData?.email || "");
    setMessage("");
  };

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      setFiles([...files, file]);
    }
  };

  const handleRemoveFile = (index) => {
    setFiles(files.filter((_, i) => i !== index));
  };

  const isFormValid = () => {
    return name && contactNumber && email && message && files.length > 0;
  };

  const handleTrimiteCerere = async (e) => {
    e.preventDefault(); // Previne comportamentul default al formularului de a reîncărca pagina
    setIsLoading(true); // Setează starea de încărcare la true pentru a indica începutul procesului
    // console.log("numele oferte....", oferte.titluOferta);
    try {
      const docsUrls = await handleUploadDocs(files); // Încarcă documentele și obține URL-urile
      const data = {
        docsUrls,
        name,
        contactNumber,
        email,
        message,
        partener,
        utilizator,
        idUtilizator: userData.user_uid,
        titluOferta,
        oferta,
      }; // Creează un obiect de date cu informațiile necesare
      // console.log("numele oferte....", oferte.titluOferta);
      const actionText = `${name} a trimis o cerere de aplicare pentru anuntul ${titluOferta} catre ${partener.denumireBrand}`;

      // Încarcă datele în Firestore și gestionează succesele și eșecurile
      await handleUploadFirestoreSubcollection(
        data,
        `UsersUber/${partener.user_uid}/Cereri`,
        partener.user_uid,
        actionText
      );

      // Dacă totul a funcționat, resetează formularul
      resetForm();
      // Afișează un alert de succes
      showAlert(`Cerere trimisa cu succes!`, "success");
    } catch (error) {
      // Afișează un alert de eroare dacă ceva nu funcționează
      showAlert(`A apărut o eroare: ${error.message}`, "danger");
      console.error("Eroare la trimiterea cererii:", error);
    } finally {
      // Asigură-te că setIsLoading(false) se execută indiferent de rezultat
      setIsLoading(false);
    }
  };

  return (
    <>
      <form className="comments_form" onSubmit={handleTrimiteCerere}>
        <div className="form-group">
          <input
            type="text"
            className="form-control"
            placeholder="Nume*"
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </div>
        <div className="form-group">
          <input
            type="number"
            className="form-control"
            placeholder="Numar de contact*"
            required
            value={contactNumber}
            onChange={(e) => setContactNumber(e.target.value)}
          />
        </div>
        <div className="form-group">
          <input
            type="email"
            className="form-control"
            placeholder="Email*"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>
        <div className="form-group">
          <textarea
            className="form-control"
            rows="6"
            placeholder="Mesaj*"
            required
            value={message}
            onChange={(e) => setMessage(e.target.value)}
          ></textarea>
        </div>

        <div className="form-group mb5">
          <label htmlFor="documentUpload" className="btn btn-primary">
            <span style={{ color: "black" }}>Încarcă document</span>
            <input
              type="file"
              className="form-control-file"
              id="documentUpload"
              style={{ display: "none" }}
              onChange={handleFileChange}
            />
          </label>
        </div>

        {files.length > 0 && (
          <ul className="list-group mb-3">
            {files.map((file, index) => (
              <li
                key={index}
                className="list-group-item d-flex justify-content-between align-items-center"
              >
                {file.name}
                <button
                  type="button"
                  className="btn btn-danger btn-sm"
                  onClick={() => handleRemoveFile(index)}
                >
                  Șterge
                </button>
              </li>
            ))}
          </ul>
        )}

        <button
          type="submit"
          className={`btn ${isFormValid() ? "btnEnabled" : "btnDisabled"}`}
          disabled={!isFormValid()}
        >
          {isLoading ? <CommonLoader /> : "Trimite"}
        </button>
      </form>
      <AlertModal
        message={alert.message}
        type={alert.type}
        onClose={closeAlert}
      />
    </>
  );
};

export default ReviewBox;
