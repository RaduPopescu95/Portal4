"use client";

import React, { useState } from "react";
import CommonLoader from "../CommonLoader";

export default function PasswordDialog({
  handleCloseModal,
  handleConfirm,
  isLoading,
}) {
  // Stare pentru parola actuala
  const [currentPassword, setCurrentPassword] = useState("");

  // Functie pentru a actualiza starea cu valoarea din input
  const handlePasswordChange = (event) => {
    setCurrentPassword(event.target.value);
  };

  return (
    <>
      <div className="modal fade show d-block" tabIndex="-1" role="dialog">
        <div className="modal-dialog modal-dialog-centered" role="document">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title">Parola actuala</h5>
              <button
                type="button"
                className="close"
                data-dismiss="modal"
                aria-label="Close"
                onClick={handleCloseModal}
              >
                <span aria-hidden="true">&times;</span>
              </button>
            </div>
            <div className="modal-body">
              Pentru a continua introdu parola ta actuala
              <div className="form-group">
                <input
                  type="password"
                  className="form-control"
                  placeholder="Parola actuala"
                  value={currentPassword}
                  onChange={handlePasswordChange}
                  required
                />
              </div>
            </div>
            <div className="modal-footer">
              <button
                type="button"
                className="btn btn-secondary"
                onClick={handleCloseModal}
              >
                Anulează
              </button>
              <button
                type="button"
                className="btn btn-danger"
                onClick={() => handleConfirm(currentPassword)}
                disabled={!currentPassword} // Butonul va fi dezactivat dacă parola nu este completată
              >
                {isLoading ? <CommonLoader /> : "Actualizeaza"}
              </button>
            </div>
          </div>
        </div>
      </div>
      <div className="modal-backdrop fade show"></div>
    </>
  );
}
