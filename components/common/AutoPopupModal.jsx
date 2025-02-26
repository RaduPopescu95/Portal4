"use client";
import { useState, useEffect } from "react";
import LoginSignupUtilizator from "./user-credentials/LoginSignupUtilizator";
import LoginSignupPartener from "./user-credentials/LoginSignupPartener";

const AutoPopupModal = ({ onClose }) => {
  const [isVisible, setIsVisible] = useState(false);
  const [modalType, setModalType] = useState("specialist"); // Poate fi "specialist" sau "client"

  useEffect(() => {
    // Dacă pop-up-ul nu a mai fost afișat, îl afișăm și salvăm în localStorage
    const hasShown = localStorage.getItem("autoPopupShown");
    if (!hasShown) {
      setIsVisible(true);
      localStorage.setItem("autoPopupShown", "true");
    }
  }, []);

  const handleClose = () => {
    setIsVisible(false);
    if (onClose) onClose();
  };

  // Funcții pentru comutarea tipului de modal
  const switchToClient = () => setModalType("client");
  const switchToSpecialist = () => setModalType("specialist");

  if (!isVisible) return null;

  return (
    <>
      <div
        className="modal fade show"
        style={{ display: "block" }}
        tabIndex="-1"
        role="dialog"
        aria-modal="true"
      >
        <div className="modal-dialog modal-dialog-centered modal-lg" role="document">
          <div className="modal-content">
            <div className="modal-header">
              <button type="button" className="btn-close" onClick={handleClose}></button>
            </div>
            <div className="modal-body">
              {modalType === "specialist" ? (
                <>
                  <h4>Creează-ți contul pentru a oferi servicii</h4>
                  <LoginSignupUtilizator />
                  <div className="mt-3">
                    <button className="btn btn-thm" onClick={switchToClient}>
                      Ești client? Vezi opțiuni
                    </button>
                  </div>
                </>
              ) : (
                <>
                  <h4>Caută servicii în apropierea ta</h4>
                  <LoginSignupPartener />
                  <div className="mt-3">
                    <button className="btn btn-thm" onClick={switchToSpecialist}>
                      Ești specialist? Vezi alte opțiuni
                    </button>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
      {/* Backdrop pentru modal */}
      <div className="modal-backdrop fade show"></div>
    </>
  );
};

export default AutoPopupModal;
