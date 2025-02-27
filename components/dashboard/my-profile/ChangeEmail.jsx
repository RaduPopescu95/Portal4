"use client";

import { AlertModal } from "@/components/common/AlertModal";
import { useAuth } from "@/context/AuthContext";
import { authentication } from "@/firebase";
import {
  handleChangeEmail,
  handleChangePassword,
  handleFirebaseAuthError,
} from "@/utils/authUtils";
import {
  handleUpdateFirestore,
  handleUploadFirestore,
} from "@/utils/firestoreUtils";
import { updatePassword } from "firebase/auth";
import { useState } from "react";

const ChangeEmail = () => {
  const { userData, currentUser, setCurrentUser, setUserData, judete } =
    useAuth();
  const [oldPassword, setOldPassword] = useState("");
  const [emailNew, setEmail] = useState(userData?.email || "");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [alert, setAlert] = useState({ message: "", type: "" });

  const showAlert = (message, type) => {
    setAlert({ message, type });
  };

  const closeAlert = () => {
    setAlert({ message: "", type: "" });
  };

  const handleChangeE = async () => {
    if (!emailNew || !oldPassword) {
      showAlert(
        `Campurile e-mail si parolă actuală trebuie sa fie completate.`,
        "danger"
      );
      return;
    }

    let data = {
      ...userData,
      email: emailNew,
    };

    console.log("aici inainte de actualizare email");
    try {
      // Încercăm să actualizăm adresa de email
      await handleChangeEmail(oldPassword, emailNew);
      showAlert(`E-mailul a fost actualizat.`, "success");

      // Dacă actualizarea emailului a reușit, încercăm să actualizăm și Firestore
      await handleUpdateFirestore(
        `UsersUber/${userData.user_uid}`,
        data,
        `${userData.numeUtilizator} a schimbat adresa de e-mail la ${emailNew}`
      );
      console.log("Update successfully.");
      setUserData(data);
      setOldPassword("");
    } catch (error) {
      // Aici gestionăm erorile care ar putea să apară în oricare dintre apelurile await
      // const errorMessage = handleFirebaseAuthError(error); // Utilizează funcția pentru a procesa eroarea
      console.error("A apărut o eroare:", error);
      showAlert(`${error.message}`, "danger");
    }
  };

  return (
    <>
      <div className="row">
        <div className="col-xl-6">
          <div className="my_profile_setting_input form-group">
            <label htmlFor="formGroupExampleOldPass">Parola actuală</label>
            <input
              type="password"
              className="form-control"
              id="formGroupExampleOldPass"
              value={oldPassword}
              onChange={(e) => setOldPassword(e.target.value)}
            />
          </div>
        </div>
      </div>
      {/* End .row */}

      <div className="row">
        <div className="col-lg-6 col-xl-6">
          <div className="my_profile_setting_input form-group">
            <label htmlFor="formGroupExampleNewPass">E-mail nou</label>
            <input
              type="email"
              className="form-control"
              id="formGroupExampleNewPass"
              value={emailNew}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
        </div>
        {/* End .col */}

        <div className="col-xl-12">
          <div className="my_profile_setting_input float-start fn-520">
            <button className="btn btn3 btn-dark" onClick={handleChangeE}>
              Actualizează E-mail
            </button>
          </div>
        </div>
        {/* End .col */}
      </div>
      {/* End .row */}
      <AlertModal
        message={alert.message}
        type={alert.type}
        onClose={closeAlert}
      />
    </>
  );
};

export default ChangeEmail;
