import React from "react";
import Image from "next/image";

const ImageModal = ({ isOpen, handleClose, imageSrc, altText }) => {
  return (
    <>
      {/* Modal using Bootstrap */}
      <div
        className={`modal ${isOpen ? "show" : ""}`}
        style={{ display: isOpen ? "block" : "none" }}
        onClick={handleClose}
      >
        <div className="modal-dialog modal-dialog-centered modal-lg">
          {" "}
          {/* Modificat aici pentru un modal mai mare */}
          <div className="modal-content">
            {/* <div className="modal-header">
              <h5 className="modal-title">{altText}</h5>
              <button
                type="button"
                className="close"
                data-dismiss="modal"
                aria-label="Close"
                onClick={handleClose}
              >
                <span aria-hidden="true">&times;</span>
              </button>
            </div> */}
            <div className="modal-body">
              <Image width={600} height={600} src={imageSrc} alt={altText} />{" "}
              {/* Dimensiune ajustată pentru imagine */}
            </div>
          </div>
        </div>
      </div>

      {/* Overlay for modal */}
      {isOpen && (
        <div className="modal-backdrop show" onClick={handleClose}></div>
      )}
    </>
  );
};

export default ImageModal;
