"use client";

import { AlertModal } from "@/components/common/AlertModal";
import { authentication } from "@/firebase";
import { handleChangePassword } from "@/utils/authUtils";
import { updatePassword } from "firebase/auth";
import { useState } from "react";

const ChangePassword = () => {
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
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

  const handleChangePass = async () => {
    const auth = authentication;

    if (newPassword !== confirmPassword) {
      showAlert(
        `Parola nouă și confirmarea parolei nu se potrivesc.`,
        "danger"
      );
      return;
    }

    const user = auth.currentUser;

    try {
      await handleChangePassword(oldPassword, newPassword);
      showAlert(`Parola nouă a fost actualizată.`, "success");
      // Resetează câmpurile după actualizarea cu succes
      setOldPassword("");
      setConfirmPassword("");
      setNewPassword("");
    } catch (error) {
      // Afișează eroarea prinsă din handleChangePassword
      console.error("Error updating password:", error);
      showAlert(error.message, "danger"); // Asumăm că showAlert acceptă un al doilea parametru pentru tipul alertei
    }
  };

  return (
    <>
      <div className="row">
        <div className="col-xl-6">
          <div className="my_profile_setting_input form-group">
            <label htmlFor="formGroupExampleOldPass">Parola veche</label>
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
            <label htmlFor="formGroupExampleNewPass">Parola nouă</label>
            <input
              type="password"
              className="form-control"
              id="formGroupExampleNewPass"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
            />
          </div>
        </div>
        {/* End .col */}

        <div className="col-lg-6 col-xl-6">
          <div className="my_profile_setting_input form-group">
            <label htmlFor="formGroupExampleConfPass">
              Confirmă parola nouă
            </label>
            <input
              type="password"
              className="form-control"
              id="formGroupExampleConfPass"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
            />
          </div>
        </div>
        {/* End .col */}

        <div className="col-xl-12">
          <div className="my_profile_setting_input float-start fn-520">
            <button className="btn btn3 btn-dark" onClick={handleChangePass}>
              Actualizează Parola
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

export default ChangePassword;
